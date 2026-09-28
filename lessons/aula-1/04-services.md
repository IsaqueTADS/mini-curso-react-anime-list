# Apostila 04 - Services, requisições e mapper

**Minicurso:** React com Vite na Prática: Construindo uma Aplicação de Listagem e Detalhes de Animes  
**Módulo:** Dia 1 - Comunicação com a Kitsu API  
**Autor e apresentador:** Isaque Rodrigues Alves  
**Instituição:** IFNMG - Instituto Federal do Norte de Minas Gerais

---

## Sumário

- [O objetivo desta etapa](#o-objetivo-desta-etapa)
- [1. Por que criar uma pasta `services`?](#1-por-que-criar-uma-pasta-services)
- [2. Criar a pasta e o arquivo](#2-criar-a-pasta-e-o-arquivo)
- [3. A URL base](#3-a-url-base)
- [4. A função `getAnimeList`](#4-a-função-getanimelist)
- [5. Calculando o offset](#5-calculando-o-offset)
- [6. Montando os parâmetros](#6-montando-os-parâmetros)
- [7. Fazendo o `fetch`](#7-fazendo-o-fetch)
- [8. Transformando a resposta](#8-transformando-a-resposta)
- [9. O mapper](#9-o-mapper)
- [10. A função `getAnimeDetails`](#10-a-função-getanimedetails)
- [11. Arquivo completo](#11-arquivo-completo)
- [12. Teste rápido no navegador](#12-teste-rápido-no-navegador)
- [13. Exercícios](#13-exercícios)
- [Checklist da etapa](#checklist-da-etapa)
- [Resumo](#resumo)

## O objetivo desta etapa

Na apostila anterior conhecemos a API. Agora vamos criar a camada que conversa
com ela.

O componente React não deve precisar saber:

- qual é a URL completa da Kitsu;
- como os parâmetros são codificados;
- qual campo contém os animes;
- como a nota chega como texto;
- como a imagem está dentro de `attributes.posterImage.medium`.

Essas responsabilidades ficarão em:

```text
src/services/anime.ts
```

Ao final, esse arquivo terá duas funções públicas:

```ts
getAnimeList()
getAnimeDetails()
```

Também terá uma função interna, `mapearAnime`, que transforma a resposta da
Kitsu no modelo `Anime` criado na apostila 02.

## 1. Por que criar uma pasta `services`?

Sem um service, o componente poderia acabar assim:

```tsx
async function loadAnime() {
  const response = await fetch(
    'https://kitsu.io/api/edge/anime?page[limit]=15&page[offset]=0',
  )

  const data = await response.json()
  setAnimes(data.data)
}
```

Esse código até pode funcionar, mas mistura duas responsabilidades:

1. controlar a interface;
2. conhecer os detalhes da API.

Com um service, a página fica mais simples:

```tsx
const animes = await getAnimeList()
setAnimes(animes)
```

O componente sabe que precisa de uma lista. O service sabe como obtê-la.

```text
AnimeList
    ↓ pede uma lista
getAnimeList
    ↓ faz fetch e transforma a resposta
Kitsu API
```

## 2. Criar a pasta e o arquivo

No template não existe a pasta `services`. Crie:

```text
src/services/anime.ts
```

No VS Code, é possível clicar com o botão direito em `src`, escolher **New
Folder**, criar `services` e depois criar `anime.ts` dentro dela.

## 3. A URL base

Começamos com uma constante:

```ts
const BASE_URL = 'https://kitsu.io/api/edge/anime'
```

A URL base termina em `/anime` porque as duas funções trabalham com esse
recurso:

```text
lista:    BASE_URL
detalhes: BASE_URL + /id
```

Manter a URL em um só lugar evita repetir o texto e facilita uma mudança futura.

## 4. A função `getAnimeList`

Essa função será responsável por:

1. receber uma busca opcional;
2. receber uma página opcional;
3. calcular o offset;
4. montar os parâmetros da URL;
5. fazer a requisição;
6. verificar se a resposta foi bem-sucedida;
7. converter a resposta em `Anime[]`.

### Parâmetros da função

```ts
export async function getAnimeList(query: string = '', page: number = 1) {
```

Os valores padrão permitem chamar a função sem argumentos:

```ts
getAnimeList()
```

Nesse caso:

```text
query = ''
page  = 1
```

Também podemos pesquisar:

```ts
getAnimeList('naruto')
```

E, quando a paginação for adicionada:

```ts
getAnimeList('naruto', 3)
```

Nesta etapa a página já é aceita pela função, mesmo que a interface só use a
primeira página. Isso prepara o service para a apostila 06.

## 5. Calculando o offset

```ts
const limit = 15
const offset = (page - 1) * limit
```

O projeto trabalha com 15 animes por requisição.

| Página | Offset |
| --- | --- |
| 1 | 0 |
| 2 | 15 |
| 3 | 30 |

O usuário pensa em páginas. A API pensa em posições. O service faz essa
tradução para que a tela não precise conhecer os detalhes da Kitsu.

## 6. Montando os parâmetros

```ts
const params = new URLSearchParams({
  'page[limit]': String(limit),
  'page[offset]': String(offset),
})
```

`URLSearchParams` recebe um objeto com os parâmetros e transforma os valores em
texto apropriado para a URL.

Se houver uma busca:

```ts
if (query.trim()) {
  params.set('filter[text]', query.trim())
}
```

O `trim()` remove espaços no começo e no fim. O `if` evita enviar
`filter[text]=` quando o usuário não está pesquisando.

Exemplo do resultado:

```text
page%5Blimit%5D=15&page%5Boffset%5D=30&filter%5Btext%5D=naruto
```

O navegador decodifica esses valores ao fazer a requisição. Os colchetes
aparecem codificados porque fazem parte do nome do parâmetro.

## 7. Fazendo o `fetch`

```ts
const response = await fetch(`${BASE_URL}?${params}`)
```

O template string concatena:

```text
BASE_URL + ? + parâmetros
```

O `await` espera a resposta antes de continuar.

### Verificando `response.ok`

```ts
if (!response.ok) {
  throw new Error('Erro ao buscar animes')
}
```

O `fetch` não rejeita automaticamente a Promise para todo status HTTP de erro.
Por isso verificamos `response.ok` explicitamente.

Se a resposta não for bem-sucedida, lançamos um erro. O componente que chamou o
service poderá capturar esse erro e mostrar uma mensagem de interface.

## 8. Transformando a resposta

```ts
const data: KitsuAnimeListResponse = await response.json()

return data.data.map(mapearAnime)
```

Há duas operações diferentes nesse trecho:

1. `response.json()` transforma o corpo HTTP em um objeto JavaScript;
2. `map(mapearAnime)` transforma cada recurso da Kitsu em um `Anime`.

A resposta original possui uma lista em `data.data`. Por isso usamos `.map()`:

```text
data.data
  ├── recurso Kitsu 1 → mapearAnime → Anime 1
  ├── recurso Kitsu 2 → mapearAnime → Anime 2
  └── recurso Kitsu 3 → mapearAnime → Anime 3
```

## 9. O mapper

O mapper é uma função de transformação. Ele recebe um
`KitsuAnimeResource` e devolve um `Anime`.

```ts
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

### Transformações realizadas

| Kitsu | Aplicação | Motivo |
| --- | --- | --- |
| `anime.id` | `id` | Mantém o identificador |
| `attributes.canonicalTitle` | `title` | Nome menor e próprio do domínio |
| `attributes.description` | `synopsis` | Nome usado pela aplicação |
| `attributes.posterImage.medium` | `image` | Escolhe um tamanho de imagem |
| `attributes.averageRating` | `rating` | Converte texto para escala de 0 a 10 |
| `attributes.episodeCount` | `episodes` | Simplifica o nome |
| `attributes.status` | `status` | Mantém a situação do anime |
| `attributes.subtype` | `subtype` | Mantém o tipo de produção |
| `attributes.startDate` | `startDate` | Mantém a data inicial |

### Nota da nota

A Kitsu pode enviar uma nota como texto entre 0 e 100:

```text
'82.27'
```

O projeto converte para número e divide por 10:

```ts
Number('82.27') / 10 // 8.227
```

Depois o card mostra uma casa decimal:

```ts
anime.rating.toFixed(1) // '8.2'
```

### Imagem opcional

```ts
image: anime.attributes.posterImage?.medium ?? null
```

O `?.` evita tentar acessar `medium` quando `posterImage` é `null`. O `?? null`
garante que o modelo da aplicação receba `null` quando a imagem não estiver
disponível.

## 10. A função `getAnimeDetails`

A segunda função consulta um anime específico:

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

O fluxo é quase o mesmo da listagem, mas existem duas diferenças:

- a URL recebe o ID no final;
- `data` é um recurso único, não um array.

Por isso não usamos `.map()` nesta função:

```ts
return mapearAnime(data.data)
```

Essa função já será criada na Aula 1, mas a tela que utiliza os detalhes será
construída somente na Aula 2. Preparar uma função antes do componente que a
utiliza mostra que a camada de acesso a dados pode ser organizada
independentemente da interface.

## 11. Arquivo completo

Depois de acompanhar as partes, o arquivo inicial completo fica assim:

```ts
import type { Anime } from '../types/anime'
import type {
  KitsuAnimeDetailsResponse,
  KitsuAnimeListResponse,
  KitsuAnimeResource,
} from '../types/kitsu'

const BASE_URL = 'https://kitsu.io/api/edge/anime'

export async function getAnimeList(query: string = '', page: number = 1) {
  try {
    const limit = 15
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

    return data.data.map(mapearAnime)
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

## 12. Teste rápido no navegador

Antes de criar a tela, você pode testar a API diretamente no navegador:

```text
https://kitsu.io/api/edge/anime?page[limit]=15&page[offset]=0
```

Também pode testar a busca:

```text
https://kitsu.io/api/edge/anime?filter[text]=naruto&page[limit]=15&page[offset]=0
```

Observe a diferença entre a resposta da API e o objeto que o mapper devolverá.

## 13. Exercícios

1. Troque temporariamente o `limit` de 15 para 5 e observe a quantidade de
   itens retornados.
2. Faça uma busca por `one piece` usando a URL.
3. Observe o valor de `averageRating` em uma resposta da Kitsu e calcule o
   valor que será usado no card.
4. Identifique três campos da API que não fazem parte da interface `Anime`.
5. Explique por que `getAnimeDetails` não usa `.map()`.

## Checklist da etapa

- [ ] Criei `src/services/anime.ts`.
- [ ] Entendi o papel de `getAnimeList`.
- [ ] Entendi o papel de `getAnimeDetails`.
- [ ] Consigo explicar por que o `mapper` existe.
- [ ] Sei por que usamos `data.data.map(mapearAnime)` na listagem.
- [ ] Sei por que usamos `mapearAnime(data.data)` nos detalhes.
- [ ] Entendi que a paginação visual será integrada depois.

## Resumo

O service separa a comunicação com a Kitsu da interface. `getAnimeList` busca
uma lista, `getAnimeDetails` busca um recurso e `mapearAnime` traduz a resposta
externa para o modelo interno da aplicação.

Na próxima apostila vamos usar essas funções para substituir a mensagem inicial
da `AnimeList` por dados reais na tela.

---

**GitHub:** https://github.com/IsaqueTADS  
**LinkedIn:** https://www.linkedin.com/in/isaque-rodriguestads  
**Portfólio:** https://portfolio.isaque.dev.br/
