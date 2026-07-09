# Horizonte 500 — v1.1

Sistema Operacional de Crescimento Pessoal. Next.js + PostgreSQL + Prisma.

Módulos: **Home (executiva)**, **Finanças**, **Patrimônio**, **Dívidas**, **Objetivos**,
**Decisões**, **Backlog**.

## Deploy 100% pelo navegador (sem terminal local)

### 1. Banco de dados — Supabase
1. [supabase.com](https://supabase.com) → New Project → região São Paulo
2. **Connect** → aba **ORMs** → **Prisma** → copie `DATABASE_URL` e `DIRECT_URL`

### 2. Código — GitHub (upload direto, sem git)
1. Descompacte este zip no seu computador (recurso nativo do sistema, não é instalação)
2. [github.com/new](https://github.com/new) → crie um repositório privado `horizonte500`
3. Na página do repo → **Add file → Upload files**
4. Arraste o **conteúdo** da pasta `horizonte500` (não a pasta em si — os arquivos `package.json`,
   `app/`, `prisma/` etc. direto na raiz do repositório)
5. **Commit changes**

### 3. Deploy — Vercel
1. [vercel.com/new](https://vercel.com/new) → importe o repositório `horizonte500`
2. Em **Environment Variables**, adicione as três:
   - `DATABASE_URL` → do Supabase
   - `DIRECT_URL` → do Supabase
   - `SEED_SECRET` → invente uma senha aleatória (vai usar no passo 4)
3. **Deploy**

O comando de build (`prisma generate && prisma db push && next build`) já está configurado
para criar as tabelas no banco automaticamente — você não precisa rodar nenhum comando.

### 4. Popular com seus dados reais
Depois que o deploy terminar, acesse no navegador:
```
https://SEU-APP.vercel.app/api/seed?secret=A_SENHA_QUE_VOCE_DEFINIU
```
Isso carrega os 168 lançamentos, 12 dívidas, 6 objetivos, 4 ativos, 5 itens de backlog e
2 decisões. Você verá uma resposta JSON confirmando. **Rode só uma vez** — rodar de novo
apaga e recarrega os dados originais (útil para "resetar" caso precise).

Pronto — acesse `https://SEU-APP.vercel.app` e o Horizonte 500 está no ar.

## Estrutura do projeto

```
app/
  page.tsx             → Home executiva
  financas/page.tsx     → Finanças (lançamentos + formulário)
  patrimonio/page.tsx   → Patrimônio (ativos → patrimônio líquido)
  dividas/page.tsx      → Dívidas
  objetivos/page.tsx    → Objetivos
  decisoes/page.tsx     → Centro de Decisões
  backlog/page.tsx      → Backlog interno
  api/                  → Rotas de API de cada módulo + /api/seed (carga inicial)
components/              → Sidebar, Cards, KPIs, Badge, Ring, formulários
prisma/
  schema.prisma          → Modelo de dados (fonte única de verdade)
  seedData.ts             → Dados reais compartilhados (script local + rota /api/seed)
  seed.ts                 → Script local opcional (npm run prisma:seed, se tiver Node)
lib/
  prisma.ts               → Cliente Prisma singleton
  format.ts                → Formatação de moeda (BRL)
```

## Princípio de dados

Todo o sistema deriva da tabela `Lancamento` (finanças) e `Ativo`/`Divida` (patrimônio
líquido = ativos − dívidas − dívida com o pai). Nada é calculado ou guardado em duplicidade.

## Rodando localmente (opcional, se um dia tiver Node.js à mão)

```bash
npm install
cp .env.example .env   # preencha com as strings do Supabase
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

## Próximas sprints (roadmap)

- **v1.2** — Dashboard Executivo mais rico (comparativos vs. mês anterior)
- **v1.3** — Importação de Excel
- **v1.4** — Evolução (histórico mensal com gráficos via Recharts)
- **v1.5** — Insights (regras de alerta simples)
- **v2.0** — IA integrada (CFO virtual via OpenAI API)
