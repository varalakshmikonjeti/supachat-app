"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const sendQuery = async () => {
    if (!query) return;

    const newMessages = [...messages, { role: "user", text: query }];
    setMessages(newMessages);
    setQuery("");

    try {
      const res = await fetch("https://supabase-backend-r6vw.onrender.com/chat",  {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "bot", data: data }
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "bot", data: { message: "Error connecting to backend" } }
      ]);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h1>💬 Supabase Chat</h1>

      {/* Chat Messages */}
      <div style={{ minHeight: "300px", marginBottom: "20px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "15px" }}>
            {msg.role === "user" ? (
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    background: "#0070f3",
                    color: "white",
                    padding: "10px",
                    borderRadius: "10px",
                    display: "inline-block"
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ) : (
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    background: "#f1f1f1",
                    padding: "10px",
                    borderRadius: "10px",
                    color: "black"
                  }}
                >
                  {msg.data?.type === "table" ? (
                    <table
                      style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        background: "white",
                        color: "black"
                      }}
                    >
                      <thead>
                        <tr>
                          {Object.keys(msg.data.data[0] || {}).map((key) => (
                            <th
                              key={key}
                              style={{
                                border: "1px solid black",
                                padding: "6px",
                                background: "#ddd"
                              }}
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {msg.data.data.map((row: any, idx: number) => (
                          <tr key={idx}>
                            {Object.values(row).map((val: any, j) => (
                              <td
                                key={j}
                                style={{
                                  border: "1px solid black",
                                  padding: "6px",
                                  textAlign: "center"
                                }}
                              >
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>{msg.data?.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask something..."
        style={{
          padding: "10px",
          width: "70%",
          border: "1px solid gray",
          borderRadius: "5px"
        }}
      />

      <button
        onClick={sendQuery}
        style={{
          padding: "10px",
          marginLeft: "10px",
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Send
      </button>
    </div>
  );
}