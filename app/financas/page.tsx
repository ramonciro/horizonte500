import { prisma } from "@/lib/prisma";
import { fmtBRL } from "@/lib/format";
import { Card } from "@/components/UI";
import LancamentoForm from "@/components/LancamentoForm";

export const dynamic = "force-dynamic";

export default async function FinancasPage() {
  const lancamentos = await prisma.lancamento.findMany({ orderBy: { data: "asc" } });

  return (
    <>
      <h1 className="font-display text-2xl font-semibold mb-4">Finanças</h1>

      <Card className="mb-5">
        <LancamentoForm />
      </Card>

      <Card>
        <table>
          <thead>
            <tr>
              <th>Mês</th>
              <th>Tipo</th>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Previsto</th>
              <th>Realizado</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos.map((l) => (
              <tr key={l.id}>
                <td>{l.mes}</td>
                <td className={l.tipo === "Receita" ? "text-good" : "text-bad"}>{l.tipo}</td>
                <td className="text-muted">{l.categoria}</td>
                <td>{l.descricao}</td>
                <td>{fmtBRL(l.previsto)}</td>
                <td>{fmtBRL(l.realizado)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
