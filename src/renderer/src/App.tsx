import { useState, createContext } from 'react';
import { MediaFinder } from './pages/MediaFinder';
import { EpisodeSelector } from './pages/EpisodeSelector/EpisodeSelector';
import { NavBar } from './components/NavBar/NavBar';

export const context = createContext({
  page: 'finder',
  setPage: (_p: string) => {},
  animeId: null,
  setAnimeId: (_a: any) => {},
  animeName: "",
  setAnimeName: (_a: string) => {},
});

function App() {
  const [page, setPage] = useState('finder');
  const [animeId, setAnimeId] = useState(null);
  const [animeName, setAnimeName] = useState('');

  return (
    <div>
      <context.Provider value={{ page, setPage, animeId, setAnimeId, animeName, setAnimeName}}>
        <NavBar/>
        {page === 'finder' && <MediaFinder/>}
        {page === 'episodes' && <EpisodeSelector/>}
      </context.Provider>
    </div>
  )
}

export default App;