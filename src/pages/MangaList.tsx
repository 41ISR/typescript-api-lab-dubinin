import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getManga } from "../api/manga"
import type { Manga } from "../types"
import { Loader } from "../components/Loader"
import { ErrorMessage } from "../components/ErrorMessage"

export const MangaList = () => {
  const [mangaList, setMangaList] = useState<Manga[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [searchText, setSearchText] = useState("")
  const [debouncedSearchText, setDebouncedSearchText] = useState("")
  const limit = 20

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchText])

  useEffect(() => {
    const fetchManga = async () => {
      setLoading(true)
      setError(null)
      try {
        const params: Record<string, string | number> = {
          "page[limit]": limit,
          "page[offset]": offset,
        }
        if (debouncedSearchText) params["filter[text]"] = debouncedSearchText

        const data = await getManga(params)
        setMangaList(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load manga")
      } finally {
        setLoading(false)
      }
    }

    fetchManga()
  }, [offset, debouncedSearchText])

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
              placeholder="Search manga..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </section>

        <div className="controls-bar">
          <div className="results-count">Showing {mangaList.length} results</div>
        </div>

        <div className="cards-grid">
          {mangaList.map((manga) => (
            <div key={manga.id} className="card">
              <div className="card-image-wrapper">
                <img
                  src={manga.attributes.posterImage.medium}
                  alt={manga.attributes.canonicalTitle}
                  className="card-image"
                />
                {manga.attributes.averageRating && (
                  <span className="badge" style={{ backgroundColor: "#10b981" }}>
                    ⭐ {parseFloat(manga.attributes.averageRating).toFixed(1)}
                  </span>
                )}
              </div>
              <div className="card-content">
                <h3 className="card-title">{manga.attributes.canonicalTitle}</h3>
                <p className="card-description">
                  {manga.attributes.synopsis
                    ? manga.attributes.synopsis.slice(0, 100) + "..."
                    : "No description available"}
                </p>
                <div className="card-tags">
                  <span className="tag">{manga.attributes.mangaType}</span>
                  <span className="tag secondary">{manga.attributes.status}</span>
                  {manga.attributes.chapterCount && (
                    <span className="tag success">
                      {manga.attributes.chapterCount} chapters
                    </span>
                  )}
                </div>
                <div className="card-footer">
                  <div className="card-stats">
                    <span className="stat-item">
                      <span>📅</span>
                      <span>{manga.attributes.startDate || "TBA"}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
            disabled={mangaList.length < limit}>
            Next →
          </button>
        </div>
      </div>
    </>
  )
}
