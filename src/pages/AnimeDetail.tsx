import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { getAnimeById } from "../api/anime"
import type { Anime } from "../types"
import { Loader } from "../components/Loader"
import { ErrorMessage } from "../components/ErrorMessage"

export const AnimeDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [anime, setAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnime = async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const response = await getAnimeById(id)
        setAnime(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load anime")
      } finally {
        setLoading(false)
      }
    }

    fetchAnime()
  }, [id])

  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} />
  if (!anime) return <ErrorMessage message="Anime not found" />

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
        <Link to="/" className="back-button">
          <span className="back-icon">←</span>
          Back to List
        </Link>

        <div className="detail-page">
          <div className="detail-container">
            <div className="detail-image-section">
              <img
                src={anime.attributes.posterImage.large}
                alt={anime.attributes.canonicalTitle}
                className="detail-main-image"
              />
            </div>

            <div className="detail-content-section">
              <div className="detail-header">
                <h1 className="detail-title">{anime.attributes.canonicalTitle}</h1>
                <p className="detail-subtitle">{anime.attributes.showType}</p>

                <div className="detail-meta">
                  <div className="detail-stats">
                    {anime.attributes.averageRating && (
                      <span className="stat-item">
                        <span>Rating:</span>
                        <span style={{ color: "#10b981", fontWeight: 600 }}>
                          ⭐ {parseFloat(anime.attributes.averageRating).toFixed(1)}
                        </span>
                      </span>
                    )}
                    <span className="stat-item">
                      <span>Status:</span>
                      <span style={{ fontWeight: 600 }}>{anime.attributes.status}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h2 className="section-title">Synopsis</h2>
                <div className="detail-description">
                  <p>{anime.attributes.synopsis || "No synopsis available"}</p>
                </div>
              </div>

              <div className="detail-section">
                <h2 className="section-title">Information</h2>
                <table className="info-table">
                  <tbody>
                    <tr>
                      <th>Title</th>
                      <td>{anime.attributes.canonicalTitle}</td>
                    </tr>
                    <tr>
                      <th>Type</th>
                      <td>{anime.attributes.showType}</td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>{anime.attributes.status}</td>
                    </tr>
                    {anime.attributes.episodeCount && (
                      <tr>
                        <th>Episodes</th>
                        <td>{anime.attributes.episodeCount}</td>
                      </tr>
                    )}
                    {anime.attributes.episodeLength && (
                      <tr>
                        <th>Episode Length</th>
                        <td>{anime.attributes.episodeLength} min</td>
                      </tr>
                    )}
                    <tr>
                      <th>Start Date</th>
                      <td>{anime.attributes.startDate || "TBA"}</td>
                    </tr>
                    {anime.attributes.endDate && (
                      <tr>
                        <th>End Date</th>
                        <td>{anime.attributes.endDate}</td>
                      </tr>
                    )}
                    {anime.attributes.averageRating && (
                      <tr>
                        <th>Average Rating</th>
                        <td>{parseFloat(anime.attributes.averageRating).toFixed(2)}</td>
                      </tr>
                    )}
                    {anime.attributes.popularityRank && (
                      <tr>
                        <th>Popularity Rank</th>
                        <td>#{anime.attributes.popularityRank}</td>
                      </tr>
                    )}
                    {anime.attributes.ratingRank && (
                      <tr>
                        <th>Rating Rank</th>
                        <td>#{anime.attributes.ratingRank}</td>
                      </tr>
                    )}
                    {anime.attributes.ageRating && (
                      <tr>
                        <th>Age Rating</th>
                        <td>
                          {anime.attributes.ageRating}
                          {anime.attributes.ageRatingGuide &&
                            ` - ${anime.attributes.ageRatingGuide}`}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="detail-section">
                <h2 className="section-title">Tags</h2>
                <div className="detail-tags">
                  <span className="tag">{anime.attributes.showType}</span>
                  <span className="tag secondary">{anime.attributes.status}</span>
                  {anime.attributes.ageRating && (
                    <span className="tag warning">{anime.attributes.ageRating}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
