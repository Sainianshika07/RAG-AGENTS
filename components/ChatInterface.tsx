"use client";

import { useState } from "react";
import { CitationCard, RetrievedChunk } from "./CitationCard";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: RetrievedChunk[];
  timestamp: number;
}

interface ChatInterfaceProps {
  namespaceId: string;
  documentName?: string;
  kValue: number;
}

export function ChatInterface({ namespaceId, documentName, kValue }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I have processed \"" + (documentName || "your uploaded document") + "\". Ask me any question, and I will synthesize answers grounded directly in the document chunks.",
      timestamp: Date.now(),
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const trimmed = inputQuery.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = {
      id: "msg-" + Date.now() + "-u",
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namespaceId,
          message: trimmed,
          kValue,
        }),
      });

      const text = await res.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch {}
      if (!res.ok) {
        throw new Error(data?.error || text.slice(0, 160) || "Failed to get an answer (HTTP " + res.status + ")");
      }

      const assistantMessage: ChatMessage = {
        id: "msg-" + Date.now() + "-a",
        role: "assistant",
        content: data.answer,
        citations: data.citations || [],
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "660px",
        background: "var(--bg-secondary)",
        borderRadius: "14px",
        border: "1px solid var(--border-subtle)",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "0.9rem 1.25rem",
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(255, 255, 255, 0.02)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.2rem" }}>💬</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>
              Interactive RAG Chat
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Document: <span style={{ color: "var(--brand-purple)" }}>{documentName || "Active Document"}</span> • Top-{kValue} Chunks
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.72rem",
            color: "var(--brand-green)",
            background: "rgba(16, 185, 129, 0.1)",
            padding: "0.25rem 0.6rem",
            borderRadius: "9999px",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--brand-green)" }} />
          Grounded Mode Active
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: "1.2rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "82%",
                padding: "0.8rem 1.1rem",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: msg.role === "user" ? "var(--brand-purple)" : "rgba(255, 255, 255, 0.05)",
                color: msg.role === "user" ? "#fff" : "var(--text-primary)",
                border: msg.role === "user" ? "none" : "1px solid var(--border-subtle)",
                fontSize: "0.9rem",
                lineHeight: 1.55,
                boxShadow: msg.role === "user" ? "0 4px 14px rgba(124, 58, 237, 0.3)" : "none",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {msg.content}
            </div>

            {msg.role === "assistant" && msg.citations && msg.citations.length > 0 && (
              <div style={{ maxWidth: "82%", width: "100%", marginTop: "0.2rem" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.3rem", marginBottom: "0.1rem" }}>
                  📚 Grounded Sources ({msg.citations.length} retrieved chunks):
                </div>
                {msg.citations.map((c) => (
                  <CitationCard key={c.id || c.chunkIndex} citation={c} />
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            <div className="spinner" style={{ width: "16px", height: "16px" }} />
            <span>Searching vector embeddings and synthesizing answer with Gemini 2.5 Flash...</span>
          </div>
        )}

        {error && (
          <div style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.1)", padding: "0.6rem 0.9rem", borderRadius: "8px", fontSize: "0.82rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            ⚠️ {error}
          </div>
        )}
      </div>


      {/* Quick suggestions */}
      <div
        style={{
          padding: "0.4rem 1.2rem",
          display: "flex",
          gap: "0.5rem",
          overflowX: "auto",
          background: "rgba(255, 255, 255, 0.015)",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", alignSelf: "center", whiteSpace: "nowrap" }}>
          Suggested:
        </span>
        {[
          "Summarize key takeaways",
          "What are the main topics?",
          "Explain the key methodology",
        ].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setInputQuery(suggestion)}
            disabled={loading}
            style={{
              padding: "0.25rem 0.65rem",
              borderRadius: "9999px",
              border: "1px solid var(--border-subtle)",
              background: "rgba(255, 255, 255, 0.04)",
              color: "var(--text-secondary)",
              fontSize: "0.74rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "background 0.15s ease",
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>
      <form
        onSubmit={handleSendMessage}
        style={{
          padding: "0.9rem 1.2rem",
          borderTop: "1px solid var(--border-subtle)",
          background: "rgba(255, 255, 255, 0.01)",
          display: "flex",
          gap: "0.75rem",
        }}
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask anything about this document..."
          disabled={loading}
          style={{
            flex: 1,
            padding: "0.7rem 1rem",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
            background: "rgba(0, 0, 0, 0.4)",
            color: "var(--text-primary)",
            fontSize: "0.9rem",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className="btn btn-primary"
          style={{
            padding: "0.7rem 1.3rem",
            fontSize: "0.88rem",
            opacity: loading || !inputQuery.trim() ? 0.6 : 1,
            cursor: loading || !inputQuery.trim() ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Thinking..." : "Send Query"}
        </button>
      </form>
    </div>
  );
}
