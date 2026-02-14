# rag_20

 Version: 0.9.1

 date    : 2026/02/12
 
 update :

***

fastAPI ChromaDB , RAG example

* Github Copilot SDK , python
* gpt-4.1
* embedding: qwen3-embedding:0.6b , ollama
* Python 3.13.4

***
* vector data add

https://github.com/kuc-arc-f/fastapi_1ex/tree/main/rag_19

***
### setup

* windows
```
python -m venv venv
.\venv\Scripts\activate

pip install fastapi uvicorn sqlalchemy
pip install "fastapi[all]" python-multipart
pip install requests
pip install chromadb uuid
pip install ollama
pip install github-copilot-sdk

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

https://zenn.dev/knaka0209/scraps/3749880e894e2e

***
