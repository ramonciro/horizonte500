"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIAS = ["Ideia", "Melhoria", "Funcionalidade", "Bug"];
const STATUSES = ["Backlog", "Em análise", "Planejado", "Descartado"];
const inp = "bg-[#0F1729] border border-border rounded-md px-2.5 py-2 text-[13px] text-ink";

export default function BacklogForm() {
  const router = useRouter();
  const [form, setForm] = useState({ titulo: "", descricao: "", categoria: "Ideia", status: "Backlog" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titulo) return;
    setLoading(true);
    await fetch("/api/backlog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setForm({ titulo: "", descricao: "", categoria: "Ideia", status: "Backlog" });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-[1fr_1fr_130px_130px_auto] gap-2 items-center">
      <input className={inp} placeholder="Título da ideia" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
      <input className={inp} placeholder="Descrição (opcional)" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
      <select className={inp} value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
        {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
      </select>
      <select className={inp} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
        {STATUSES.map((s) => <option key={s}>{s}</option>)}
      </select>
      <button type="submit" disabled={loading} className="bg-gold text-bg rounded-md px-3.5 py-2 font-semibold text-[13px]">
        {loading ? "..." : "+ Add"}
      </button>
    </form>
  );
}
