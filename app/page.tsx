import { prisma } from "@/lib/prisma";
import { fmtBRL } from "@/lib/format";
import { Card, KPI, Ring, TrendBadge, Sparkline, AlertItem } from "@/components/UI";

export const dynamic = "force-dynamic";

const DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

function saudacao(hora: number) {
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

function pctChange(atual: number, anterior: number): number | null {
  if (anterior === 0) return null;
  return ((atual - anterior) / Math.abs(anterior)) * 100;
}

async function getHomeData() {
  const [lancamentos, dividas, ativos, objetivos, decisoes, dividaPaiCfg, reservaCfg, metaReservaCfg] =
    await Promise.all([
      prisma.lancamento.findMany({ orderBy: { data: "asc" } }),
      prisma.divida.findMany(),
      prisma.ativo.findMany(),
      prisma.objetivo.findMany(),
      prisma.decisao.findMany({ orderBy: { data: "desc" } }),
      prisma.config.findUnique({ where: { chave: "divida_pai_saldo" } }),
      prisma.config.findUnique({ where: { chave: "reserva_atual" } }),
      prisma.config.findUnique({ where: { chave: "meta_reserva_emergencia" } }),
    ]);

  // Agrupa lançamentos por mês, em ordem cronológica real (pela data), não pelo rótulo
  const porMes = new Map<string, { data: Date; receita: number; despesa: number; despesaVariavel: number; despesaConsignado: number }>();
  for (const l of lancamentos) {
    const key = l.mes;
    if (!porMes.has(key)) porMes.set(key, { data: l.data, receita: 0, despesa: 0, despesaVariavel: 0, despesaConsignado: 0 });
    const m = porMes.get(key)!;
    if (l.tipo === "Receita") m.receita += l.realizado;
    if (l.tipo === "Despesa") {
      m.despesa += l.realizado;
      if (l.categoria === "Despesa Variável") m.despesaVariavel += l.realizado;
      if (l.categoria === "Dívida - Consignado") m.despesaConsignado += l.realizado;
    }
  }
  const meses = [...porMes.entries()]
    .map(([mes, v]) => ({ mes, ...v, saldo: v.receita - v.despesa }))
    .sort((a, b) => a.data.getTime() - b.data.getTime());

  const atual = meses[meses.length - 1];
  const anterior = meses.length > 1 ? meses[meses.length - 2] : null;

  const receitaMedia = meses.reduce((s, m) => s + m.receita, 0) / (meses.length || 1);
  const despesaMedia = meses.reduce((s, m) => s + m.despesa, 0) / (meses.length || 1);
  const saldoMedio = meses.reduce((s, m) => s + m.saldo, 0) / (meses.length || 1);

  const dividaTotal = dividas.reduce((s, d) => s + d.valorComDesconto, 0);
  const dividaPaiSaldo = parseFloat(dividaPaiCfg?.valor ?? "5279.57");
  const totalAtivos = ativos.reduce((s, i) => s + i.valor, 0);
  const patrimonioLiquido = totalAtivos - dividaTotal - dividaPaiSaldo;

  const reservaAtual = parseFloat(reservaCfg?.valor ?? "0");
  const reservaMeta = parseFloat(metaReservaCfg?.valor ?? "8100");
  const reservaPct = reservaAtual / reservaMeta;

  // --- Índices CFO ---
  const taxaPoupanca = atual && atual.receita > 0 ? atual.saldo / atual.receita : null;
  const comprometimentoDivida = atual && atual.receita > 0 ? atual.despesaConsignado / atual.receita : null;
  const coberturaReservaMeses = despesaMedia > 0 ? reservaAtual / despesaMedia : 0;

  // --- Tendências vs mês anterior ---
  const trendReceita = anterior ? pctChange(atual.receita, anterior.receita) : null;
  const trendDespesa = anterior ? pctChange(atual.despesa, anterior.despesa) : null;
  const trendSaldo = anterior ? pctChange(atual.saldo, anterior.saldo) : null;

  // --- Alertas automáticos (baseados em regra) ---
  const alertas: { tipo: "alerta" | "positivo" | "info"; texto: string }[] = [];
  if (meses.length >= 2) {
    const anteriores = meses.slice(Math.max(0, meses.length - 4), meses.length - 1);
    const mediaVariavel = anteriores.reduce((s, m) => s + m.despesaVariavel, 0) / (anteriores.length || 1);
    if (mediaVariavel > 0 && atual) {
      const desvio = ((atual.despesaVariavel - mediaVariavel) / mediaVariavel) * 100;
      if (desvio > 15) {
        alertas.push({ tipo: "alerta", texto: `Despesa variável em ${atual.mes} está ${desvio.toFixed(0)}% acima da média dos meses anteriores.` });
      } else if (desvio < -15) {
        alertas.push({ tipo: "positivo", texto: `Despesa variável em ${atual.mes} caiu ${Math.abs(desvio).toFixed(0)}% vs a média — bom sinal.` });
      }
    }
  }
  if (atual && atual.saldo < 0) {
    alertas.push({ tipo: "alerta", texto: `${atual.mes} fechou no negativo (${fmtBRL(atual.saldo)}).` });
  }
  if (atual && atual.saldo > 0 && reservaPct < 1) {
    alertas.push({ tipo: "info", texto: `Saldo positivo em ${atual.mes} — considere direcionar parte para a reserva de emergência.` });
  }
  const dividaAltaMaiorDesconto = [...dividas].filter((d) => d.prioridade === "Alta").sort((a, b) => b.saldoOriginal - a.saldoOriginal)[0];
  if (dividaAltaMaiorDesconto) {
    alertas.push({ tipo: "alerta", texto: `${dividaAltaMaiorDesconto.empresa} com desconto de ${(((dividaAltaMaiorDesconto.saldoOriginal - dividaAltaMaiorDesconto.valorComDesconto) / dividaAltaMaiorDesconto.saldoOriginal) * 100).toFixed(0)}% ainda não negociada.` });
  }

  // --- Top 3 prioridades ---
  const prioridades: string[] = [];
  if (dividaAltaMaiorDesconto) {
    prioridades.push(`Negociar ${dividaAltaMaiorDesconto.empresa} — de ${fmtBRL(dividaAltaMaiorDesconto.saldoOriginal)} para ${fmtBRL(dividaAltaMaiorDesconto.valorComDesconto)} à vista.`);
  }
  const decisaoPendente = decisoes.find((d) => !d.resultadoObtido);
  if (decisaoPendente) {
    prioridades.push(`Registrar o resultado da decisão: "${decisaoPendente.decisao}".`);
  }
  const objetivoAtrasado = [...objetivos]
    .filter((o) => o.atual < o.meta)
    .sort((a, b) => a.atual / a.meta - b.atual / b.meta)[0];
  if (objetivoAtrasado) {
    prioridades.push(`Avançar objetivo "${objetivoAtrasado.nome}" — ${Math.round((objetivoAtrasado.atual / objetivoAtrasado.meta) * 100)}% concluído.`);
  }
  while (prioridades.length < 3) prioridades.push("Sem pendência crítica aqui — bom momento para revisar o Backlog.");

  // --- Trajetória (fluxo de caixa acumulado, mês a mês) ---
  let acumulado = 0;
  const sparklineData = meses.map((m) => (acumulado += m.saldo));

  const status: "good" | "warn" | "bad" = saldoMedio > 0 ? (reservaPct >= 1 ? "good" : "warn") : "bad";
  const saudePct = saldoMedio > 0 ? Math.min(1, 0.35 + reservaPct * 0.5) : 0.15;

  return {
    atual, anterior, receitaMedia, despesaMedia, saldoMedio, dividaTotal, patrimonioLiquido,
    reservaAtual, reservaMeta, reservaPct, taxaPoupanca, comprometimentoDivida, coberturaReservaMeses,
    trendReceita, trendDespesa, trendSaldo, alertas, prioridades, sparklineData, status, saudePct,
  };
}

export default async function HomePage() {
  const d = await getHomeData();
  const agora = new Date();
  const dia = DIAS[agora.getDay()];

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold">{saudacao(agora.getHours())}, Ramon.</h1>
        <p className="text-[13px] text-muted mt-1">
          Hoje é {dia}{d.atual ? ` · referência: ${d.atual.mes}` : ""}.
        </p>
        <p className="text-[13px] text-muted italic mt-2">
          &quot;Qual é a melhor decisão hoje para aumentar meu patrimônio e minha liberdade?&quot;
        </p>
      </div>

      <div className="grid grid-cols-[140px_1fr] gap-6 mb-6 items-center">
        <Ring pct={d.saudePct} status={d.status} />
        <Card>
          <div className="text-[11px] text-muted uppercase tracking-wide mb-2">Top 3 prioridades</div>
          <ol className="space-y-1.5">
            {d.prioridades.slice(0, 3).map((p, i) => (
              <li key={i} className="text-[13.5px] leading-relaxed">
                <span className="text-gold font-semibold mr-1.5">{i + 1}.</span>{p}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* Vitais com tendência */}
      <div className="grid grid-cols-3 gap-3.5 mb-3.5">
        <Card>
          <div className="text-[11px] tracking-wide text-muted uppercase mb-2">Renda do Mês</div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold">{d.atual ? fmtBRL(d.atual.receita) : "—"}</span>
            <TrendBadge pct={d.trendReceita} />
          </div>
        </Card>
        <Card>
          <div className="text-[11px] tracking-wide text-muted uppercase mb-2">Despesa do Mês</div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold">{d.atual ? fmtBRL(d.atual.despesa) : "—"}</span>
            <TrendBadge pct={d.trendDespesa} invert />
          </div>
        </Card>
        <Card>
          <div className="text-[11px] tracking-wide text-muted uppercase mb-2">Saldo do Mês</div>
          <div className="flex items-baseline gap-2">
            <span className={`font-display text-2xl font-semibold ${d.atual && d.atual.saldo >= 0 ? "text-good" : "text-bad"}`}>
              {d.atual ? fmtBRL(d.atual.saldo) : "—"}
            </span>
            <TrendBadge pct={d.trendSaldo} />
          </div>
        </Card>
      </div>

      {/* Índices CFO */}
      <div className="grid grid-cols-3 gap-3.5 mb-3.5">
        <KPI label="Taxa de Poupança" value={d.taxaPoupanca !== null ? `${Math.round(d.taxaPoupanca * 100)}%` : "—"} tone={d.taxaPoupanca !== null && d.taxaPoupanca >= 0 ? "good" : "bad"} />
        <KPI label="Renda Comprometida (Consignado)" value={d.comprometimentoDivida !== null ? `${Math.round(d.comprometimentoDivida * 100)}%` : "—"} tone={d.comprometimentoDivida !== null && d.comprometimentoDivida > 0.3 ? "bad" : "gold"} />
        <KPI label="Cobertura de Reserva" value={`${d.coberturaReservaMeses.toFixed(1)} meses`} tone="gold" />
      </div>

      <div className="grid grid-cols-3 gap-3.5 mb-3.5">
        <KPI label="Patrimônio Líquido" value={fmtBRL(d.patrimonioLiquido)} tone={d.patrimonioLiquido >= 0 ? "good" : "bad"} />
        <KPI label="Dívidas a Negociar" value={fmtBRL(d.dividaTotal)} tone="bad" />
        <KPI label="Reserva vs Meta" value={`${Math.round(d.reservaPct * 100)}%`} tone="gold" />
      </div>

      {/* Trajetória + Alertas */}
      <div className="grid grid-cols-[1.2fr_1fr] gap-3.5">
        <Card>
          <div className="text-[11px] text-muted uppercase tracking-wide mb-3">Fluxo de caixa acumulado (mês a mês)</div>
          <Sparkline points={d.sparklineData} />
          <div className="text-[11px] text-muted mt-2">
            Proxy de trajetória a partir do saldo mensal. Histórico real de patrimônio chega na v1.4 (Evolução).
          </div>
        </Card>
        <Card>
          <div className="text-[11px] text-muted uppercase tracking-wide mb-2">Alertas</div>
          {d.alertas.length === 0 ? (
            <div className="text-[13px] text-muted">Nenhum alerta no momento.</div>
          ) : (
            <div className="space-y-2">
              {d.alertas.slice(0, 4).map((a, i) => <AlertItem key={i} tipo={a.tipo} texto={a.texto} />)}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
