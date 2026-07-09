import { prisma } from "@/lib/prisma";
import { fmtBRL } from "@/lib/format";
import { Card, KPI } from "@/components/UI";
import PatrimonioForm from "@/components/PatrimonioForm";

export const dynamic = "force-dynamic";

export default async function PatrimonioPage() {
  const [itens, dividas, dividaPaiCfg] = await Promise.all([
    prisma.ativo.findMany({ orderBy: { valor: "desc" } }),
    prisma.divida.findMany(),
    prisma.config.findUnique({ where: { chave: "divida_pai_saldo" } }),
  ]);

  const totalAtivos = itens.reduce((s, i) => s + i.valor, 0);
  const dividasTotais = dividas.reduce((s, d) => s + d.valorComDesconto, 0);
  const dividaPaiSaldo = parseFloat(dividaPaiCfg?.valor ?? "5279.57");
  const patrimonioLiquido = totalAtivos - dividasTotais - dividaPaiSaldo;

  return (
    <>
      <h1 className="font-display text-2xl font-semibold mb-1.5">Patrimônio</h1>
      <p className="text-[13px] text-muted mb-5">O coração do Horizonte 500 — tudo que você tem, menos tudo que você deve.</p>

      <div className="grid grid-cols-3 gap-3.5 mb-5">
        <KPI label="Total em Ativos" value={fmtBRL(totalAtivos)} tone="good" />
        <KPI label="Total em Dívidas" value={fmtBRL(dividasTotais + dividaPaiSaldo)} tone="bad" />
        <KPI label="Patrimônio Líquido" value={fmtBRL(patrimonioLiquido)} tone={patrimonioLiquido >= 0 ? "good" : "bad"} />
      </div>

      <Card className="mb-5">
        <PatrimonioForm />
      </Card>

      <Card>
        <table>
          <thead>
            <tr><th>Nome</th><th>Tipo</th><th>Valor</th><th>Observação</th></tr>
          </thead>
          <tbody>
            {itens.map((i) => (
              <tr key={i.id}>
                <td>{i.nome}</td>
                <td className="text-muted">{i.tipo}</td>
                <td>{fmtBRL(i.valor)}</td>
                <td className="text-muted">{i.observacao ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
