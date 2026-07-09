"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ConfigField({ chave, label, valorAtual }: { chave: string; label: string; valorAtual: string }) {
  const router = useRouter();
  const [valor, setValor] = useState(valorAtual);
  const [loading, setLoading] = useState(false);
  const [salvo, setSalvo] = useState(false);

  async function salvar() {
    setLoading(true);
    setSalvo(false);
    await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chave, valor }),
    });
    setLoading(false);
    setSalvo(true);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2.5 mb-3">
      <label className="text-[13px] text-muted w-[260px] flex-shrink-0">{label}</label>
      <input
        className="flex-1 bg-[#0F1729] border border-border rounded-md px-2.5 py-2 text-[13px] text-ink"
        value={valor}
        onChange={(e) => { setValor(e.target.value); setSalvo(false); }}
      />
      <button
        onClick={salvar}
        disabled={loading}
        className="bg-gold text-bg rounded-md px-3.5 py-2 font-semibold text-[12.5px] whitespace-nowrap"
      >
        {loading ? "..." : salvo ? "✓ Salvo" : "Salvar"}
      </button>
    </div>
  );
}

export function NovaConfigForm() {
  const router = useRouter();
  const [chave, setChave] = useState("");
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!chave || !valor) return;
    setLoading(true);
    await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chave, valor }),
    });
    setLoading(false);
    setChave("");
    setValor("");
    router.refresh();
  }

  return (
    <form onSubmit={salvar} className="flex items-center gap-2.5">
      <input
        className="w-[260px] bg-[#0F1729] border border-border rounded-md px-2.5 py-2 text-[13px] text-ink"
        placeholder="chave_nova (ex: meta_renda_10k)"
        value={chave}
        onChange={(e) => setChave(e.target.value)}
      />
      <input
        className="flex-1 bg-[#0F1729] border border-border rounded-md px-2.5 py-2 text-[13px] text-ink"
        placeholder="valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />
      <button type="submit" disabled={loading} className="bg-blue text-white rounded-md px-3.5 py-2 font-semibold text-[12.5px]">
        {loading ? "..." : "+ Nova config"}
      </button>
    </form>
  );
}
