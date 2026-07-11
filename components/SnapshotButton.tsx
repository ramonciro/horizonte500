"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";

export default function SnapshotButton({ label = "Snapshot do mês atual" }: { label?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function salvar() {
    setLoading(true);
    await fetch("/api/snapshot", { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={salvar}
      disabled={loading}
      className="flex items-center gap-2 bg-teal text-bg rounded-lg px-4 py-2 font-semibold text-[13px]"
    >
      <Camera size={15} strokeWidth={2} />
      {loading ? "Salvando..." : label}
    </button>
  );
}
