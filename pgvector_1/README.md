# pgvector_1

 Version: 0.9.1

 date    : 2026/02/12
 
 update :

***

fastAPI RAG example , pgvector use

* Github Copilot SDK , python
* embedding: qwen3-embedding:0.6b , ollama
* model: gpt-4.1
* Python 3.13.4

***
### setup

* windows
```
python -m venv venv
.\venv\Scripts\activate

pip install fastapi uvicorn sqlalchemy
pip install "fastapi[all]" python-multipart
pip install requests
pip install psycopg2-binary pgvector
pip install ollama
pip install langchain-text-splitters
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
* vector data add
```
python embed.py
```
***
* table.sql
```
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(1024)
);
```

***
### blog

https://zenn.dev/knaka0209/scraps/2590884be8cc38

***
