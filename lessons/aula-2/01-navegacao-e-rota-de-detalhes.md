# Apostila 01 - Navegação e rota de detalhes

**Minicurso:** React com Vite na Prática: Construindo uma Aplicação de Listagem e Detalhes de Animes<br>
**Módulo:** Dia 2 - Navegação, parâmetros de rota e seleção de animes<br>
**Autor e apresentador:** Isaque Rodrigues Alves<br>
**Instituição:** IFNMG - Instituto Federal do Norte de Minas Gerais

---

## Sumário

- [Como esta etapa começa](#como-esta-etapa-começa)
- [1. O que ficou pronto na Aula 1](#1-o-que-ficou-pronto-na-aula-1)
- [2. O fluxo que queremos construir](#2-o-fluxo-que-queremos-construir)
- [3. O clique no `AnimeCard`](#3-o-clique-no-animecard)
- [4. Navegando com `useNavigate`](#4-navegando-com-usenavigate)
- [5. Criando a rota dinâmica](#5-criando-a-rota-dinâmica)
- [6. Lendo o ID com `useParams`](#6-lendo-o-id-com-useparams)
- [7. Por que o ID é uma string?](#7-por-que-o-id-é-uma-string)
- [8. Código final da navegação](#8-código-final-da-navegação)
- [9. Exercícios](#9-exercícios)
- [Checklist da etapa](#checklist-da-etapa)
- [Resumo](#resumo)

## Como esta etapa começa

Na Aula 1 terminamos a tela de listagem com busca e paginação. Cada card já
recebe uma função `onSelect`, mas essa função ainda não abre outra tela.

O service também já possui a função:

```ts
getAnimeDetails(id: string)
```

Nesta etapa vamos conectar as duas pontas:

```text
clique no card
    ↓
ID do anime
    ↓
    ↓
AnimeDetails lê o ID
```

Ainda não vamos buscar os detalhes nesta apostila. Primeiro vamos fazer a URL e
o Router funcionarem.

## 1. O que ficou pronto na Aula 1

O `AnimeCard` possui esta prop:

```tsx
interface AnimeCardProps {
  anime: Anime
  onSelect: (id: string) => void
}
```

Quando o usuário clica, o card envia o ID ao componente pai:

```tsx
onClick={() => onSelect(anime.id)}
```

O card não sabe se o pai vai abrir detalhes, selecionar o item, exibir um
modal ou fazer outra coisa. Ele apenas comunica o evento.

Essa separação permite adicionar navegação sem colocar React Router dentro do
componente visual do card.

## 2. O fluxo que queremos construir

O fluxo completo da seleção será:

```text
AnimeCard recebe anime.id
        ↓
onSelect(anime.id)
        ↓
AnimeList.handleSelect(id)
        ↓
navigate(`/anime/${id}`)
        ↓
BrowserRouter atualiza a URL
        ↓
Route encontra /anime/:id
        ↓
AnimeDetails é renderizado
```

Exemplo com o anime de ID `1`:

```text
/anime/1
```

O trecho `1` será o valor do parâmetro chamado `id`.

## 3. O clique no `AnimeCard`

No arquivo `src/pages/anime-list.tsx`, precisamos obter a função de navegação:

```tsx
import { useNavigate } from 'react-router'
```

Dentro do componente:

```tsx
const navigate = useNavigate()
```

Depois criamos o handler:

```tsx
function handleSelect(id: string) {
  navigate(`/anime/${id}`)
}
```

E passamos esse handler para os cards:

```tsx
{animes.map((anime) => (
  <AnimeCard
    key={anime.id}
    anime={anime}
    onSelect={handleSelect}
  />
))}
```

### O que acontece quando clicamos?

Se o anime tiver ID `1`, o React Router recebe:

```tsx
navigate('/anime/1')
```

A URL muda sem recarregar a página inteira. O Router observa a nova URL e
renderiza o componente correspondente.

## 4. Navegando com `useNavigate`

`useNavigate` retorna uma função para navegar por código:

```tsx
const navigate = useNavigate()

navigate('/anime/1')
```

Também podemos navegar no histórico do navegador:

```tsx
navigate(-1)
```

Esse segundo formato será usado no botão `Voltar` da tela de detalhes.

O hook deve ser usado dentro de um componente que esteja dentro do
`BrowserRouter`. No nosso projeto, `App` envolve as rotas com:

```tsx
<BrowserRouter>
  <Routes>{/* rotas */}</Routes>
</BrowserRouter>
```

Por isso `AnimeList` pode chamar `useNavigate`.

## 5. Criando a rota dinâmica

O arquivo `src/App.tsx` já possui a rota da listagem:

```tsx
<Route path="/" element={<AnimeList />} />
```

Agora vamos adicionar a rota de detalhes:

```tsx
<Route path="/anime/:id" element={<AnimeDetails />} />
```

O `:id` representa um parâmetro dinâmico. Essas URLs serão atendidas pela
mesma rota:

```text
/anime/1
/anime/20
/anime/999
```

O componente será sempre `AnimeDetails`, mas o valor de `id` muda.

### Arquivo completo do `App.tsx`

```tsx
import { BrowserRouter, Route, Routes } from 'react-router'
import { AnimeList } from './pages/anime-list'
import { AnimeDetails } from './pages/anime-details'

function App() {
  return (
    <BrowserRouter>
      <div className="m-auto max-w-6xl">
        <Routes>
          <Route path="/" element={<AnimeList />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
```

Neste momento, a rota já pode renderizar o esqueleto de `AnimeDetails`, mesmo
que a tela ainda não tenha sido estilizada.

## 6. Lendo o ID com `useParams`

Na tela de detalhes, usamos `useParams`:

```tsx
import { useParams } from 'react-router'

const { id } = useParams()
```

Se a URL atual for:

```text
/anime/42
```

O valor será:

```ts
id === '42'
```

O Router não busca os dados automaticamente. Ele apenas entrega o parâmetro
para o componente. A chamada para a Kitsu será feita na próxima apostila.

## 7. Por que o ID é uma string?

Parâmetros de URL são textos. Mesmo que a URL contenha `42`, o Router entrega:

```ts
string | undefined
```

O valor pode ser `undefined` porque o componente também pode ser renderizado
sem um parâmetro válido em alguma situação de configuração.

Por isso a tela deve verificar o ID antes de chamar o service:

```tsx
if (!id) {
  // mostrar erro ou interromper o carregamento
  return
}
```

No nosso caso, o `useEffect` da tela de detalhes fará essa verificação.

Não precisamos converter o ID para número. A Kitsu aceita o identificador na
URL como texto, e o service já recebe:

```ts
getAnimeDetails(id: string)
```

## 8. Código final da navegação

Ao terminar esta apostila, a mudança principal na `AnimeList` será:

```tsx
import { useNavigate } from 'react-router'

export function AnimeList() {
  const navigate = useNavigate()

  function handleSelect(id: string) {
    navigate(`/anime/${id}`)
  }

  return (
    <div>
      {animes.map((anime) => (
        <AnimeCard
          key={anime.id}
          anime={anime}
          onSelect={handleSelect}
        />
      ))}
    </div>
  )
}
```

E o `App.tsx` terá as duas rotas:

```tsx
<Routes>
  <Route path="/" element={<AnimeList />} />
  <Route path="/anime/:id" element={<AnimeDetails />} />
</Routes>
```

A tela de detalhes ainda ficará incompleta até a próxima apostila.

## 9. Exercícios

1. Clique em um card e observe a URL mudar.
2. Troque manualmente o ID na URL, por exemplo, de `/anime/1` para
   `/anime/20`.
3. Adicione temporariamente um `console.log(id)` no `AnimeDetails`.
4. Teste `navigate(-1)` em um botão temporário.
5. Explique a diferença entre `navigate('/anime/1')` e `navigate(-1)`.

## Checklist da etapa

- [ ] O `AnimeCard` chama `onSelect` com o ID.
- [ ] A `AnimeList` usa `useNavigate`.
- [ ] O clique muda a URL para `/anime/{id}`.
- [ ] O `App.tsx` possui a rota `/anime/:id`.
- [ ] O `AnimeDetails` usa `useParams`.
- [ ] Entendi que o parâmetro chega como `string | undefined`.
- [ ] Ainda não coloquei a requisição de detalhes diretamente no Router.

## Resumo

O card comunica o ID, a `AnimeList` decide navegar, o Router identifica a rota
dinâmica e o `AnimeDetails` lê o parâmetro com `useParams`.

Na próxima apostila vamos usar esse ID para chamar `getAnimeDetails`, tratar
carregamento e erro e montar a interface final da tela.

---

**GitHub:** https://github.com/IsaqueTADS<br>
**LinkedIn:** https://www.linkedin.com/in/isaque-rodriguestads<br>
**Portfólio:** https://portfolio.isaque.dev.br/
