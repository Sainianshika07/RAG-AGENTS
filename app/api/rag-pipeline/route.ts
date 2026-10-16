import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ragGraph, GraphState } from "@/lib/rag/graph";
import { v4 as uuidv4 } from "uuid";

// In-memory store for pipeline states (in production, use Redis)
// Keyed by namespaceId / runId
import { pipelineStore } from "@/lib/rag/store";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const documentFile = formData.get("document") as File | null;
    const query = formData.get("query") as string | null;
    const kValue = parseInt(formData.get("kValue") as string) || 3;
    const chunkSize = parseInt(formData.get("chunkSize") as string) || 500;
    const chunkOverlap = parseInt(formData.get("chunkOverlap") as string) || 50;
    const namespaceId = (formData.get("namespaceId") as string) || uuidv4();

    let documentText: string | null = null;

    // Extract text from uploaded file
    if (documentFile) {
      if (documentFile.size > 4.5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File exceeds 4.5MB limit. Please upload a smaller document.' },
          { status: 413 }
        );
      }
      const fileType = documentFile.type;
      const buffer = await documentFile.arrayBuffer();

      if (fileType === "text/plain" || documentFile.name.endsWith(".txt")) {
        documentText = new TextDecoder().decode(buffer);
      } else if (fileType === "application/pdf" || documentFile.name.endsWith(".pdf")) {
        // Dynamically import pdf-parse to avoid bundling issues
        const pdfParse = (await import("pdf-parse")).default;
        const pdfData = await pdfParse(Buffer.from(buffer));
        documentText = pdfData.text;
      } else {
        return NextResponse.json(
          { error: "Only .txt and .pdf files are supported" },
          { status: 400 }
        );
      }
    }

    // Get existing state from store if continuing a session
    const existingState = pipelineStore.get(namespaceId);

    // Build initial state merging existing + new inputs
    const initialState: Partial<GraphState> = {
      ...(existingState || {}),
      namespaceId,
      kValue,
      chunkSize,
      chunkOverlap,
      ...(documentText ? { documentText, documentVectorized: false } : {}),
      ...(query ? { query, context: null, answer: null } : {}),
    };

    // Run the graph — it will stop at the first END (HITL)
    const result = await ragGraph.invoke(initialState);

    // Persist state for resumption
    pipelineStore.set(namespaceId, result as GraphState);

    return NextResponse.json({
      success: true,
      namespaceId,
      state: sanitizeState(result as GraphState),
    });
  } catch (err) {
    console.error("Pipeline error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Remove large embedding arrays from response (send summary instead)
 * to keep HTTP payloads manageable.
 */
function sanitizeState(state: GraphState) {
  return {
    namespaceId: state.namespaceId,
    currentStep: state.currentStep,
    documentVectorized: state.documentVectorized,
    chunks: state.chunks,
    chunkCount: state.chunks?.length || 0,
    // Send only first 10 values of first 3 embeddings for visualization
    embeddingsSample: state.embeddings?.slice(0, 3).map((emb) => ({
      preview: emb.slice(0, 20),
      dimensions: emb.length,
    })),
    retrievedChunks: state.retrievedChunks,
    context: state.context,
    answer: state.answer,
    query: state.query,
    kValue: state.kValue,
    chunkSize: state.chunkSize,
    chunkOverlap: state.chunkOverlap,
    error: state.error,
  };
}
