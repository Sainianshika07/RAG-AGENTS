import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { embedText, getGenerativeModel } from "@/lib/gemini";
import { getPineconeIndex } from "@/lib/pinecone";
import { z } from "zod";

const ChatSchema = z.object({
  namespaceId: z.string().min(1),
  message: z.string().min(1, "Message cannot be empty"),
  kValue: z.number().min(1).max(20).default(3),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = ChatSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { namespaceId, message, kValue } = validated.data;

    const queryVector = await embedText(message);

    const pineconeIndex = getPineconeIndex();
    const queryResponse = await pineconeIndex.namespace(namespaceId).query({
      vector: queryVector,
      topK: kValue,
      includeMetadata: true,
    });

    const matches = queryResponse.matches || [];
    const citations = matches.map((match, idx) => ({
      id: match.id,
      text: (match.metadata?.text as string) || "",
      score: match.score || 0,
      chunkIndex: (match.metadata?.chunkIndex as number) ?? idx,
    }));

    const context = citations
      .map((c) => `[Chunk ${c.chunkIndex + 1} | Similarity: ${Math.round(c.score * 100)}%]\n${c.text}`)
      .join(String.fromCharCode(10, 10) + "---" + String.fromCharCode(10, 10));

    const model = getGenerativeModel();
    const prompt = [
      "You are a knowledgeable AI assistant answering questions about the user uploaded document.",
      "Answer the question accurately, concisely, and ONLY using the retrieved context provided below.",
      "If the retrieved context does not contain enough information to answer, state that clearly rather than hallucinating.",
      "When referencing specific points from the context, mention the chunk number.",
      "",
      "Retrieved Context:",
      context || "No matching document chunks found.",
      "",
      `Question: ${message}`,
      "",
      "Helpful & Grounded Answer:",
    ].join(String.fromCharCode(10));

    const result = await model.invoke(prompt);
    const answer = typeof result.content === "string" ? result.content : JSON.stringify(result.content);

    return NextResponse.json({
      answer,
      citations,
    });
  } catch (error) {
    console.error("[API /chat error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Chat generation failed" },
      { status: 500 }
    );
  }
}