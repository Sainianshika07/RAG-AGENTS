import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// ─── Generation Model ─────────────────────────────────────────────────────────

/**
 * Get the Gemini 2.5 Flash generative model via LangChain.
 */
export function getGenerativeModel() {
  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_GENAI_API_KEY!,
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
  const model = getEmbeddingModel();
  const result = await model.embedQuery(text);
  return result;
}

/**
 * Batch embed multiple texts efficiently to reduce API quota usage.
 * LangChain's embedDocuments handles batching internally.
 */
export async function batchEmbedTexts(texts: string[]): Promise<number[][]> {
  const model = getEmbeddingModel();

  const BATCH_SIZE = 10; // Quota safety batch
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const embeddings = await model.embedDocuments(batch);
    allEmbeddings.push(...embeddings);
  }

  return allEmbeddings;
}
