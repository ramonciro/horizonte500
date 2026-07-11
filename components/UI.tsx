export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface border border-border rounded-2xl px-5 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function HeroCard({
  label,
  value,
  breakdown,
  icon: Icon,
  tone = "teal",
}: {
  label: string;
  value: string;
  breakdown?: string;
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  tone?: "teal" | "good" | "bad";
}) {
  const valueColor = { teal: "text-teal", good: "text-good", bad: "text-bad" }[tone];
  const glow = { teal: "from-teal/10", good: "from-good/10", bad: "from-bad/10" }[tone];
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${glow} to-surface px-6 py-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] tracking-wide text-muted uppercase font-medium">{label}</span>
        {Icon && <Icon size={18} strokeWidth={1.8} className="text-muted" />}
      </div>
      <div className={`font-display text-[34px] font-semibold leading-none mb-2 ${valueColor}`}>{value}</div>
      {breakdown && <div className="text-[12.5px] text-muted">{breakdown}</div>}
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

export function TrendBadge({ pct, invert = false }: { pct: number | null; invert?: boolean }) {
  if (pct === null || !isFinite(pct)) return null;
  const isUp = pct >= 0;
  const good = invert ? !isUp : isUp;
  const color = good ? "text-good" : "text-bad";
  const arrow = isUp ? "↑" : "↓";
  return (
    <span className={`text-[12px] font-semibold ${color}`}>
      {arrow} {Math.abs(pct).toFixed(0)}%
    </span>
  );
}

export function Sparkline({ points, width = 320, height = 56 }: { points: number[]; width?: number; height?: number }) {
  if (points.length < 2) {
    return <div className="text-[12px] text-muted">Dados insuficientes ainda — precisa de pelo menos 2 meses.</div>;
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = width / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = i * stepX;
    const y = height - ((p - min) / range) * (height - 8) - 4;
    return [x, y];
  });
  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = coords[coords.length - 1];
  const trendUp = points[points.length - 1] >= points[0];
  const color = trendUp ? "#34D399" : "#F87171";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
      <circle cx={last[0]} cy={last[1]} r="3.5" fill={color} />
    </svg>
  );
}

export function AlertItem({ tipo, texto }: { tipo: "alerta" | "positivo" | "info"; texto: string }) {
  const styles: Record<string, { bg: string; icon: string }> = {
    alerta: { bg: "border-l-4 border-bad", icon: "⚠" },
    positivo: { bg: "border-l-4 border-good", icon: "✓" },
    info: { bg: "border-l-4 border-blue", icon: "ℹ" },
  };
  const s = styles[tipo];
  return (
    <div className={`${s.bg} pl-3 py-1.5 text-[13px] text-ink/90`}>
      <span className="mr-1.5">{s.icon}</span>
      {texto}
    </div>
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
