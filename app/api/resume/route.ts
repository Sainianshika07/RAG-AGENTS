import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ragGraph, GraphState } from "@/lib/rag/graph";
import { pipelineStore } from "../rag-pipeline/route";
import { z } from "zod";

const ResumeSchema = z.object({
  namespaceId: z.string().min(1),
  query: z.string().optional(),
  kValue: z.number().min(1).max(20).optional(),
  chunkSize: z.number().min(100).max(2000).optional(),
  chunkOverlap: z.number().min(0).max(200).optional(),
  resetContext: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = ResumeSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { namespaceId, query, kValue, chunkSize, chunkOverlap, resetContext } =
      validated.data;

    const existingState = pipelineStore.get(namespaceId);
    if (!existingState) {
      return NextResponse.json(
        { error: "Pipeline session not found. Please start a new pipeline." },
        { status: 404 }
      );
    }

    // Merge tweaked parameters into existing state
    const resumeState: Partial<GraphState> = {
      ...existingState,
      ...(kValue !== undefined ? { kValue } : {}),
      ...(chunkSize !== undefined ? { chunkSize } : {}),
      ...(chunkOverlap !== undefined ? { chunkOverlap } : {}),
      ...(query ? { query } : {}),
      // Reset context/answer so the pipeline re-runs retrieval/generation
      ...(resetContext || query ? { context: null, answer: null } : {}),
    };

    const result = await ragGraph.invoke(resumeState);
    pipelineStore.set(namespaceId, result as GraphState);

    const state = result as GraphState;
    return NextResponse.json({
      success: true,
      namespaceId,
      state: {
        namespaceId: state.namespaceId,
        currentStep: state.currentStep,
        documentVectorized: state.documentVectorized,
        chunks: state.chunks,
        chunkCount: state.chunks?.length || 0,
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
      },
    });
  } catch (err) {
    console.error("Resume error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
