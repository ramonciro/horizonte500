import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const config = await prisma.config.findMany();
  return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { chave, valor } = body;
  if (!chave || valor === undefined) {
    return NextResponse.json({ error: "chave e valor são obrigatórios." }, { status: 400 });
  }
  const atualizado = await prisma.config.upsert({
    where: { chave },
    update: { valor: String(valor) },
    create: { chave, valor: String(valor) },
  });
  return NextResponse.json(atualizado);
}
