"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/pipeline");
    }
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              fontSize: "2.5rem",
              marginBottom: "1rem",
              display: "inline-block",
              animation: "float 3s ease-in-out infinite",
            }}
          >
            🧠
          </div>
          <h1
            style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}
          >
            Welcome back
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Sign in to your LearnRAG account
          </p>
        </div>

        {/* Card */}
        <div
          className="glass-card"
          style={{
            padding: "2.5rem",
            background:
              "linear-gradient(145deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.04) 100%)",
            borderColor: "var(--border-accent)",
          }}
        >
          {error && (
            <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ marginTop: "0.5rem", width: "100%", justifyContent: "center" }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: "16px", height: "16px" }} />
                  Signing in…
                </>
              ) : (
                "Sign in →"
              )}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.88rem",
            color: "var(--text-muted)",
          }}
        >
          Don't have an account?{" "}
          <Link
            href="/register"
            style={{ color: "var(--brand-purple-light)", textDecoration: "none", fontWeight: 600 }}
          >
            Create one free →
          </Link>
        </p>
      </div>
    </div>
  );
}
