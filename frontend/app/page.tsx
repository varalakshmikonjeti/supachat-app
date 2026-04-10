"use client";

import { useState } from "react";

type Message =
  | { role: "user"; content: string }
  | { role: "bot"; content: any };

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch(
        "https://supabase-backend-r6vw.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: input }),
        }
      );

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: { message: "Server error. Try again." },
        },
      ]);
    }

    setInput("");
  };

  // ✅ REMOVE DUPLICATES FUNCTION
  const removeDuplicates = (data: any[]) => {
    const seen = new Set();

    return data.filter((item) => {
      const key = `${item.title}-${item.topic}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const renderBotMessage = (content: any) => {
    if (content?.type === "table") {
      const uniqueData = removeDuplicates(content.data || []);

      return (
        <div
          style={{
            background: "#f3f4f6",
            padding: "10px",
            borderRadius: "10px",
            color: "#111",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Topic</th>
                <th style={thStyle}>Views</th>
                <th style={thStyle}>Likes</th>
              </tr>
            </thead>

            <tbody>
              {uniqueData.map((item: any, index: number) => (
                <tr key={index}>
                  <td style={tdStyle}>{item.title || "-"}</td>
                  <td style={tdStyle}>{item.topic || "-"}</td>
                  <td style={tdStyle}>{item.views || "-"}</td>
                  <td style={tdStyle}>{item.likes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div style={{ color: "#111" }}>
        {content?.message || "No response"}
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #ddd",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "15px",
            background: "#111",
            color: "#fff",
            textAlign: "center",
          }}
        >
          Supabase Chat
        </div>

        <div
          style={{
            flex: 1,
            padding: "10px",
            background: "#fafafa",
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent:
                  msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.role === "user" ? (
                <div style={userBubble}>{msg.content}</div>
              ) : (
                <div style={botBubble}>
                  {renderBotMessage(msg.content)}
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            padding: "10px",
            borderTop: "1px solid #ddd",
            background: "#fff",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              outline: "none",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              marginLeft: "10px",
              padding: "10px 15px",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// STYLES
const userBubble: React.CSSProperties = {
  background: "#0070f3",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: "10px",
  maxWidth: "70%",
};

const botBubble: React.CSSProperties = {
  background: "#e5e7eb",
  color: "#111",
  padding: "8px 12px",
  borderRadius: "10px",
  maxWidth: "90%",
};

const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  background: "#f0f0f0",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
};