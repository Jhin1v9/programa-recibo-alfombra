# Recibos Alfombra Studio

Aplicacao moderna com `Next.js 16`, `React 19`, `TypeScript` e `Tailwind CSS 4` para:

- importar contatos em `VCF`, `CSV` e `TSV`;
- guardar empresa, clientes e recibos no `localStorage`;
- reutilizar modelos por cliente;
- repetir o ultimo servico sem preencher tudo outra vez;
- gerar recibos prontos para imprimir em `A4` ou guardar como PDF;
- navegar por paginas separadas para `Inicio`, `Empresa`, `Clientes` e `Recibos`.

## Funcionalidades

- importacao de contatos em `VCF`, `CSV` e `TSV`;
- cadastro e pesquisa de clientes;
- modelos por cliente para repetir servicos recorrentes;
- historico de recibos com duplicacao rapida;
- preview pronto para impressao em `A4`;
- deploy simples na `Vercel`.

## Stack

- `Next.js 16` com App Router
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `React Compiler` ativado em `next.config.ts`

## Como executar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run audit
npm run build
npm run start
npm run check
```

## Deploy na Vercel

- A app ja esta em `Next.js`, entao a Vercel detecta o projeto automaticamente.
- Nao precisa de `vercel.json` para o fluxo atual.
- Antes de subir, rode:

```bash
npm run lint
npm run build
```

## Dados

- Os mesmos `localStorage keys` da versao antiga foram preservados.
- Se ja existirem clientes e recibos guardados no navegador, a nova interface reutiliza esses dados.
- Na Vercel os dados continuam locais no browser do utilizador; para partilhar entre dispositivos sera preciso backend ou base de dados.

## Notas

- A app agora usa menu lateral com paginas dedicadas para organizar o fluxo.
- O preview da pagina de recibos foi mantido em formato de recibo imprimivel.
- O botao `Gerar PDF / imprimir` usa a dialog nativa do navegador.
- `npm run check` executa a validacao principal antes de publicar ou subir para a Vercel.
