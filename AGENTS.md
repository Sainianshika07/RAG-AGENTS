# AGENTS.md — Repository Operating Guidelines

## Overview
This repository contains **RAG Agents**, a full-stack Next.js 15 application providing human-in-the-loop (HITL) document vectorization, conversational grounded question answering with citations, and automated RAG Triad quality evaluation.

---

## 1. Stack & Runtime Conventions
- **Framework**: Next.js 15 (App Router, Server Actions, Route Handlers).
- **Language**: TypeScript (Strict Mode). Always ensure `npx tsc --noEmit` passes with 0 errors before completing any task.
- **Database**: SQLite with Prisma Client (`prisma/schema.prisma`).
- **AI & Retrieval**:
  - LangChain / LangGraph (`lib/rag/graph.ts`) for multi-step agent orchestration.
  - Google Gemini 2.5 Flash for chat synthesis and `gemini-embedding-001` (768D) for vector embeddings.
  - Pinecone for vector indexing with automatic in-memory fallback.
  - Custom RAG Triad Evaluator (`lib/rag/evaluator.ts`) calculating Faithfulness, Relevance, Recall, and Latency.

---

## 2. Architecture & Coding Invariants
- **API Boundary Isolation**: Route handler files (`app/api/**/route.ts`) must only export valid Next.js HTTP method handlers (`GET`, `POST`, `PUT`, `DELETE`, etc.) or segment configs. Shared mutable state must live in `lib/` (e.g., `lib/rag/store.ts`).
- **Resilient Fallbacks**: Never assume external API credentials exist or will succeed. All vector generation and retrieval flows must gracefully fall back to local computation without throwing uncaught 500 errors.
- **Data Validation**: Validate all inbound HTTP payloads at the boundary using `zod` schemas.
- **Database Operations**: Prisma mutations must be wrapped with appropriate try/catch error handling to maintain uninterrupted user experience.

---

## 3. Pre-Flight & Verification Commands
- `node scripts/setup.js`: Automated pre-flight check (dependencies, Prisma synchronization, and TypeScript typechecking).
- `npx tsc --noEmit`: Strict typecheck.
- `npm run build`: Production Next.js build.
