import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const decisoes = await prisma.decisao.findMany({ orderBy: { data: "desc" } });
  return NextResponse.json(decisoes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { decisao, motivo, resultadoEsperado, resultadoObtido } = body;
  if (!decisao || !motivo || !resultadoEsperado) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }
  const novo = await prisma.decisao.create({
    data: { decisao, motivo, resultadoEsperado, resultadoObtido: resultadoObtido || null },
  });
  return NextResponse.json(novo, { status: 201 });
}
