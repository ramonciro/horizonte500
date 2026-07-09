"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MESES = ["Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Janeiro"];
const CATEGORIAS = ["Renda", "Dívida - Consignado", "Despesa Fixa", "Despesa Variável", "Extra"];

const inp = "bg-[#0F1729] border border-border rounded-md px-2.5 py-2 text-[13px] text-ink";

export default function LancamentoForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    mes: "Maio",
    tipo: "Despesa",
    categoria: "Despesa Variável",
    descricao: "",
    previsto: "",
    realizado: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.descricao || !form.previsto) return;
    setLoading(true);
    const monthIndex = { Maio: "05", Junho: "06", Julho: "07", Agosto: "08", Setembro: "09", Outubro: "10", Novembro: "11", Dezembro: "12", Janeiro: "01" }[form.mes];
    const year = form.mes === "Janeiro" ? "2027" : "2026";
    await fetch("/api/lancamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, data: `${year}-${monthIndex}-01` }),
    });
    setLoading(false);
    setForm({ ...form, descricao: "", previsto: "", realizado: "" });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-[90px_110px_150px_1fr_100px_100px_auto] gap-2 items-center">
      <select className={inp} value={form.mes} onChange={(e) => setForm({ ...form, mes: e.target.value })}>
        {MESES.map((m) => <option key={m}>{m}</option>)}
      </select>
      <select className={inp} value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
        <option>Receita</option>
        <option>Despesa</option>
      </select>
      <select className={inp} value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
        {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
      </select>
      <input className={inp} placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
      <input className={inp} placeholder="Previsto" value={form.previsto} onChange={(e) => setForm({ ...form, previsto: e.target.value })} />
      <input className={inp} placeholder="Realizado" value={form.realizado} onChange={(e) => setForm({ ...form, realizado: e.target.value })} />
      <button type="submit" disabled={loading} className="bg-gold text-bg rounded-md px-3.5 py-2 font-semibold text-[13px]">
        {loading ? "..." : "+ Lançar"}
      </button>
    </form>
  );
}
