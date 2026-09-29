# Apostila 02 - Construindo a tela de detalhes

**Minicurso:** React com Vite na Prática: Construindo uma Aplicação de Listagem e Detalhes de Animes<br>
**Módulo:** Dia 2 - Requisição de detalhes, estados da tela e estilização<br>
**Autor e apresentador:** Isaque Rodrigues Alves<br>
**Instituição:** IFNMG - Instituto Federal do Norte de Minas Gerais

---

## Sumário

- [Como esta etapa começa](#como-esta-etapa-começa)
- [1. O service de detalhes já está pronto](#1-o-service-de-detalhes-já-está-pronto)
- [2. Estados necessários](#2-estados-necessários)
- [3. Carregando os detalhes](#3-carregando-os-detalhes)
- [4. Tratando erros](#4-tratando-erros)
- [5. Criando o loading visual](#5-criando-o-loading-visual)
- [6. Exibindo os dados do anime](#6-exibindo-os-dados-do-anime)
- [7. Mantendo o estilo do projeto](#7-mantendo-o-estilo-do-projeto)
- [8. Arquivo completo](#8-arquivo-completo)
- [9. Exercícios](#9-exercícios)
- [Checklist da etapa](#checklist-da-etapa)
- [Resumo](#resumo)

## Como esta etapa começa

Na apostila anterior fizemos a URL mudar e criamos a rota:

```tsx
<Route path="/anime/:id" element={<AnimeDetails />} />
```

Agora a URL já informa qual anime foi escolhido, mas ainda falta buscar e
mostrar os dados.

O fluxo da tela será:

```text
useParams lê o ID
      ↓
getAnimeDetails(id)
      ↓
Kitsu API /anime/{id}
      ↓
mapper transforma a resposta
      ↓
AnimeDetails renderiza o modelo Anime
```

## 1. O service de detalhes já está pronto

Na Aula 1 criamos esta função em `src/services/anime.ts`:

```ts
export async function getAnimeDetails(id: string): Promise<Anime> {
  const response = await fetch(`${BASE_URL}/${id}`)

  if (!response.ok) {
    throw new Error('Erro ao buscar detalhes do anime')
  }

  const data: KitsuAnimeDetailsResponse = await response.json()

  return mapearAnime(data.data)
}
```

Ela já resolve três responsabilidades importantes:

- monta a URL com o ID;
- verifica se a resposta HTTP foi bem-sucedida;
- transforma a resposta da Kitsu no modelo `Anime`.

Por isso a tela não precisa acessar:

```tsx
anime.data.attributes.canonicalTitle
```

Ela recebe diretamente:

```tsx
anime.title
```

Não precisamos adicionar outro `fetch` dentro do componente. A tela deve chamar
o service existente.

## 2. Estados necessários

A tela precisa representar três informações:

```tsx
const [anime, setAnime] = React.useState<Anime | null>(null)
const [loading, setLoading] = React.useState(true)
const [error, setError] = React.useState(false)
```

### `anime`

Começa como `null` porque a requisição ainda não terminou. Depois recebe um
objeto `Anime`:

```text
null → carregando
Anime → dados disponíveis
```

### `loading`

Começa como `true` porque a tela deve carregar os detalhes assim que for aberta.

### `error`

Começa como `false` e muda para `true` se o service lançar um erro.

## 3. Carregando os detalhes

Importe os hooks de rota e o service:

```tsx
import { useNavigate, useParams } from 'react-router'
import { getAnimeDetails } from '../services/anime'
```

Dentro do componente, lemos o parâmetro e obtemos a função de navegação:

```tsx
const navigate = useNavigate()
const { id } = useParams()
```

O carregamento acontece dentro do `useEffect`:

```tsx
React.useEffect(() => {
  async function loadAnimeDetails() {
    if (!id) {
      setAnime(null)
      setError(true)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(false)
      setAnime(null)

      const anime = await getAnimeDetails(id)

      setAnime(anime)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  loadAnimeDetails()
}, [id])
```

### Por que `[id]` é a dependência?

Porque queremos carregar novamente caso o ID da URL mude:

```text
/anime/1 → /anime/20
```

O componente pode continuar montado enquanto o parâmetro muda. A dependência
`[id]` garante que o efeito acompanhe esse valor.

### Por que limpar `anime` antes da requisição?

```tsx
setAnime(null)
```

Se o usuário mudar rapidamente de uma rota para outra, não queremos mostrar os
dados antigos enquanto os novos estão sendo carregados.

## 4. Tratando erros

O service lança um erro quando a resposta não é válida:

```ts
if (!response.ok) {
  throw new Error('Erro ao buscar detalhes do anime')
}
```

A tela captura o erro:

```tsx
try {
  const anime = await getAnimeDetails(id)
  setAnime(anime)
} catch {
  setError(true)
} finally {
  setLoading(false)
}
```

Depois usamos o componente já existente `EmptyState`:

```tsx
{!loading && error && (
  <EmptyState
    title="Não foi possível carregar este anime"
    description="A Kitsu API pode estar sem resposta no momento. Tente novamente em alguns segundos."
  />
)}
```

A responsabilidade fica separada:

```text
service → detecta o erro e lança
componente → decide como mostrar o erro
```

Não é necessário colocar outro `try/catch` dentro de `getAnimeDetails`. O
service já lança o erro e a página já faz o tratamento visual.

## 5. Criando o loading visual

Enquanto a API responde, mostramos uma estrutura semelhante à tela final:

```tsx
{loading && (
  <div className="grid animate-pulse gap-8 md:grid-cols-[18rem_minmax(0,1fr)]">
    <div className="aspect-2/3 rounded-lg bg-muted" />

    <div className="flex flex-col gap-4">
      <div className="h-10 w-3/4 rounded bg-muted" />
      <div className="h-6 w-1/2 rounded bg-muted" />
      <div className="h-24 w-full rounded bg-muted" />
    </div>
  </div>
)}
```

Esse é um skeleton simples. Não precisamos criar outro componente para uma
única tela durante este minicurso.

As classes principais são:

- `animate-pulse`: cria a animação de carregamento;
- `bg-muted`: usa a cor já definida no tema;
- `aspect-2/3`: preserva o formato do pôster;
- `md:grid-cols-[18rem_minmax(0,1fr)]`: organiza imagem e conteúdo em colunas
  em telas maiores.

## 6. Exibindo os dados do anime

Depois que `loading` termina e não existe erro, podemos renderizar o conteúdo:

```tsx
{!loading && !error && anime && (
  <article>
    <h1>{anime.title}</h1>
  </article>
)}
```

O `anime &&` informa ao TypeScript e ao React que só renderizamos os detalhes
quando o objeto existe.

### Pôster

```tsx
{anime.image ? (
  <img
    src={anime.image}
    alt={`Capa de ${anime.title}`}
    className="h-full w-full object-cover"
  />
) : (
  <div>Imagem indisponível</div>
)}
```

Como `image` pode ser `null`, precisamos tratar os dois casos.

### Título e identificação visual

```tsx
<p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
  Detalhes do anime
</p>

<h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
  {anime.title}
</h1>
```

### Informações resumidas

```tsx
{anime.rating !== null && (
  <span>★ {anime.rating.toFixed(1)}</span>
)}

{anime.subtype && <span>{anime.subtype}</span>}
{anime.status && <span>{anime.status}</span>}

{anime.episodes !== null && (
  <span>{anime.episodes} episódios</span>
)}
```

Cada informação condicional só aparece quando existe. Isso evita mostrar
`null`, `undefined` ou etiquetas vazias.

### Sinopse

```tsx
<section>
  <h2>Sinopse</h2>
  <p>{anime.synopsis || 'Sinopse não disponível.'}</p>
</section>
```

O operador `||` fornece um texto alternativo quando a API não possui sinopse.

## 7. Mantendo o estilo do projeto

A tela usa as mesmas decisões visuais da listagem:

```text
fundo escuro       → background global
cartões escuros    → bg-card
amarelo            → primary
texto claro        → foreground
texto secundário   → muted-foreground
bordas discretas   → border
```

Não criamos um CSS separado. O `index.css` já possui o tema e os componentes
usam classes Tailwind diretamente.

### Layout responsivo

No celular, a imagem aparece acima do texto:

```text
[ pôster              ]
[ título              ]
[ informações         ]
[ sinopse             ]
```

Em telas médias e grandes, o layout passa a ter duas colunas:

```text
[ pôster ] [ título, informações e sinopse ]
```

Essa mudança é feita por:

```tsx
md:grid-cols-[18rem_minmax(0,1fr)]
```

### Botão voltar

```tsx
<button
  type="button"
  onClick={() => navigate(-1)}
>
  ← Voltar
</button>
```

O botão volta uma posição no histórico do navegador. Ele não precisa conhecer a
URL anterior.

## 8. Arquivo completo

Substitua o conteúdo de `src/pages/anime-details.tsx` por:

```tsx
import React from 'react'
import { useNavigate, useParams } from 'react-router'
import { EmptyState } from '../components/empty-state'
import { getAnimeDetails } from '../services/anime'
import type { Anime } from '../types/anime'

export function AnimeDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [anime, setAnime] = React.useState<Anime | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    async function loadAnimeDetails() {
      if (!id) {
        setAnime(null)
        setError(true)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(false)
        setAnime(null)

        const anime = await getAnimeDetails(id)

        setAnime(anime)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadAnimeDetails()
  }, [id])

  return (
    <div className="flex w-full flex-col gap-8 px-6 py-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="w-fit rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:border-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        ← Voltar
      </button>

      {loading && (
        <div className="grid animate-pulse gap-8 md:grid-cols-[18rem_minmax(0,1fr)]">
          <div className="aspect-2/3 rounded-lg bg-muted" />

          <div className="flex flex-col gap-4">
            <div className="h-10 w-3/4 rounded bg-muted" />
            <div className="h-6 w-1/2 rounded bg-muted" />
            <div className="h-24 w-full rounded bg-muted" />
          </div>
        </div>
      )}

      {!loading && error && (
        <EmptyState
          title="Não foi possível carregar este anime"
          description="A Kitsu API pode estar sem resposta no momento. Tente novamente em alguns segundos."
        />
      )}

      {!loading && !error && anime && (
        <article className="grid gap-8 md:grid-cols-[18rem_minmax(0,1fr)]">
          <div className="aspect-2/3 overflow-hidden rounded-lg border border-border bg-card">
            {anime.image ? (
              <img
                src={anime.image}
                alt={`Capa de ${anime.title}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                Imagem indisponível
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Detalhes do anime
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {anime.title}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {anime.rating !== null && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 font-semibold text-primary-foreground">
                  ★ {anime.rating.toFixed(1)}
                </span>
              )}

              {anime.subtype && (
                <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
                  {anime.subtype}
                </span>
              )}

              {anime.status && (
                <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
                  {anime.status}
                </span>
              )}

              {anime.episodes !== null && (
                <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
                  {anime.episodes} episódios
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 border-y border-border py-4 text-sm text-muted-foreground sm:flex-row sm:gap-6">
              <p>
                <span className="font-medium text-foreground">ID:</span>{' '}
                {anime.id}
              </p>

              {anime.startDate && (
                <p>
                  <span className="font-medium text-foreground">
                    Lançamento:
                  </span>{' '}
                  {anime.startDate}
                </p>
              )}
            </div>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-foreground">Sinopse</h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                {anime.synopsis || 'Sinopse não disponível.'}
              </p>
            </section>
          </div>
        </article>
      )}
    </div>
  )
}
```

## 9. Exercícios

1. Adicione uma tradução visual para os status `finished`, `current` e
   `upcoming`.
2. Formate `startDate` para o padrão brasileiro.
3. Mostre `episodeLength` na tela de detalhes. Para isso, o modelo `Anime` e o
   mapper precisarão ser ampliados.
4. Crie um botão para voltar diretamente para `/` usando
   `navigate('/')`.
5. Teste uma URL com ID inválido e observe o estado de erro.

## Checklist da etapa

- [ ] `AnimeDetails` lê o ID com `useParams`.
- [ ] A tela chama `getAnimeDetails(id)`.
- [ ] O carregamento possui um skeleton visual.
- [ ] Erros são tratados com `try/catch`.
- [ ] A tela usa `EmptyState` para mostrar o erro.
- [ ] O título, imagem, nota, tipo, status e episódios aparecem.
- [ ] A sinopse possui texto alternativo quando está vazia.
- [ ] O botão voltar usa `navigate(-1)`.
- [ ] O layout mantém o tema visual da aplicação.
- [ ] A tela se adapta a telas pequenas e grandes.

## Resumo

`AnimeDetails` lê o ID da rota, chama o service, controla os estados de
carregamento e erro e exibe o modelo simplificado `Anime`.

O componente não conhece a estrutura JSON:API da Kitsu. Essa responsabilidade
continua no service e no mapper, exatamente como na tela de listagem.

---

**GitHub:** https://github.com/IsaqueTADS<br>
**LinkedIn:** https://www.linkedin.com/in/isaque-rodriguestads<br>
**Portfólio:** https://portfolio.isaque.dev.br/
