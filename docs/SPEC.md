# Technical Specification: LearnRAG Chat Interface & Visual Upgrades

## 1. System Overview
LearnRAG extends its multi-agent educational pipeline with an interactive multi-turn Chat Interface with document citations. Users can seamlessly toggle between the **Step-by-Step Educational Inspector** and the **Interactive Chat View** for any ingested document namespace.

## 2. Design Tokens & Styling (globals.css conventions)
- --bg-primary: #0a0b10 (deep space obsidian)
- --bg-secondary: #12141f (elevated dark panel)
- --bg-card: rgba(22, 25, 40, 0.7) (frosted glass surface)
- --border-subtle: rgba(255, 255, 255, 0.08)
- --brand-purple: #8b5cf6 (action / primary CTA)
- --brand-cyan: #06b6d4 (vector / retrieval badge)
- --brand-amber: #f59e0b (citation indicator)
- --brand-green: #10b981 (grounded response & success)
- --text-primary: #f8fafc
- --text-secondary: #94a3b8

## 3. Component Contracts

### 3.1 ChatInterface.tsx
- Props: namespaceId: string, documentName?: string, kValue: number
- State: messages, inputQuery, isGenerating
- Endpoints Used: POST /api/chat (multi-turn query handler with citations)

### 3.2 CitationCard.tsx
- Displays chunk index, similarity match score percentage, and excerpted grounding text with expandable preview.

### 3.3 Enhanced Pipeline View (app/pipeline/page.tsx)
- Adds view mode toggle: [Pipeline Inspector | Interactive Chat]
- Seamless state preservation across toggles.

## 4. API Endpoints Contract
- POST /api/chat: takes { namespaceId, message, kValue }, queries Pinecone with Gemini query embedding, constructs grounded prompt, responds with answer and citations array.

## 5. Verification Plan
- Build typecheck: npm run build
- Route tests and interactive verification.
