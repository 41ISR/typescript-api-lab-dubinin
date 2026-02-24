import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AnimeList } from "./pages/AnimeList"
import { AnimeDetail } from "./pages/AnimeDetail"
import { MangaList } from "./pages/MangaList"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnimeList />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/manga" element={<MangaList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
