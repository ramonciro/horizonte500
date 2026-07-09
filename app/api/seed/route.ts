import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dividasSeed, objetivosSeed, ativosSeed, backlogSeed, decisoesSeed, configSeed } from "@/prisma/seedData";
import lancamentosSeed from "@/prisma/seed_lancamentos.json";

// Rota de carga inicial — use UMA VEZ após o primeiro deploy, acessando:
// https://SEU-APP.vercel.app/api/seed?secret=SEU_SEED_SECRET
// Protegida pela variável de ambiente SEED_SECRET (defina no Vercel).
// Atenção: ela APAGA e recria os dados — não rode de novo sem querer.

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    await prisma.lancamento.deleteMany();
    await prisma.divida.deleteMany();
    await prisma.objetivo.deleteMany();
    await prisma.config.deleteMany();
    await prisma.ativo.deleteMany();
    await prisma.backlogItem.deleteMany();
    await prisma.decisao.deleteMany();

    for (const l of lancamentosSeed as any[]) {
      await prisma.lancamento.create({
        data: {
          mes: l.mes,
          data: new Date(l.data),
          tipo: l.tipo,
          categoria: l.categoria,
          descricao: l.descricao,
          previsto: l.previsto,
          realizado: l.realizado,
        },
      });
    }

    await prisma.divida.createMany({ data: dividasSeed });
    await prisma.objetivo.createMany({ data: objetivosSeed });
    await prisma.config.createMany({ data: configSeed });
    await prisma.ativo.createMany({ data: ativosSeed });
    await prisma.backlogItem.createMany({ data: backlogSeed });
    await prisma.decisao.createMany({ data: decisoesSeed });

    return NextResponse.json({
      ok: true,
      mensagem: `Seed concluído: ${lancamentosSeed.length} lançamentos, ${dividasSeed.length} dívidas, ${objetivosSeed.length} objetivos, ${ativosSeed.length} ativos, ${backlogSeed.length} itens de backlog, ${decisoesSeed.length} decisões.`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
