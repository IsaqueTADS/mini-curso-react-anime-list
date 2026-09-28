# Apostila 01 - Introdução ao React

**Minicurso:** React com Vite na Prática: Construindo uma Aplicação de Listagem e Detalhes de Animes  
**Módulo:** Dia 1 - Fundamentos de React + Tela de Listagem  
**Autor e apresentador:** Isaque Rodrigues Alves  
**Instituição:** IFNMG - Instituto Federal do Norte de Minas Gerais

---

## Sumário

- [Como usar esta apostila](#como-usar-esta-apostila)
- [1. O que é React?](#1-o-que-é-react)
- [2. Um pouco da história](#2-um-pouco-da-história)
- [3. Biblioteca ou framework?](#3-biblioteca-ou-framework)
- [4. JSX](#4-jsx)
- [5. Componentes](#5-componentes)
- [6. Props](#6-props)
- [7. Estado](#7-estado)
- [8. O `useState`](#8-o-usestate)
- [9. O `useEffect`](#9-o-useeffect)
- [10. Visão rápida dos principais hooks](#10-visão-rápida-dos-principais-hooks)
- [11. Regras dos hooks](#11-regras-dos-hooks)
- [12. O que vamos usar no minicurso](#12-o-que-vamos-usar-no-minicurso)
- [13. Checklist da etapa](#13-checklist-da-etapa)
- [Resumo](#resumo)

## Como usar esta apostila

Esta é a primeira etapa da construção do projeto. Antes de criar arquivos,
vamos entender as ideias que serão usadas nas próximas apostilas.

O objetivo não é aprender todos os detalhes do React em uma hora. O objetivo é
criar um mapa mental para que cada decisão do projeto faça sentido quando o
código começar a crescer.

Ao final desta apostila, você deverá conseguir explicar:

- o que é React;
- a diferença entre biblioteca e framework;
- para que servem JSX, componentes e props;
- o que é estado;
- por que usamos hooks;
- o papel de `useState` e `useEffect` neste projeto.

## 1. O que é React?

React é uma biblioteca JavaScript para construir interfaces de usuário por
meio de componentes reutilizáveis.

Em vez de escrever uma página inteira como um bloco único de HTML, dividimos a
interface em partes menores:

```text
Aplicação
├── Cabeçalho
├── Barra de busca
├── Grade de animes
│   └── Card de anime
└── Paginação
```

Cada parte pode ter sua própria responsabilidade, propriedades e estado.

No nosso projeto teremos componentes como:

```text
AnimeList
├── SearchBar
├── LoadingGrid
├── EmptyState
├── AnimeCard
└── Pagination
```

Esse modelo facilita a leitura e permite reutilizar uma parte da interface em
outros lugares.

## 2. Um pouco da história

O React foi criado no Facebook para resolver problemas de interfaces grandes e
interativas. Ele foi apresentado publicamente em 2013 e ganhou espaço porque
oferecia uma forma organizada de descrever como a interface deveria ficar a
partir dos dados atuais.

O conceito central continua sendo simples:

```text
dados atuais + componentes = interface atual
```

Em 2019, a versão 16.8 introduziu os Hooks. Com eles, componentes escritos
como funções passaram a conseguir utilizar estado, efeitos e outros recursos
que antes eram normalmente associados a classes.

O projeto deste minicurso utiliza React 19, conforme a dependência declarada no
`package.json`. Mesmo com versões novas, os fundamentos continuam sendo os
mesmos: componentes, props, estado, eventos e renderização.

## 3. Biblioteca ou framework?

Essa diferença aparece bastante em conversas sobre desenvolvimento web.

### Biblioteca

Uma biblioteca oferece ferramentas para resolver uma parte do problema. A
aplicação escolhe quando e como chamar essas ferramentas.

```text
Sua aplicação
    └── chama a biblioteca quando precisa
```

O React se concentra principalmente na construção da interface. Para outras
necessidades, como roteamento, chamadas HTTP ou validação de formulários, o
projeto pode escolher ferramentas complementares.

### Framework

Um framework costuma oferecer uma estrutura mais completa e define mais
convenções sobre como a aplicação deve ser organizada.

```text
Framework
    ├── define uma estrutura
    ├── oferece várias soluções integradas
    └── chama partes da sua aplicação em momentos definidos
```

Não existe uma opção universalmente melhor. A escolha depende do problema, do
time e do nível de convenção desejado.

### E o Vite?

Vite não é o framework da aplicação. Ele é uma ferramenta de desenvolvimento e
build.

No nosso projeto, o Vite oferece:

- servidor local para desenvolvimento;
- atualização rápida durante a edição, chamada HMR;
- transformação de TypeScript e JSX;
- processo de build para produção;
- integração com plugins, como o plugin do React e o plugin do Tailwind.

Podemos resumir assim:

```text
React  → constrói a interface
Vite   → executa, transforma e empacota o projeto
```

## 4. JSX

JSX é a sintaxe que permite escrever uma estrutura parecida com HTML dentro de
um arquivo JavaScript ou TypeScript.

```tsx
function Welcome() {
  return <h1>Bem-vindo ao catálogo de animes</h1>
}
```

O JSX não é HTML sendo executado diretamente pelo navegador. O Vite transforma
esse código em chamadas que o React entende.

### Expressões com chaves

Dentro do JSX usamos chaves para inserir valores e expressões JavaScript:

```tsx
interface GreetingProps {
  name: string
}

function Greeting({ name }: GreetingProps) {
  return <p>Olá, {name}!</p>
}
```

### `className` em vez de `class`

Como `class` é uma palavra com significado especial em JavaScript, no JSX
usamos `className`:

```tsx
function Title() {
  return <h1 className="text-3xl font-bold">Animes</h1>
}
```

No projeto, as classes do Tailwind serão usadas dessa forma em todos os
componentes.

## 5. Componentes

Um componente é uma função que retorna uma parte da interface.

```tsx
export function EmptyState() {
  return (
    <div>
      <p>Nenhum anime encontrado.</p>
    </div>
  )
}
```

Por convenção, o nome de um componente React começa com letra maiúscula. Isso
ajuda o React a diferenciar um componente de uma tag HTML:

```tsx
<EmptyState />
<div />
```

O componente pode ser pequeno, como um botão, ou representar uma tela inteira,
como `AnimeList`.

## 6. Props

Props são dados que um componente recebe do componente pai. Elas funcionam de
forma parecida com os parâmetros de uma função.

```tsx
interface AnimeCardProps {
  title: string
  image: string
}

export function AnimeCard({ title, image }: AnimeCardProps) {
  return (
    <article>
      <img src={image} alt={title} />
      <h2>{title}</h2>
    </article>
  )
}
```

Uso:

```tsx
<AnimeCard
  title="Cowboy Bebop"
  image="https://example.com/cowboy-bebop.jpg"
/>
```

O componente não precisa saber de onde os dados vieram. Ele apenas recebe as
props e desenha a interface.

Também podemos passar funções como props. Esse padrão será usado pelo
`SearchBar`, pelo `AnimeCard` e pelo `Pagination`:

```tsx
interface ButtonProps {
  onClick: () => void
}

function ActionButton({ onClick }: ButtonProps) {
  return <button onClick={onClick}>Executar</button>
}
```

Uma ideia importante para as próximas aulas:

```text
componente filho avisa por meio de uma função
componente pai decide o que fazer
```

## 7. Estado

Props vêm do pai. Estado pertence ao componente que precisa lembrar de alguma
coisa entre uma renderização e outra.

Exemplos de estado na nossa aplicação:

- lista de animes carregada;
- texto pesquisado;
- página atual;
- estado de carregamento;
- estado de erro.

Quando o estado muda, o React renderiza novamente a parte necessária da
interface.

## 8. O `useState`

`useState` cria uma informação que pode mudar durante a vida do componente.

```tsx
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Cliques: {count}
    </button>
  )
}
```

A declaração tem duas partes:

```tsx
const [valor, setValor] = useState(valorInicial)
```

- `valor` é o valor atual;
- `setValor` é a função usada para solicitar uma atualização;
- `valorInicial` é o valor usado na primeira renderização.

No `AnimeList`, teremos estados parecidos com estes:

```tsx
const [animes, setAnimes] = useState<Anime[] | null>(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(false)
```

## 9. O `useEffect`

`useEffect` é usado quando o componente precisa sincronizar algo com o mundo
externo à renderização. Exemplos:

- buscar dados em uma API;
- alterar o título da página;
- ouvir um evento do navegador;
- iniciar e limpar um timer.

Um exemplo simples:

```tsx
import { useEffect } from 'react'

useEffect(() => {
  document.title = 'Lista de animes'
}, [])
```

O array vazio significa que o efeito será iniciado depois da montagem do
componente. Na nossa aplicação, o carregamento inicial da lista será feito
dessa forma.

```tsx
useEffect(() => {
  async function loadAnime() {
    // chamada para o service
  }

  loadAnime()
}, [])
```

O `useEffect` não deve ser usado para qualquer cálculo comum. Se um valor puder
ser calculado diretamente durante a renderização, não precisamos de um efeito.

## 10. Visão rápida dos principais hooks

Hooks são funções especiais do React. Eles começam, por convenção, com `use`.

| Hook ou API | Uso principal | Será usado neste projeto? |
| --- | --- | --- |
| `useState` | Guardar estado local | Sim |
| `useEffect` | Sincronizar com API e efeitos externos | Sim |
| `useContext` | Ler dados compartilhados por um contexto | Não nesta versão |
| `useReducer` | Organizar transições de estados mais complexos | Não nesta versão |
| `useRef` | Guardar uma referência sem provocar renderização | Não nesta versão |
| `useMemo` | Memorizar um cálculo caro | Não precisamos dele |
| `useCallback` | Memorizar uma função | Não precisamos dele |
| `useId` | Gerar IDs acessíveis e estáveis | Não nesta versão |
| `useTransition` | Marcar uma atualização como não urgente | Conteúdo avançado |
| `useDeferredValue` | Adiar a atualização de um valor | Conteúdo avançado |
| `useOptimistic` | Mostrar uma atualização otimista | Conteúdo avançado |
| `useActionState` | Organizar o estado de uma ação assíncrona | Conteúdo avançado |
| `use` | Ler uma Promise ou Context durante a renderização | Conteúdo avançado |

Essa tabela não precisa ser decorada. Ela serve para reconhecer os nomes e
saber que cada hook resolve um tipo específico de problema.

### Hooks personalizados

Também podemos criar nossos próprios hooks combinando hooks existentes:

```tsx
function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}
```

Hooks personalizados também devem começar com `use` e seguir as regras dos
hooks.

## 11. Regras dos hooks

As duas regras mais importantes são:

1. Chame hooks apenas no topo do componente ou de um hook personalizado.
2. Não chame hooks dentro de `if`, `for`, `while`, funções internas ou blocos
   condicionais.

Errado:

```tsx
function Example({ enabled }: { enabled: boolean }) {
  if (enabled) {
    const [value, setValue] = useState(0)
  }

  return null
}
```

Correto:

```tsx
function Example({ enabled }: { enabled: boolean }) {
  const [value, setValue] = useState(0)

  if (!enabled) return null

  return <button onClick={() => setValue(value + 1)}>{value}</button>
}
```

O React precisa encontrar os hooks na mesma ordem em todas as renderizações.
Por isso a regra existe.

O projeto já possui `eslint-plugin-react-hooks`, que ajuda a identificar vários
erros relacionados a essas regras.

## 12. O que vamos usar no minicurso

O projeto foi pensado para duas horas e evita abstrações avançadas de
propósito. Na Aula 1 vamos trabalhar principalmente com:

```text
JSX
componentes
props
useState
useEffect
eventos
fetch
renderização de listas
```

Na Aula 2 vamos utilizar o estado da aplicação e o React Router para construir
a tela de detalhes.

Não precisamos adicionar Redux, Context API, React Query, memoização ou outras
camadas para resolver este projeto introdutório.

## 13. Checklist da etapa

- [ ] Consigo explicar a diferença entre React e Vite.
- [ ] Sei que um componente é uma função que retorna uma interface.
- [ ] Sei que props entram no componente vindas do pai.
- [ ] Sei que estado pode mudar e provocar uma nova renderização.
- [ ] Sei quando `useState` e `useEffect` serão usados.
- [ ] Sei que hooks não podem ser chamados dentro de condicionais.

## Resumo

React organiza a interface em componentes. Props permitem enviar dados e
funções para componentes filhos. O estado guarda informações que podem mudar.
Hooks dão acesso a recursos do React em componentes escritos como funções.

Nas próximas apostilas, esses conceitos serão aplicados em uma situação real:
buscar dados de uma API, transformar a resposta e exibir uma lista de animes.

---

**GitHub:** https://github.com/IsaqueTADS  
**LinkedIn:** https://www.linkedin.com/in/isaque-rodriguestads  
**Portfólio:** https://portfolio.isaque.dev.br/
