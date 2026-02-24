import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getAnime } from "../api/anime"
import type { Anime } from "../types"
import { Loader } from "../components/Loader"
import { ErrorMessage } from "../components/ErrorMessage"

export const AnimeList = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const limit = 20

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true)
      setError(null)
      try {
        const params: Record<string, string | number> = {
          "page[limit]": limit,
          "page[offset]": offset,
        }
        if (searchText) params["filter[text]"] = searchText
        if (statusFilter) params["filter[status]"] = statusFilter

        const data = await getAnime(params)
        setAnimeList(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load anime")
      } finally {
        setLoading(false)
      }
    }

    fetchAnime()
  }, [offset, searchText, statusFilter])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setOffset(0)
  }

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} />

  return (
    <>
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            Kitsu Anime
          </Link>
          <nav className="header-nav">
            <Link to="/" className="nav-link">
              Anime
            </Link>
            <Link to="/manga" className="nav-link">
              Manga
            </Link>
          </nav>
        </div>
      </header>

      <div className="container">
        <section className="search-filter-section">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search anime..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>

          <div className="filters-row">
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setOffset(0)
                }}>
                <option value="">All Status</option>
                <option value="current">Currently Airing</option>
                <option value="finished">Finished</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        </section>

        <div className="controls-bar">
          <div className="results-count">Showing {animeList.length} results</div>
        </div>

        <div className="cards-grid">
          {animeList.map((anime) => (
            <Link to={`/anime/${anime.id}`} key={anime.id} className="card">
              <div className="card-image-wrapper">
                <img
                  src={anime.attributes.posterImage.medium}
                  alt={anime.attributes.canonicalTitle}
                  className="card-image"
                />
                {anime.attributes.averageRating && (
                  <span className="badge" style={{ backgroundColor: "#10b981" }}>
                    ⭐ {parseFloat(anime.attributes.averageRating).toFixed(1)}
                  </span>
                )}
              </div>
              <div className="card-content">
                <h3 className="card-title">{anime.attributes.canonicalTitle}</h3>
                <p className="card-description">
                  {anime.attributes.synopsis
                    ? anime.attributes.synopsis.slice(0, 100) + "..."
                    : "No description available"}
                </p>
                <div className="card-tags">
                  <span className="tag">{anime.attributes.showType}</span>
                  <span className="tag secondary">{anime.attributes.status}</span>
                  {anime.attributes.episodeCount && (
                    <span className="tag success">
                      {anime.attributes.episodeCount} eps
                    </span>
                  )}
                </div>
                <div className="card-footer">
                  <div className="card-stats">
                    <span className="stat-item">
                      <span>📅</span>
                      <span>{anime.attributes.startDate || "TBA"}</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => setOffset((p) => Math.max(0, p - limit))}
            disabled={offset === 0}>
            ← Previous
          </button>
          <span className="pagination-info">Page {offset / limit + 1}</span>
          <button
            className="pagination-button"
            onClick={() => setOffset((p) => p + limit)}
            disabled={animeList.length < limit}>
            Next →
          </button>
        </div>
      </div>
    </>
  )
}
