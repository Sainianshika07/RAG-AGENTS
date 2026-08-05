"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <div className="navbar-logo-icon">🧠</div>
            <span className="navbar-logo-text">LearnRAG</span>
          </Link>

          <div className="navbar-links">
            {session ? (
              <>
                <Link
                  href="/pipeline"
                  className={`btn btn-sm ${pathname === "/pipeline" ? "btn-primary" : "btn-secondary"}`}
                  id="nav-pipeline-link"
                >
                  🔬 Pipeline
                </Link>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginLeft: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {session.user?.name}
                  </span>
                  <button
                    id="nav-signout-btn"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="btn btn-sm btn-secondary"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-sm btn-secondary" id="nav-login-link">
                  Sign in
                </Link>
                <Link href="/register" className="btn btn-sm btn-primary" id="nav-register-link">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
