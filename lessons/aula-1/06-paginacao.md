# Apostila 06 - Criando a paginação

**Minicurso:** React com Vite na Prática: Construindo uma Aplicação de Listagem e Detalhes de Animes<br>
**Módulo:** Dia 1 - Paginação e fechamento da tela de listagem<br>
**Autor e apresentador:** Isaque Rodrigues Alves  
**Instituição:** IFNMG - Instituto Federal do Norte de Minas Gerais

---

## Sumário

- [Como esta etapa começa](#como-esta-etapa-começa)
- [1. O problema que apareceu](#1-o-problema-que-apareceu)
- [2. O contrato da Kitsu para paginação](#2-o-contrato-da-kitsu-para-paginação)
- [3. O ponto de partida da apostila 05](#3-o-ponto-de-partida-da-apostila-05)
- [4. Criando o resultado da listagem](#4-criando-o-resultado-da-listagem)
- [5. Atualizando o service](#5-atualizando-o-service)
- [6. Criando os estados da paginação](#6-criando-os-estados-da-paginação)
- [7. Atualizando `fetchAnimeList`](#7-atualizando-fetchanimelist)
- [8. Atualizando a carga inicial e a busca](#8-atualizando-a-carga-inicial-e-a-busca)
- [9. Criando `handlePageChange`](#9-criando-handlepagechange)
- [10. Calculando `totalPages`](#10-calculando-totalpages)
- [11. Criando o componente `Pagination`](#11-criando-o-componente-pagination)
- [12. Chamando `Pagination` dentro da `AnimeList`](#12-chamando-pagination-dentro-da-animelist)
- [13. Arquivos completos](#13-arquivos-completos)
- [14. Testando a funcionalidade](#14-testando-a-funcionalidade)
- [15. Erros comuns](#15-erros-comuns)
- [Checklist da etapa](#checklist-da-etapa)
- [Resultado da Aula 1](#resultado-da-aula-1)
- [Resumo](#resumo)

## Como esta etapa começa

Esta apostila começa exatamente no ponto em que a apostila 05 terminou.

Ao final da apostila 05, a aplicação já consegue:

- buscar os animes;
- exibir os cards;
- pesquisar por texto;
- mostrar carregamento;
- mostrar erro;
- mostrar uma mensagem quando não há resultados.

O service ainda devolve somente um array:

```ts
return data.data.map(mapearAnime)
```

E a `AnimeList` chama a primeira página sem guardar informações de paginação:

```tsx
const animes = await getAnimeList(query)
setAnimes(animes)
```

Durante esta apostila vamos evoluir esse contrato. Ao final, o service devolverá
os animes e informações adicionais, enquanto a `AnimeList` controlará a página
atual.

O resultado esperado será:

```text
busca atual + página atual
          ↓
service calcula o offset
          ↓
Kitsu devolve uma página de resultados
          ↓
AnimeList atualiza cards e total de páginas
          ↓
Pagination permite avançar ou voltar
```

## 1. O problema que apareceu

A Kitsu possui muitos animes, mas nossa aplicação solicita apenas 15 por vez.
Isso é bom para o desempenho, mas cria uma pergunta:

```text
Como o usuário chega aos próximos 15 animes?
```

Precisamos de três informações na tela:

```text
qual página está sendo exibida?
quantos resultados existem no total?
qual texto está sendo pesquisado?
```

Essas informações ainda não existem nos estados da `AnimeList` da apostila 05.
Por isso não podemos começar diretamente com esta linha:

```tsx
const totalPages = Math.ceil(total / PAGE_SIZE)
```

Antes dela precisamos criar `total`, importar `PAGE_SIZE` e controlar `page`.
Esta é a sequência que seguiremos.

## 2. O contrato da Kitsu para paginação

A Kitsu usa dois parâmetros:

```text
page[limit]  → quantidade de registros por resposta
page[offset] → posição inicial dos registros
```

O projeto usará 15 registros:

```http
GET /anime?page[limit]=15&page[offset]=0
```

A página seguinte será:

```http
GET /anime?page[limit]=15&page[offset]=15
```

A conversão é:

```ts
const offset = (page - 1) * PAGE_SIZE
```

| Página escolhida | Cálculo | Offset enviado |
| --- | --- | --- |
| 1 | `(1 - 1) * 15` | 0 |
| 2 | `(2 - 1) * 15` | 15 |
| 3 | `(3 - 1) * 15` | 30 |

Além de `data`, a Kitsu devolve informações que nos ajudam a montar a
paginação:

```json
{
  "data": [],
  "links": {
    "first": "...",
    "prev": "...",
    "next": "...",
    "last": "..."
  },
  "meta": {
    "count": 22466
  }
}
```

O campo que usaremos para calcular a quantidade de páginas é:

```ts
```

O `count` representa o total de resultados da busca atual. Se o usuário buscar
`naruto`, o total será o total de animes encontrados para `naruto`, e não o
total do catálogo inteiro.

## 3. O ponto de partida da apostila 05

Antes de continuar, confira se o arquivo `src/types/anime.ts` possui pelo menos
o modelo `Anime`:

```ts
export interface Anime {
  id: string
  title: string
  synopsis: string | null
  image: string | null
  rating: number | null
  episodes: number | null
  status: string
  subtype: string
  startDate: string | null
}
```

E confira se o service ainda retorna um array na versão anterior à paginação:

```ts
return data.data.map(mapearAnime)
```

Na `AnimeList`, o estado da apostila 05 é parecido com este:

```tsx
const [animes, setAnimes] = React.useState<Anime[] | null>(null)
const [loading, setLoading] = React.useState(true)
const [error, setError] = React.useState(false)
```

Se você já começou a alterar a paginação e o arquivo ficou com erros, não tente
corrigir apenas a linha que o TypeScript marcou. Siga as etapas abaixo na
ordem, pois cada etapa cria uma informação usada pela próxima.

## 4. Criando o resultado da listagem

O retorno antigo era apenas `Anime[]`. Agora precisamos transportar também o
total e as informações de navegação da API.

No final de `src/types/anime.ts`, adicione:

```ts
export interface AnimeListResult {
  animes: Anime[]
  total: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
```

O arquivo completo fica:

```ts
export interface Anime {
  id: string
  title: string
  synopsis: string | null
  image: string | null
  rating: number | null
  episodes: number | null
  status: string
  subtype: string
  startDate: string | null
}

export interface AnimeListResult {
  animes: Anime[]
  total: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
```

### Por que não devolver somente `Anime[]`?

Porque os cards precisam da lista, mas a paginação precisa de mais informações:

```text
Anime[]          → desenha os cards
total            → calcula totalPages
hasNextPage      → informa se existe próxima página
hasPreviousPage  → informa se existe página anterior
```

O objeto `AnimeListResult` representa o resultado completo de uma requisição de
listagem.

## 5. Atualizando o service

Agora o service precisa devolver um `AnimeListResult`.

### 5.1 Importar o novo tipo

Em `src/services/anime.ts`, altere:

```ts
import type { Anime } from '../types/anime'
```

Para:

```ts
import type { Anime, AnimeListResult } from '../types/anime'
```

### 5.2 Criar o tamanho da página

Depois da URL base, adicione:

```ts
export const PAGE_SIZE = 15
```

Esse valor será usado tanto pelo service quanto pela `AnimeList`. Exportá-lo
evita escrever o número 15 em vários lugares sem explicação.

### 5.3 Alterar o retorno de `getAnimeList`

A função deve continuar recebendo busca e página:

```ts
export async function getAnimeList(
  query: string = '',
  page: number = 1,
): Promise<AnimeListResult> {
```

O `page` é o número que o usuário escolheu. O service transforma esse número
em `offset`:

```ts
const limit = PAGE_SIZE
const offset = (page - 1) * limit
```

### 5.4 Alterar o `return`

Antes da paginação, o retorno era:

```ts
return data.data.map(mapearAnime)
```

Depois da paginação, o retorno passa a ser um objeto:

```ts
return {
  animes: data.data.map(mapearAnime),
  total: data.meta?.count ?? 0,
  hasNextPage: data.links?.next != null,
  hasPreviousPage: data.links?.prev != null,
}
```

O mapper continua sendo executado para cada item. A única diferença é que a
lista transformada agora vem acompanhada dos metadados.

### 5.5 O `try/catch`

O `try/catch` que já existe no service pode continuar exatamente como está:

```ts
try {
  // requisição
} catch (err) {
  console.log(err)
  throw err
}
```

Ele não é o responsável pela paginação. O importante nesta etapa é alterar o
contrato de retorno e enviar `page` para a API.

### 5.6 Arquivo completo do service

Para evitar misturar versões, o `src/services/anime.ts` completo fica assim:

```ts
import type { Anime, AnimeListResult } from '../types/anime'
import type {
  KitsuAnimeDetailsResponse,
  KitsuAnimeListResponse,
  KitsuAnimeResource,
} from '../types/kitsu'

const BASE_URL = 'https://kitsu.io/api/edge/anime'

export const PAGE_SIZE = 15

export async function getAnimeList(
  query: string = '',
  page: number = 1,
): Promise<AnimeListResult> {
  try {
    const limit = PAGE_SIZE
    const offset = (page - 1) * limit

    const params = new URLSearchParams({
      'page[limit]': String(limit),
      'page[offset]': String(offset),
    })

    if (query.trim()) {
      params.set('filter[text]', query.trim())
    }

    const response = await fetch(`${BASE_URL}?${params}`)

    if (!response.ok) {
      throw new Error('Erro ao buscar animes')
    }

    const data: KitsuAnimeListResponse = await response.json()

    return {
      animes: data.data.map(mapearAnime),
      total: data.meta?.count ?? 0,
      hasNextPage: data.links?.next != null,
      hasPreviousPage: data.links?.prev != null,
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getAnimeDetails(id: string): Promise<Anime> {
  const response = await fetch(`${BASE_URL}/${id}`)

  if (!response.ok) {
    throw new Error('Erro ao buscar detalhes do anime')
  }

  const data: KitsuAnimeDetailsResponse = await response.json()

  return mapearAnime(data.data)
}

function mapearAnime(anime: KitsuAnimeResource): Anime {
  return {
    id: anime.id,
    title: anime.attributes.canonicalTitle,
    synopsis: anime.attributes.description,
    image: anime.attributes.posterImage?.medium ?? null,
    rating: anime.attributes.averageRating
      ? Number(anime.attributes.averageRating) / 10
      : null,
    episodes: anime.attributes.episodeCount,
    status: anime.attributes.status,
    subtype: anime.attributes.subtype,
    startDate: anime.attributes.startDate,
  }
}
```

Neste momento, o service está pronto, mas a página ainda não está usando o
`total`. Vamos fazer essa ligação agora.

## 6. Criando os estados da paginação

Volte para `src/pages/anime-list.tsx`.

### 6.1 Atualizar os imports

Altere o import do service:

```tsx
import { getAnimeList, PAGE_SIZE } from '../services/anime'
```

Neste momento, não adicione ainda o import de `Pagination`. O arquivo do
componente será criado na seção 11. Depois que ele existir, adicionaremos o
import durante a integração com a `AnimeList`.

### 6.2 Adicionar os estados

Depois dos estados já existentes da apostila 05, adicione:

```tsx
const [query, setQuery] = React.useState('')
const [page, setPage] = React.useState(1)
const [total, setTotal] = React.useState(0)
```

Agora a `AnimeList` conhece:

| Estado | Responsabilidade |
| --- | --- |
| `query` | Busca que está sendo usada |
| `page` | Página exibida atualmente |
| `total` | Total de animes da busca atual |

O estado `total` começa com zero porque ainda não recebemos a resposta da API.
Depois da requisição, ele será atualizado com `result.total`.

## 7. Atualizando `fetchAnimeList`

A função da apostila 05 recebia apenas a busca:

```tsx
async function fetchAnimeList(query?: string)
```

Agora ela precisa receber duas informações obrigatórias:

```tsx
async function fetchAnimeList(
  query: string,
  page: number,
) {
```

O nome `query` representa o texto e `page` representa a página que será enviada
ao service.

Dentro da função, troque:

```tsx
const animes = await getAnimeList(query)

setAnimes(animes)
```

Por:

```tsx
const result = await getAnimeList(query, page)

setAnimes(result.animes)
setTotal(result.total)
```

O resultado agora é um objeto. Por isso não podemos mais tratá-lo como se fosse
diretamente um array.

## 8. Atualizando a carga inicial e a busca

Como `fetchAnimeList` agora precisa de dois argumentos, o efeito inicial também
precisa informar os valores iniciais:

```tsx
React.useEffect(() => {
  async function loadAnime() {
    await fetchAnimeList('', 1)
  }

  loadAnime()
}, [])
```

### 8.1 Criar `handleSearch`

Não devemos mais passar `fetchAnimeList` diretamente para o `SearchBar`, porque
a busca precisa resetar a página para 1.

Crie:

```tsx
function handleSearch(query: string) {
  setQuery(query)
  setPage(1)
  fetchAnimeList(query, 1)
}
```

Depois altere:

```tsx
<SearchBar onSearch={fetchAnimeList} />
```

Para:

```tsx
<SearchBar onSearch={handleSearch} />
```

### Por que resetar a página?

Imagine este fluxo:

```text
usuário está na página 8
usuário pesquisa "naruto"
```

Talvez a busca por `naruto` tenha apenas duas páginas. Se mantivermos a página
8, a API poderá devolver uma lista vazia. Toda busca nova começa na página 1.

## 9. Criando `handlePageChange`

Agora criamos a função que será chamada pelo componente `Pagination`:

```tsx
function handlePageChange(nextPage: number) {
  setPage(nextPage)
  fetchAnimeList(query, nextPage)
}
```

Ela faz duas coisas:

1. atualiza o número mostrado na tela;
2. busca a nova página mantendo a busca atual.

Se o usuário estiver pesquisando `naruto` e clicar na página 2, a chamada será:

```ts
getAnimeList('naruto', 2)
```

O filtro não pode ser perdido durante a navegação.

## 10. Calculando `totalPages`

Agora que `total` foi criado e atualizado pelo service, podemos calcular o
total de páginas.

Depois do bloco que garante que `animes` existe, adicione:

```tsx
const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
```

A fórmula é:

```text
totalPages = total de resultados / quantidade por página
```

Como o resultado pode ser quebrado, usamos `Math.ceil`:

```ts
Math.ceil(31 / 15) // 3
```

O `Math.max(1, ...)` impede que o valor seja zero quando uma busca não retornar
nenhum anime. O componente só será exibido quando existirem animes e mais de
uma página.

### Importante

Esta linha só funciona porque todas estas partes já existem:

```tsx
const [total, setTotal] = React.useState(0)
```

```tsx
import { getAnimeList, PAGE_SIZE } from '../services/anime'
```

```tsx
setTotal(result.total)
```

Não copie `totalPages` sozinho. Ele depende dessas três etapas.

## 11. Criando o componente `Pagination`

Agora crie o arquivo:

```text
src/components/pagination.tsx
```

Esse componente não faz requisição e não possui estado próprio. Ele recebe a
página atual, o total de páginas e uma função para avisar quando o usuário
clicar.

```tsx
interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-4">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:border-primary/60 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Anterior
      </button>

      <span className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </span>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:border-primary/60 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Próxima
      </button>
    </nav>
  )
}
```

### O que cada prop significa?

```tsx
page: number
```

Página atual. Esse valor pertence à `AnimeList`, não ao componente de
paginação.

```tsx
```

Total calculado a partir do `total` da API.

```tsx
onPageChange: (page: number) => void
```

Função que o componente chama para avisar qual página foi escolhida. O
`Pagination` não sabe como buscar dados e não precisa saber.

### Por que retornar `null`?

```tsx
if (totalPages <= 1) return null
```

Se existe apenas uma página, não há motivo para mostrar botões de navegação.
Em React, retornar `null` significa não renderizar nada.

### Por que usar `disabled`?

Na primeira página, o botão anterior fica desabilitado:

```tsx
```

Na última página, o botão próxima fica desabilitado:

```tsx
```

O componente visual usa `page` e `totalPages`. O service continua calculando o
`offset` com base na página recebida.

## 12. Chamando `Pagination` dentro da `AnimeList`

Agora que o arquivo `src/components/pagination.tsx` já foi criado, importe o
componente no início de `src/pages/anime-list.tsx`:

```tsx
import { Pagination } from '../components/pagination'
```

A paginação deve ficar fora do `.map()`. Ela é irmã da grade de cards:

```tsx
<>
  <div className="grid ...">
    {animes.map((anime) => (
      <AnimeCard key={anime.id} anime={anime} onSelect={handleSelect} />
    ))}
  </div>

  <Pagination
    page={page}
    totalPages={totalPages}
    onPageChange={handlePageChange}
  />
</>
```

Se colocarmos o `Pagination` dentro do `.map()`, ele será renderizado uma vez
para cada anime. A paginação deve aparecer uma única vez abaixo da lista.

## 13. Arquivos completos

Depois das alterações, estes são os arquivos principais da etapa.

### `src/types/anime.ts`

```ts
export interface Anime {
  id: string
  title: string
  synopsis: string | null
  image: string | null
  rating: number | null
  episodes: number | null
  status: string
  subtype: string
  startDate: string | null
}

export interface AnimeListResult {
  animes: Anime[]
  total: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
```

### `src/components/pagination.tsx`

```tsx
interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-4">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:border-primary/60 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Anterior
      </button>

      <span className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </span>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:border-primary/60 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Próxima
      </button>
    </nav>
  )
}
```

### `src/pages/anime-list.tsx`

```tsx
import React from 'react'
import { getAnimeList, PAGE_SIZE } from '../services/anime'
import type { Anime } from '../types/anime'
import { AnimeCard } from '../components/anime-card'
import { SearchBar } from '../components/search-bar'
import { EmptyState } from '../components/empty-state'
import { LoadingGrid } from '../components/loading-grid'
import { Pagination } from '../components/pagination'

export function AnimeList() {
  const [animes, setAnimes] = React.useState<Anime[] | null>(null)
  const [query, setQuery] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  async function fetchAnimeList(
    query: string,
    page: number,
  ) {
    try {
      setLoading(true)
      setError(false)
      const result = await getAnimeList(query, page)

      setAnimes(result.animes)
      setTotal(result.total)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    async function loadAnime() {
      await fetchAnimeList('', 1)
    }

    loadAnime()
  }, [])

  function handleSearch(query: string) {
    setQuery(query)
    setPage(1)
    fetchAnimeList(query, 1)
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage)
    fetchAnimeList(query, nextPage)
  }

  function handleSelect(id: string) {
    console.log('Anime selecionado:', id)
  }

  if (!animes) return null

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

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

      {!loading && !error && animes.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {animes.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}
```

## 14. Testando a funcionalidade

Depois de copiar os arquivos, execute:

```bash
npm run build
```

Se o build passar, inicie o projeto:

```bash
npm run dev
```

### Teste 1: primeira página

Ao abrir a aplicação, a requisição deve usar:

```text
page[limit]=15
page[offset]=0
```

### Teste 2: próxima página

Ao clicar em `Próxima`, a URL deve usar:

```text
page[offset]=15
```

Os cards devem mudar e o texto deve mostrar:

```text
Página 2 de algum número
```

### Teste 3: pesquisa

Pesquise por `naruto`. A requisição deve conter:

```text
filter[text]=naruto
page[offset]=0
```

A busca deve voltar para a página 1.

### Teste 4: pesquisa e paginação

Depois de pesquisar, clique em `Próxima`. A requisição deve manter os dois
parâmetros:

```text
filter[text]=naruto
page[offset]=15
```

### Teste 5: poucos resultados

Pesquise um termo que retorne poucos animes. Se houver apenas uma página, o
componente `Pagination` não deve aparecer.

### Teste 6: nenhum resultado

Pesquise um texto inexistente. A mensagem de estado vazio deve aparecer sem
exibir a paginação.

## 15. Erros comuns

### `Cannot find name 'total'`

Você usou `total` sem criar o estado:

```tsx
const [total, setTotal] = React.useState(0)
```

### `Cannot find name 'PAGE_SIZE'`

Você precisa importar a constante:

```tsx
import { getAnimeList, PAGE_SIZE } from '../services/anime'
```

### `Property 'animes' does not exist on type 'Anime[]'`

O componente está esperando um objeto, mas o service ainda retorna um array.
Atualize o `return` do service para `AnimeListResult`.

### A página sempre volta para a primeira

Confira se a função está enviando a página:

```tsx
getAnimeList(query, page)
```

E se o cálculo do service usa:

```ts
const offset = (page - 1) * PAGE_SIZE
```

### A busca desaparece ao trocar de página

Confira se o texto está guardado no estado:

```tsx
const [query, setQuery] = React.useState('')
```

E se a troca de página usa esse estado:

```tsx
fetchAnimeList(query, nextPage)
```

### `Cannot find module '../components/pagination'`

O arquivo ainda não foi criado. Crie exatamente:

```text
src/components/pagination.tsx
```

### A paginação aparece várias vezes

O componente foi colocado dentro do `.map()`. Ele deve ficar depois do fechamento
da grade, como irmão dos cards.

## Checklist da etapa

- [ ] Adicionei `AnimeListResult` em `src/types/anime.ts`.
- [ ] O service retorna `animes`, `total`, `hasNextPage` e `hasPreviousPage`.
- [ ] `PAGE_SIZE` está exportado pelo service.
- [ ] A `AnimeList` possui os estados `query`, `page` e `total`.
- [ ] `fetchAnimeList` recebe a busca e a página.
- [ ] A carga inicial chama a página 1.
- [ ] Uma nova busca reseta para a página 1.
- [ ] A troca de página mantém a busca atual.
- [ ] Criei `src/components/pagination.tsx`.
- [ ] Renderizei `Pagination` abaixo da grade.
- [ ] A API recebe o `offset` esperado.
- [ ] Executei `npm run build`.

## Resultado da Aula 1

Ao finalizar esta apostila, a aplicação possui:

```text
React
  ├── componentes
  ├── props
  ├── useState
  ├── useEffect
  ├── fetch
  ├── Kitsu API
  ├── mapper
  ├── busca
  └── paginação
```

A aplicação ainda não possui a segunda rota nem a tela de detalhes. Esses
recursos serão desenvolvidos na Aula 2, usando o `id` recebido pelo
`AnimeCard`, a função `getAnimeDetails` e o React Router.

## Resumo

A paginação exigiu uma evolução em todas as camadas:

```text
API Kitsu
    ↓ devolve data + meta + links
Service
    ↓ devolve AnimeListResult
AnimeList
    ↓ guarda query, page e total
Pagination
    ↓ avisa qual página foi escolhida
Service
    ↓ converte página em offset
```

O ponto principal é que `totalPages` não aparece sozinho. Ele depende do
`total` recebido da API, do `PAGE_SIZE` exportado pelo service e do estado que
guarda esse total dentro da `AnimeList`.

---

**GitHub:** https://github.com/IsaqueTADS<br>
**LinkedIn:** https://www.linkedin.com/in/isaque-rodriguestads<br>
**Portfólio:** https://portfolio.isaque.dev.br/
