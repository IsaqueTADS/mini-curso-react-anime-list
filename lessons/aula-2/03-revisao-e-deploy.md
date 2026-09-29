# Apostila 03 - Revisão, organização e introdução ao deploy

**Minicurso:** React com Vite na Prática: Construindo uma Aplicação de Listagem e Detalhes de Animes<br>
**Módulo:** Dia 2 - Revisão final e próximos passos<br>
**Autor e apresentador:** Isaque Rodrigues Alves<br>
**Instituição:** IFNMG - Instituto Federal do Norte de Minas Gerais

---

## Sumário

- [O resultado da Aula 2](#o-resultado-da-aula-2)
- [1. Revisando o fluxo completo](#1-revisando-o-fluxo-completo)
- [2. Revisando a organização das pastas](#2-revisando-a-organização-das-pastas)
- [3. Responsabilidade de cada camada](#3-responsabilidade-de-cada-camada)
- [4. Checklist funcional](#4-checklist-funcional)
- [5. Preparando o build](#5-preparando-o-build)
- [6. O que é deploy?](#6-o-que-é-deploy)
- [7. Publicando uma aplicação Vite](#7-publicando-uma-aplicação-vite)
- [8. Atenção com rotas no deploy](#8-atenção-com-rotas-no-deploy)
- [9. Próximos passos](#9-próximos-passos)
- [Checklist da aula](#checklist-da-aula)
- [Resumo](#resumo)

## O resultado da Aula 2

Ao final da aula, a aplicação terá duas telas:

```text
/             → AnimeList
/anime/:id    → AnimeDetails
```

O usuário poderá:

- listar animes;
- pesquisar por texto;
- navegar pelas páginas;
- selecionar um card;
- abrir detalhes pelo ID;
- visualizar informações do anime;
- voltar para a tela anterior.

A aplicação continua simples de propósito. Não adicionamos autenticação,
banco de dados, favoritos, avaliações, Context API ou uma biblioteca de
gerenciamento de estado.

## 1. Revisando o fluxo completo

### Listagem

```text
AnimeList
    ↓
getAnimeList(query, page)
    ↓
Kitsu /anime
    ↓
mapearAnime
    ↓
AnimeListResult
    ↓
AnimeCard + Pagination
```

### Detalhes

```text
clique no AnimeCard
    ↓
navigate('/anime/1')
    ↓
Route /anime/:id
    ↓
useParams() → id
    ↓
getAnimeDetails(id)
    ↓
Kitsu /anime/1
    ↓
mapearAnime
    ↓
AnimeDetails
```

### Voltar

```tsx
const navigate = useNavigate()

navigate(-1)
```

O Router utiliza o histórico do navegador e retorna para a tela anterior.

## 2. Revisando a organização das pastas

A estrutura final da Aula 2 fica:

```text
src/
├── App.tsx
├── index.css
├── main.tsx
├── components/
│   ├── anime-card.tsx
│   ├── empty-state.tsx
│   ├── loading-grid.tsx
│   ├── pagination.tsx
│   └── search-bar.tsx
├── pages/
│   ├── anime-details.tsx
│   └── anime-list.tsx
├── services/
│   └── anime.ts
└── types/
    ├── anime.ts
    └── kitsu.ts
```

O projeto separa a aplicação por responsabilidade, não por tipo de arquivo
aleatório.

## 3. Responsabilidade de cada camada

### `App.tsx`

Organiza as rotas:

```tsx
<Routes>
  <Route path="/" element={<AnimeList />} />
  <Route path="/anime/:id" element={<AnimeDetails />} />
</Routes>
```

### `pages`

Representa telas completas:

- `AnimeList`: lista, busca e paginação;
- `AnimeDetails`: dados de um anime selecionado.

### `components`

Representa partes reutilizáveis das telas:

- `AnimeCard` apresenta um anime;
- `SearchBar` captura uma busca;
- `Pagination` controla a navegação entre páginas;
- `LoadingGrid` apresenta carregamento;
- `EmptyState` apresenta erro ou ausência de resultados.

### `services`

Centraliza as requisições:

```ts
getAnimeList(query, page)
getAnimeDetails(id)
```

### `types`

Representa contratos de dados:

- `kitsu.ts`: resposta da API externa;
- `anime.ts`: modelo simplificado da aplicação.

## 4. Checklist funcional

Teste o fluxo como usuário, não apenas olhando o código:

- [ ] A aplicação abre a listagem em `/`.
- [ ] Os cards aparecem depois do carregamento.
- [ ] A busca envia `filter[text]` para a Kitsu.
- [ ] Uma nova busca volta para a página 1.
- [ ] A paginação altera o `page[offset]`.
- [ ] A busca continua aplicada ao trocar de página.
- [ ] Clicar em um card altera a URL para `/anime/{id}`.
- [ ] A tela de detalhes lê o ID correto.
- [ ] O título e a imagem aparecem nos detalhes.
- [ ] A sinopse aparece quando existe.
- [ ] Um anime sem imagem não quebra a tela.
- [ ] Um erro da Kitsu mostra uma mensagem compreensível.
- [ ] O botão voltar retorna para a tela anterior.
- [ ] A aplicação funciona em uma tela pequena.

## 5. Preparando o build

Durante o desenvolvimento usamos:

```bash
npm run dev
```

Para gerar os arquivos de produção:

```bash
npm run build
```

Esse script executa:

```text
tsc -b
    ↓
verificação do TypeScript
    ↓
vite build
    ↓
geração da pasta dist/
```

Antes de publicar, também podemos executar:

```bash
npm run lint
```

Para testar localmente o resultado de produção:

```bash
npm run preview
```

O build não deve ser confundido com o servidor de desenvolvimento. O `dev`
serve para programar; o `build` prepara arquivos otimizados; o `preview` simula
o servidor desses arquivos localmente.

## 6. O que é deploy?

Deploy é disponibilizar a aplicação para que outras pessoas possam acessá-la
por uma URL pública.

Para este projeto, o fluxo é:

```text
código no GitHub
    ↓
provedor executa npm run build
    ↓
arquivos da pasta dist/
    ↓
site público
```

Como esta aplicação é frontend, não temos um servidor próprio nem um banco de
dados para publicar. A aplicação faz requisições diretamente para a Kitsu API
no navegador.

## 7. Publicando uma aplicação Vite

Serviços de hospedagem de frontend normalmente precisam saber:

```text
comando de instalação: npm install
comando de build:      npm run build
diretório de saída:    dist
```

O nome do provedor pode mudar, mas esses três conceitos continuam os mesmos.

Uma sequência genérica é:

1. Enviar o projeto para um repositório no GitHub.
2. Conectar o repositório a um serviço de hospedagem frontend.
3. Informar `npm run build` como comando de build.
4. Informar `dist` como diretório publicado.
5. Aguardar o build e abrir a URL gerada.

O minicurso apresenta o conceito de deploy. A configuração específica de um
provedor pode ser estudada como próximo passo.

## 8. Atenção com rotas no deploy

A aplicação usa React Router e possui uma rota dinâmica:

```text
/anime/:id
```

Durante a navegação interna, o Router funciona no navegador. Porém, quando uma
pessoa acessa diretamente:

```text
https://dominio.com/anime/1
```

O servidor de hospedagem pode procurar um arquivo físico chamado `anime/1`.
Esse arquivo não existe, porque a rota é criada pelo React.

Por isso, hospedagens de aplicações SPA precisam de uma regra de fallback:

```text
qualquer rota desconhecida → index.html
```

Essa regra permite que o React Router receba a URL e escolha o componente.

O detalhe exato depende do serviço de hospedagem. A ideia importante é:

```text
rotas do React não são arquivos físicos
```

## 9. Próximos passos

Depois do minicurso, o projeto pode evoluir com:

- React Router mais avançado;
- rota de erro para páginas inexistentes;
- parâmetros de busca na URL;
- favoritos salvos no navegador;
- testes de componentes;
- estados de loading como componentes reutilizáveis;
- tradução dos status da Kitsu;
- tratamento de cancelamento de requisições;
- melhorias de acessibilidade;
- deploy completo com um provedor escolhido.

Essas ideias são possibilidades futuras. Elas não fazem parte da implementação
final deste minicurso.

## Checklist da aula

- [ ] Entendo o caminho do clique até a rota de detalhes.
- [ ] Sei diferenciar `useNavigate` e `useParams`.
- [ ] Sei onde ficam páginas, componentes, services e tipos.
- [ ] Executei `npm run lint`.
- [ ] Executei `npm run build`.
- [ ] Testei a aplicação com `npm run preview`.
- [ ] Entendo que `dist` é o resultado publicado.
- [ ] Entendo que uma SPA precisa de fallback para rotas diretas.
- [ ] Sei quais melhorias podem ser estudadas depois.

## Resumo

Na Aula 2 conectamos a seleção de um card a uma rota dinâmica, usamos o ID da
URL para buscar detalhes, tratamos loading e erro e organizamos a aplicação
para uma possível publicação.

O projeto termina pequeno de propósito, mas já demonstra um fluxo completo de
uma aplicação React: dados externos, transformação, componentes, estados,
busca, paginação, navegação e detalhes.

---

**GitHub:** https://github.com/IsaqueTADS<br>
**LinkedIn:** https://www.linkedin.com/in/isaque-rodriguestads<br>
**Portfólio:** https://portfolio.isaque.dev.br/
