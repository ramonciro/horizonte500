import { prisma } from "@/lib/prisma";
import { Card } from "@/components/UI";
import DecisaoForm from "@/components/DecisaoForm";

export const dynamic = "force-dynamic";

export default async function DecisoesPage() {
  const decisoes = await prisma.decisao.findMany({ orderBy: { data: "desc" } });

  return (
    <>
      <h1 className="font-display text-2xl font-semibold mb-1.5">Decisões</h1>
      <p className="text-[13px] text-muted mb-5">
        O sucesso do Horizonte 500 não se mede pelo que ele registra — se mede pelas decisões melhores que você toma com ele.
      </p>

      <Card className="mb-5">
        <DecisaoForm />
      </Card>

      <div className="flex flex-col gap-3">
        {decisoes.map((d) => (
          <Card key={d.id}>
            <div className="flex justify-between items-start mb-1.5">
              <span className="font-semibold text-sm">{d.decisao}</span>
              <span className="text-xs text-muted">{new Date(d.data).toLocaleDateString("pt-BR")}</span>
            </div>
            <div className="text-[13px] text-muted mb-1">
              <b className="text-ink/70">Motivo:</b> {d.motivo}
            </div>
            <div className="text-[13px] text-muted">
              <b className="text-ink/70">Resultado esperado:</b> {d.resultadoEsperado}
            </div>
            {d.resultadoObtido && (
              <div className="text-[13px] text-good mt-1">
                <b>Resultado obtido:</b> {d.resultadoObtido}
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
