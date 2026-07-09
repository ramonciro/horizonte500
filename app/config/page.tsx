import { prisma } from "@/lib/prisma";
import { Card } from "@/components/UI";
import { ConfigField, NovaConfigForm } from "@/components/ConfigForm";

export const dynamic = "force-dynamic";

const CAMPOS_CONHECIDOS = [
  { chave: "meta_reserva_emergencia", label: "Meta de Reserva de Emergência (R$)" },
  { chave: "reserva_atual", label: "Reserva Atual (R$)" },
  { chave: "divida_pai_saldo", label: "Saldo da Dívida com o Pai (R$)" },
  { chave: "pilar_1", label: "Pilar 1" },
  { chave: "pilar_2", label: "Pilar 2" },
  { chave: "pilar_3", label: "Pilar 3" },
];

export default async function ConfigPage() {
  const config = await prisma.config.findMany();
  const mapa = new Map(config.map((c) => [c.chave, c.valor]));
  const conhecidasChaves = new Set(CAMPOS_CONHECIDOS.map((c) => c.chave));
  const outras = config.filter((c) => !conhecidasChaves.has(c.chave));

  return (
    <>
      <h1 className="font-display text-2xl font-semibold mb-1.5">Configurações</h1>
      <p className="text-[13px] text-muted mb-5">
        Ajuste reserva, metas e pilares sem precisar entrar no Supabase.
      </p>

      <Card className="mb-5">
        <div className="text-[11px] text-muted uppercase tracking-wide mb-3.5">Metas e parâmetros</div>
        {CAMPOS_CONHECIDOS.map((c) => (
          <ConfigField key={c.chave} chave={c.chave} label={c.label} valorAtual={mapa.get(c.chave) ?? ""} />
        ))}
      </Card>

      {outras.length > 0 && (
        <Card className="mb-5">
          <div className="text-[11px] text-muted uppercase tracking-wide mb-3.5">Outras configurações</div>
          {outras.map((c) => (
            <ConfigField key={c.chave} chave={c.chave} label={c.chave} valorAtual={c.valor} />
          ))}
        </Card>
      )}

      <Card>
        <div className="text-[11px] text-muted uppercase tracking-wide mb-3.5">Adicionar nova configuração</div>
        <NovaConfigForm />
      </Card>
    </>
  );
}
