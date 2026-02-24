import { apiClient } from "./apiClient"
import type { ApiResponse, Anime } from "../types"

export const getAnime = (params?: {
  "page[limit]"?: number
  "page[offset]"?: number
  "filter[text]"?: string
  "filter[status]"?: string
}): Promise<ApiResponse<Anime[]>> => {
  return apiClient.get<ApiResponse<Anime[]>>("/anime", params)
}

export const getAnimeById = (id: string): Promise<{ data: Anime }> => {
  return apiClient.get<{ data: Anime }>(`/anime/${id}`)
}
