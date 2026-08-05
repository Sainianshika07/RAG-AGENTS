"use client";

interface RetrievedChunk {
  id: string;
  text: string;
  score: number;
  chunkIndex: number;
}

interface ContextHighlighterProps {
  retrievedChunks: RetrievedChunk[];
  query: string;
  kValue: number;
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    score > 0.85
      ? "var(--brand-green)"
      : score > 0.7
      ? "var(--brand-cyan)"
      : "var(--brand-amber)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
      <div
        style={{
          flex: 1,
          height: "5px",
          background: "var(--border-subtle)",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: "3px",
            transition: "width 0.8s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color,
          minWidth: "42px",
          textAlign: "right",
        }}
      >
        {pct}%
      </span>
    </div>
  );
}

export function ContextHighlighter({
  retrievedChunks,
  query,
  kValue,
}: ContextHighlighterProps) {
  if (!retrievedChunks || retrievedChunks.length === 0) return null;

  return (
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem" }}>
            🔍 Retrieved Context
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.4rem 0.75rem",
              background: "rgba(6, 182, 212, 0.08)",
              border: "1px solid rgba(6, 182, 212, 0.2)",
              borderRadius: "8px",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Query:</span>
            <span
              style={{
                fontSize: "0.82rem",
                color: "var(--brand-cyan-light)",
                fontStyle: "italic",
              }}
            >
              "{query}"
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <span className="badge badge-cyan">top-{kValue} chunks</span>
          <span className="badge badge-purple">cosine similarity</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {retrievedChunks.map((chunk, idx) => (
          <div
            key={chunk.id}
            style={{
              background:
                idx === 0
                  ? "rgba(16, 185, 129, 0.08)"
                  : "rgba(255, 255, 255, 0.02)",
              border: `1px solid ${
                idx === 0 ? "rgba(16, 185, 129, 0.3)" : "var(--border-subtle)"
              }`,
              borderRadius: "12px",
              padding: "1.1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.75rem",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  #{idx + 1} — Chunk {chunk.chunkIndex + 1}
                </span>
                {idx === 0 && (
                  <span className="badge badge-green" style={{ fontSize: "0.65rem" }}>
                    Best match
                  </span>
                )}
              </div>
              <div style={{ minWidth: "160px" }}>
                <ScoreBar score={chunk.score} />
              </div>
            </div>
            <p
              style={{
                fontSize: "0.84rem",
                color: "var(--text-primary)",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {chunk.text}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "1rem",
          padding: "0.75rem",
          background: "rgba(16, 185, 129, 0.06)",
          borderRadius: "8px",
          border: "1px solid rgba(16, 185, 129, 0.15)",
          fontSize: "0.78rem",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
        }}
      >
        💡 <strong>Cosine similarity</strong> measures the angle between two vectors. A score of 100% means 
        the query and chunk point in exactly the same semantic direction. The top chunk is used as context for generation.
      </div>
    </div>
  );
}
