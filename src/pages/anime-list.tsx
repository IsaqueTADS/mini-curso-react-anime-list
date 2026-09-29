import React from 'react'
import type { Anime } from '../types/anime'
import { AnimeCard } from '../components/anime-card'
import { SearchBar } from '../components/search-bar'
import { EmptyState } from '../components/empty-state'
import { LoadingGrid } from '../components/loading-grid'
import { getAnimeList } from '../service/anime'

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
          <AnimeCard key={anime.id} anime={anime} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  )
}
