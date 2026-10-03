import { BrowserRouter, Route, Routes } from 'react-router'
import { AnimeList } from './pages/anime-list'
import { AnimeDetails } from './pages/anime-details'

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-6xl m-auto">
        <Routes>
          <Route path="/" element={<AnimeList />} />
          <Route path='anime/:id' element={<AnimeDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
