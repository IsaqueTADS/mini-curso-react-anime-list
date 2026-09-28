export interface KitsuImage {
  tiny: string
  small: string
  medium?: string
  large: string
  original: string
}

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

export interface KitsuAnimeResource {
  id: string
  type: 'anime'
  attributes: KitsuAnimeAttributes
}

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
