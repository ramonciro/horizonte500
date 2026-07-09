// Dados de seed compartilhados — usados tanto pelo script local (npm run prisma:seed)
// quanto pela rota /api/seed (para popular o banco 100% pelo navegador, sem terminal local)

const dividasSeed = [
  { empresa: "NuBank", tipo: "Serasa", saldoOriginal: 12745.39, descontoPossivel: 12368.20, valorComDesconto: 377.19, parcelamento: "À vista", prioridade: "Alta", estrategia: "Negociar liquidação à vista — desconto de 97%", status: "Pendente", observacoes: "Negativado; alto retorno ao negociar" },
  { empresa: "NuBank", tipo: "Serasa", saldoOriginal: 51403.15, descontoPossivel: 49874.00, valorComDesconto: 1529.15, parcelamento: "À vista", prioridade: "Alta", estrategia: "Negociar liquidação à vista — desconto de 97%", status: "Pendente", observacoes: "Negativado; alto retorno ao negociar" },
  { empresa: "NuBank", tipo: "Serasa", saldoOriginal: 54957.43, descontoPossivel: 52931.46, valorComDesconto: 2025.97, parcelamento: "19x ou à vista", prioridade: "Alta", estrategia: "Negociar liquidação à vista — desconto de 96%", status: "Pendente", observacoes: "Negativado; maior dívida do grupo" },
  { empresa: "NuBank", tipo: "Serasa", saldoOriginal: 6167.32, descontoPossivel: 5465.70, valorComDesconto: 701.62, parcelamento: "À vista", prioridade: "Média", estrategia: "Negociar liquidação à vista — desconto de 89%", status: "Pendente", observacoes: "Negativado" },
  { empresa: "Unifacs", tipo: "Serasa", saldoOriginal: 11171.04, descontoPossivel: 3588.48, valorComDesconto: 7582.56, parcelamento: "12x", prioridade: "Média", estrategia: "Avaliar parcelamento — desconto menor (32%)", status: "Pendente", observacoes: "Negativado; desconto proporcionalmente menor" },
  { empresa: "Vivo", tipo: "Serasa", saldoOriginal: 623.19, descontoPossivel: 451.98, valorComDesconto: 171.21, parcelamento: "À vista", prioridade: "Baixa", estrategia: "Quitar à vista — valor baixo, resolve rápido", status: "Pendente", observacoes: "Negativado" },
  { empresa: "Boticário (Serasa)", tipo: "Serasa", saldoOriginal: 461.80, descontoPossivel: 110.34, valorComDesconto: 351.46, parcelamento: "À vista", prioridade: "Baixa", estrategia: "Quitar à vista", status: "Pendente", observacoes: "Distinto do parcelamento Boticário no fluxo mensal" },
  { empresa: "Shoppe", tipo: "Serasa", saldoOriginal: 505.31, descontoPossivel: 429.51, valorComDesconto: 75.80, parcelamento: "À vista", prioridade: "Baixa", estrategia: "Quitar à vista — valor baixo", status: "Pendente", observacoes: "Negativado" },
  { empresa: "Mercado Pago", tipo: "Serasa", saldoOriginal: 338.22, descontoPossivel: 321.31, valorComDesconto: 16.91, parcelamento: "À vista", prioridade: "Baixa", estrategia: "Quitar à vista — valor simbólico", status: "Pendente", observacoes: "Negativado" },
  { empresa: "Oi", tipo: "Serasa", saldoOriginal: 223.80, descontoPossivel: 163.62, valorComDesconto: 60.18, parcelamento: "À vista", prioridade: "Baixa", estrategia: "Quitar à vista", status: "Pendente", observacoes: "Negativado" },
  { empresa: "Oi (parcelas adicionais)", tipo: "Serasa", saldoOriginal: 177.20, descontoPossivel: 0, valorComDesconto: 177.20, parcelamento: "4 parcelas de R$44,30", prioridade: "Baixa", estrategia: "Revisar — 4 linhas idênticas na origem", status: "Revisar", observacoes: "Possível duplicidade detectada na origem" },
  { empresa: "NeoEnergia (débito)", tipo: "Boleto", saldoOriginal: 2500.00, descontoPossivel: 0, valorComDesconto: 2500.00, parcelamento: "5x", prioridade: "Média", estrategia: "Manter parcelamento — já em andamento", status: "Em andamento", observacoes: "Confirmar se está sendo pago" },
  { empresa: "Consignados Folha (A+B+C) + Externo D", tipo: "Consignado", saldoOriginal: 4807.34, descontoPossivel: 0, valorComDesconto: 4807.34, parcelamento: "Desconto automático em folha", prioridade: "Automática", estrategia: "Sem ação — desconto já ocorre via folha", status: "Em andamento", observacoes: "Consolidado a partir da antiga aba EMPRÉSTIMOS" },
];

