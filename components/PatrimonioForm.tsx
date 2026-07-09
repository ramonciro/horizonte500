"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TIPOS = ["Conta", "FGTS", "Veículo", "Investimentos", "Imóveis", "Outros"];
const inp = "bg-[#0F1729] border border-border rounded-md px-2.5 py-2 text-[13px] text-ink";

export default function PatrimonioForm() {
  const router = useRouter();
  const [form, setForm] = useState({ nome: "", tipo: "Conta", valor: "", observacao: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome || !form.valor) return;
    setLoading(true);
    await fetch("/api/patrimonio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setForm({ nome: "", tipo: form.tipo, valor: "", observacao: "" });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-[1fr_130px_130px_1fr_auto] gap-2 items-center">
      <input className={inp} placeholder="Nome (ex: Conta Corrente)" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
      <select className={inp} value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
        {TIPOS.map((t) => <option key={t}>{t}</option>)}
      </select>
      <input className={inp} placeholder="Valor atual" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} />
      <input className={inp} placeholder="Observação (opcional)" value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} />
      <button type="submit" disabled={loading} className="bg-gold text-bg rounded-md px-3.5 py-2 font-semibold text-[13px]">
        {loading ? "..." : "+ Adicionar"}
      </button>
    </form>
  );
}
