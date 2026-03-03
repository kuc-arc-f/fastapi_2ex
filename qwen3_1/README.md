# qwen3_1

 Version: 0.9.1

 date    : 2026/03/03
 
 update :

***

RAG example , chromadb

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

* pip install
```
pip install openai
pip install chromadb uuid
pip install ollama
pip install langchain_text_splitters
```

***
* db-init
```
python init_db.py
```

***
* vector data add
```
python embed.py
```
***
* search
```
python search.py --query hello
```

***
### blog

***
