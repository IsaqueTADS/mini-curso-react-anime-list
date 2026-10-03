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
