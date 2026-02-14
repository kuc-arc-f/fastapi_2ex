import os
import ollama
from copilot import CopilotClient
from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import psycopg2
import json

from sqlalchemy.orm import Session
from typing import List

# SQLAlchemy関連のインポート
from sqlalchemy import create_engine, Column, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from pgvector.psycopg2 import register_vector
# Pydanticモデル（スキーマ）のインポート
from pydantic import BaseModel

# 4. モデルクラスが継承するBaseクラスを定義
Base = declarative_base()

# --- SQLAlchemyモデル（データベースのテーブル定義） ---

class SearchRequest(BaseModel):
    query: str

class Item(Base):
    __tablename__ = "items"  # テーブル名

    # テーブルの項目（カラム）を定義
    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, index=True)


# --- Pydanticモデル（APIのスキーマ定義） ---
# APIが受け取ったり返したりするデータの形を定義します

# 共通のベースモデル
class ItemBase(BaseModel):
    name: str

# データ作成時に使用するモデル
class ItemCreate(ItemBase):
    pass

class EditDeleteRequest(BaseModel):
    id: int

class AddRequest(BaseModel):
    content: str

# データを読み取る時に使用するモデル（レスポンスモデル）
class ItemResponse(ItemBase):
    id: int

    # SQLAlchemyモデルからPydanticモデルへ変換できるように設定
    class Config:
        orm_mode = True


# --- FastAPIアプリケーションの初期化 ---

app = FastAPI()

# public フォルダを静的ファイルとしてマウント
# /static というURLパスで public フォルダの内容にアクセスできるようになります。
app.mount("/static", StaticFiles(directory="public"), name="static")

# Jinja2Templates を使用してHTMLテンプレートをレンダリングする場合
# templates フォルダにHTMLファイルがあることを想定
templates = Jinja2Templates(directory="templates")

# --- APIエンドポイント（CRUD処理） ---

#
#
#
def search_similar(embedding, top_k=5):
    # PostgreSQL 接続
    conn = psycopg2.connect(
        dbname="mydb",
        user="root",
        password="admin",
        host="localhost",
        port=5432
    )

    # pgvector を psycopg2 に登録
    register_vector(conn)

    # -- コサイン距離をコサイン類似度 (1 - 距離) に変換し、similarityとして取得
    # -- 類似度が高い順（降順）に並び替え
    SQL_QUERY = """
    SELECT
        id,
        content,
        embedding,
        1 - (embedding <=> %s) AS cosine_similarity
    FROM
        documents
    ORDER BY
        cosine_similarity DESC
    LIMIT 1;
    """

    query_vector_str = json.dumps(embedding)
    with conn.cursor() as cur:
        cur.execute(SQL_QUERY, (query_vector_str,))
        return cur.fetchall()


@app.post("/api/rag_search")
async def api_rag_search(item: SearchRequest):
    print("query=" + item.query)
    query = item.query
    # --- 環境変数の取得 ---
    embedding = ollama.embeddings(
        model="qwen3-embedding:0.6b",
        prompt=query
    )

    vec = embedding["embedding"]

    print(len(vec))
    print(vec[:5])   

    matches = ""
    rows = search_similar(vec, 3)
    ouStr = "" 

    for row in rows:
        ouStr += row[1]+ "\n\n"

    #print(ouStr)  
    print("out.len=" + str(len(ouStr))) 
    if len(ouStr) > 0:
        matches = f"context: {ouStr}\n user query: {query}"
    else:
        matches = query
    #print(matches)

    sendMessage = f"日本語で回答して欲しい\n"
    sendMessage += f"要約して欲しい\n\n {matches} \n"
    print(sendMessage)
    #
    copilot_client = CopilotClient()
    await copilot_client.start()

    session = await copilot_client.create_session({"model": "gpt-4.1"})
    response = await session.send_and_wait({"prompt": sendMessage})
    print(response.data.content)

    await copilot_client.stop()    

    return {
        "status": "success",
        "result": response.data.content
    }    

#
#
#
def get_pg_conn():
    conn = psycopg2.connect(
        dbname="mydb",
        user="root",
        password="admin",
        host="localhost",
        port=5432
    )
    return conn

#
#
#
@app.post("/api/edit_create")
async def edit_create(item: AddRequest):
    # PostgreSQL 接続
    conn = get_pg_conn()
    register_vector(conn)
    print("query=" + item.content)
    in_text = item.content

    print("in_text=" + in_text)
    
    embedding = ollama.embeddings(
        model="qwen3-embedding:0.6b",
        prompt=in_text
    )
    vec = embedding["embedding"]

    print(len(vec))
    print(vec[:5])  
    # SQL へ挿入
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO documents (content, embedding) VALUES (%s, %s)",
            (in_text, vec)
        )
        conn.commit()

    return {
        "status": "success",
        "result": ""
    } 
#
#
#
@app.post("/api/edit_delete")
async def edit_delete(item: EditDeleteRequest):
    # PostgreSQL 接続
    conn = get_pg_conn()
    register_vector(conn)

    print("edit_delete.id=" + str(item.id) )
    id = item.id
    # 1件削除
    with conn.cursor() as cur:
        cur.execute(
            "DELETE FROM documents WHERE id= %s",
            (id,)
        )
        conn.commit()   

    return {
        "status": "success",
        "result": ""
    }  
    
#
#
#
@app.post("/api/edit_list")
async def edit_list(item: SearchRequest):
    # PostgreSQL 接続
    conn = get_pg_conn()

    # pgvector を psycopg2 に登録
    register_vector(conn)

    print("ChromaDB クライアントを初期化しました。")
    print("query=" + item.query)
    query = item.query

    print("query=" + query)

    try:
        sorted_results = []
        cur = conn.cursor()
        if query == "":
            SQL_QUERY = """
            SELECT
                id,
                content
            FROM
                documents
            ORDER BY
                id DESC
            LIMIT 100;
            """
            cur.execute(SQL_QUERY)
        else:
            SQL_QUERY = f"SELECT id, content FROM documents WHERE content LIKE '%{query}%'" 
            SQL_QUERY += " ORDER BY id DESC LIMIT 100" 
            print("SQL_QUERY=" + SQL_QUERY)
            cur.execute(SQL_QUERY)

        rows = cur.fetchall()
        for row in rows:
            print(row)
            sorted_results.append({
                "id": row[0],
                "content": row[1],
            })
        cur.close()
        conn.close()

        return {
            "status": "success",
            "result": sorted_results
        }
    except ValueError:
        # 指定されたコレクションが存在しない場合のエラー処理
        print("500 エラー")

# POST-Test
@app.post("/post_test")
def post_text_api(item: ItemCreate):
    return "OK"

@app.get("/", response_class=HTMLResponse)
async def home_page():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>FastAPI Static Files</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <link href="/static/main.css" rel="stylesheet"/>
    </head>
    <body>
        <div id="app"></div>
        <script type="module" src="/static/client.js"></script>
    </body>
    </html>
    """
#
#
#
@app.get("/edit", response_class=HTMLResponse)
async def edit_page():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>FastAPI Static Files</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <link href="/static/main.css" rel="stylesheet"/>
    </head>
    <body>
        <div id="app"></div>
        <script type="module" src="/static/client.js"></script>
    </body>
    </html>
    """
