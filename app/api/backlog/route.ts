import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const itens = await prisma.backlogItem.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(itens);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { titulo, descricao, categoria, status } = body;
  if (!titulo || !categoria || !status) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }
  const item = await prisma.backlogItem.create({
    data: { titulo, descricao: descricao || null, categoria, status },
  });
  return NextResponse.json(item, { status: 201 });
}
