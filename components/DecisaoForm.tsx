"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inp = "bg-[#0F1729] border border-border rounded-md px-2.5 py-2 text-[13px] text-ink w-full";

export default function DecisaoForm() {
  const router = useRouter();
  const [form, setForm] = useState({ decisao: "", motivo: "", resultadoEsperado: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.decisao || !form.motivo || !form.resultadoEsperado) return;
    setLoading(true);
    await fetch("/api/decisoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setForm({ decisao: "", motivo: "", resultadoEsperado: "" });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-2 items-start">
      <input className={inp} placeholder="Qual foi a decisão?" value={form.decisao} onChange={(e) => setForm({ ...form, decisao: e.target.value })} />
      <input className={inp} placeholder="Motivo" value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} />
      <div className="flex gap-2">
        <input className={inp} placeholder="Resultado esperado" value={form.resultadoEsperado} onChange={(e) => setForm({ ...form, resultadoEsperado: e.target.value })} />
        <button type="submit" disabled={loading} className="bg-gold text-bg rounded-md px-3.5 py-2 font-semibold text-[13px] whitespace-nowrap">
          {loading ? "..." : "+ Registrar"}
        </button>
      </div>
    </form>
  );
}
