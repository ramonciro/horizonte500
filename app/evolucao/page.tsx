import { prisma } from "@/lib/prisma";
import { fmtBRL } from "@/lib/format";
import { EvolutionChart } from "@/components/UI";
import SnapshotButton from "@/components/SnapshotButton";

export const dynamic = "force-dynamic";

const fmtCompacto = (n: number) => {
  const sinal = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1000) return `${sinal}R$ ${(abs / 1000).toFixed(0)}k`;
  return `${sinal}R$ ${abs.toFixed(0)}`;
};

export default async function EvolucaoPage() {
  const snapshots = await prisma.snapshot.findMany({ orderBy: { data: "asc" } });

  const pontos = (campo: "patrimonioLiquido" | "fluxoMes" | "reservaAtual" | "totalDividas") =>
    snapshots.map((s) => ({ label: s.mesReferencia, valor: s[campo] }));

  return (
    <>
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <div className="text-[11px] text-teal uppercase tracking-wide font-semibold mb-1">Módulo</div>
          <h1 className="font-display text-2xl font-semibold">Evolução</h1>
        </div>
        <SnapshotButton />
      </div>
      <p className="text-[13px] text-muted mb-6">Snapshots mensais: patrimônio, fluxo, reserva e endividamento.</p>

      <div className="grid grid-cols-2 gap-3.5">
        <EvolutionChart titulo="Patrimônio Líquido" pontos={pontos("patrimonioLiquido")} formatador={fmtCompacto} cor="#2DD4BF" />
        <EvolutionChart titulo="Fluxo Mensal" pontos={pontos("fluxoMes")} formatador={fmtCompacto} cor="#34D399" />
        <EvolutionChart titulo="Reserva" pontos={pontos("reservaAtual")} formatador={fmtCompacto} cor="#4C7CF3" />
        <EvolutionChart titulo="Endividamento" pontos={pontos("totalDividas")} formatador={fmtCompacto} cor="#F87171" />
      </div>

      {snapshots.length > 0 && (
        <div className="text-[12px] text-muted mt-4">
          Último snapshot: {snapshots[snapshots.length - 1].mesReferencia} · Patrimônio {fmtBRL(snapshots[snapshots.length - 1].patrimonioLiquido)}
        </div>
      )}
    </>
  );
}
