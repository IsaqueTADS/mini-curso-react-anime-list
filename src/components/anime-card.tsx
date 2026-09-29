import type { Anime } from '../types/anime'

// Um card recebe um anime (via props) e avisa o componente pai quando
// o usuário clica nele — quem decide o que fazer com o clique é o pai.
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
