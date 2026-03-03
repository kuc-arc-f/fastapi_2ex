import chromadb
import ollama
import uuid
#import uuid
import glob
import os
from langchain_text_splitters import RecursiveCharacterTextSplitter


folder_path = "./data"
collection_name = "my_document_collection"
# スプリッターの初期化
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,      # 1チャンクあたりの文字数（目安）
    chunk_overlap=100,    # 前後のチャンクと重複させる文字数（文脈維持のため）
    length_function=len, # 長さを測る関数（通常はlen）
    separators=["\n\n", "\n", "。", " ", ""] # 分割する優先順位
    # is_separator_regex=False,
)

#
#
#
def read_file(collection):
    data = []
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


    #
    for i, d in enumerate(data):
        print(f"data:{str(i)} \n")
        content_str = d["content"]
        #print(f"{d["content"]}\n")
        print(f"{content_str}\n")
        response = ollama.embeddings(model="qwen3-embedding:0.6b", prompt=content_str)
        embedding = response["embedding"]
        collection.add(
            ids=[str(uuid.uuid4())],
            embeddings=[embedding],
            documents=[content_str]
        )

#
#
#
def add_embed():
   # クライアントの初期化 (ローカルにデータベースファイルを作成)
    # インメモリで実行する場合は chromadb.Client() を使用します
    client = chromadb.PersistentClient(path="./my_chroma_db") 
    print("ChromaDB クライアントを初期化しました。")

    # コレクションの作成または取得
    # get_or_create を使うと、既に存在すればそれを取得し、なければ新しく作成します
    collection = client.get_or_create_collection(name=collection_name)

    print(f"コレクション '{collection_name}' を作成/取得しました。")
    read_file(collection)
    return

#
#
#
if __name__ == "__main__":
    add_embed()
