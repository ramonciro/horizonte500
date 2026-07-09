"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home", icon: "◎" },
  { href: "/financas", label: "Finanças", icon: "≋" },
  { href: "/dividas", label: "Dívidas", icon: "▣" },
  { href: "/patrimonio", label: "Patrimônio", icon: "◆" },
  { href: "/objetivos", label: "Objetivos", icon: "◈" },
  { href: "/decisoes", label: "Decisões", icon: "✎" },
  { href: "/backlog", label: "Backlog", icon: "▦" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="w-[200px] border-r border-border p-6 flex-shrink-0 h-screen sticky top-0">
      <div className="font-display text-lg font-bold text-gold mb-1">Horizonte 500</div>
      <div className="text-xs text-[#5B6478] mb-8">Ramon Ciro</div>
      {NAV.map((n) => {
        const active = pathname === n.href;
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-1 text-[13.5px] font-medium ${
              active ? "bg-gold text-bg" : "text-[#B7BFD0] hover:bg-surface2"
            }`}
          >
            <span className="text-[13px]">{n.icon}</span> {n.label}
          </Link>
        );
      })}
    </div>
  );
}
