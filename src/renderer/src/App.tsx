import { useState, createContext } from 'react'
import { MediaFinder } from './pages/MediaFinder'
import { EpisodeSelector } from './pages/EpisodeSelector/EpisodeSelector'
import { SavedShows } from './pages/SavedShows/SavedShows'
import { NavBar } from './components/NavBar/NavBar'
import { FavoritesProvider } from './context/FavoritesContext'; // adjust path

export const context = createContext({
  page: 'search',
  setPage: (_p: string) => {},
  animeId: null,
  setAnimeId: (_a: any) => {},
  animeName: '',
  setAnimeName: (_a: string) => {},
  animeImage: '',
  setAnimeImage: (_a: string) => {},
  animeEnded: false,
  setAnimeEnded: (_a: boolean) => {},
})

function App() {
  const [page, setPage] = useState('search')
  const [animeId, setAnimeId] = useState(null)
  const [animeName, setAnimeName] = useState('')
  const [animeImage, setAnimeImage] = useState('')
  const [animeEnded, setAnimeEnded] = useState(false)

  return (
    <div>
      <FavoritesProvider>
        <context.Provider value={{ page, setPage, animeId, setAnimeId, animeName, setAnimeName, animeImage, setAnimeImage, animeEnded, setAnimeEnded }}>
          <NavBar />
          {page === 'search' && <MediaFinder />}
          {page === 'episodes' && <EpisodeSelector />}
          {page === 'saved' && <SavedShows />}
        </context.Provider>
      </FavoritesProvider>
    </div>
  )
}

export default App
