export interface Anime {
  id: string
  type: string
  attributes: {
    slug: string
    synopsis: string
    canonicalTitle: string
    averageRating: string
    startDate: string
    endDate: string
    popularityRank: number
    ratingRank: number
    ageRating: string
    ageRatingGuide: string
    status: string
    posterImage: {
      tiny: string
      small: string
      medium: string
      large: string
      original: string
    }
    coverImage: {
      tiny: string
      small: string
      large: string
      original: string
    } | null
    episodeCount: number
    episodeLength: number
    youtubeVideoId: string
    showType: string
  }
}

export interface Manga {
  id: string
  type: string
  attributes: {
    slug: string
    synopsis: string
    canonicalTitle: string
    averageRating: string
    startDate: string
    endDate: string
    popularityRank: number
    ratingRank: number
    ageRating: string
    status: string
    posterImage: {
      tiny: string
      small: string
      medium: string
      large: string
      original: string
    }
    chapterCount: number
    volumeCount: number
    mangaType: string
  }
}

export interface Links {
  first: string
  next: string
  last: string
}

export interface Meta {
  count: number
}

export interface ApiResponse<T> {
  data: T
  meta: Meta
  links: Links
}
