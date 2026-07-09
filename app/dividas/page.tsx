import { prisma } from "@/lib/prisma";
import { fmtBRL } from "@/lib/format";
import { Card, Badge } from "@/components/UI";

export const dynamic = "force-dynamic";

const ORDER: Record<string, number> = { Alta: 0, Média: 1, Automática: 2, Baixa: 3 };

export default async function DividasPage() {
  const dividas = await prisma.divida.findMany();
  dividas.sort((a, b) => (ORDER[a.prioridade] ?? 9) - (ORDER[b.prioridade] ?? 9));
  const total = dividas.reduce((s, d) => s + d.valorComDesconto, 0);

  return (
    <>
      <h1 className="font-display text-2xl font-semibold mb-1.5">Dívidas</h1>
      <p className="text-[13px] text-muted mb-4">
        Total a negociar (valor com desconto): <b className="text-bad">{fmtBRL(total)}</b>
      </p>
      <Card>
        <table>
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Tipo</th>
              <th>Valor Original</th>
              <th>Com Desconto</th>
              <th>Prioridade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dividas.map((d) => (
              <tr key={d.id}>
                <td>{d.empresa}</td>
                <td className="text-muted">{d.tipo}</td>
                <td className="text-muted line-through">{fmtBRL(d.saldoOriginal)}</td>
                <td className="font-semibold">{fmtBRL(d.valorComDesconto)}</td>
                <td><Badge text={d.prioridade} /></td>
                <td><Badge text={d.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
