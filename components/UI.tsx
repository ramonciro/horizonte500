export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface border border-border rounded-[10px] px-5 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function KPI({
  label,
  value,
  tone = "text",
}: {
  label: string;
  value: string;
  tone?: "text" | "good" | "bad" | "gold";
}) {
  const colors: Record<string, string> = {
    text: "text-ink",
    good: "text-good",
    bad: "text-bad",
    gold: "text-gold",
  };
  return (
    <Card>
      <div className="text-[11px] tracking-wide text-muted uppercase mb-2">{label}</div>
      <div className={`font-display text-[26px] font-semibold leading-tight ${colors[tone]}`}>{value}</div>
    </Card>
  );
}

export function Badge({ text }: { text: string }) {
  const map: Record<string, string> = {
    Alta: "bg-bad",
    Média: "bg-gold",
    Baixa: "bg-blue",
    Automática: "bg-muted",
    Pendente: "bg-bad",
    "Em andamento": "bg-good",
    Revisar: "bg-gold",
  };
  return (
    <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full text-bg ${map[text] || "bg-muted"}`}>
      {text}
    </span>
  );
}

export function Ring({ pct, status }: { pct: number; status: "good" | "warn" | "bad" }) {
  const circumference = 2 * Math.PI * 54;
  const dash = Math.max(0, Math.min(1, pct)) * circumference;
  const color = status === "good" ? "#34D399" : status === "warn" ? "#C9A227" : "#F87171";
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r="54" fill="none" stroke="#232C42" strokeWidth="10" />
      <circle
        cx="70"
        cy="70"
        r="54"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
      />
      <text x="70" y="65" textAnchor="middle" fontSize="22" fill="#E7EAF0" fontFamily="Fraunces, Georgia, serif" fontWeight={600}>
        {Math.round(pct * 100)}%
      </text>
      <text x="70" y="84" textAnchor="middle" fontSize="10" fill="#7C879E" fontFamily="Inter, system-ui, sans-serif">
        SAÚDE GERAL
      </text>
    </svg>
  );
}
