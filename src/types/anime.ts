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
