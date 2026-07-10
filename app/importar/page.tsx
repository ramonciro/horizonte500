"use client";

import { useState } from "react";
import { parseControleFinanceiro, LancamentoParsed } from "@/lib/xlsxParser";
import { fmtBRL } from "@/lib/format";
import { Card } from "@/components/UI";

type Existente = { mes: string; categoria: string; descricao: string; previsto: number; realizado: number };
type ComStatus = LancamentoParsed & { status: "Novo" | "Atualizado" | "Sem mudança" };

const STATUS_COLOR: Record<string, string> = {
  Novo: "text-good",
  Atualizado: "text-gold",
  "Sem mudança": "text-muted",
};

export default function ImportarPage() {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [porMes, setPorMes] = useState<Record<string, ComStatus[]> | null>(null);
  const [importando, setImportando] = useState<string | null>(null);
  const [resultados, setResultados] = useState<Record<string, string>>({});

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErro(null);
    setCarregando(true);
    setResultados({});
    try {
      const buffer = await file.arrayBuffer();
      const { lancamentos, abasEncontradas } = parseControleFinanceiro(buffer);
      if (abasEncontradas.length === 0) {
        setErro("Nenhuma aba de mês reconhecida (esperado: MAIO, JUNHO, JULHO...). Confirme que é a planilha de Controle Financeiro.");
        setCarregando(false);
        return;
      }

      const existentesResp = await fetch("/api/lancamentos");
      const existentes: Existente[] = await existentesResp.json();
      const existentesMap = new Map(existentes.map((e) => [`${e.mes}|${e.categoria}|${e.descricao}`, e]));

      const agrupado: Record<string, ComStatus[]> = {};
      for (const l of lancamentos) {
        const key = `${l.mes}|${l.categoria}|${l.descricao}`;
        const ex = existentesMap.get(key);
        let status: ComStatus["status"] = "Novo";
        if (ex) {
          status = ex.previsto === l.previsto && ex.realizado === l.realizado ? "Sem mudança" : "Atualizado";
        }
        if (!agrupado[l.mes]) agrupado[l.mes] = [];
        agrupado[l.mes].push({ ...l, status });
      }
      setPorMes(agrupado);
    } catch (err: any) {
      setErro("Não consegui ler esse arquivo. Confirme que é um .xlsx válido. Detalhe: " + err.message);
    }
    setCarregando(false);
  }

  async function importarMes(mes: string, modo: "mesclar" | "substituir") {
    if (!porMes) return;
    setImportando(mes);
    const resp = await fetch("/api/importar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lancamentos: porMes[mes], modo }),
    });
    const data = await resp.json();
    setResultados((r) => ({ ...r, [mes]: `${data.criados} novos, ${data.atualizados} atualizados, ${data.semMudanca} sem mudança` }));
    setImportando(null);
  }

  async function importarTudo() {
    if (!porMes) return;
    for (const mes of Object.keys(porMes)) {
      await importarMes(mes, "mesclar");
    }
  }

  return (
    <>
      <h1 className="font-display text-2xl font-semibold mb-1.5">Importar Planilha</h1>
      <p className="text-[13px] text-muted mb-5">
        Envie o Controle Financeiro (.xlsx). Nada é duplicado — cada linha é comparada por mês, categoria
        e descrição. Você decide o que entra, mês a mês.
      </p>

      <Card className="mb-5">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFile}
          className="text-[13px] text-muted file:mr-3 file:py-2 file:px-3.5 file:rounded-md file:border-0 file:bg-gold file:text-bg file:font-semibold file:text-[12.5px] file:cursor-pointer"
        />
        {carregando && <div className="text-[12.5px] text-muted mt-2.5">Lendo planilha...</div>}
        {erro && <div className="text-[12.5px] text-bad mt-2.5">{erro}</div>}
      </Card>

      {porMes && (
        <>
          <button
            onClick={importarTudo}
            className="bg-gold text-bg rounded-md px-4 py-2 font-semibold text-[13px] mb-5"
          >
            Importar todos os meses (mesclar)
          </button>

          {Object.entries(porMes).map(([mes, itens]) => {
            const novos = itens.filter((i) => i.status === "Novo").length;
            const atualizados = itens.filter((i) => i.status === "Atualizado").length;
            const semMudanca = itens.filter((i) => i.status === "Sem mudança").length;
            return (
              <Card key={mes} className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-semibold text-sm mr-3">{mes}</span>
                    <span className="text-[12px] text-good mr-2">{novos} novos</span>
                    <span className="text-[12px] text-gold mr-2">{atualizados} atualizados</span>
                    <span className="text-[12px] text-muted">{semMudanca} sem mudança</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => importarMes(mes, "mesclar")}
                      disabled={importando === mes}
                      className="bg-gold text-bg rounded-md px-3 py-1.5 font-semibold text-[12px]"
                    >
                      {importando === mes ? "..." : "Mesclar"}
                    </button>
                    <button
                      onClick={() => importarMes(mes, "substituir")}
                      disabled={importando === mes}
                      className="bg-bad text-bg rounded-md px-3 py-1.5 font-semibold text-[12px]"
                      title="Apaga todos os lançamentos deste mês antes de importar"
                    >
                      Substituir mês
                    </button>
                  </div>
                </div>
                {resultados[mes] && <div className="text-[12px] text-good mb-2.5">✓ {resultados[mes]}</div>}
                <table>
                  <thead>
                    <tr><th>Status</th><th>Tipo</th><th>Categoria</th><th>Descrição</th><th>Previsto</th><th>Realizado</th></tr>
                  </thead>
                  <tbody>
                    {itens.map((i, idx) => (
                      <tr key={idx}>
                        <td className={`font-semibold ${STATUS_COLOR[i.status]}`}>{i.status}</td>
                        <td className={i.tipo === "Receita" ? "text-good" : "text-bad"}>{i.tipo}</td>
                        <td className="text-muted">{i.categoria}</td>
                        <td>{i.descricao}</td>
                        <td>{fmtBRL(i.previsto)}</td>
                        <td>{fmtBRL(i.realizado)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            );
          })}
        </>
      )}
    </>
  );
}
