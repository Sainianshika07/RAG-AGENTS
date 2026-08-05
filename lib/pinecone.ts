import { Pinecone } from "@pinecone-database/pinecone";

const globalForPinecone = globalThis as unknown as { pinecone: Pinecone };

export const pinecone =
  globalForPinecone.pinecone ||
  new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

if (process.env.NODE_ENV !== "production")
  globalForPinecone.pinecone = pinecone;

export function getPineconeIndex() {
  const indexName = process.env.PINECONE_INDEX_NAME!;
  if (!indexName) throw new Error("PINECONE_INDEX_NAME is not set");
  return pinecone.index(indexName);
}
