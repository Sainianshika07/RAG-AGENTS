import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string; email?: string } | undefined;
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const namespaceId = searchParams.get("namespaceId");

    const sessions = await prisma.chatSession.findMany({
      where: {
        userId: user.id,
        ...(namespaceId ? { namespaceId } : {}),
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: { messages: true, evalMetrics: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 30,
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("[API /chat/sessions error]:", error);
    return NextResponse.json({ error: "Failed to fetch chat sessions" }, { status: 500 });
  }
}
