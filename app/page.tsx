import { prisma } from "@/lib/prisma";
import { fmtBRL } from "@/lib/format";
import { Card, KPI, Ring } from "@/components/UI";

export const dynamic = "force-dynamic";

const DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

function saudacao(hora: number) {
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

async function getHomeData() {
  const [lancamentos, dividas, ativos, objetivos, dividaPaiCfg, reservaCfg, metaReservaCfg] =
    await Promise.all([
      prisma.lancamento.findMany(),
      prisma.divida.findMany(),
      prisma.ativo.findMany(),
      prisma.objetivo.findMany(),
      prisma.config.findUnique({ where: { chave: "divida_pai_saldo" } }),
      prisma.config.findUnique({ where: { chave: "reserva_atual" } }),
      prisma.config.findUnique({ where: { chave: "meta_reserva_emergencia" } }),
    ]);

  const meses = new Set(lancamentos.map((l) => l.mes)).size || 1;
  const receita = lancamentos.filter((l) => l.tipo === "Receita").reduce((s, l) => s + l.realizado, 0);
  const despesa = lancamentos.filter((l) => l.tipo === "Despesa").reduce((s, l) => s + l.realizado, 0);

  const dividaTotal = dividas.reduce((s, d) => s + d.valorComDesconto, 0);
  const dividaPaiSaldo = parseFloat(dividaPaiCfg?.valor ?? "5279.57");
  const totalAtivos = ativos.reduce((s, i) => s + i.valor, 0);
  const patrimonioLiquido = totalAtivos - dividaTotal - dividaPaiSaldo;

  const reservaAtual = parseFloat(reservaCfg?.valor ?? "0");
  const reservaMeta = parseFloat(metaReservaCfg?.valor ?? "8100");

  const metasConcluidas = objetivos.filter((o) => o.atual >= o.meta).length;

  return {
    receitaMedia: receita / meses,
    despesaMedia: despesa / meses,
    saldoMedio: (receita - despesa) / meses,
    dividaTotal,
    patrimonioLiquido,
    reservaAtual,
    reservaMeta,
    metasConcluidas,
    totalMetas: objetivos.length,
  };
}

export default async function HomePage() {
  const d = await getHomeData();
  const reservaPct = d.reservaAtual / d.reservaMeta;
  const status: "good" | "warn" | "bad" = d.saldoMedio > 0 ? (reservaPct >= 1 ? "good" : "warn") : "bad";
  const saudePct = d.saldoMedio > 0 ? Math.min(1, 0.35 + reservaPct * 0.5) : 0.15;

  const agora = new Date();
  const dia = DIAS[agora.getDay()];

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold">
          {saudacao(agora.getHours())}, Ramon.
        </h1>
        <p className="text-[13px] text-muted mt-1">Hoje é {dia}.</p>
        <p className="text-[13px] text-muted italic mt-2">
          &quot;Qual é a melhor decisão hoje para aumentar meu patrimônio e minha liberdade?&quot;
        </p>
      </div>

      <div className="grid grid-cols-[140px_1fr] gap-6 mb-6 items-center">
        <Ring pct={saudePct} status={status} />
        <Card>
          <div className="text-[11px] text-muted uppercase tracking-wide mb-1.5">Sua prioridade hoje</div>
          <div className="text-[14.5px] leading-relaxed">
            Negociar as dívidas Serasa de maior desconto primeiro — <b>NuBank</b> e <b>Unifacs</b>. Nenhum
            empréstimo novo até a reserva atingir 100% da meta.
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-3.5 mb-3.5">
        <KPI label="Patrimônio Líquido" value={fmtBRL(d.patrimonioLiquido)} tone={d.patrimonioLiquido >= 0 ? "good" : "bad"} />
        <KPI label="Reserva de Emergência" value={`${Math.round(reservaPct * 100)}% da meta`} tone="gold" />
        <KPI label="Metas Concluídas" value={`${d.metasConcluidas} de ${d.totalMetas}`} tone="text" />
      </div>

      <div className="grid grid-cols-3 gap-3.5">
        <KPI label="Renda Média Mensal" value={fmtBRL(d.receitaMedia)} />
        <KPI label="Despesa Média Mensal" value={fmtBRL(d.despesaMedia)} />
        <KPI label="Saldo Médio Mensal" value={fmtBRL(d.saldoMedio)} tone={d.saldoMedio >= 0 ? "good" : "bad"} />
      </div>
    </>
  );
}
