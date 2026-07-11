import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { fmtBRL } from "@/lib/format";
import { Card, HeroCard } from "@/components/UI";
import { Wallet, TrendingUp, AlertCircle, PiggyBank } from "lucide-react";

export const dynamic = "force-dynamic";

const MODULOS = [
  { href: "/financas", nome: "Finanças", desc: "Receitas, despesas e fluxo do mês." },
  { href: "/dividas", nome: "Dívidas", desc: "Priorização e estratégia por credor." },
  { href: "/patrimonio", nome: "Patrimônio", desc: "Contas, investimentos, FGTS e bens." },
  { href: "/objetivos", nome: "Objetivos", desc: "Metas, prazos e progresso." },
];

export default async function StatusPage() {
  const [lancamentos, dividas, ativos, objetivos, dividaPaiCfg, reservaCfg] = await Promise.all([
    prisma.lancamento.findMany(),
    prisma.divida.findMany(),
    prisma.ativo.findMany(),
    prisma.objetivo.findMany(),
    prisma.config.findUnique({ where: { chave: "divida_pai_saldo" } }),
    prisma.config.findUnique({ where: { chave: "reserva_atual" } }),
  ]);

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
  const totalDividasNegociando = dividas.reduce((s, d) => s + d.valorComDesconto, 0);
  const descontoDisponivel = dividas.reduce((s, d) => s + (d.saldoOriginal - d.valorComDesconto), 0);
  const dividaPaiSaldo = parseFloat(dividaPaiCfg?.valor ?? "5279.57");
  const reservaAtual = parseFloat(reservaCfg?.valor ?? "0");
  const patrimonioLiquido = totalAtivos - totalDividasNegociando - dividaPaiSaldo;

  const objetivoAtual = [...objetivos]
    .filter((o) => o.atual < o.meta)
    .sort((a, b) => a.atual / a.meta - b.atual / b.meta)[0];

  return (
    <>
      <h1 className="font-display text-2xl font-semibold mb-1.5">Status</h1>
      <p className="text-[13px] text-muted mb-5">Sua situação em 30 segundos: patrimônio, fluxo, dívidas e a próxima ação.</p>

      <div className="grid grid-cols-4 gap-3.5 mb-5">
        <HeroCard label="Patrimônio Líquido" value={fmtBRL(patrimonioLiquido)} breakdown={`Bruto ${fmtBRL(totalAtivos)} · Dívidas ${fmtBRL(totalDividasNegociando + dividaPaiSaldo)}`} icon={Wallet} tone={patrimonioLiquido >= 0 ? "teal" : "bad"} />
        <HeroCard label="Fluxo do Mês" value={fmtBRL(fluxoMes)} breakdown={atual ? `+${fmtBRL(atual.receita)} · -${fmtBRL(atual.despesa)}` : undefined} icon={TrendingUp} tone={fluxoMes >= 0 ? "good" : "bad"} />
        <HeroCard label="Dívidas Ativas" value={String(dividas.length)} breakdown={`${dividas.length} credores · desconto disponível ${fmtBRL(descontoDisponivel)}`} icon={AlertCircle} tone="bad" />
        <HeroCard label="Reserva" value={fmtBRL(reservaAtual)} breakdown={reservaAtual === 0 ? "Meta imediata: começar a reserva" : undefined} icon={PiggyBank} tone="teal" />
      </div>

      <div className="grid grid-cols-[1.3fr_1fr] gap-3.5 mb-5">
        {objetivoAtual ? (
          <Card>
            <div className="text-[11px] text-teal uppercase tracking-wide font-semibold mb-2">Objetivo Atual</div>
            <div className="font-display text-xl font-semibold mb-3">{objetivoAtual.nome}</div>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-[13px] text-muted">{fmtBRL(objetivoAtual.atual)} / {fmtBRL(objetivoAtual.meta)}</span>
              <span className="text-[13px] font-semibold">{Math.round((objetivoAtual.atual / objetivoAtual.meta) * 100)}%</span>
            </div>
            <div className="h-2 bg-border rounded overflow-hidden">
              <div className="h-full bg-teal" style={{ width: `${(objetivoAtual.atual / objetivoAtual.meta) * 100}%` }} />
            </div>
            <Link href="/dividas" className="text-[12.5px] text-teal font-medium mt-3 inline-block">Ver dívidas →</Link>
          </Card>
        ) : <Card><div className="text-[13px] text-muted">Nenhum objetivo pendente.</div></Card>}

        <Card>
          <div className="text-[11px] text-muted uppercase tracking-wide font-semibold mb-2.5">Todos os objetivos</div>
          <div className="space-y-2">
            {objetivos.map((o) => (
              <div key={o.id} className="flex items-center justify-between text-[13px]">
                <span>{o.nome}</span>
                <span className="text-muted">{Math.round(Math.min(1, o.atual / o.meta) * 100)}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-4 gap-3.5 mb-5">
        {MODULOS.map((m) => (
          <Card key={m.href}>
            <div className="text-[10.5px] text-muted uppercase tracking-wide font-semibold mb-1">Módulo</div>
            <div className="font-display text-[17px] font-semibold mb-1.5">{m.nome}</div>
            <div className="text-[12px] text-muted mb-3">{m.desc}</div>
            <Link href={m.href} className="text-[12.5px] text-teal font-medium">Abrir →</Link>
          </Card>
        ))}
      </div>

      <Card>
        <div className="text-[10.5px] text-muted uppercase tracking-wide font-semibold mb-1.5">Próxima fase</div>
        <div className="font-display text-lg font-semibold">Insights · Automação · CFO IA</div>
      </Card>
    </>
  );
}
