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
