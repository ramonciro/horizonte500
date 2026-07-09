import { prisma } from "@/lib/prisma";
import { fmtBRL } from "@/lib/format";
import { Card } from "@/components/UI";

export const dynamic = "force-dynamic";

export default async function ObjetivosPage() {
  const objetivos = await prisma.objetivo.findMany();

  return (
    <>
      <h1 className="font-display text-2xl font-semibold mb-4">Objetivos</h1>
      <div className="grid grid-cols-2 gap-3.5">
        {objetivos.map((o) => {
          const pct = Math.max(0, Math.min(1, o.atual / o.meta));
          return (
            <Card key={o.id}>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-sm">{o.nome}</span>
                <span className="text-xs text-muted">{o.prazo}</span>
              </div>
              <div className="h-2 bg-border rounded overflow-hidden mb-2">
                <div className="h-full bg-gold" style={{ width: `${pct * 100}%` }} />
              </div>
              <div className="text-[12.5px] text-muted mb-1.5">
                {fmtBRL(o.atual)} de {fmtBRL(o.meta)} · {Math.round(pct * 100)}%
              </div>
              {o.proximaAcao && <div className="text-[12px] text-ink/80 italic">→ {o.proximaAcao}</div>}
            </Card>
          );
        })}
      </div>
    </>
  );
}
