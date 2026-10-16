# Product Requirements Document (PRD): Full RAG Backend Suite & Evaluation Engine

## 1. Executive Summary & Problem Statement
In production and educational Retrieval-Augmented Generation (RAG) applications, users and developers require more than simple question answering. They require:
- Complete end-to-end multi-agent orchestration (Ingestion, Retrieval, Generation, and Evaluator agents).
- Transparent state inspection and tuning (chunk size, overlap, top-k retrieval, vector previews).
- Grounded conversational chat with source citations linked to vector chunks.
- Continuous automated quality assessment using the industry-standard RAG Triad (Faithfulness, Answer Relevance, Context Recall / Utilization).
- Durable database persistence for user sessions, chat messages, citations, and evaluation telemetry.

This document details the backend requirements to deliver a production-grade, resilient RAG backend suite built on Next.js 15, Prisma/SQLite, LangChain/LangGraph, Google Gemini 2.5 Flash, and Pinecone vector store (with seamless in-memory fallbacks).

---

## 2. Target Personas & Core User Journeys
1. Developer & AI Engineer:
   - Uploads domain documents (.txt, .pdf).
   - Observes chunking, embedding generation (768D), and vector upsert steps.
   - Tweaks hyperparameters in real-time to inspect retrieval impact.
2. End-User / Learner:
   - Asks queries through interactive chat interface.
   - Receives fact-grounded responses with granular citations (chunk index, similarity score, chunk text).
   - Accesses historical chat sessions and inspects latency and accuracy scores.
3. MLOps / Quality Evaluator:
   - Monitors the RAG Triad scores across queries.
   - Inspects trends to identify hallucinations or retrieval gaps.

---

## 3. Scope & Key Features

### Feature 1: Multi-Agent Pipeline Endpoints
- Document Ingestion (POST /api/rag-pipeline):
  - Accept document (text or PDF up to 4.5MB), chunkSize, chunkOverlap, and kValue.
  - Execute text normalization, character/paragraph recursive splitting.
  - Generate 768-dimensional embeddings using Gemini gemini-embedding-001 (with deterministic fallback).
  - Upsert vectors into Pinecone under a unique namespaceId.
- Pipeline Stepping & Tuning (POST /api/resume):
  - Allow human-in-the-loop (HITL) resumption and parameter tweaking.
  - Return detailed intermediate states (chunk previews, embedding dimensions, retrieved chunk scores).

### Feature 2: Grounded Chat & Session Persistence (POST /api/chat, GET /api/chat)
- Validate query payload with Zod.
- Query Pinecone / vector store for top-k nearest semantic chunks.
- Formulate strict grounding prompts with prompt engineering against hallucination.
- Generate answers using Gemini 2.5 Flash.
- Auto-persist:
  - Create or associate ChatSession in Prisma for the authenticated user and namespace.
  - Store user query and assistant response in ChatMessage along with serialized JSON citations.
  - Compute and log evaluation metrics.
  - Return citations, answer, and session details to the client.

### Feature 3: Automated RAG Triad Evaluation & Telemetry (GET & POST /api/eval-metrics)
- Compute or evaluate Triad metrics:
  - Faithfulness (0.0 - 1.0): Degree to which the answer claims are directly supported by retrieved context.
  - Answer Relevance (0.0 - 1.0): Degree to which the response directly addresses the user query.
  - Context Recall / Utilization (0.0 - 1.0): Proportion of retrieved information effectively utilized in the answer.
  - Latency (ms): End-to-end execution time.
- Persist scores in RAGEvalMetrics model linked to ChatSession.
- Expose GET /api/eval-metrics?namespaceId=... returning historical runs and aggregate summary statistics.

### Feature 4: Session & History Management (GET /api/chat/sessions, DELETE /api/chat/sessions/[id])
- Provide endpoints to list all document chat sessions for the logged-in user.
- Fetch chat message history with citations.
- Allow clearing / deleting sessions.

---

## 4. Non-Functional Requirements & Guardrails
- Resilience & Fallbacks: If Pinecone or external embedding credentials encounter quota limits or missing keys, fall back seamlessly to deterministic local embeddings and in-memory cosine ranking without crashing.
- Security & Authorization: All endpoints enforce NextAuth session validation. Queries and sessions are scoped strictly to the authenticated user.
- Payload Limits: Max file upload size of 4.5MB to protect serverless memory limits.
- Type Safety: End-to-end TypeScript with Zod schemas for all request payloads.
- Performance: Sub-second latency for vector retrieval and prompt construction; optimized single-turn LLM generation.
