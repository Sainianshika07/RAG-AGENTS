"use client";

interface EmbeddingSample {
  preview: number[];
  dimensions: number;
}

interface EmbeddingVisualizerProps {
  samples: EmbeddingSample[];
  chunkCount: number;
}

function ValueBar({ value }: { value: number }) {
  // Normalize value to 0-1 range for visualization (values are typically -1 to 1)
  const normalized = Math.max(0, Math.min(1, (value + 1) / 2));
  const hue = Math.round(normalized * 240); // Blue (240) to Red (0)
  const saturation = 70 + normalized * 30;
  const lightness = 45 + normalized * 20;

  return (
    <div
      title={`${value.toFixed(4)}`}
      style={{
        width: "100%",
        height: "28px",
        borderRadius: "3px",
        background: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        opacity: 0.85,
        transition: "opacity 0.2s",
        cursor: "default",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.opacity = "0.85";
      }}
    />
  );
}

export function EmbeddingVisualizer({ samples, chunkCount }: EmbeddingVisualizerProps) {
  if (!samples || samples.length === 0) return null;

  return (
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            🧮 Embedding Vectors
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Showing first 20 dimensions of {samples.length} chunks (total: {chunkCount} chunks × {samples[0]?.dimensions} dims)
          </p>
        </div>
        <span className="badge badge-cyan">gemini-embedding-001</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {samples.map((sample, chunkIdx) => (
          <div key={chunkIdx}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Chunk {chunkIdx + 1}
              </span>
              <div
                style={{
                  height: "1px",
                  flex: 1,
                  background: "var(--border-subtle)",
                }}
              />
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                {sample.dimensions}D vector
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(20, 1fr)",
                gap: "2px",
              }}
            >
              {sample.preview.map((value, dimIdx) => (
                <ValueBar key={dimIdx} value={value} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "1rem",
          padding: "0.75rem",
          background: "rgba(6, 182, 212, 0.06)",
          borderRadius: "8px",
          border: "1px solid rgba(6, 182, 212, 0.15)",
          fontSize: "0.78rem",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
        }}
      >
        💡 <strong>How to read this:</strong> Each colored cell is one dimension of the embedding vector. 
        Colors range from <span style={{ color: "#4287f5" }}>blue (negative)</span> to{" "}
        <span style={{ color: "#e05252" }}>red (positive)</span>. 
        Similar documents produce similar color patterns — that's how semantic search works!
      </div>
    </div>
  );
}
