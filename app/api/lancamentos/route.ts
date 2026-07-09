import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const lancamentos = await prisma.lancamento.findMany({ orderBy: { data: "asc" } });
  return NextResponse.json(lancamentos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { mes, data, tipo, categoria, descricao, previsto, realizado } = body;

  if (!mes || !tipo || !categoria || !descricao || previsto === undefined) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const lancamento = await prisma.lancamento.create({
    data: {
      mes,
      data: new Date(data),
      tipo,
      categoria,
      descricao,
      previsto: parseFloat(previsto),
      realizado: realizado !== undefined ? parseFloat(realizado) : parseFloat(previsto),
    },
  });

  return NextResponse.json(lancamento, { status: 201 });
}
