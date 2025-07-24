"use client";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ sender: "user" | "bot"; text: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setHistory((h) => [...h, { sender: "user", text: query }]);
    setResponse("");
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResponse(data.response);
      setHistory((h) => [...h, { sender: "bot", text: data.response }]);
    } catch (err) {
      setResponse("Error: " + err);
      setHistory((h) => [...h, { sender: "bot", text: "Error: " + err }]);
    }
    setQuery("");
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#181c24",
      color: "#f3f6fa",
      fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: 0,
    }}>
      <header style={{ width: "100%", padding: "2rem 0 1rem 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: 1, color: "#6dd5ed", margin: 0 }}>RagChatBot</h1>
        <p style={{ color: "#b0b8c1", marginTop: 8 }}>Ask anything. Get smart, context-aware answers.</p>
      </header>
      <main style={{
        width: "100%",
        maxWidth: 480,
        background: "#232a36",
        borderRadius: 16,
        boxShadow: "0 4px 32px #0002",
        padding: 24,
        margin: "0 auto 2rem auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 400,
      }}>
        <div style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: 16,
          maxHeight: 400,
        }}>
          {history.length === 0 && (
            <div style={{ color: "#7e8ba3", textAlign: "center", marginTop: 40 }}>
              Start the conversation!
            </div>
          )}
          {history.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  background: msg.sender === "user" ? "linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)" : "#232a36",
                  color: msg.sender === "user" ? "#181c24" : "#f3f6fa",
                  borderRadius: 18,
                  borderTopRightRadius: msg.sender === "user" ? 4 : 18,
                  borderTopLeftRadius: msg.sender === "user" ? 18 : 4,
                  padding: "10px 18px",
                  maxWidth: "80%",
                  fontSize: 16,
                  boxShadow: msg.sender === "user" ? "0 2px 8px #2193b033" : "0 2px 8px #0001",
                  wordBreak: "break-word",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type your question..."
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              border: "none",
              background: "#1a202b",
              color: "#f3f6fa",
              fontSize: 16,
              outline: "none",
              boxShadow: "0 1px 4px #0002",
            }}
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            style={{
              padding: "0 24px",
              borderRadius: 12,
              border: "none",
              background: loading ? "#7e8ba3" : "linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)",
              color: loading ? "#232a36" : "#181c24",
              fontWeight: 600,
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              boxShadow: "0 2px 8px #2193b033",
            }}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </main>
      <footer style={{ color: "#7e8ba3", fontSize: 14, marginBottom: 16, textAlign: "center" }}>
        Powered by Pinecone, Groq, HuggingFace, FastAPI & Next.js
      </footer>
    </div>
  );
}
