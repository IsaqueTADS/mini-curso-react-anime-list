import { BrowserRouter, Route, Routes } from 'react-router'
import { AnimeList } from './pages/anime-list'

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-6xl m-auto">
        <Routes>
          <Route path="/" element={<AnimeList />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
