import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Reconciliação por chave natural (mes + categoria + descrição) — nunca duplica.
// Se já existe um lançamento igual: atualiza previsto/realizado só se mudou.
// Se não existe: cria. Não apaga nada por padrão (modo "mesclar").
// modo "substituir": apaga todos os lançamentos do(s) mês(es) enviados antes de importar.

const MES_PARA_DATA: Record<string, string> = {
  Maio: "2026-05-01", Junho: "2026-06-01", Julho: "2026-07-01", Agosto: "2026-08-01",
  Setembro: "2026-09-01", Outubro: "2026-10-01", Novembro: "2026-11-01", Dezembro: "2026-12-01",
  Janeiro: "2027-01-01",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { lancamentos, modo } = body as {
    lancamentos: { mes: string; tipo: string; categoria: string; descricao: string; previsto: number; realizado: number }[];
    modo: "mesclar" | "substituir";
  };

  if (!Array.isArray(lancamentos) || lancamentos.length === 0) {
    return NextResponse.json({ error: "Nenhum lançamento enviado." }, { status: 400 });
  }

  const mesesEnviados = [...new Set(lancamentos.map((l) => l.mes))];

  if (modo === "substituir") {
    await prisma.lancamento.deleteMany({ where: { mes: { in: mesesEnviados } } });
  }

  let criados = 0;
  let atualizados = 0;
  let semMudanca = 0;

  for (const l of lancamentos) {
    const data = MES_PARA_DATA[l.mes];
    if (!data) continue;

    const existente = modo === "substituir" ? null : await prisma.lancamento.findFirst({
      where: { mes: l.mes, categoria: l.categoria, descricao: l.descricao },
    });

    if (existente) {
      if (existente.previsto !== l.previsto || existente.realizado !== l.realizado) {
        await prisma.lancamento.update({
          where: { id: existente.id },
          data: { previsto: l.previsto, realizado: l.realizado },
        });
        atualizados++;
      } else {
        semMudanca++;
      }
    } else {
      await prisma.lancamento.create({
        data: {
          mes: l.mes,
          data: new Date(data),
          tipo: l.tipo as any,
          categoria: l.categoria,
          descricao: l.descricao,
          previsto: l.previsto,
          realizado: l.realizado,
        },
      });
      criados++;
    }
  }

  return NextResponse.json({ ok: true, criados, atualizados, semMudanca, meses: mesesEnviados });
}