const objetivosSeed = [
  { nome: "Reserva de Emergência", meta: 8100, atual: 0, prazo: "Contínuo", proximaAcao: "Definir aporte mensal fixo assim que o fluxo ficar consistentemente positivo" },
  { nome: "Patrimônio Líquido", meta: 500000, atual: 21621.09, prazo: "~40 anos", proximaAcao: "Negociar dívidas Serasa para destravar patrimônio líquido" },
  { nome: "Renda 10K", meta: 10000, atual: 3409.76, prazo: "5 anos", proximaAcao: "Mapear trilha de carreira / especialização em T&D" },
  { nome: "Troca de Carro", meta: 60000, atual: 40000, prazo: "A definir", proximaAcao: "Aguardar quitação das dívidas prioritárias" },
  { nome: "Casa Própria", meta: 250000, atual: 0, prazo: "A definir", proximaAcao: "Retomado após reserva de emergência formada" },
  { nome: "Viagem ao Exterior", meta: 15000, atual: 0, prazo: "A definir", proximaAcao: "Objetivo de longo prazo — sem ação no momento" },
];

const ativosSeed = [
  { nome: "Conta Corrente", tipo: "Conta", valor: 0, observacao: "Marco Zero" },
  { nome: "FGTS", tipo: "FGTS", valor: 7277.65, observacao: "Marco Zero" },
  { nome: "Ford Ka 1.0 2017", tipo: "Veículo", valor: 40000, observacao: "Valor de referência — Marco Zero" },
  { nome: "Investimentos", tipo: "Investimentos", valor: 0, observacao: "Marco Zero" },
];

const backlogSeed = [
  { titulo: "Vocabulário de marca", descricao: "Avaliar linguagem própria (ex: Consumo, Capacidade de Geração) sem perder simplicidade. Decidido: manter termos técnicos, ajustar só o tom da Home.", categoria: "Ideia", status: "Descartado" },
  { titulo: "Insights com IA (CFO virtual)", descricao: "Análise automática de padrões, alertas e recomendações via OpenAI API — Roadmap v2.0", categoria: "Funcionalidade", status: "Backlog" },
  { titulo: "Evolução histórica (gráficos)", descricao: "Série histórica de patrimônio, fluxo e dívidas com Recharts", categoria: "Funcionalidade", status: "Planejado" },
  { titulo: "Importação de Excel", descricao: "Upload direto de planilha para gerar lançamentos", categoria: "Funcionalidade", status: "Planejado" },
  { titulo: "App mobile", descricao: "Versão mobile do Horizonte 500 (v6 do roadmap original)", categoria: "Funcionalidade", status: "Backlog" },
];

const decisoesSeed = [
  {
    decisao: "Priorizar negociação das dívidas Serasa (NuBank e Unifacs) antes de qualquer novo investimento",
    motivo: "Desconto de até 97% disponível; maior retorno imediato sobre qualquer alternativa de alocação de capital",
    resultadoEsperado: "Redução de ~R$130 mil em dívida nominal para ~R$20,4 mil negociado, destravando patrimônio líquido",
  },
  {
    decisao: "Migrar controle financeiro da planilha Excel para o Horizonte 500 (v1.0)",
    motivo: "Centralizar dados, eliminar duplicidade entre planilhas e criar base para decisões futuras",
    resultadoEsperado: "Visão única do fluxo, dívidas e patrimônio, atualizada em tempo real",
  },
];

const configSeed = [
  { chave: "meta_reserva_emergencia", valor: "8100" },
  { chave: "reserva_atual", valor: "0" },
  { chave: "divida_pai_saldo", valor: "5279.57" },
  { chave: "pilar_1", valor: "Pare de se endividar — nenhum novo empréstimo" },
  { chave: "pilar_2", valor: "Reserva de emergência — meta 3x salário" },
  { chave: "pilar_3", valor: "Investimento — só após quitação e reserva formada" },
];

export { dividasSeed, objetivosSeed, ativosSeed, backlogSeed, decisoesSeed, configSeed };
