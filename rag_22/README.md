# rag_22

 Version: 0.9.1

 date    : 2026/03/03
 
 update :

***

fastAPI RAG example , chromadb use

* embedding: qwen3-embedding:0.6b , ollama
* model: Qwen3.5-2B
* llama.cpp , llama-server use
* Python 3.13.4

***
### setup

* windows
* venv install
```
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```
***
* pip install
```
pip install fastapi uvicorn sqlalchemy
pip install "fastapi[all]" python-multipart
pip install requests
pip install chromadb uuid
pip install ollama
pip install openai
pip install langchain-text-splitters
```
***
* start fastAPI
```
uvicorn main:app --reload --port 8000
```

***
* front

```
npm i
npm run build
```

***
### blog

https://zenn.dev/link/comments/97b22f7bf8d5b3

***
