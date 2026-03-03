import chromadb
import ollama
import uuid
import sys
from openai import OpenAI
#
#
#
def search(query_text):
    # クライアントの初期化 (ローカルにデータベースファイルを作成)
    # インメモリで実行する場合は chromadb.Client() を使用します
    client = chromadb.PersistentClient(path="./my_chroma_db") 
    #print("ChromaDB クライアントを初期化しました。")

    # コレクション名の指定
    collection_name = "my_document_collection"

    # コレクションの作成または取得
    # get_or_create を使うと、既に存在すればそれを取得し、なければ新しく作成します
    collection = client.get_or_create_collection(name=collection_name)

    #print(f"コレクション '{collection_name}' を作成/取得しました。")
    #print("query:" + query_text)
    # クエリーテキストに対して埋め込みを生成
    response = ollama.embeddings(prompt=query_text, model="qwen3-embedding:0.6b")

    #最も関連性の高いドキュメントを取得
    results = collection.query(
        query_embeddings=[response["embedding"]],
        n_results=1
    )
    # 結果をdistancesでソートして表示
    documents = results['documents'][0]
    distances = results['distances'][0]

    # (distance, document)のペアを作成してソート
    sorted_results = sorted(zip(distances, documents))

    #print("検索結果 (ベクトル距離が近い順):")
    ouStr = "" 
    matches = ""
    for distance, doc in sorted_results:
        #print(f"\nベクトル距離: {distance:.2f}")
        #print(f"document: {doc}")
        ouStr += doc + "\n\n"

    #print("out.len=" + str(len(ouStr))) 
    if len(ouStr) > 0:
        matches = f"context: {ouStr}\n user query: {query_text}"
    else:
        matches = f"user query: {query_text}"

    sendMessage = f"日本語で回答して欲しい\n"
    sendMessage += f"要約して欲しい\n {matches} \n"
    #print(sendMessage)
    return sendMessage

#
#
#
def send_text(message):
    client = OpenAI(
        base_url="http://localhost:8080/v1",
        api_key="not-needed"
    )
    response = client.chat.completions.create(
        model="qwen3.5-2b",
        messages=[
            {"role": "system", "content": "あなたは優秀なアシスタントです。"},
            {"role": "user", "content": message}
        ],
        temperature=0.7,
    )
    print(response.choices[0].message.content)
#
#
#
#
if __name__ == "__main__":
    args = sys.argv
    #print(f"実行ファイル名: {args[0]}")
    if len(args) > 1:
        #print(f"最初の引数: {args[1]}")
        #print(f"引数 2: {args[2]}")
        query = args[2]
        resp = search(query)
        print(resp)
        send_text(resp)
    else:
        print("error, nothing args")
