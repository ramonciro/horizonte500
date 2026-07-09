import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ORDER: Record<string, number> = { Alta: 0, Média: 1, Automática: 2, Baixa: 3 };

export async function GET() {
  const dividas = await prisma.divida.findMany();
  dividas.sort((a, b) => (ORDER[a.prioridade] ?? 9) - (ORDER[b.prioridade] ?? 9));
  return NextResponse.json(dividas);
}
