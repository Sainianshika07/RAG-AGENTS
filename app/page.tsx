import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LearnRAG — Build AI That Actually Knows Things",
};

const features = [
  {
    icon: "📄",
    title: "Document Ingestion",
    description:
      "Upload any PDF or text file. Watch it get split into semantic chunks right before your eyes.",
    color: "var(--brand-purple)",
    bgColor: "rgba(124, 58, 237, 0.1)",
    borderColor: "rgba(124, 58, 237, 0.25)",
  },
  {
    icon: "🧮",
    title: "Vector Embeddings",
    description:
      "See your chunks transformed into 768-dimensional vectors by Gemini's text-embedding-004 model.",
    color: "var(--brand-cyan)",
    bgColor: "rgba(6, 182, 212, 0.1)",
    borderColor: "rgba(6, 182, 212, 0.25)",
  },
  {
    icon: "🔍",
    title: "Semantic Retrieval",
    description:
      "Ask a question. Watch Pinecone find the most relevant chunks using cosine similarity search.",
    color: "var(--brand-amber)",
    bgColor: "rgba(245, 158, 11, 0.1)",
    borderColor: "rgba(245, 158, 11, 0.25)",
  },
  {
    icon: "✨",
    title: "Grounded Generation",
    description:
      "Gemini 2.5 Flash synthesizes a precise answer using only the retrieved context. No hallucinations.",
    color: "var(--brand-green)",
    bgColor: "rgba(16, 185, 129, 0.1)",
    borderColor: "rgba(16, 185, 129, 0.25)",
  },
];

const pipeline = [
  { step: "01", label: "Upload", desc: "PDF or TXT", icon: "📤" },
  { step: "02", label: "Chunk", desc: "Configurable size", icon: "✂️" },
  { step: "03", label: "Embed", desc: "768D vectors", icon: "🧮" },
  { step: "04", label: "Store", desc: "Pinecone DB", icon: "🗄️" },
  { step: "05", label: "Retrieve", desc: "Top-k similarity", icon: "🔍" },
  { step: "06", label: "Generate", desc: "Gemini 2.5 Flash", icon: "✨" },
];

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "6rem 0 4rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative orbs */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span className="badge badge-purple" style={{ fontSize: "0.78rem" }}>
              🚀 Powered by Gemini 2.5 Flash + Pinecone
            </span>
          </div>

          <h1 style={{ marginBottom: "1.5rem", maxWidth: "800px", margin: "0 auto 1.5rem" }}>
            Build AI That{" "}
            <span className="gradient-text">Actually Knows Things</span>
          </h1>

          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--text-secondary)",
              maxWidth: "600px",
              margin: "0 auto 3rem",
              lineHeight: 1.7,
            }}
          >
            Learn Retrieval-Augmented Generation by <em>doing it</em>. Upload a document, 
            watch it become vectors, tune the retrieval, and get grounded AI answers — step by step.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn btn-primary btn-lg" id="hero-get-started-btn">
              🧠 Start Learning — It's Free
            </Link>
            <Link href="/login" className="btn btn-secondary btn-lg" id="hero-sign-in-btn">
              Sign in
            </Link>
          </div>

          {/* Tech stack pills */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "3rem",
            }}
          >
            {["LangGraph", "Gemini 2.5 Flash", "Pinecone", "Next.js 15", "SQLite"].map((tech) => (
              <span
                key={tech}
                style={{
                  padding: "0.35rem 0.85rem",
                  background: "var(--bg-glass)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.78rem",
                  color: "var(--text-secondary)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pipeline Diagram ──────────────────────────────────────────────── */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ marginBottom: "0.75rem" }}>
              The RAG Pipeline,{" "}
              <span className="gradient-text">Made Visible</span>
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Every step is observable, inspectable, and tuneable. This is how production AI systems work.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {pipeline.map((p, idx) => (
              <div key={p.step} style={{ display: "flex", alignItems: "center" }}>
                <div
                  className="glass-card"
                  style={{
                    padding: "1rem 1.25rem",
                    textAlign: "center",
                    minWidth: "100px",
                    background: "var(--gradient-card)",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>{p.icon}</div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--brand-purple-light)",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {p.step}
                  </div>
                  <div
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {p.label}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {p.desc}
                  </div>
                </div>
                {idx < pipeline.length - 1 && (
                  <div
                    aria-hidden
                    style={{
                      width: "32px",
                      height: "2px",
                      background: "var(--gradient-primary)",
                      opacity: 0.5,
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ marginBottom: "0.75rem" }}>
              Every Step,{" "}
              <span className="gradient-text-amber">Explained</span>
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              No black boxes. See exactly what's happening at each stage of the pipeline.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                className="glass-card"
                style={{
                  padding: "1.75rem",
                  background: f.bgColor,
                  borderColor: f.borderColor,
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    marginBottom: "1rem",
                    width: "52px",
                    height: "52px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "1.05rem", marginBottom: "0.6rem", color: f.color }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.65 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div
            className="glass-card"
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.1) 100%)",
              borderColor: "var(--border-accent)",
              boxShadow: "var(--shadow-card), var(--shadow-glow-purple)",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>
              Ready to{" "}
              <span className="gradient-text">understand RAG</span>?
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "2rem",
                maxWidth: "500px",
                margin: "0 auto 2rem",
              }}
            >
              Join and build your first RAG pipeline in minutes. No prior AI experience needed.
            </p>
            <Link href="/register" className="btn btn-primary btn-lg" id="cta-register-btn">
              🚀 Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "2rem 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Built with ❤️ using LangGraph, Gemini 2.5 Flash & Pinecone
          </p>
        </div>
      </footer>
    </div>
  );
}
