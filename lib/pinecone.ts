import { Pinecone } from "@pinecone-database/pinecone";

const globalForPinecone = globalThis as unknown as { pinecone?: Pinecone };

export function getPineconeClient(): Pinecone {
  if (!globalForPinecone.pinecone) {
    const apiKey = process.env.PINECONE_API_KEY || "dummy_key_for_build";
    globalForPinecone.pinecone = new Pinecone({
      apiKey,
    });
  }
  return globalForPinecone.pinecone;
}

export function getPineconeIndex() {
  const indexName = process.env.PINECONE_INDEX_NAME || "rag-agents";
  return getPineconeClient().index(indexName);
}
