import chromadb
import uuid

# クライアントの初期化 (ローカルにデータベースファイルを作成)
# インメモリで実行する場合は chromadb.Client() を使用します
client = chromadb.PersistentClient(path="./my_chroma_db") 
print("ChromaDB クライアントを初期化しました。")
