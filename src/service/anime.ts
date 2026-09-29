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
