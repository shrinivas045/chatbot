import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from typing import List
from groq import Groq

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

# Initialize embedding model
EMBEDDING_MODEL = os.getenv("HF_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
embedder = SentenceTransformer(EMBEDDING_MODEL)

# Initialize Pinecone client and index
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV") or os.getenv("PINECONE_ENVIRONMENT")
PINECONE_INDEX = os.getenv("PINECONE_INDEX") or os.getenv("PINECONE_INDEX_NAME")
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX)


def call_llm(prompt: str) -> str:
    model = os.getenv("GROQ_MODEL", "llama3-8b-8192")
    client = Groq()
    messages = [
        {"role": "user", "content": prompt}
    ]
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.2,
        max_tokens=512
    )
    return response.choices[0].message.content.strip()


def embed_query(query: str) -> List[float]:
    return embedder.encode([query])[0].tolist()


def search_pinecone(embedding: List[float], top_k: int = 5):
    results = index.query(vector=embedding, top_k=top_k, include_metadata=True)
    return results["matches"]


def build_prompt(user_query: str, retrieved_chunks: List[dict]) -> str:
    context = "\n".join([chunk["metadata"].get("text", "") for chunk in retrieved_chunks])
    prompt = f"Context:\n{context}\n\nUser Query: {user_query}\nAnswer:"
    return prompt


def rag_pipeline(user_query: str) -> str:
    embedding = embed_query(user_query)
    retrieved = search_pinecone(embedding)
    prompt = build_prompt(user_query, retrieved)
    response = call_llm(prompt)
    return response 