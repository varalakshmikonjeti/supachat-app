"use client";

import { useState } from "react";

export default function Page() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<
    { role: string; text?: string; data?: any }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const sendQuery = async () => {
    if (!query.trim()) return;

    const currentQuery = query;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: "user", text: currentQuery },
    ]);

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
          body: JSON.stringify({ query: currentQuery }),
        }
      );

      const data = await res.json();

      // Add bot message
      setMessages((prev) => [
        ...prev,
        { role: "bot", data },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          data: { message: "Error connecting to backend" },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>💬 Supabase Chat</h2>

      {/* Chat Box */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "400px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            {msg.role === "user" ? (
              <div>
                <b>You:</b> {msg.text}
              </div>
            ) : (
              <div>
                <b>Bot:</b>{" "}
                {msg.data?.message || JSON.stringify(msg.data)}
              </div>
            )}
          </div>
        ))}

        {loading && <p>⏳ Thinking...</p>}
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask something..."
        style={{ width: "70%", padding: "10px" }}
        onKeyDown={(e) => e.key === "Enter" && sendQuery()}
      />

      <button onClick={sendQuery} style={{ padding: "10px" }}>
        Send
      </button>
    </div>
  );
}