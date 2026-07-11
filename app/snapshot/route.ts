import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const snapshots = await prisma.snapshot.findMany({ orderBy: { data: "asc" } });
  return NextResponse.json(snapshots);
}

export async function POST() {
  const [lancamentos, dividas, ativos, dividaPaiCfg, reservaCfg] = await Promise.all([
    prisma.lancamento.findMany(),
    prisma.divida.findMany(),
    prisma.ativo.findMany(),
    prisma.config.findUnique({ where: { chave: "divida_pai_saldo" } }),
    prisma.config.findUnique({ where: { chave: "reserva_atual" } }),
  ]);

  // Mesma lógica de agrupamento por mês usada na Home — mês mais recente com lançamento = mês de referência
  const porMes = new Map<string, { data: Date; receita: number; despesa: number }>();
  for (const l of lancamentos) {
    if (!porMes.has(l.mes)) porMes.set(l.mes, { data: l.data, receita: 0, despesa: 0 });
    const m = porMes.get(l.mes)!;
    if (l.tipo === "Receita") m.receita += l.realizado;
    if (l.tipo === "Despesa") m.despesa += l.realizado;
  }
  const meses = [...porMes.values()].sort((a, b) => a.data.getTime() - b.data.getTime());
  const atual = meses[meses.length - 1];
  const fluxoMes = atual ? atual.receita - atual.despesa : 0;

  const totalAtivos = ativos.reduce((s, a) => s + a.valor, 0);
  const totalDividas = dividas.reduce((s, d) => s + d.valorComDesconto, 0);
  const dividaPaiSaldo = parseFloat(dividaPaiCfg?.valor ?? "5279.57");
  const reservaAtual = parseFloat(reservaCfg?.valor ?? "0");
  const patrimonioLiquido = totalAtivos - totalDividas - dividaPaiSaldo;

  const hoje = new Date();
  const mesReferencia = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;

  const snapshot = await prisma.snapshot.upsert({
    where: { mesReferencia },
    update: { patrimonioLiquido, totalAtivos, totalDividas: totalDividas + dividaPaiSaldo, reservaAtual, fluxoMes, data: hoje },
    create: { mesReferencia, data: hoje, patrimonioLiquido, totalAtivos, totalDividas: totalDividas + dividaPaiSaldo, reservaAtual, fluxoMes },
  });

  return NextResponse.json(snapshot);
}
