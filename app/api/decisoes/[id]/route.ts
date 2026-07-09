import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { resultadoObtido } = body;
  if (!resultadoObtido) {
    return NextResponse.json({ error: "resultadoObtido é obrigatório." }, { status: 400 });
  }
  const atualizado = await prisma.decisao.update({
    where: { id: params.id },
    data: { resultadoObtido },
  });
  return NextResponse.json(atualizado);
}
