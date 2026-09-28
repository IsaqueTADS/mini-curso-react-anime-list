# Apostila 05 - Construindo a AnimeList

**Minicurso:** React com Vite na Prática: Construindo uma Aplicação de Listagem e Detalhes de Animes  
**Módulo:** Dia 1 - Lista de animes, componentes, busca e estados da interface  
**Autor e apresentador:** Isaque Rodrigues Alves  
**Instituição:** IFNMG - Instituto Federal do Norte de Minas Gerais

---

## Sumário

- [O objetivo desta etapa](#o-objetivo-desta-etapa)
- [1. Substituindo a mensagem inicial](#1-substituindo-a-mensagem-inicial)
- [2. Os estados da tela](#2-os-estados-da-tela)
- [3. Criando `fetchAnimeList`](#3-criando-fetchanimelist)
- [4. Carregamento inicial com `useEffect`](#4-carregamento-inicial-com-useeffect)
- [5. Primeira versão: mostrar somente os títulos](#5-primeira-versão-mostrar-somente-os-títulos)
- [6. Surge a necessidade do `AnimeCard`](#6-surge-a-necessidade-do-animecard)
- [7. Surge a necessidade do `SearchBar`](#7-surge-a-necessidade-do-searchbar)
- [8. Surge a necessidade de estados visuais](#8-surge-a-necessidade-de-estados-visuais)
- [9. Ligando os componentes na `AnimeList`](#9-ligando-os-componentes-na-animelist)
- [10. Arquivo completo antes da paginação](#10-arquivo-completo-antes-da-paginação)
- [11. O fluxo da tela](#11-o-fluxo-da-tela)
- [12. O que ainda falta?](#12-o-que-ainda-falta)
- [13. Exercícios](#13-exercícios)
- [Checklist da etapa](#checklist-da-etapa)
- [Resumo](#resumo)

## O objetivo desta etapa

Até aqui já temos:

- um template React funcionando;
- tipos que representam a Kitsu;
- um modelo `Anime` da nossa aplicação;
- as funções de service;
- a função `mapearAnime`.

Agora vamos substituir a mensagem inicial da página pela primeira versão da
aplicação.

A tela evoluirá por necessidade:

```text
mensagem inicial
    ↓
requisição para a API
    ↓
lista de títulos
    ↓
card reutilizável
    ↓
campo de busca
    ↓
estado de carregamento
    ↓
estado de erro e estado vazio
```

Esta apostila termina antes da paginação. A paginação será construída na
apostila 06.

## 1. Substituindo a mensagem inicial

O template começa com:

```tsx
export function AnimeList() {
  return <h1>Minha lista de animes</h1>
}
```

Esse componente já é renderizado pelo `App.tsx` na rota `/`. Portanto, não
precisamos alterar o Router para começar a construir a tela.

O primeiro passo é importar o service e o tipo do nosso domínio:

```tsx
import { getAnimeList } from '../services/anime'
import type { Anime } from '../types/anime'
```

O componente chama o service, mas não conhece a URL da Kitsu. Essa é a
separação que construímos na apostila 04.

## 2. Os estados da tela

Uma tela que depende de uma requisição precisa representar pelo menos três
situações:

```text
carregando
    ↓
sucesso com itens
    ↓
sucesso sem itens

ou

carregando
    ↓
erro
```

Vamos começar com estes estados:

```tsx
const [animes, setAnimes] = React.useState<Anime[] | null>(null)
const [loading, setLoading] = React.useState(true)
const [error, setError] = React.useState(false)
```

### `animes`

O tipo `Anime[] | null` comunica duas situações:

- ainda não recebemos a lista: `null`;
- já recebemos uma lista, que pode ter itens ou estar vazia: `Anime[]`.

### `loading`

Começa como `true` porque, ao montar a página, a primeira requisição ainda será
realizada.

### `error`

Começa como `false`. Se a requisição falhar, mudamos para `true` e mostramos uma
mensagem adequada.

## 3. Criando `fetchAnimeList`

A função será responsável por coordenar a chamada e atualizar os estados:

```tsx
async function fetchAnimeList(query?: string) {
  try {
    setLoading(true)
    setError(false)
    const animes = await getAnimeList(query)

    setAnimes(animes)
  } catch {
    setError(true)
  } finally {
    setLoading(false)
  }
}
```

### O `try`

Antes da chamada:

```tsx
setLoading(true)
setError(false)
```

Isso permite que uma nova busca volte a mostrar o carregamento e limpe um erro
anterior.

Depois chamamos o service:

```tsx
const animes = await getAnimeList(query)
setAnimes(animes)
```

O valor devolvido pelo service já é `Anime[]`, porque o mapper foi executado na
camada de services.

### O `catch`

Se o `fetch` falhar ou o service lançar um erro por causa de uma resposta HTTP
inválida, chegamos ao `catch`:

```tsx
catch {
  setError(true)
}
```

O componente decide como apresentar o erro. O service não precisa conhecer
elementos visuais.

### O `finally`

O `finally` roda tanto quando há sucesso quanto quando há erro:

```tsx
finally {
  setLoading(false)
}
```

Assim o indicador de carregamento não fica preso na tela.

## 4. Carregamento inicial com `useEffect`

Queremos buscar os animes quando a tela for montada:

```tsx
React.useEffect(() => {
  async function loadAnime() {
    await fetchAnimeList()
  }

  loadAnime()
}, [])
```

Por que criamos `loadAnime` dentro do efeito? Porque a função passada para
`useEffect` não deve ser `async` diretamente. Criamos uma função assíncrona
interna e a chamamos.

O array vazio indica que o carregamento inicial deve acontecer uma vez por
montagem do componente.

## 5. Primeira versão: mostrar somente os títulos

Antes de criar um card, podemos verificar se os dados chegaram mostrando os
títulos:

```tsx
<div>
  {animes?.map((anime) => (
    <p key={anime.id}>{anime.title}</p>
  ))}
</div>
```

O operador `?.` evita executar o `.map()` enquanto `animes` ainda é `null`.

O `key` identifica cada item para o React. O ID da API é uma boa escolha porque
é específico para cada anime.

Essa versão prova que a requisição e o mapper estão funcionando, mas ainda não
é uma interface agradável.

## 6. Surge a necessidade do `AnimeCard`

Agora temos uma decisão de design. Se toda a marcação do card ficar dentro do
`.map()`, a página ficará difícil de ler:

```tsx
{animes?.map((anime) => (
  <button className="...">
    <img src={anime.image || ''} alt={anime.title} />
    <span>{anime.title}</span>
    {/* mais regras visuais */}
  </button>
))}
```

O card tem uma responsabilidade própria: apresentar um anime. Vamos extrair
essa responsabilidade para:

```text
src/components/anime-card.tsx
```

Crie a pasta `components` e o arquivo com o conteúdo abaixo:

```tsx
import type { Anime } from '../types/anime'

interface AnimeCardProps {
  anime: Anime
  onSelect: (id: string) => void
}

export function AnimeCard({ anime, onSelect }: AnimeCardProps) {
  return (
    <button
      onClick={() => onSelect(anime.id)}
      className="group relative aspect-2/3 w-full overflow-hidden rounded-lg border border-border bg-card text-left transition hover:border-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <img
        src={anime.image || ''}
        alt={anime.title}
        loading="lazy"
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-3">
        {anime.rating !== null && (
          <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            ★ {anime.rating.toFixed(1)}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
          {anime.title}
        </h3>
        {anime.subtype && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {anime.subtype}
          </p>
        )}
      </div>
    </button>
  )
}
```

### O que o card recebe?

```ts
interface AnimeCardProps {
  anime: Anime
  onSelect: (id: string) => void
}
```

- `anime`: os dados que serão apresentados;
- `onSelect`: uma função que recebe o ID quando o usuário clica.

Ainda não temos a segunda rota de detalhes. Por isso, na Aula 1, o pai pode
usar uma função temporária. Na Aula 2, essa mesma prop será ligada à navegação.

O componente filho não decide o que acontece depois do clique. Ele apenas
avisa:

```text
AnimeCard → "o usuário clicou no anime 1"
AnimeList → decide o que fazer com o ID 1
```

## 7. Surge a necessidade do `SearchBar`

Com os cards aparecendo, queremos filtrar os resultados. A busca terá estado
próprio porque o valor digitado pertence ao formulário.

Arquivo: `src/components/search-bar.tsx`

```tsx
import { useState } from 'react'
import type { FormEvent } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (value.trim() === '') return

    onSearch(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Buscar por nome do anime..."
        className="w-full rounded-md border border-input bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <button
        type="submit"
        className="shrink-0 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Buscar
      </button>
    </form>
  )
}
```

### O formulário não recarrega a página

Formulários HTML normalmente recarregam a página ao enviar. O React intercepta
esse comportamento:

```tsx
function handleSubmit(event: FormEvent) {
  event.preventDefault()
```

Assim conseguimos chamar a API sem perder o estado atual da aplicação.

### Input controlado

O valor do campo vem do estado:

```tsx
value={value}
onChange={(event) => setValue(event.target.value)}
```

Esse padrão é chamado de input controlado. O React sabe o valor atual e recebe
cada alteração do usuário.

### Callback de busca

O `SearchBar` não chama a Kitsu diretamente. Ele apenas envia o texto para o
componente pai:

```tsx
onSearch(value.trim())
```

O `AnimeList` decide chamar `fetchAnimeList`.

## 8. Surge a necessidade de estados visuais

Enquanto a requisição está acontecendo, a grade ainda não possui dados. Um
estado de carregamento ajuda o usuário a entender que a aplicação está
trabalhando.

Arquivo: `src/components/loading-grid.tsx`

```tsx
export function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 15 }).map((_, index) => (
        <div
          key={index}
          className="aspect-2/3 w-full animate-pulse rounded-lg bg-muted"
        />
      ))}
    </div>
  )
}
```

Para erros e listas vazias, vamos reutilizar um componente pequeno:

Arquivo: `src/components/empty-state.tsx`

```tsx
interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-20 text-center">
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
```

O componente recebe textos por props e não precisa saber se está sendo usado
para um erro ou para uma busca sem resultado.

## 9. Ligando os componentes na `AnimeList`

Agora a página importa os componentes:

```tsx
import { AnimeCard } from '../components/anime-card'
import { SearchBar } from '../components/search-bar'
import { EmptyState } from '../components/empty-state'
import { LoadingGrid } from '../components/loading-grid'
```

Para a busca, criamos uma função que passa o texto ao service:

```tsx
function handleSearch(query: string) {
  fetchAnimeList(query)
}
```

O `SearchBar` recebe essa função:

```tsx
<SearchBar onSearch={handleSearch} />
```

Para o card, criamos uma função temporária. Ela apenas mostra no console qual
anime foi selecionado. A navegação será implementada na Aula 2:

```tsx
function handleSelect(id: string) {
  console.log('Anime selecionado:', id)
}
```

## 10. Arquivo completo antes da paginação

O arquivo `src/pages/anime-list.tsx` fica assim ao final desta apostila:

```tsx
import React from 'react'
import { getAnimeList } from '../services/anime'
import type { Anime } from '../types/anime'
import { AnimeCard } from '../components/anime-card'
import { SearchBar } from '../components/search-bar'
import { EmptyState } from '../components/empty-state'
import { LoadingGrid } from '../components/loading-grid'

export function AnimeList() {
  const [animes, setAnimes] = React.useState<Anime[] | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  async function fetchAnimeList(query?: string) {
    try {
      setLoading(true)
      setError(false)
      const animes = await getAnimeList(query)

      setAnimes(animes)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    async function loadAnime() {
      await fetchAnimeList()
    }

    loadAnime()
  }, [])

  function handleSearch(query: string) {
    fetchAnimeList(query)
  }

  function handleSelect(id: string) {
    console.log('Anime selecionado:', id)
  }

  if (!animes) return null

  return (
    <div className="flex w-full flex-col gap-8 px-6 py-10">
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Encontre seu próximo anime
        </h1>

        <p className="max-w-lg text-sm text-muted-foreground">
          Pesquise por títulos, explore diferentes animes e descubra o que
          assistir a seguir.
        </p>

        <SearchBar onSearch={handleSearch} />
      </section>

      {loading && <LoadingGrid />}

      {!loading && error && (
        <EmptyState
          title="Não foi possível buscar agora"
          description="A Kitsu API pode estar sem resposta no momento. Tente buscar novamente em alguns segundos."
        />
      )}

      {!loading && !error && animes.length === 0 && (
        <EmptyState
          title="Nenhum anime encontrado"
          description="Tente buscar por outro nome."
        />
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {animes.map((anime) => (
          <AnimeCard
            key={anime.id}
            anime={anime}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  )
}
```

### Atenção ao `key`

O `key` fica no componente usado diretamente dentro do `.map()`:

```tsx
{animes.map((anime) => (
  <AnimeCard key={anime.id} anime={anime} onSelect={handleSelect} />
))}
```

Ele não deve ser colocado dentro do `AnimeCard`, porque é a lista que precisa
identificar os seus filhos.

### Atenção ao estado inicial

Nesta versão, `animes` começa como `null` e a página retorna `null` até a
primeira resposta chegar. Depois que a primeira lista é carregada, os estados
de loading, erro e lista vazia aparecem normalmente durante novas buscas.

Uma melhoria possível seria mostrar o `LoadingGrid` também na primeira carga,
em vez de retornar `null`. Essa melhoria pode ser feita como exercício sem
mudar a ideia principal da aula.

## 11. O fluxo da tela

```text
AnimeList monta
    ↓
useEffect chama fetchAnimeList()
    ↓
setLoading(true)
    ↓
getAnimeList chama a Kitsu
    ↓
mapper transforma cada recurso em Anime
    ↓
setAnimes atualiza o estado
    ↓
React renderiza os AnimeCards
```

Quando o usuário pesquisa:

```text
usuário envia o formulário
    ↓
SearchBar chama onSearch(query)
    ↓
AnimeList chama fetchAnimeList(query)
    ↓
service envia filter[text]
    ↓
lista é substituída pelos resultados da busca
```

## 12. O que ainda falta?

Ao final desta etapa já conseguimos:

- carregar a primeira lista;
- mostrar cards;
- pesquisar por texto;
- exibir loading;
- exibir erro;
- exibir estado vazio.

Ainda falta controlar páginas. Neste momento, o service já recebe um argumento
`page`, mas a `AnimeList` sempre chama `getAnimeList(query)` sem controlar esse
valor.

Na próxima apostila vamos fazer surgir uma nova necessidade: a API possui mais
resultados do que os 15 mostrados na tela. Então precisaremos guardar página e
total, adaptar o retorno do service e criar o componente `Pagination`.

## 13. Exercícios

1. Altere o texto do título principal.
2. Mostre `anime.episodes` no card quando o valor não for `null`.
3. Mostre `anime.status` em uma pequena etiqueta.
4. Faça a busca aceitar texto vazio para voltar à lista inicial.
5. Troque temporariamente `handleSelect` para mostrar o ID com `alert` e
   depois restaure o `console.log`.
6. Melhore o primeiro carregamento para mostrar `LoadingGrid` imediatamente.

## Checklist da etapa

- [ ] Substituí a mensagem inicial da `AnimeList`.
- [ ] Criei a pasta `src/components`.
- [ ] Criei `AnimeCard`.
- [ ] Criei `SearchBar`.
- [ ] Criei `LoadingGrid`.
- [ ] Criei `EmptyState`.
- [ ] Entendi o fluxo de props e callbacks.
- [ ] Consigo explicar o `try/catch/finally` da busca.
- [ ] A busca por texto está funcionando.
- [ ] A aplicação ainda não possui paginação visual.

## Resumo

Começamos com uma mensagem simples e evoluímos a tela conforme surgiram
necessidades. A `AnimeList` coordena estado e dados. Os componentes menores
apresentam partes específicas da interface e recebem informações por props.

Essa separação deixa a próxima mudança mais fácil. Para adicionar paginação,
não precisaremos reescrever os cards ou a busca. Vamos apenas ampliar o estado
da página e criar mais um componente.

---

**GitHub:** https://github.com/IsaqueTADS  
**LinkedIn:** https://www.linkedin.com/in/isaque-rodriguestads  
**Portfólio:** https://portfolio.isaque.dev.br/
