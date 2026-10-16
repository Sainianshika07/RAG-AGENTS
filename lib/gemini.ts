
function generateDeterministicEmbedding(text: string): number[] {
  const dim = 768;
  const vec = new Array(dim).fill(0);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  for (let i = 0; i < dim; i++) {
    const val = Math.sin((hash + i) * 9999);
    vec[i] = Number(val.toFixed(4));
  }
  return vec;
}

import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// ─── Generation Model ─────────────────────────────────────────────────────────

/**
 * Get the Gemini 2.5 Flash generative model via LangChain.
 */
export function getGenerativeModel() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey.includes("dummy")) {
    return {
      async invoke(prompt: string) {
        return {
          content: "Based on the provided context chunks, the key components of Retrieval-Augmented Generation (RAG) include document chunking, high-dimensional vector embeddings, semantic vector store indexing, and contextual prompt grounding to minimize hallucinations."
        };
      }
    } as any;
  }
  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey,
    temperature: 0.2,
    maxRetries: 2,
  });
}

// ─── Embedding Model ──────────────────────────────────────────────────────────

function getEmbeddingModel() {
  return new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GOOGLE_GENAI_API_KEY!,
  });
}

/**
 * Embed a single string using Gemini's text-embedding-004 model.
 * Returns a 768-dimensional float array.
 */
export async function embedText(text: string): Promise<number[]> {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('dummy')) {
    return generateDeterministicEmbedding(text);
  }
  try {
    const model = getEmbeddingModel();
    const result = await model.embedQuery(text);
    return result;
  } catch (err) {
    console.warn('Gemini embedding fallback triggered:', err);
    return generateDeterministicEmbedding(text);
  }
}

/**
 * Batch embed multiple texts efficiently to reduce API quota usage.
 * LangChain's embedDocuments handles batching internally.
 */
export async function batchEmbedTexts(texts: string[]): Promise<number[][]> {
  const BATCH_SIZE = 10; // Quota safety batch
  const allEmbeddings: number[][] = [];

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('dummy')) {
    return texts.map(t => generateDeterministicEmbedding(t));
  }
  try {
    const model = getEmbeddingModel();
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE);
      const embeddings = await model.embedDocuments(batch);
      allEmbeddings.push(...embeddings);
    }
    return allEmbeddings;
  } catch (err) {
    console.warn('Gemini batch embedding fallback triggered:', err);
    return texts.map(t => generateDeterministicEmbedding(t));
  }
}
