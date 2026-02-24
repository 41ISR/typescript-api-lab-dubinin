export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = "ApiError"
  }
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = import.meta.env.VITE_URL) {
    this.baseUrl = baseUrl
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config: RequestInit = {
      ...options,
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        ...options?.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          response.status,
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(
        0,
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    const url = params ? this.buildUrl(endpoint, params) : `${this.baseUrl}${endpoint}`

    return this.request<T>(url.replace(this.baseUrl, ""), {
      method: "GET",
    })
  }
}

export const apiClient = new ApiClient()
