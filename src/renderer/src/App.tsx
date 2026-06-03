import { useState, createContext } from 'react';
import { MediaFinder } from './pages/MediaFinder';
import { EpisodeShower } from './pages/EpisodeShower';

export const context = createContext({
  page: 'finder',
  setPage: (_p: string) => {},
  animeId: null,
  setAnimeId: (_a: any) => {},
});

function App() {
  const [page, setPage] = useState('finder');
  const [animeId, setAnimeId] = useState(null);

  return (
    <div>
      <context.Provider value={{ page, setPage, animeId, setAnimeId}}>
        {page === 'finder' && <MediaFinder/>}
        {page === 'episodes' && <EpisodeShower/>}
      </context.Provider>
    </div>
  )
}

export default App;