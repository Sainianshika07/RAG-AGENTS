import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "LearnRAG — Build AI That Actually Knows Things",
  description:
    "An interactive educational platform to understand Retrieval-Augmented Generation (RAG) by building it step-by-step with real AI. Upload documents, inspect embeddings, tune retrieval, and watch Gemini generate grounded answers.",
  keywords: ["RAG", "LangGraph", "Gemini", "AI", "Embeddings", "Pinecone", "Educational"],
  openGraph: {
    title: "LearnRAG — Interactive RAG Pipeline Explorer",
    description: "Learn how RAG works by building it with Gemini 2.5 Flash and Pinecone.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="page-wrapper">
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
