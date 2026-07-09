import { PrismaClient } from "@prisma/client";
import lancamentosSeed from "./seed_lancamentos.json";
import { dividasSeed, objetivosSeed, ativosSeed, backlogSeed, decisoesSeed, configSeed } from "./seedData";

const prisma = new PrismaClient();

async function main() {
  console.log("Limpando dados existentes...");
  await prisma.lancamento.deleteMany();
  await prisma.divida.deleteMany();
  await prisma.objetivo.deleteMany();
  await prisma.config.deleteMany();
  await prisma.ativo.deleteMany();
  await prisma.backlogItem.deleteMany();
  await prisma.decisao.deleteMany();

  console.log(`Semeando ${lancamentosSeed.length} lançamentos...`);
  for (const l of lancamentosSeed as any[]) {
    await prisma.lancamento.create({
      data: {
        mes: l.mes,
        data: new Date(l.data),
        tipo: l.tipo,
        categoria: l.categoria,
        descricao: l.descricao,
        previsto: l.previsto,
        realizado: l.realizado,
      },
    });
  }

  console.log(`Semeando ${dividasSeed.length} dívidas...`);
  await prisma.divida.createMany({ data: dividasSeed });

  console.log(`Semeando ${objetivosSeed.length} objetivos...`);
  await prisma.objetivo.createMany({ data: objetivosSeed });

  console.log("Semeando configurações...");
  await prisma.config.createMany({ data: configSeed });

  console.log(`Semeando ${ativosSeed.length} ativos (patrimônio)...`);
  await prisma.ativo.createMany({ data: ativosSeed });

  console.log(`Semeando ${backlogSeed.length} itens de backlog...`);
  await prisma.backlogItem.createMany({ data: backlogSeed });

  console.log(`Semeando ${decisoesSeed.length} decisões...`);
  await prisma.decisao.createMany({ data: decisoesSeed });

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
