# Technical Specification: Full RAG Backend Architecture & Evaluation Engine

## 1. System Architecture & Component Diagram
The backend system provides a complete suite of services for document ingestion, vector retrieval, contextual question-answering with citations, and continuous RAG triad evaluation.

Endpoints:
- POST /api/rag-pipeline (Upload & Ingest Document)
- POST /api/resume (HITL Pipeline Step & Hyperparameter Tuning)
- POST /api/chat (Interactive Query with Citations, Evaluation & Persistence)
- GET /api/chat/sessions (History & Session Management)
- GET /api/eval-metrics (Telemetry Dashboard Data)

## 2. API Contracts & Schemas
### 2.1 POST /api/chat
- Auth: Requires valid session via NextAuth.
- Request: { namespaceId, message, kValue, sessionId }
- Response: { sessionId, answer, citations, metrics }

### 2.2 GET /api/chat/sessions
- Scoped to authenticated user ID.
- Returns all active and past sessions with message history.

## 3. RAG Triad Evaluator Engine
- Computes Faithfulness, Answer Relevance, Context Recall / Utilization, and Latency.
- Persists records to Prisma RAGEvalMetrics table.

## 4. Resilience & Fallback Strategy
- Pinecone and Gemini fallbacks for robust zero-crash execution.