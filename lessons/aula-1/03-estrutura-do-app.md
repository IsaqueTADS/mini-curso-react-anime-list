# Apostila 03 - Estrutura da aplicação

**Minicurso:** React com Vite na Prática: Construindo uma Aplicação de Listagem e Detalhes de Animes  
**Módulo:** Dia 1 - Template, Vite, Tailwind CSS e React Router  
**Autor e apresentador:** Isaque Rodrigues Alves  
**Instituição:** IFNMG - Instituto Federal do Norte de Minas Gerais

---

## Sumário

- [Como esta etapa começa](#como-esta-etapa-começa)
- [1. Instalar e executar o template](#1-instalar-e-executar-o-template)
- [2. O que o Vite trouxe para o projeto](#2-o-que-o-vite-trouxe-para-o-projeto)
- [3. Como o React entra na página](#3-como-o-react-entra-na-página)
- [4. O `App.tsx` do template](#4-o-apptsx-do-template)
- [5. Como o React Router funciona](#5-como-o-react-router-funciona)
- [6. Parâmetros de rota](#6-parâmetros-de-rota)
- [7. Navegação programática](#7-navegação-programática)
- [8. O Tailwind CSS no projeto](#8-o-tailwind-css-no-projeto)
- [9. O plugin do Tailwind no Vite](#9-o-plugin-do-tailwind-no-vite)
- [10. Estrutura que construiremos](#10-estrutura-que-construiremos)
- [11. O que será criado em cada etapa](#11-o-que-será-criado-em-cada-etapa)
- [12. Checklist da etapa](#12-checklist-da-etapa)
- [Resumo](#resumo)

## Como esta etapa começa

Os alunos não começarão executando `npm create vite` durante a aula. Eles
receberão um template pronto no GitHub.

O template inicial terá esta parte do código:

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── pages/
│   └── anime-list.tsx
└── types/
    └── kitsu.ts
```

O restante da aplicação será criado ao longo das apostilas:

```text
src/components/
src/services/
src/types/anime.ts
```

O arquivo `src/pages/anime-list.tsx` começa apenas com uma mensagem para que o
template compile:

```tsx
export function AnimeList() {
  return <h1>Minha lista de animes</h1>
}
```

Nesta etapa não vamos criar a segunda rota de detalhes. O `App.tsx` terá
somente a rota `/`, e isso é intencional. A segunda rota será assunto da Aula 2.

## 1. Instalar e executar o template

Depois de baixar o projeto, o primeiro passo é instalar as dependências:

```bash
npm install
```

Depois iniciamos o servidor de desenvolvimento:

```bash
npm run dev
```

Os scripts reais estão em `package.json`:

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Verifica os tipos e gera o build de produção |
| `npm run lint` | Executa as regras do ESLint |
| `npm run preview` | Abre uma prévia do build de produção |

Durante a aula, o comando mais usado será:

```bash
npm run dev
```

O Vite observa os arquivos e atualiza o navegador rapidamente quando o código
muda. Esse comportamento é chamado de HMR, ou Hot Module Replacement.

## 2. O que o Vite trouxe para o projeto

O Vite é responsável pelo ambiente de desenvolvimento e pelo processo de
build. Ele não substitui o React.

Os principais arquivos de configuração são:

```text
index.html       ponto de entrada HTML
vite.config.ts   plugins e configuração do Vite
tsconfig.json    referências das configurações TypeScript
tsconfig.app.json configuração do código da aplicação
tsconfig.node.json configuração dos arquivos executados no Node
package.json     scripts e dependências
```

### `index.html`

O navegador começa pelo `index.html`:

```html
<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>anime-list</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

O elemento mais importante é:

```html
<div id="root"></div>
```

Ele é o espaço vazio que o React ocupará.

## 3. Como o React entra na página

O arquivo `src/main.tsx` conecta o React ao elemento `root`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

O fluxo é:

```text
index.html
    ↓
div#root
    ↓
createRoot(...)
    ↓
<App />
    ↓
restante da aplicação
```

### `StrictMode`

`StrictMode` ajuda a encontrar problemas durante o desenvolvimento. Em alguns
casos, efeitos podem ser executados mais de uma vez em desenvolvimento para
revelar código que não está preparado para limpeza ou repetição.

Isso não significa que a aplicação de produção fará necessariamente duas
requisições. Quando chegarmos ao `useEffect`, veremos esse comportamento com
mais calma.

## 4. O `App.tsx` do template

O template começa com o `App.tsx` montado:

```tsx
import { BrowserRouter, Route, Routes } from 'react-router'
import { AnimeList } from './pages/anime-list'

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-6xl m-auto">
        <Routes>
          <Route path="/" element={<AnimeList />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
```

Mesmo tendo apenas uma tela, o Router já está preparado para a evolução da
aplicação. A rota inicial aponta para o componente `AnimeList`.

Durante a Aula 1 não vamos adicionar outra rota. O `App.tsx` só será expandido
na Aula 2, quando a tela de detalhes for criada.

## 5. Como o React Router funciona

O React Router relaciona URLs a componentes.

```text
URL atual
    ↓
Routes procura uma rota compatível
    ↓
Route escolhe o element
    ↓
React renderiza o componente
```

### `BrowserRouter`

`BrowserRouter` cria um contexto de navegação para os componentes que estão
dentro dele. Esse contexto permite que os componentes consultem a URL atual e
solicitem mudanças de navegação sem precisarem receber todas essas informações
por props.

Por isso `Routes` e `Route` estão dentro de `BrowserRouter`.

### `Routes`

`Routes` observa as rotas declaradas e renderiza a que corresponde à URL atual.

### `Route`

Uma rota possui pelo menos:

- `path`: caminho da URL;
- `element`: componente que deve aparecer quando o caminho for encontrado.

No template:

```tsx
<Route path="/" element={<AnimeList />} />
```

Isso significa: quando a URL for a raiz, renderize `AnimeList`.

## 6. Parâmetros de rota

Uma rota também pode conter um parâmetro dinâmico. A ideia pode ser descrita
assim:

```text
/recurso/:id
```

O trecho `:id` não é o texto literal `id`. Ele é um espaço reservado. Quando a
URL for, por exemplo, `/recurso/42`, o valor do parâmetro será a string `42`.

Dentro do componente, o React Router oferece o hook `useParams` para ler esse
valor:

```tsx
const { id } = useParams()
```

Os parâmetros chegam como texto. Se uma função precisar de um número, devemos
fazer a conversão explicitamente:

```ts
const numericId = Number(id)
```

No nosso projeto, essa ideia será usada na Aula 2 para buscar os detalhes do
anime selecionado. Nesta Aula 1, não vamos escrever a rota de detalhes nem o
componente que lê o ID.

## 7. Navegação programática

Além de ler parâmetros, o Router possui um hook para solicitar uma navegação:

```tsx
const navigate = useNavigate()

navigate('/algum-caminho')
```

Também é possível voltar no histórico:

```tsx
navigate(-1)
```

Esses exemplos servem apenas para apresentar o conceito. A implementação da
navegação entre card, detalhes e botão voltar pertence à Aula 2.

## 8. O Tailwind CSS no projeto

O arquivo `src/index.css` já vem pronto no template:

```css
@import 'tailwindcss';

@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --color-background: #111319;
  --color-foreground: #f2f1ed;
  --color-primary: #e8b34c;
  --color-muted: #1d2029;
  --color-border: #262a35;
}
```

O `@import 'tailwindcss'` ativa o Tailwind CSS v4. O bloco `@theme` define
valores que podem ser usados como classes:

```tsx
<main className="bg-background text-foreground">
  <h1 className="text-3xl font-bold text-primary">Animes</h1>
</main>
```

Também há estilos base para o `body`, como cor de fundo, cor do texto e fonte.
Por isso os componentes da aula poderão usar classes sem criar arquivos CSS
individuais.

## 9. O plugin do Tailwind no Vite

O `vite.config.ts` liga os plugins do React e do Tailwind:

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

O plugin do React permite que o Vite processe JSX e facilite o desenvolvimento.
O plugin do Tailwind integra o Tailwind v4 ao processo do Vite.

## 10. Estrutura que construiremos

Ao final da Aula 1, a pasta `src` terá evoluído para algo parecido com isto:

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
│   └── anime-list.tsx
├── services/
│   └── anime.ts
└── types/
    ├── anime.ts
    └── kitsu.ts
```

Cada pasta terá uma responsabilidade simples:

| Pasta | Responsabilidade |
| --- | --- |
| `components` | Partes reutilizáveis da interface |
| `pages` | Telas da aplicação |
| `services` | Comunicação com APIs e regras de acesso a dados |
| `types` | Contratos e modelos TypeScript |

## 11. O que será criado em cada etapa

```text
Apostila 02 → src/types/anime.ts
Apostila 03 → entendimento do template e da rota inicial
Apostila 04 → src/services/anime.ts
Apostila 05 → components/ e implementação real da AnimeList
Apostila 06 → components/pagination.tsx e evolução da paginação
```

O aluno não precisa criar todas as pastas de uma vez. A estrutura cresce junto
com a necessidade do projeto.

## 12. Checklist da etapa

- [ ] Baixei o template.
- [ ] Executei `npm install`.
- [ ] Executei `npm run dev`.
- [ ] Entendi o caminho `index.html` → `main.tsx` → `App.tsx`.
- [ ] Identifiquei a rota `/` do template.
- [ ] Entendi o papel do `BrowserRouter`.
- [ ] Entendi que parâmetros como `:id` serão usados na Aula 2.
- [ ] Entendi que o `index.css` e o Tailwind já estão configurados.

## Resumo

O Vite oferece o ambiente de desenvolvimento e o build. O `main.tsx` conecta
o React ao `div#root`. O `App.tsx` organiza a entrada da aplicação e o
React Router relaciona URLs a componentes.

O template já possui a rota inicial e o estilo global. A partir da próxima
etapa, vamos criar as camadas que ainda não existem: types do domínio,
services e componentes.

---

**GitHub:** https://github.com/IsaqueTADS  
**LinkedIn:** https://www.linkedin.com/in/isaque-rodriguestads  
**Portfólio:** https://portfolio.isaque.dev.br/
