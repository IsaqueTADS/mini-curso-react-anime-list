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
