"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResolveDecisaoForm({ id }: { id: string }) {
  const router = useRouter();
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);
  const [aberto, setAberto] = useState(false);

  async function salvar() {
    if (!valor) return;
    setLoading(true);
    await fetch(`/api/decisoes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resultadoObtido: valor }),
    });
    setLoading(false);
    setAberto(false);
    setValor("");
    router.refresh();
  }

  if (!aberto) {
    return (
      <button onClick={() => setAberto(true)} className="text-[12px] text-gold font-semibold mt-2">
        + Registrar resultado
      </button>
    );
  }

  return (
    <div className="flex gap-2 mt-2">
      <input
        className="flex-1 bg-[#0F1729] border border-border rounded-md px-2.5 py-1.5 text-[12.5px] text-ink"
        placeholder="O que de fato aconteceu?"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />
      <button onClick={salvar} disabled={loading} className="bg-gold text-bg rounded-md px-3 py-1.5 text-[12px] font-semibold">
        {loading ? "..." : "Salvar"}
      </button>
    </div>
  );
}
