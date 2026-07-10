import * as XLSX from "xlsx";

export type LancamentoParsed = {
  mes: string;
  tipo: "Receita" | "Despesa";
  categoria: string;
  descricao: string;
  previsto: number;
  realizado: number;
};

const MESES_ESPERADOS = ["MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO", "JANEIRO"];
const MES_LABEL: Record<string, string> = {
  MAIO: "Maio", JUNHO: "Junho", JULHO: "Julho", AGOSTO: "Agosto", SETEMBRO: "Setembro",
  OUTUBRO: "Outubro", NOVEMBRO: "Novembro", DEZEMBRO: "Dezembro", JANEIRO: "Janeiro",
};

const SECAO_MAP: Record<string, string> = {
  "ENTRADAS": "Receita",
  "DESPESAS FIXAS": "Despesa Fixa",
  "DESPESAS VARIÁVEIS": "Despesa Variável",
  "EXTRAS": "Extra",
};

const STOP_HEADERS = ["RESUMO DO MÊS", "DÍVIDA COM O PAI", "ORÇAMENTO SEMANAL", "STATUS DO MÊS", "OBSERVAÇÕES DO MÊS"];
const EXCLUDE_DESC = [
  "Total de Saídas", "SALDO FINAL DO MÊS", "Saldo disponível p/ gastos livres",
  "GASTO MÁXIMO POR SEMANA", "Pagamento ao Pai este mês", "Saldo devedor (acumulado)",
];

export function parseControleFinanceiro(arrayBuffer: ArrayBuffer): { lancamentos: LancamentoParsed[]; abasEncontradas: string[] } {
  const wb = XLSX.read(arrayBuffer, { type: "array", cellDates: false });
  const abasEncontradas: string[] = [];
  const lancamentos: LancamentoParsed[] = [];

  for (const mesKey of MESES_ESPERADOS) {
    if (!wb.SheetNames.includes(mesKey)) continue;
    abasEncontradas.push(mesKey);
    const ws = wb.Sheets[mesKey];
    const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null });

    let secaoAtual: string | null = null;
    for (const row of rows) {
      const b = row[1];
      const c = row[2];
      const d = row[3];
      if (b === null || b === undefined) continue;
      const btext = String(b).trim();

      let matchedSecao: string | null = null;
      for (const key of Object.keys(SECAO_MAP)) {
        if (btext.includes(key)) { matchedSecao = key; break; }
      }
      if (matchedSecao && (c === null || c === undefined)) {
        secaoAtual = matchedSecao;
        continue;
      }
      if ((c === null || c === undefined) && STOP_HEADERS.some((h) => btext.includes(h))) {
        secaoAtual = null;
        continue;
      }
      if (btext.startsWith("=")) continue;
      if (secaoAtual === null) continue;
      if (EXCLUDE_DESC.some((x) => btext.includes(x))) continue;
      if (typeof c !== "number") continue;

      let desc = btext;
      let tipo: "Receita" | "Despesa" = "Despesa";
      let categoria = SECAO_MAP[secaoAtual];

      if (desc.startsWith("Desconto:")) {
        tipo = "Despesa";
        categoria = "Dívida - Consignado";
        desc = desc.replace("Desconto: ", "");
      } else if (secaoAtual === "ENTRADAS") {
        tipo = "Receita";
        categoria = "Renda";
      }

      lancamentos.push({
        mes: MES_LABEL[mesKey],
        tipo,
        categoria,
        descricao: desc,
        previsto: c,
        realizado: typeof d === "number" ? d : c,
      });
    }
  }

  return { lancamentos, abasEncontradas };
}
