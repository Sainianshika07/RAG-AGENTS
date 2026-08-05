"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChunkViewer } from "@/components/ChunkViewer";
import { EmbeddingVisualizer } from "@/components/EmbeddingVisualizer";
import { ContextHighlighter } from "@/components/ContextHighlighter";
import { StepCard } from "@/components/StepCard";
import type { PipelineStep } from "@/lib/rag/graph";

interface PipelineState {
  namespaceId: string;
  currentStep: PipelineStep;
  documentVectorized: boolean;
  chunks: string[];
  chunkCount: number;
  embeddingsSample: { preview: number[]; dimensions: number }[];
  retrievedChunks: { id: string; text: string; score: number; chunkIndex: number }[];
  context: string | null;
  answer: string | null;
  query: string | null;
  kValue: number;
  chunkSize: number;
  chunkOverlap: number;
  error: string | null;
}

export default function PipelinePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const [pipelineState, setPipelineState] = useState<PipelineState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Upload step
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chunkSize, setChunkSize] = useState(500);
  const [chunkOverlap, setChunkOverlap] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Query step
  const [query, setQuery] = useState("");
  const [kValue, setKValue] = useState(3);

  // JSON inspector
  const [showStateJson, setShowStateJson] = useState(false);

  const currentStep: PipelineStep = pipelineState?.currentStep || "idle";

  async function handleUpload() {
    if (!selectedFile) return;
    setError("");
    setLoading(true);

    const form = new FormData();
    form.append("document", selectedFile);
    form.append("chunkSize", String(chunkSize));
    form.append("chunkOverlap", String(chunkOverlap));
    form.append("kValue", String(kValue));

    try {
      const res = await fetch("/api/rag-pipeline", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Pipeline failed");
      setPipelineState(data.state);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleQuery() {
    if (!query.trim() || !pipelineState?.namespaceId) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namespaceId: pipelineState.namespaceId,
          query,
          kValue,
          resetContext: true,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Query failed");
      setPipelineState(data.state);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleRetune() {
    if (!pipelineState?.namespaceId) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namespaceId: pipelineState.namespaceId,
          kValue,
          resetContext: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Re-tune failed");
      setPipelineState(data.state);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "text/plain" || file.type === "application/pdf")) {
      setSelectedFile(file);
    }
  }

  function resetPipeline() {
    setPipelineState(null);
    setSelectedFile(null);
    setQuery("");
    setError("");
    setKValue(3);
    setChunkSize(500);
    setChunkOverlap(50);
  }

  const steps = [
    {
      stepNumber: 1,
      title: "Document Ingestion",
      description: "Text chunked and embedded into Pinecone vectors",
      icon: "📄",
      stepKey: "ingestion" as PipelineStep,
    },
    {
      stepNumber: 2,
      title: "Semantic Retrieval",
      description: "Query embedded and matched against stored vectors",
      icon: "🔍",
      stepKey: "retrieval" as PipelineStep,
    },
    {
      stepNumber: 3,
      title: "Answer Generation",
      description: "Gemini 2.5 Flash synthesizes a grounded response",
      icon: "✨",
      stepKey: "generation" as PipelineStep,
    },
  ];

  if (status === "loading") {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem 0 4rem" }}>
      <div className="container">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
              🔬 RAG{" "}
              <span className="gradient-text">Pipeline Explorer</span>
            </h1>
            {pipelineState && (
              <button
                id="pipeline-reset-btn"
                onClick={resetPipeline}
                className="btn btn-sm btn-secondary"
              >
                ↺ Reset
              </button>
            )}
          </div>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Welcome back, <strong style={{ color: "var(--text-primary)" }}>{session?.user?.name}</strong>. 
            Upload a document and explore how RAG works from the inside.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {/* ── Left: Steps Panel ─────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h3 style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>
              Pipeline Steps
            </h3>
            {steps.map((s) => (
              <StepCard
                key={s.stepKey}
                {...s}
                currentStep={currentStep}
                isComplete={
                  (s.stepKey === "ingestion" && !!pipelineState?.documentVectorized) ||
                  (s.stepKey === "retrieval" && !!pipelineState?.context) ||
                  (s.stepKey === "generation" && !!pipelineState?.answer)
                }
              />
            ))}

            {/* State Inspector Toggle */}
            {pipelineState && (
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  id="toggle-state-json-btn"
                  className="btn btn-sm btn-outline"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => setShowStateJson(!showStateJson)}
                >
                  {showStateJson ? "Hide" : "Show"} Raw State JSON
                </button>
              </div>
            )}
          </div>

          {/* ── Right: Main Work Area ─────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Error display */}
            {error && (
              <div className="alert alert-error">
                ⚠️ {error}
              </div>
            )}

            {/* ── STEP 1: Upload & Ingest ─────────────────────────────── */}
            <div className="glass-card" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <span
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "rgba(124,58,237,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                  }}
                >
                  📄
                </span>
                <div>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Step 1 — Document Ingestion</h2>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Upload a PDF or TXT file to chunk, embed, and store in Pinecone
                  </p>
                </div>
                {pipelineState?.documentVectorized && (
                  <span className="badge badge-green" style={{ marginLeft: "auto" }}>✓ Vectorized</span>
                )}
              </div>

              {/* File Drop Zone */}
              <div
                id="file-drop-zone"
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? "var(--brand-purple)" : selectedFile ? "var(--brand-green)" : "var(--border-subtle)"}`,
                  borderRadius: "12px",
                  padding: "2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  background: dragOver
                    ? "rgba(124,58,237,0.08)"
                    : selectedFile
                    ? "rgba(16,185,129,0.06)"
                    : "var(--bg-glass)",
                  transition: "all 0.2s ease",
                  marginBottom: "1.25rem",
                }}
              >
                <input
                  ref={fileInputRef}
                  id="file-input"
                  type="file"
                  accept=".txt,.pdf"
                  style={{ display: "none" }}
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  {selectedFile ? "✅" : "📂"}
                </div>
                <p style={{ fontSize: "0.9rem", color: selectedFile ? "var(--brand-green-light)" : "var(--text-secondary)" }}>
                  {selectedFile
                    ? `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`
                    : "Drop a PDF or TXT file here, or click to browse"}
                </p>
                {!selectedFile && (
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    Supports: .pdf, .txt — Max 10MB
                  </p>
                )}
              </div>

              {/* Chunking Parameters */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Chunk Size</span>
                    <span style={{ color: "var(--brand-purple-light)", fontWeight: 700 }}>{chunkSize}</span>
                  </label>
                  <input
                    id="chunk-size-slider"
                    type="range"
                    min={100}
                    max={2000}
                    step={50}
                    value={chunkSize}
                    onChange={(e) => setChunkSize(Number(e.target.value))}
                    style={{ width: "100%", marginTop: "0.5rem" }}
                    disabled={!!pipelineState?.documentVectorized}
                  />
                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    Characters per chunk
                  </p>
                </div>
                <div>
                  <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Overlap</span>
                    <span style={{ color: "var(--brand-cyan)", fontWeight: 700 }}>{chunkOverlap}</span>
                  </label>
                  <input
                    id="chunk-overlap-slider"
                    type="range"
                    min={0}
                    max={200}
                    step={10}
                    value={chunkOverlap}
                    onChange={(e) => setChunkOverlap(Number(e.target.value))}
                    style={{ width: "100%", marginTop: "0.5rem" }}
                    disabled={!!pipelineState?.documentVectorized}
                  />
                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    Overlap between chunks
                  </p>
                </div>
              </div>

              <button
                id="ingest-btn"
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={!selectedFile || loading || !!pipelineState?.documentVectorized}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {loading && currentStep === "idle" ? (
                  <><div className="spinner" style={{ width: "16px", height: "16px" }} /> Ingesting…</>
                ) : pipelineState?.documentVectorized ? (
                  "✓ Document Vectorized"
                ) : (
                  "🚀 Ingest Document"
                )}
              </button>
            </div>

            {/* ── Chunking Results ─────────────────────────────────────── */}
            {pipelineState?.chunks && pipelineState.chunks.length > 0 && (
              <ChunkViewer
                chunks={pipelineState.chunks}
                chunkSize={pipelineState.chunkSize}
                chunkOverlap={pipelineState.chunkOverlap}
              />
            )}

            {/* ── Embedding Results ────────────────────────────────────── */}
            {pipelineState?.embeddingsSample && pipelineState.embeddingsSample.length > 0 && (
              <EmbeddingVisualizer
                samples={pipelineState.embeddingsSample}
                chunkCount={pipelineState.chunkCount}
              />
            )}

            {/* ── STEP 2: Query & Retrieval ────────────────────────────── */}
            {pipelineState?.documentVectorized && (
              <div className="glass-card" style={{ padding: "1.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <span
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(6,182,212,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                    }}
                  >
                    🔍
                  </span>
                  <div>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Step 2 — Query & Retrieval</h2>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Ask a question about your document. Tune k to retrieve more/fewer chunks.
                    </p>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <label htmlFor="query-input" className="form-label">Your Question</label>
                  <textarea
                    id="query-input"
                    className="form-input"
                    placeholder="e.g. What are the main topics covered in this document?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={3}
                    style={{ resize: "vertical" }}
                  />
                </div>

                {/* K-value slider */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Top-K Chunks</span>
                    <span style={{ color: "var(--brand-cyan)", fontWeight: 700 }}>k = {kValue}</span>
                  </label>
                  <input
                    id="k-value-slider"
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={kValue}
                    onChange={(e) => setKValue(Number(e.target.value))}
                    style={{ width: "100%", marginTop: "0.5rem" }}
                  />
                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    Number of chunks to retrieve from Pinecone
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    id="query-btn"
                    className="btn btn-primary"
                    onClick={handleQuery}
                    disabled={!query.trim() || loading}
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    {loading ? (
                      <><div className="spinner" style={{ width: "16px", height: "16px" }} /> Processing…</>
                    ) : (
                      "🔍 Search & Generate"
                    )}
                  </button>
                  {pipelineState.context && (
                    <button
                      id="retune-btn"
                      className="btn btn-outline"
                      onClick={handleRetune}
                      disabled={loading}
                      title="Re-run retrieval with new k value"
                    >
                      ↺ Re-tune
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── Retrieved Context ────────────────────────────────────── */}
            {pipelineState?.retrievedChunks && pipelineState.retrievedChunks.length > 0 && pipelineState.query && (
              <ContextHighlighter
                retrievedChunks={pipelineState.retrievedChunks}
                query={pipelineState.query}
                kValue={pipelineState.kValue}
              />
            )}

            {/* ── STEP 3: Generated Answer ─────────────────────────────── */}
            {pipelineState?.answer && (
              <div
                className="glass-card"
                style={{
                  padding: "1.75rem",
                  background:
                    "linear-gradient(145deg, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.05) 100%)",
                  borderColor: "rgba(16,185,129,0.3)",
                  boxShadow: "var(--shadow-card), 0 0 30px rgba(16,185,129,0.15)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <span
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(16,185,129,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                    }}
                  >
                    ✨
                  </span>
                  <div>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-green-light)" }}>
                      Step 3 — Generated Answer
                    </h2>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Synthesized by Gemini 2.5 Flash using only the retrieved context
                    </p>
                  </div>
                  <span className="badge badge-green" style={{ marginLeft: "auto" }}>Grounded</span>
                </div>

                <div
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    borderRadius: "10px",
                    padding: "1.5rem",
                    fontSize: "0.95rem",
                    color: "var(--text-primary)",
                    lineHeight: 1.8,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {pipelineState.answer}
                </div>

                <div
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem",
                    background: "rgba(16,185,129,0.06)",
                    borderRadius: "8px",
                    border: "1px solid rgba(16,185,129,0.15)",
                    fontSize: "0.78rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  💡 <strong>1 LLM call only.</strong> The generation agent used exactly one Gemini request — 
                  combining your query with the retrieved context — to produce this grounded answer. 
                  No iterative self-refinement loops, saving API quota.
                </div>
              </div>
            )}

            {/* ── Raw State Inspector ──────────────────────────────────── */}
            {showStateJson && pipelineState && (
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "1rem" }}>
                  🔧 Live State JSON (HITL Inspector)
                </h3>
                <pre className="code-block" style={{ fontSize: "0.75rem" }}>
                  {JSON.stringify(pipelineState, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pipeline-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
