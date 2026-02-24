import { apiClient } from "./apiClient"
import type { ApiResponse, Manga } from "../types"

export const getManga = (params?: {
  "page[limit]"?: number
  "page[offset]"?: number
  "filter[text]"?: string
}): Promise<ApiResponse<Manga[]>> => {
  return apiClient.get<ApiResponse<Manga[]>>("/manga", params)
}

export const getMangaById = (id: string): Promise<{ data: Manga }> => {
  return apiClient.get<{ data: Manga }>(`/manga/${id}`)
}
