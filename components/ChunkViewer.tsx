"use client";

interface Chunk {
  text: string;
  index: number;
}

interface ChunkViewerProps {
  chunks: string[];
  chunkSize: number;
  chunkOverlap: number;
}

export function ChunkViewer({ chunks, chunkSize, chunkOverlap }: ChunkViewerProps) {
  if (!chunks || chunks.length === 0) return null;

  const colors = [
    "rgba(124, 58, 237, 0.12)",
    "rgba(6, 182, 212, 0.12)",
    "rgba(245, 158, 11, 0.12)",
    "rgba(16, 185, 129, 0.12)",
    "rgba(236, 72, 153, 0.12)",
  ];

  const borderColors = [
    "rgba(124, 58, 237, 0.3)",
    "rgba(6, 182, 212, 0.3)",
    "rgba(245, 158, 11, 0.3)",
    "rgba(16, 185, 129, 0.3)",
    "rgba(236, 72, 153, 0.3)",
  ];

  return (
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            📄 Document Chunks
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Split into {chunks.length} chunks (size: {chunkSize}, overlap: {chunkOverlap})
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <span className="badge badge-purple">{chunks.length} chunks</span>
          <span className="badge badge-amber">
            ~{Math.round(chunks.reduce((a, c) => a + c.length, 0) / chunks.length)} avg chars
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          maxHeight: "400px",
          overflowY: "auto",
          paddingRight: "0.5rem",
        }}
      >
        {chunks.map((chunk, idx) => (
          <div
            key={idx}
            style={{
              background: colors[idx % colors.length],
              border: `1px solid ${borderColors[idx % borderColors.length]}`,
              borderRadius: "10px",
              padding: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.6rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Chunk #{idx + 1}
              </span>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                · {chunk.length} chars
              </span>
            </div>
            <p
              style={{
                fontSize: "0.83rem",
                color: "var(--text-primary)",
                lineHeight: 1.65,
                margin: 0,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {chunk.length > 300 ? chunk.slice(0, 300) + "…" : chunk}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "1rem",
          padding: "0.75rem",
          background: "rgba(245, 158, 11, 0.06)",
          borderRadius: "8px",
          border: "1px solid rgba(245, 158, 11, 0.15)",
          fontSize: "0.78rem",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
        }}
      >
        💡 <strong>Why chunking?</strong> LLMs have limited context windows. Chunking breaks long documents into 
        overlapping segments so each piece stays within token limits while preserving context across boundaries.
      </div>
    </div>
  );
}
