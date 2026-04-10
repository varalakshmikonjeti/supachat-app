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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        }
      );

      const data = await res.json();

      setMessages((prev) => [...prev, { role: "bot", content: data }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: { type: "text", data: "Server error" } },
      ]);
    }

    setLoading(false);
  };

  const renderBot = (content: any) => {
    if (!content) return null;

    // TEXT
    if (content.type === "text") {
      return <div>{content.data}</div>;
    }

    // TABLE (CLEAN ASSIGNMENT STYLE)
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
        <div style={{ marginTop: "8px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr style={{ background: "#eee" }}>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                  Title
                </th>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                  Topic
                </th>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                  Views
                </th>
                <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                  Likes
                </th>
              </tr>
            </thead>
            <tbody>
              {uniqueData.map((item: any, i: number) => (
                <tr key={i}>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    {item.title}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    {item.topic}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    {item.views}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    {item.likes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        background: "#f6f6f6",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ textAlign: "center" }}>💬 Supabase Chat</h2>

      {/* CHAT BOX */}
      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          minHeight: "400px",
          border: "1px solid #ddd",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "12px" }}>
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
                  {msg.content}
                </span>
              </div>
            ) : (
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    background: "#eaeaea",
                    padding: "10px",
                    borderRadius: "10px",
                    display: "inline-block",
                    maxWidth: "100%",
                  }}
                >
                  <b>Bot:</b>
                  {renderBot(msg.content)}
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && <p>Bot is typing...</p>}
      </div>

      {/* INPUT */}
      <div style={{ display: "flex", marginTop: "10px" }}>
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
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}