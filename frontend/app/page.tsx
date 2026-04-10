"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!query.trim()) return;

    const userMsg = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);

    setQuery("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://supabase-backend-r6vw.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        }
      );

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: { type: "text", data: "Error connecting backend" },
        },
      ]);
    }

    setLoading(false);
  };

  const renderResponse = (content: any) => {
    if (!content) return null;

    // TEXT RESPONSE
    if (content.type === "text") {
      return <p>{content.data}</p>;
    }

    // TABLE RESPONSE (REMOVE DUPLICATES)
    if (content.type === "table") {
      const uniqueData = Array.from(
        new Map(
          content.data.map((item: any) => [
            item.title + item.topic,
            item,
          ])
        ).values()
      );

      return (
        <div style={{ marginTop: "10px" }}>
          {uniqueData.map((item: any, i: number) => (
            <div
              key={i}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "10px",
                background: "#f9f9f9",
              }}
            >
              <h4 style={{ margin: "0 0 5px 0" }}>
                📌 {item.title}
              </h4>
              <p style={{ margin: 0 }}>Topic: {item.topic}</p>
              <p style={{ margin: 0 }}>
                Views: {item.views} | Likes: {item.likes}
              </p>
            </div>
          ))}
        </div>
      );
    }

    return <pre>{JSON.stringify(content, null, 2)}</pre>;
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h2 style={{ textAlign: "center" }}>💬 Supabase Chat</h2>

      {/* CHAT BOX */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          minHeight: "400px",
          borderRadius: "10px",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "15px" }}>
            {msg.role === "user" ? (
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    background: "#007bff",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    display: "inline-block",
                  }}
                >
                  You: {msg.content}
                </span>
              </div>
            ) : (
              <div style={{ textAlign: "left" }}>
                <span
                  style={{
                    background: "#f1f1f1",
                    padding: "10px",
                    borderRadius: "10px",
                    display: "inline-block",
                    maxWidth: "100%",
                  }}
                >
                  <b>Bot:</b>
                  {renderResponse(msg.content)}
                </span>
              </div>
            )}
          </div>
        ))}

        {loading && <p>Bot is typing...</p>}
      </div>

      {/* INPUT */}
      <div style={{ marginTop: "10px", display: "flex" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            marginLeft: "10px",
            padding: "10px 15px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}