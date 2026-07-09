import { prisma } from "@/lib/prisma";
import { Card, Badge } from "@/components/UI";
import BacklogForm from "@/components/BacklogForm";

export const dynamic = "force-dynamic";

export default async function BacklogPage() {
  const itens = await prisma.backlogItem.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <h1 className="font-display text-2xl font-semibold mb-1.5">Backlog</h1>
      <p className="text-[13px] text-muted mb-5">Ideias e melhorias do Horizonte 500 — nada se perde.</p>

      <Card className="mb-5">
        <BacklogForm />
      </Card>

      <Card>
        <table>
          <thead>
            <tr><th>Título</th><th>Categoria</th><th>Status</th></tr>
          </thead>
          <tbody>
            {itens.map((i) => (
              <tr key={i.id}>
                <td>
                  {i.titulo}
                  {i.descricao && <div className="text-xs text-muted mt-0.5">{i.descricao}</div>}
                </td>
                <td className="text-muted">{i.categoria}</td>
                <td><Badge text={i.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
