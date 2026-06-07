import { useState, createContext } from 'react'
import { MediaFinder } from './pages/MediaFinder'
import { EpisodeSelector } from './pages/EpisodeSelector/EpisodeSelector'
import { SavedShows } from './pages/SavedShows/SavedShows'
import { NavBar } from './components/NavBar/NavBar'

export const context = createContext({
  page: 'search',
  setPage: (_p: string) => {},
  animeId: null,
  setAnimeId: (_a: any) => {},
  animeName: '',
  setAnimeName: (_a: string) => {}
})

function App() {
  const [page, setPage] = useState('search')
  const [animeId, setAnimeId] = useState(null)
  const [animeName, setAnimeName] = useState('')

  return (
    <div>
      <context.Provider value={{ page, setPage, animeId, setAnimeId, animeName, setAnimeName }}>
        <NavBar />
        {page === 'search' && <MediaFinder />}
        {page === 'episodes' && <EpisodeSelector />}
        {page === 'saved' && <SavedShows />}
      </context.Provider>
    </div>
  )
}

export default App
