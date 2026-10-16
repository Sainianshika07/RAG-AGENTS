# RAG Agents — System Setup & Development Guide

This guide walks you through setting up, configuring, and developing on the **RAG Agents** platform.

---

## 1. System Requirements
- **Node.js**: v18.17.0+ or v20+ (Node v22+ supported)
- **Package Manager**: npm (bundled with Node)
- **Database**: SQLite (local  handled automatically via Prisma)
- **Operating System**: Windows, macOS, or Linux

---

## 2. Quickstart Pre-Flight Setup
We provide an automated pre-flight setup script that checks your runtime, installs missing packages, generates Prisma clients, applies SQLite migrations, and validates TypeScript types:

```bash
node scripts/setup.js
```

---

## 3. Environment Configuration
Create a  or  in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-char-random-secret"

# Google Gemini (LLM & Embeddings)
GEMINI_API_KEY="your-gemini-api-key"

# Pinecone Vector Store
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_INDEX_NAME="rag-agents"
```

> **Note on Zero-Crash Resilient Fallbacks:**  
> If `GEMINI_API_KEY` or `PINECONE_API_KEY` are absent or reach quota limits, the system automatically falls back to deterministic local 768-dimensional embeddings and in-memory cosine vector ranking.

---

## 4. Manual Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Synchronize Prisma Database
```bash
# Generate Prisma Client
npx prisma generate

# Push SQLite schema
npx prisma db push
```

### 3. Launch Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000).

---

## 5. Available Scripts
| Command | Description |
|---|---|
| `node scripts/setup.js` | Pre-flight validation, database sync, and type audit |
| `npm run dev` | Start Next.js development server at port 3000 |
| `npm run build` | Run production Next.js compiler build |
| `npm run start` | Start production server after build |
| `npm run lint` | Run ESLint checks |
| `npx prisma studio` | Open visual web GUI to inspect SQLite tables |
| `npx tsc --noEmit` | Typecheck entire project without emitting output |

---

## 6. Project Architecture Overview
- **`app/api/rag-pipeline/`**: Document ingestion, chunking, embedding, vector store upsert.
- **`app/api/resume/`**: Parameter tuning (`kValue`, `chunkSize`, `chunkOverlap`) and HITL graph progression.
- **`app/api/chat/`**: Grounded chat with citations, evaluation scoring, and Prisma persistence.
- **`app/api/chat/sessions/`**: Session listing, conversation history, and deletion.
- **`app/api/eval-metrics/`**: RAG Triad telemetry retrieval and evaluation calculations.
- **`lib/rag/evaluator.ts`**: RAG Triad assessment algorithm (Faithfulness, Relevance, Recall, Latency).
- **`lib/rag/store.ts`**: Global state map for active LangGraph pipelines.
- **`components/EvalMetricsDashboard.tsx`**: Real-time evaluation dashboard.
- **`components/ChatInterface.tsx`**: Interactive chat with inline citation cards and triad quality badges.
