import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const itens = await prisma.ativo.findMany({ orderBy: { valor: "desc" } });
  return NextResponse.json(itens);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nome, tipo, valor, observacao } = body;
  if (!nome || !tipo || valor === undefined) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }
  const item = await prisma.ativo.create({
    data: { nome, tipo, valor: parseFloat(valor), observacao: observacao || null },
  });
  return NextResponse.json(item, { status: 201 });
}
