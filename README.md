# KZ Audio — conceito de design

Estudo visual independente que combina o universo do áudio da KZ com referências estéticas da alta relojoaria. O site apresenta uma coleção conceitual de nove edições, com filme de produto, catálogo e páginas individuais.

> **Projeto conceitual e não oficial.** Não representa parceria, endosso ou vínculo comercial com a Rolex. Produtos, preços, acabamentos e disponibilidade são ilustrativos; não há venda ou envio real de dados pelo site.

## Experiência

- Página inicial editorial com filme e apresentação da proposta.
- Catálogo com nove conceitos de produto e valores ilustrativos.
- Página de detalhes para cada edição, incluindo formulário de contato demonstrativo.
- Animações de rolagem e layout responsivo para celular e desktop.

## Tecnologias

- [Astro](https://astro.build/)
- TypeScript para os dados da coleção
- CSS e JavaScript nativos

## Requisitos

- Node.js `>=22.12.0`
- npm

## Desenvolvimento

```bash
npm install
npm run dev
```

O servidor local informa a URL no terminal (normalmente `http://localhost:4321`).

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura do projeto

```text
src/
  components/       Componentes Astro reutilizáveis
  data/products.ts  Conteúdo e dados das nove edições
  layouts/          Layout compartilhado
  pages/            Página inicial, catálogo e detalhes dinâmicos
public/
  css/              Estilos do site
  js/               Interações e animações
  logos/            Marcas usadas no conceito visual
  produtos/         Imagens e filme da coleção
```

Os diretórios `site antigo/`, `graphify-out/` e `tmp/` contêm referências ou artefatos locais e não fazem parte do site publicado.
