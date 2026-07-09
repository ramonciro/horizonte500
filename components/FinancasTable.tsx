"use client";

import { useMemo, useState } from "react";
import { fmtBRL } from "@/lib/format";

type Lancamento = {
  id: string;
  mes: string;
  tipo: string;
  categoria: string;
  descricao: string;
  previsto: number;
  realizado: number;
};

export default function FinancasTable({ lancamentos }: { lancamentos: Lancamento[] }) {
  const meses = useMemo(() => [...new Set(lancamentos.map((l) => l.mes))], [lancamentos]);
  const [filtroMes, setFiltroMes] = useState("Todos");

  const filtrados = filtroMes === "Todos" ? lancamentos : lancamentos.filter((l) => l.mes === filtroMes);

  const porCategoria = useMemo(() => {
    const map = new Map<string, Lancamento[]>();
    for (const l of filtrados) {
      if (!map.has(l.categoria)) map.set(l.categoria, []);
      map.get(l.categoria)!.push(l);
    }
    return [...map.entries()];
  }, [filtrados]);

  return (
    <div>
      <div className="mb-3.5 flex items-center gap-2">
        <span className="text-[12px] text-muted">Filtrar por mês:</span>
        <select
          className="bg-[#0F1729] border border-border rounded-md px-2.5 py-1.5 text-[12.5px] text-ink"
          value={filtroMes}
          onChange={(e) => setFiltroMes(e.target.value)}
        >
          <option>Todos</option>
          {meses.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>

      {porCategoria.map(([categoria, itens]) => {
        const previsto = itens.reduce((s, l) => s + l.previsto, 0);
        const realizado = itens.reduce((s, l) => s + l.realizado, 0);
        return (
          <div key={categoria} className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-muted uppercase tracking-wide">{categoria}</span>
              <span className="text-[12px] text-muted">
                Previsto {fmtBRL(previsto)} · Realizado <b className="text-ink">{fmtBRL(realizado)}</b>
              </span>
            </div>
            <table>
              <tbody>
                {itens.map((l) => (
                  <tr key={l.id}>
                    <td className="w-[90px] text-muted">{l.mes}</td>
                    <td className={l.tipo === "Receita" ? "text-good w-[80px]" : "text-bad w-[80px]"}>{l.tipo}</td>
                    <td>{l.descricao}</td>
                    <td className="text-right w-[110px]">{fmtBRL(l.previsto)}</td>
                    <td className="text-right w-[110px] font-medium">{fmtBRL(l.realizado)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
