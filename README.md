# LearnRAG — Full-Stack Interactive AI & RAG Platform

> Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **LangGraph**, **Gemini 2.5 Flash**, **Pinecone Vector DB**, and **Prisma ORM**.

---

## 🌟 Overview

**LearnRAG** is a full-stack AI application combining an **educational multi-agent RAG pipeline explorer** with an **interactive conversational chat interface** featuring dynamic source citations.

Instead of treating RAG as an opaque black box, LearnRAG breaks down document ingestion, semantic chunking, 768-dimensional vector embeddings, Pinecone similarity matching, and grounded Gemini 2.5 Flash synthesis into observable, tunable stages.

---

## 🚀 Key Features

### 1. Interactive RAG Chat with Document Citations
- **Conversational Q&A**: Chat naturally with your uploaded PDF and text documents.
- **Traceable Citations**: Expandable citation cards showing chunk indices, similarity match percentages, and excerpted grounding text.
- **Grounded Responses**: Constrained synthesis via **Gemini 2.5 Flash** ensuring answers are grounded strictly in retrieved context.

### 2. Multi-Agent Educational Pipeline Inspector
- **Document Ingestion**: Fast extraction of text from uploaded PDF or TXT files.
- **Configurable Chunking**: Interactive sliders for chunk size and overlap ($500$ chars, $50$ overlap default).
- **Vector Embedding Visualizer**: Inspect 768-D float arrays with vector dimension badges and numerical heatmaps.
- **Pinecone Vector Database**: Similarity retrieval with adjustable top-$k$ nearest neighbors.
- **State JSON Inspection**: Live inspect intermediate LangGraph state transitions.

### 3. Production Architecture & Security
- **NextAuth.js**: Credentials authentication with bcryptjs password hashing.
- **Prisma ORM**: Relational schema tracking user accounts and pipeline run progress.
- **API Quota Protection**: Programmatic supervisor agent ensuring single-pass LLM synthesis and batched embeddings.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Vanilla CSS tokens with dark glassmorphism aesthetic (`globals.css`), Framer Motion
- **AI Orchestration**: `@langchain/langgraph`, `@langchain/google-genai`
- **Embedding & LLM**: Google Gemini 2.5 Flash (`gemini-embedding-001` & `gemini-2.5-flash`)
- **Vector Database**: Pinecone (`@pinecone-database/pinecone`)
- **Database & ORM**: Prisma ORM with SQLite (compatible with PostgreSQL)
- **Auth**: NextAuth.js (`next-auth`) + `bcryptjs`

---

## 🏁 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Sainianshika07/RAG-Agents.git
cd RAG-Agents
npm install
```

### 2. Environment Variables Configuration
Create a `.env.local` file in the root directory:
```env
# App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Pinecone Vector DB
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=learn-rag

# Database
DATABASE_URL="file:./dev.db"
```

### 3. Initialize Database
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/            # NextAuth credentials endpoints
│   │   ├── chat/            # Interactive chat & citation synthesis
│   │   ├── rag-pipeline/    # Document upload & ingestion agent
│   │   └── resume/          # Parameter tuning & graph resumption
│   ├── pipeline/            # Main studio (Inspector & Chat views)
│   ├── login/               # User authentication
│   ├── register/            # Account registration
│   └── page.tsx             # Landing page
├── components/
│   ├── ChatInterface.tsx    # Conversational chat with citations
│   ├── CitationCard.tsx     # Expandable citation source cards
│   ├── ChunkViewer.tsx      # Semantic chunk boundary inspector
│   ├── EmbeddingVisualizer.tsx # 768-D vector embedding visualizer
│   └── ContextHighlighter.tsx # Retrieved context highlighter
├── lib/
│   ├── gemini.ts            # Google Gemini 2.5 Flash & embeddings
│   ├── pinecone.ts          # Pinecone vector client & namespace management
│   ├── auth.ts              # NextAuth options & bcrypt verification
│   └── rag/
│       └── graph.ts         # LangGraph multi-agent state definition
├── prisma/
│   └── schema.prisma        # Database models (User, Session, Progress)
└── docs/
    ├── PRD.md               # Product Requirements Document
    └── SPEC.md              # Technical Specification
```

---

## 📄 License
MIT License. Built by Anshika Saini.
