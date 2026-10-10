"use client";

import { useState } from "react";

export interface RetrievedChunk {
  id: string;
  text: string;
  score: number;
  chunkIndex: number;
}

export function CitationCard({ citation }: { citation: RetrievedChunk }) {
  const [expanded, setExpanded] = useState(false);
  const pct = Math.round(citation.score * 100);

  const badgeColor =
    citation.score > 0.8
      ? "var(--brand-green)"
      : citation.score > 0.65
      ? "var(--brand-cyan)"
      : "var(--brand-amber)";

  return (
    <div
      style={{
        marginTop: "0.6rem",
        borderRadius: "8px",
        border: "1px solid var(--border-subtle)",
        background: "rgba(255, 255, 255, 0.03)",
        overflow: "hidden",
        fontSize: "0.82rem",
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.45rem 0.75rem",
          background: "none",
          border: "none",
          color: "var(--text-secondary)",
          cursor: "pointer",
          textAlign: "left",
          fontSize: "0.8rem",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            Chunk #{citation.chunkIndex + 1}
          </span>
          <span
            style={{
              padding: "0.15rem 0.45rem",
              borderRadius: "9999px",
              fontSize: "0.7rem",
              fontWeight: 700,
              background: "rgba(255, 255, 255, 0.05)",
              color: badgeColor,
              border: "1px solid var(--border-subtle)",
            }}
          >
            {pct}% match
          </span>
        </span>
        <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>
          {expanded ? "Hide excerpt" : "View citation source"}
        </span>
      </button>

      {expanded && (
        <div
          style={{
            padding: "0.6rem 0.75rem",
            borderTop: "1px solid var(--border-subtle)",
            background: "rgba(0, 0, 0, 0.25)",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontFamily: "monospace",
            fontSize: "0.78rem",
          }}
        >
          {citation.text}
        </div>
      )}
    </div>
  );
}