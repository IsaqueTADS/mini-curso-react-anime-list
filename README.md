# React com Vite na Prática: Lista de Animes

Aplicação desenvolvida no minicurso **React com Vite na Prática: Construindo uma
Aplicação de Listagem e Detalhes de Animes**, realizado no IFNMG.

O projeto consome a [Kitsu API](https://kitsu.io/api/edge) e demonstra, em uma
aplicação pequena, como organizar uma interface React com TypeScript, busca,
paginação, navegação e tela de detalhes.

O código na raiz representa o resultado completo do minicurso. As apostilas
explicam a evolução da aplicação passo a passo, partindo dos fundamentos até a
revisão e a preparação para deploy.

## Funcionalidades

- Lista de animes obtida da Kitsu API.
- Busca de animes por texto.
- Paginação com 15 resultados por página.
- Cards clicáveis para selecionar um anime.
- Rota dinâmica de detalhes em `/anime/:id`.
- Exibição de pôster, título, nota, tipo, status, episódios, lançamento e
  sinopse.
- Estados visuais de carregamento, erro e lista vazia.
- Layout responsivo com Tailwind CSS.

## Minicurso

- **Apresentador:** Isaque Rodrigues Alves
- **Marca:** isaqueTADS
- **Instituição:** IFNMG — Instituto Federal do Norte de Minas Gerais
- **Datas:** 28 e 29 de setembro de 2026
- **Carga horária:** 2 horas, divididas em duas aulas de aproximadamente 1 hora
- **Público:** pessoas iniciantes em React

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router
- ESLint
- Kitsu API

## Requisitos

- Node.js instalado.
- npm instalado.
- Acesso à internet para consultar a Kitsu API.

Confira as versões disponíveis no ambiente:

```bash
node --version
npm --version
```

## Executar o projeto

Clone o repositório e entre na pasta do projeto:

```bash
git clone https://github.com/IsaqueTADS/mini-curso-react-anime-list.git
cd mini-curso-react-anime-list
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local para abrir a aplicação. Durante o
desenvolvimento, o navegador será atualizado automaticamente quando os arquivos
forem alterados.

## Scripts disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite |
| `npm run lint` | Executa o ESLint |
| `npm run build` | Verifica o TypeScript e gera o build de produção |
| `npm run preview` | Serve localmente o build gerado |

Para testar o resultado de produção localmente:

```bash
npm run build
npm run preview
```

O build é gerado na pasta `dist/`.

## Estrutura do projeto

```text
.
├── lessons/
│   ├── aula-1/
│   └── aula-2/
├── src/
│   ├── components/
│   │   ├── anime-card.tsx
│   │   ├── empty-state.tsx
│   │   ├── loading-grid.tsx
│   │   ├── pagination.tsx
│   │   └── search-bar.tsx
│   ├── pages/
│   │   ├── anime-details.tsx
│   │   └── anime-list.tsx
│   ├── services/
│   │   └── anime.ts
│   ├── types/
│   │   ├── anime.ts
│   │   └── kitsu.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### Responsabilidade das pastas

| Pasta ou arquivo | Responsabilidade |
| --- | --- |
| `src/components` | Componentes reutilizáveis da interface |
| `src/pages` | Telas completas da aplicação |
| `src/services` | Requisições para a Kitsu e transformação dos dados |
| `src/types` | Tipos da API externa e modelo de domínio |
| `src/App.tsx` | Configuração das rotas |
| `src/index.css` | Tailwind CSS e tema visual global |
| `src/main.tsx` | Ponto de entrada que monta o React |
| `lessons` | Apostilas e roteiro didático do minicurso |

## Rotas

| Rota | Tela | Descrição |
| --- | --- | --- |
| `/` | `AnimeList` | Lista, busca e paginação de animes |
| `/anime/:id` | `AnimeDetails` | Detalhes do anime identificado pelo `id` |

## Integração com a Kitsu API

As requisições são feitas diretamente no navegador, sem necessidade de variáveis
de ambiente ou de um backend próprio.

| Recurso | Endpoint | Uso |
| --- | --- | --- |
| Lista | `GET /anime` | Carrega os animes |
| Busca | `GET /anime?filter[text]=termo` | Filtra por texto |
| Paginação | `page[limit]` e `page[offset]` | Controla os resultados exibidos |
| Detalhes | `GET /anime/{id}` | Carrega um anime específico |

O projeto usa `page[limit]=15`. O `page[offset]` é calculado no service a partir
da página atual. A resposta da API é convertida pelo mapper em um modelo menor,
definido em `src/types/anime.ts`, antes de chegar aos componentes React.

Fluxo resumido:

```text
Kitsu API
    ↓
src/types/kitsu.ts
    ↓
src/services/anime.ts
    ↓ mapper
src/types/anime.ts
    ↓
pages e components
```

## Apostilas e roteiro das aulas

Leia as apostilas na ordem. Elas foram escritas para explicar as decisões do
projeto, mesmo que a versão disponível na raiz já contenha a implementação
completa.

### Aula 1 — Fundamentos e tela de listagem

1. [Introdução ao React](lessons/aula-1/01-introducao-ao-react.md): JSX,
   componentes, props, estado, hooks e `useEffect`.
2. [Kitsu API e tipos](lessons/aula-1/02-kitsu-api.md): API HTTP, JSON:API,
   contratos TypeScript e modelo de domínio.
3. [Estrutura da aplicação](lessons/aula-1/03-estrutura-do-app.md): Vite,
   Tailwind CSS, React Router e organização das pastas.
4. [Services e mapper](lessons/aula-1/04-services.md): `fetch`, parâmetros,
   tratamento de resposta e transformação dos dados.
5. [Construindo a AnimeList](lessons/aula-1/05-anime-list.md): componentes,
   busca, callbacks e estados de carregamento, erro e lista vazia.
6. [Criando a paginação](lessons/aula-1/06-paginacao.md): `AnimeListResult`,
   página atual, total de resultados e componente `Pagination`.

### Aula 2 — Navegação, detalhes e deploy

1. [Navegação e rota de detalhes](lessons/aula-2/01-navegacao-e-rota-de-detalhes.md):
   `useNavigate`, `useParams` e rota dinâmica.
2. [Tela de detalhes](lessons/aula-2/02-tela-de-detalhes.md): requisição por
   ID, loading, erro e apresentação dos dados.
3. [Revisão e deploy](lessons/aula-2/03-revisao-e-deploy.md): fluxo completo,
   build, publicação e fallback para rotas de uma SPA.

## Build e deploy

Para gerar os arquivos otimizados:

```bash
npm run build
```

Ao configurar uma hospedagem de frontend, os valores principais são:

```text
Comando de instalação: npm install
Comando de build:      npm run build
Diretório de saída:    dist
```

Como a aplicação usa React Router, a hospedagem precisa redirecionar rotas que
não correspondem a arquivos físicos para `index.html`. Essa configuração é
necessária para que um acesso direto a `/anime/1` seja tratado pelo Router.

## Possíveis evoluções

- Adicionar uma rota para páginas inexistentes.
- Sincronizar busca e paginação com a URL.
- Criar favoritos persistidos no navegador.
- Adicionar testes de componentes.
- Traduzir os status retornados pela Kitsu.
- Cancelar requisições antigas durante buscas consecutivas.
- Melhorar acessibilidade e tratamento de imagens.

## Links

- [Kitsu API](https://kitsu.io/api/edge)
- [GitHub — IsaqueTADS](https://github.com/IsaqueTADS)
- [LinkedIn — Isaque Rodrigues Alves](https://www.linkedin.com/in/isaque-rodriguestads)
- [Portfólio — isaque.dev.br](https://portfolio.isaque.dev.br/)
