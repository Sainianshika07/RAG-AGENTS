# Product Requirements Document (PRD)

## Project: LearnRAG — Full-Stack Interactive Document RAG & Chat Platform

### 1. Executive Summary & Vision
LearnRAG is a full-stack educational and practical AI application built with Next.js 15, React 19, TypeScript, and Node.js. It demystifies Retrieval-Augmented Generation (RAG) by offering both an educational step-by-step pipeline visualizer (chunking, 768-D vector embeddings, similarity search, and generation) and a production-grade, interactive multi-turn Chat Interface with real-time document citations.

### 2. User Problems Solved
1. **Black-box AI Mystery**: Most RAG tools hide intermediate steps. Users and students cannot inspect how documents are chunked or why specific context passages were retrieved.
2. **Missing Citations in Chat**: Many standard chat bots give answers without source traceability or confidence scores.
3. **Complex Setup**: Developers struggle to wire up Pinecone, LangGraph, Google Gemini, and Next.js authentication cleanly.

### 3. Target Audience & Personas
- **AI Developers & Students**: Want to inspect vector dimensions, chunk boundaries, cosine similarity scores, and parameter tuning ($k$-value, chunk size).
- **Knowledge Workers**: Need to upload PDF/TXT documents and engage in interactive, multi-turn conversational Q&A backed by exact document citations.

### 4. Core Features & Scope

#### Phase 1: Interactive Chat Interface & Document Citations (Primary Priority)
- **Multi-turn Chat UI**: Conversational chat interface allowing continuous follow-ups on the uploaded document.
- **Dynamic Source Citations**: Inline and collapsible source cards displaying chunk index, similarity score, and excerpted grounding text.
- **Direct Namespace Integration**: Chat connects directly to the Pinecone namespace generated during document ingestion.
- **Suggested Prompts & History**: Quick sample questions derived from document chunks.

#### Phase 2: Pipeline State Inspection & Educational Visualizers
- **Document Chunk Inspector**: Visual boundaries for overlapping chunks.
- **High-Dimensional Embedding Visualizer**: Visual representation of 768-dimensional float arrays with interactive heatmaps.
- **Context Highlighter**: Clear indication of retrieved context fed into the Gemini 2.5 Flash synthesis prompt.
- **Human-in-the-Loop (HITL) Controls**: Adjustable chunk size, overlap, and top-$k$ nearest neighbors.

#### Phase 3: Authentication & Progress Persistence
- **NextAuth.js Integration**: Credentials-based login and registration.
- **Prisma ORM**: Storing user profiles and session progress runs in SQLite / PostgreSQL.

### 5. Technical Constraints & Quota Optimization
- **Gemini 2.5 Flash**: Single generation pass per query with deterministic routing to avoid quota starvation.
- **Pinecone Vector Database**: Namespace-isolated document index with cosine similarity metric.
- **Client-Side Responsiveness**: Mobile-friendly, glassmorphism dark aesthetic using standard CSS variables and Framer Motion micro-interactions.

### 6. Acceptance Criteria
- [ ] Users can upload PDF/TXT files and see ingestion complete with chunk and embedding count.
- [ ] Users can switch between Step-by-Step Pipeline Inspector and Interactive Chat Interface.
- [ ] Chat responses include verifiable chunk citations with similarity relevance badges.
- [ ] Application compiles cleanly without TypeScript errors or broken routes.
