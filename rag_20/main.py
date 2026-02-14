import asyncio
import chromadb
import os
import ollama
import uuid
from copilot import CopilotClient
from fastapi import FastAPI, Request
from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import json
import requests
import sys

# Pydanticモデル（スキーマ）のインポート
from pydantic import BaseModel

class SearchRequest(BaseModel):
    query: str

class AddRequest(BaseModel):
    content: str

class EditDeleteRequest(BaseModel):
    id: str

app = FastAPI()
DB_PATH="./my_chroma_db"
collection_name = "my_document_collection"

# public フォルダを静的ファイルとしてマウント
# /static というURLパスで public フォルダの内容にアクセスできるようになります。
app.mount("/static", StaticFiles(directory="public"), name="static")

# Jinja2Templates を使用してHTMLテンプレートをレンダリングする場合
# templates フォルダにHTMLファイルがあることを想定
templates = Jinja2Templates(directory="templates")

#
#
#
@app.post("/api/rag_search")
async def rag_search(item: SearchRequest):
    client = chromadb.PersistentClient(path=DB_PATH) 
    print("ChromaDB クライアントを初期化しました。")
    print("query=" + item.query)
    query = item.query

    print("query=" + query)
    
    embedding = ollama.embeddings(
        model="qwen3-embedding:0.6b",
        prompt=query
    )
    vec = embedding["embedding"]

    print(len(vec))
    print(vec[:5])   

    query_vector = embedding["embedding"]
    query_vec_str = [str(n) for n in query_vector]

    collection = client.get_or_create_collection(name=collection_name)
    print(f"コレクション '{collection_name}' を作成/取得しました。")

    #最も関連性の高いドキュメントを取得
    results = collection.query(
        query_embeddings=[query_vector],
        n_results=1
    )
    # 結果をdistancesでソートして表示
    documents = results['documents'][0]
    distances = results['distances'][0]

    # (distance, document)のペアを作成してソート
    sorted_results = sorted(zip(distances, documents))

    print("検索結果 (ベクトル距離が近い順):")
    ouStr = "" 
    matches = ""
    for distance, doc in sorted_results:
        print(f"\nベクトル距離: {distance:.2f}")
        print(f"document: {doc}")
        ouStr += doc + "\n\n"

    print("out.len=" + str(len(ouStr))) 
    #print(resp)
    if len(ouStr) > 0:
        matches = f"context: {ouStr}\n user query: {query}\n"
    else:
        matches = f"user query: {query}"
    #print(matches)

    sendMessage = f"日本語で回答して欲しい\n"
    sendMessage += f"要約して欲しい\n\n {matches} \n"
    print(sendMessage) 
    newMessage = await send_text(sendMessage) 
    return {
        "status": "success",
        "result": newMessage
    } 
     
#
#
#
async def send_text(query):
    client = CopilotClient()
    await client.start()

    session = await client.create_session({"model": "gpt-4.1"})
    response = await session.send_and_wait({"prompt": query})

    print(response.data.content)

    await client.stop()
    return response.data.content
#
#
#
@app.post("/api/edit_create")
async def edit_create(item: AddRequest):
    client = chromadb.PersistentClient(path=DB_PATH) 
    print("ChromaDB クライアントを初期化しました。")
    collection = client.get_or_create_collection(name=collection_name)
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
    collection.add(
        ids=[str(uuid.uuid4())],
        embeddings=[vec],
        documents=[in_text]
    )    
    return {
        "status": "success",
        "result": ""
    } 
#
#
#
@app.post("/api/edit_delete")
async def edit_delete(item: EditDeleteRequest):
    client = chromadb.PersistentClient(path=DB_PATH) 
    print("ChromaDB クライアントを初期化しました。")
    collection = client.get_or_create_collection(name=collection_name)

    print("edit_delete.id=" + item.id)
    id = item.id
    # 1件削除
    collection.delete(
        ids=[id]
    )

    return {
        "status": "success",
        "result": ""
    }  

#
#
#
@app.post("/api/edit_list")
async def edit_list(item: SearchRequest):
    client = chromadb.PersistentClient(path=DB_PATH) 
    print("ChromaDB クライアントを初期化しました。")
    print("query=" + item.query)
    query = item.query

    print("query=" + query)

    # 2. コレクションの取得
    # 埋め込み関数は件数を取得するだけなら不要ですが、既存のコレクションを取得するためには名前が必要です。
    try:
        collection = client.get_collection(name=collection_name)
        print(f"コレクション '{collection_name}' を取得しました。")
        sorted_results = []

        if query == "":
            # ペアを作成してソート
            results = collection.get(
                include=["documents"],  # documents のみ取得（idsは常に返る）
                limit=100                # 最大件数
            )
            ids = results['ids']
            documents = results['documents']
            sorted_results = sorted(zip(ids, documents))
            #for id, doc in sorted_results:
                #print(f"id: {id} \n")
                #print(f"document: {doc} \n")
        else:
            keyword = query
            results = collection.get(
                include=["documents"],  # documents のみ取得（idsは常に返る）
            )
            ids = results['ids']
            documents = results['documents']
            # ペアを作成してソート
            sorted_results = sorted(zip(ids, documents))
            filtered_ids = []
            filtered_docs = []
            for id, doc in sorted_results:
                if doc and keyword in doc:
                    filtered_ids.append(id)
                    filtered_docs.append(doc)
            sorted_results = sorted(zip(filtered_ids, filtered_docs))
            #print(filtered_ids)
            #print(filtered_docs)

        return {
            "status": "success",
            "result": sorted_results
        }
    except ValueError:
        # 指定されたコレクションが存在しない場合のエラー処理
        print(f"エラー: コレクション '{COLLECTION_NAME}' は存在しません。")

#
#
#
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