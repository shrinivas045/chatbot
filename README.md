<<<<<<< HEAD
# RagChatBot

A chatbot that answers user queries by retrieving relevant information from a vector database and generating human-like responses using a large language model (LLM).

## Tech Stack

- **Frontend:** Next.js (TypeScript)
- **Backend:** FastAPI (Python)
- **Vector DB:** Pinecone
- **Embeddings:** Hugging Face (Sentence Transformers)
- **LLM:** Groq API or Gemini Pro
- **Optional:** Langchain for RAG pipeline

## Functional Flow

1. User enters query in frontend
2. Backend embeds the query
3. Search similar documents in Pinecone
4. Combine retrieved chunks + user query
5. Send to Groq
6. Return the response to the user

## Setup

### Frontend

```
cd frontend
npm run dev
```

### Backend

```
python -m venv venv
# Activate the venv (Windows)
venv\Scripts\activate
uvicorn backend.main:app --reload
```

---

Configure your Pinecone, Hugging Face, and LLM API keys in a `.env` file in the backend directory.
=======
# ChatBot-using-RAG
>>>>>>> 4b4a85597cb70aca40167d0fc10cb147c17e1ef3
