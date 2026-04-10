"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!query.trim()) return;

    const userMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("https://supabase-backend-r6vw.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      const botMessage = {
        role: "bot",
        content: data,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: { type: "text", data: "Error connecting server" } },
      ]);
    }

    setLoading(false);
  };

  const renderBotResponse = (content: any) => {
    if (!content) return "No response";

    // TABLE RESPONSE
    if (content.type === "table") {
      return (
        <table border={1} cellPadding={8} style={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Topic</th>
              <th>Views</th>
              <th>Likes</th>
            </tr>
          </thead>
          <tbody>
            {content.data.map((item: any, index: number) => (
              <tr key={index}>
                <td>{item.title}</td>
                <td>{item.topic}</td>
                <td>{item.views}</td>
                <td>{item.likes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // TEXT RESPONSE
    if (content.type === "text") {
      return <p>{content.data}</p>;
    }

    return <pre>{JSON.stringify(content, null, 2)}</pre>;
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
      <h2>Supabase Chat</h2>

      <div style={{ border: "1px solid #ccc", padding: "10px", minHeight: "300px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            {msg.role === "user" ? (
              <p><b>You:</b> {msg.content}</p>
            ) : (
              <div>
                <b>Bot:</b>
                {renderBotResponse(msg.content)}
              </div>
            )}
          </div>
        ))}

        {loading && <p>Bot is typing...</p>}
      </div>

      <div style={{ marginTop: "10px" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something..."
          style={{ width: "80%", padding: "8px" }}
        />
        <button onClick={sendMessage} style={{ padding: "8px 12px" }}>
          Send
        </button>
      </div>
    </div>
  );
}