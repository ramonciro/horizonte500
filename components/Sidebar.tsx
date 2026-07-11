"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid, Wallet, Upload, AlertCircle, Building2, Target,
  FileText, Kanban, Settings, Activity, LineChart,
} from "lucide-react";

const NAV = [
  { href: "/", label: "Home", icon: LayoutGrid },
  { href: "/status", label: "Status", icon: Activity },
  { href: "/financas", label: "Finanças", icon: Wallet },
  { href: "/importar", label: "Importar", icon: Upload },
  { href: "/dividas", label: "Dívidas", icon: AlertCircle },
  { href: "/patrimonio", label: "Patrimônio", icon: Building2 },
  { href: "/objetivos", label: "Objetivos", icon: Target },
  { href: "/evolucao", label: "Evolução", icon: LineChart },
  { href: "/decisoes", label: "Decisões", icon: FileText },
  { href: "/backlog", label: "Backlog", icon: Kanban },
  { href: "/config", label: "Configurações", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="w-[220px] border-r border-border p-5 flex-shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div className="flex items-center gap-3 mb-8 px-1">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal via-blue to-purple flex-shrink-0" />
        <div>
          <div className="font-display text-[15px] font-bold text-ink leading-tight">Horizonte 500</div>
          <div className="text-[9.5px] text-muted uppercase tracking-wider">Sistema Operacional</div>
        </div>
      </div>
      {NAV.map((n) => {
        const active = pathname === n.href;
        const Icon = n.icon;
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-[13.5px] font-medium transition-colors ${
              active ? "bg-surface2 text-ink" : "text-muted hover:bg-surface2/60 hover:text-ink"
            }`}
          >
            <Icon size={17} strokeWidth={1.8} className={active ? "text-teal" : "text-muted"} />
            {n.label}
          </Link>
        );
      })}
    </div>
  );
}
