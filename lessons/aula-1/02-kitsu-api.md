# Apostila 02 - Conhecendo a Kitsu API e os tipos

**Minicurso:** React com Vite na Prática: Construindo uma Aplicação de Listagem e Detalhes de Animes  
**Módulo:** Dia 1 - Kitsu API, TypeScript e domínio da aplicação  
**Autor e apresentador:** Isaque Rodrigues Alves  
**Instituição:** IFNMG - Instituto Federal do Norte de Minas Gerais

---

## Sumário

- [Como esta etapa se encaixa no projeto](#como-esta-etapa-se-encaixa-no-projeto)
- [1. O que é uma API?](#1-o-que-é-uma-api)
- [2. A Kitsu API](#2-a-kitsu-api)
- [3. Endpoints usados no projeto](#3-endpoints-usados-no-projeto)
- [4. Por que tipar a resposta?](#4-por-que-tipar-a-resposta)
- [5. O arquivo `src/types/kitsu.ts`](#5-o-arquivo-srctypeskitsuts)
- [6. O nosso modelo de domínio](#6-o-nosso-modelo-de-domínio)
- [7. API externa versus domínio da aplicação](#7-api-externa-versus-domínio-da-aplicação)
- [8. `import type` no projeto](#8-import-type-no-projeto)
- [9. Exercício rápido](#9-exercício-rápido)
- [Checklist da etapa](#checklist-da-etapa)
- [Resumo](#resumo)

## Como esta etapa se encaixa no projeto

O template dos alunos já possui o arquivo:

```text
src/types/kitsu.ts
```

Esse arquivo representa o formato que vem da API externa. Nesta apostila vamos
entender esse formato e criar o arquivo que representa o formato que a nossa
aplicação realmente precisa:

```text
src/types/anime.ts
```

Ainda não vamos criar o service nem a tela de listagem. Primeiro vamos separar
as duas responsabilidades:

```text
Kitsu API                 Aplicação
resposta grande      →    modelo simples
```

Ao final desta etapa, você deverá saber:

- o que é uma API HTTP;
- como a Kitsu organiza uma resposta JSON:API;
- quais endpoints serão utilizados;
- o que cada tipo de `src/types/kitsu.ts` representa;
- por que criamos um modelo `Anime` separado;
- por que os componentes não devem conhecer todos os campos da API.

## 1. O que é uma API?

Uma API é uma forma organizada de um sistema disponibilizar dados e operações
para outro sistema.

Neste projeto, o navegador será o cliente e a Kitsu será o serviço que fornece
os dados:

```text
Aplicação React
      │
      │ requisição HTTP
      ▼
Kitsu API
      │
      │ resposta JSON
      ▼
Aplicação React
```

Uma requisição HTTP normalmente possui:

- método, como `GET`, `POST`, `PUT` ou `DELETE`;
- URL;
- parâmetros de busca, quando necessários;
- resposta do servidor;
- status HTTP indicando sucesso ou erro.

Para consultar dados, usaremos principalmente o método `GET`.

## 2. A Kitsu API

A API usada no projeto é a Kitsu API.

```text
https://kitsu.io/api/edge
```

Essa é a URL base. A partir dela acrescentamos o recurso que queremos acessar.

```text
https://kitsu.io/api/edge/anime
```

A Kitsu devolve dados no estilo JSON:API. Isso significa que o objeto retornado
possui uma estrutura organizada, em vez de ser simplesmente uma lista de
objetos sem contexto.

Uma resposta de listagem se parece com isto:

```json
{
  "data": [
    {
      "id": "1",
      "type": "anime",
      "attributes": {
        "canonicalTitle": "Cowboy Bebop",
        "description": "No ano de 2071...",
        "averageRating": "82.27",
        "episodeCount": 26,
        "status": "finished",
        "subtype": "TV",
        "posterImage": {
          "medium": "https://media.kitsu.io/anime/poster_images/1/medium.jpg"
        }
      }
    }
  ],
  "links": {
    "first": "...",
    "next": "...",
    "last": "..."
  },
  "meta": {
    "count": 22466
  }
}
```

Os campos mais importantes para a Aula 1 são:

| Campo | Função |
| --- | --- |
| `data` | Lista dos recursos devolvidos pela API |
| `id` | Identificador do anime |
| `type` | Tipo do recurso, neste caso `anime` |
| `attributes` | Informações próprias do anime |
| `links` | Links de navegação e paginação |
| `meta.count` | Quantidade total de resultados |

## 3. Endpoints usados no projeto

### Listar animes

```http
GET https://kitsu.io/api/edge/anime
```

Esse endpoint retorna uma lista paginada de animes.

### Pesquisar por texto

```http
GET https://kitsu.io/api/edge/anime?filter[text]=naruto
```

O parâmetro `filter[text]` informa para a Kitsu que queremos filtrar os
resultados por texto.

No código, não vamos montar essa URL manualmente. Usaremos
`URLSearchParams`, que cuida da codificação dos parâmetros:

```ts
const params = new URLSearchParams()

params.set('filter[text]', 'naruto')

console.log(params.toString())
// filter%5Btext%5D=naruto
```

### Paginar resultados

```http
GET https://kitsu.io/api/edge/anime?page[limit]=15&page[offset]=0
```

Os parâmetros significam:

- `page[limit]`: quantidade de itens solicitada;
- `page[offset]`: posição a partir da qual os itens devem ser retornados.

A Kitsu aceita no máximo 20 itens por requisição. Neste projeto usaremos 15,
para deixar a grade e a explicação mais simples:

```ts
const limit = 15
const offset = (page - 1) * limit
```

A explicação completa da paginação está na apostila 06.

### Pesquisa com paginação

Os parâmetros podem ser combinados:

```http
GET https://kitsu.io/api/edge/anime?filter[text]=naruto&page[limit]=15&page[offset]=0
```

O usuário pesquisa um termo e, em seguida, percorre apenas os resultados
daquela pesquisa.

### Detalhes de um anime

```http
GET https://kitsu.io/api/edge/anime/1
```

O número no final da URL é o ID do anime.

A resposta de detalhes possui um recurso único:

```json
{
  "data": {
    "id": "1",
    "type": "anime",
    "attributes": {
      "canonicalTitle": "Cowboy Bebop"
    }
  }
}
```

Na Aula 1 vamos preparar a função que consulta esse endpoint. A tela que usa
essa função será desenvolvida na Aula 2.

## 4. Por que tipar a resposta?

JavaScript não sabe automaticamente que `data.data[0].attributes.canonicalTitle`
é uma string. TypeScript permite declarar essa expectativa.

Quando tipamos a resposta, o editor consegue:

- sugerir propriedades válidas;
- avisar quando escrevemos um nome errado;
- mostrar quais valores podem ser `null`;
- documentar o formato esperado da API;
- ajudar durante a transformação dos dados.

Sem tipos, poderíamos escrever:

```ts
const title = data.data[0].attributes.canonialTitle
```

O erro de digitação em `canonialTitle` só seria descoberto em execução. Com
TypeScript, o editor pode apontar o problema antes.

## 5. O arquivo `src/types/kitsu.ts`

O arquivo já está disponível no template. Ele descreve a resposta externa, não
a interface visual da nossa aplicação.

### Imagens

```ts
export interface KitsuImage {
  tiny: string
  small: string
  medium?: string
  large: string
  original: string
}
```

A API oferece diferentes tamanhos da mesma imagem. Na listagem usaremos a
imagem `medium`.

O `?` em `medium?: string` significa que essa propriedade pode não existir.
Por isso o mapper precisará tratar a possibilidade de ausência.

### Atributos do anime

```ts
export interface KitsuAnimeAttributes {
  canonicalTitle: string
  description: string | null
  posterImage: KitsuImage | null
  coverImage: KitsuImage | null
  averageRating: string | null
  episodeCount: number | null
  episodeLength: number | null
  totalLength: number | null
  startDate: string | null
  endDate: string | null
  status: string
  subtype: 'ONA' | 'OVA' | 'TV' | 'movie' | 'music' | 'special'
  youtubeVideoId: string | null
  ageRating: string | null
  ageRatingGuide: string | null
}
```

Alguns detalhes merecem atenção:

- `description` pode ser `null`;
- `posterImage` pode ser `null`;
- `averageRating` chega como texto, por exemplo, `'82.27'`;
- `episodeCount` pode não existir para alguns animes;
- `subtype` é uma união de valores conhecidos;
- vários campos não serão usados nesta primeira versão.

### Recurso da API

```ts
export interface KitsuAnimeResource {
  id: string
  type: 'anime'
  attributes: KitsuAnimeAttributes
}
```

Esse tipo representa um item dentro de `data`.

### Respostas de listagem e detalhes

```ts
export interface KitsuPaginationLinks {
  first: string
  prev: string | null
  next: string | null
  last: string
}

export interface KitsuPaginationMeta {
  count: number
}

export interface KitsuAnimeListResponse {
  data: KitsuAnimeResource[]
  links: KitsuPaginationLinks
  meta: KitsuPaginationMeta
}

export interface KitsuAnimeDetailsResponse {
  data: KitsuAnimeResource
}
```

Uma listagem tem vários recursos, links e metadados. Detalhes têm um recurso
único, por isso `data` não é um array em `KitsuAnimeDetailsResponse`.

Na prática, algumas respostas da Kitsu podem omitir um link quando ele não faz
sentido, como o `prev` da primeira página. A aplicação trata essa possibilidade
quando usa os links para a paginação.

## 6. O nosso modelo de domínio

Se os componentes usassem diretamente `KitsuAnimeAttributes`, eles ficariam
acoplados a nomes e detalhes da API:

```tsx
<h2>{anime.attributes.canonicalTitle}</h2>
<img src={anime.attributes.posterImage?.medium} />
```

Esse código funciona, mas espalha a estrutura da Kitsu pela aplicação inteira.
Se a API mudar ou se decidirmos trocar de fornecedor, muitos componentes
precisarão ser alterados.

Em vez disso, vamos criar um modelo pequeno para a nossa aplicação.

Arquivo: `src/types/anime.ts`

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

Esse modelo contém apenas o que a interface precisa na Aula 1 e na tela de
detalhes da Aula 2.

Por enquanto, não vamos adicionar `AnimeListResult`. Esse tipo será incluído na
apostila 06, quando surgir a necessidade de transportar também as informações
da paginação.

## 7. API externa versus domínio da aplicação

O fluxo que vamos construir é:

```text
Kitsu API
    ↓
Resposta JSON:API
    ↓
Tipos Kitsu
    ↓
Mapper
    ↓
Modelo Anime
    ↓
Componentes React
```

O mapper será uma função responsável por traduzir nomes e formatos:

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

Não é necessário memorizar esse código agora. Na apostila 04 vamos construir
essa função dentro do service e entender cada transformação.

### Por que não usamos tudo?

A resposta da API possui muitos dados: datas de atualização, estatísticas,
rankings, imagens em vários tamanhos, relacionamentos, vídeos e informações
que não aparecem na nossa interface.

Usar tudo traria problemas:

- componentes maiores e mais difíceis de entender;
- maior dependência de detalhes externos;
- mais campos para tratar como `null`;
- dificuldade para trocar de API no futuro;
- mistura entre regra de infraestrutura e regra visual.

O modelo de domínio funciona como uma fronteira. Os componentes recebem apenas
o que precisam para cumprir suas responsabilidades.

## 8. `import type` no projeto

Como os tipos são usados apenas durante a verificação do TypeScript, o projeto
usa a forma explícita:

```ts
import type { Anime } from '../types/anime'
```

Isso deixa claro que `Anime` não é um valor usado em execução. Ele desaparece
quando o TypeScript transforma o código para JavaScript.

## 9. Exercício rápido

Abra `src/types/kitsu.ts` e localize:

1. onde o título original é declarado;
2. onde a imagem do pôster é declarada;
3. onde a quantidade de episódios é declarada;
4. quais campos aceitam `null`;
5. qual tipo representa um recurso de anime.

Depois crie `src/types/anime.ts` com a interface `Anime` apresentada nesta
apostila.

Não crie ainda `AnimeListResult`. Vamos precisar dele somente quando a
paginação for adicionada.

## Checklist da etapa

- [ ] Sei qual é a URL base da Kitsu.
- [ ] Sei a diferença entre `/anime` e `/anime/{id}`.
- [ ] Sei para que servem `filter[text]`, `page[limit]` e `page[offset]`.
- [ ] Entendo a diferença entre `KitsuAnimeResource` e `Anime`.
- [ ] Criei `src/types/anime.ts`.
- [ ] Entendo que o mapper será a ponte entre a API e a aplicação.

## Resumo

A Kitsu fornece uma resposta grande e organizada em JSON:API. Os tipos de
`src/types/kitsu.ts` representam esse formato externo. O arquivo
`src/types/anime.ts` representa o formato que os componentes realmente usarão.

Essa separação torna a aplicação mais simples e prepara o projeto para crescer
sem espalhar detalhes da API pela interface.

Na próxima apostila vamos entender onde cada arquivo fica e como o Vite monta a
aplicação React.

---

**GitHub:** https://github.com/IsaqueTADS  
**LinkedIn:** https://www.linkedin.com/in/isaque-rodriguestads  
**Portfólio:** https://portfolio.isaque.dev.br/
