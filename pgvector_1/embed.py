import glob
import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
import ollama
import psycopg2
from pgvector.psycopg2 import register_vector

# PostgreSQL 接続
conn = psycopg2.connect(
    dbname="mydb",
    user="root",
    password="admin",
    host="localhost",
    port=5432
)
folder_path = "./data"
# pgvector を psycopg2 に登録
register_vector(conn)
data = []

# スプリッターの初期化
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,      # 1チャンクあたりの文字数（目安）
    chunk_overlap=20,    # 前後のチャンクと重複させる文字数（文脈維持のため）
    length_function=len, # 長さを測る関数（通常はlen）
    separators=["\n\n", "\n", " ", ""] # 分割する優先順位
    # is_separator_regex=False,
)

contData = []
for file_path in glob.glob(os.path.join(folder_path, "*.*")):
    root, extension = os.path.splitext(file_path)
    print("ext:"+ extension)
    if extension.lower() == ".txt" or extension.lower() == ".md":
        with open(file_path, "r", encoding="utf-8") as f:
            targetContent = f.read()
            # 分割実行
            chunks = text_splitter.create_documents([targetContent])

            for i, chunk in enumerate(chunks):
                print(f"Chunk {i}: {chunk.page_content}")
                data.append({
                    "filename": os.path.basename(file_path),
                    "content": chunk.page_content,
                })
                contData.append(chunk.page_content)
                embedding = ollama.embeddings(
                    model="qwen3-embedding:0.6b",
                    prompt= chunk.page_content
                )

                vec = embedding["embedding"]
                print(len(vec))
                print(vec[:5])

                # SQL へ挿入
                with conn.cursor() as cur:
                    cur.execute(
                        "INSERT INTO documents (content, embedding) VALUES (%s, %s)",
                        (chunk.page_content, vec)
                    )
                    conn.commit()


#print(data)
