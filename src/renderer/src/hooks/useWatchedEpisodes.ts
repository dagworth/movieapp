import { useState, useEffect } from 'react'

export function useWatchedEpisodes(animeId: string) {
  const [watched, setWatched] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const stored = localStorage.getItem('watched_episodes')
    const allWatched = stored ? JSON.parse(stored) : {}
    setWatched(allWatched[animeId] || {})
  }, [animeId])

  const markWatched = (episodeId: number) => {
    const raw = localStorage.getItem('watched_episodes')
    const info = raw ? JSON.parse(raw) : {}

    const currentAnime = info[animeId] || {}

    currentAnime[episodeId] = true
    info[animeId] = currentAnime

    localStorage.setItem('watched_episodes', JSON.stringify(info))

    setWatched(currentAnime)
  }

  const markUnwatch = (episodeId: number) => {
    const raw = localStorage.getItem('watched_episodes')
    const info = raw ? JSON.parse(raw) : {}

    const currentAnime = info[animeId] || {}

    delete currentAnime[episodeId]
    info[animeId] = currentAnime

    localStorage.setItem('watched_episodes', JSON.stringify(info))

    setWatched(currentAnime)
  }

  const getLatestWatched = () => {
    console.table(watched)
    const watchedEpisodes = Object.keys(watched).map(Number);
    return watchedEpisodes.length > 0 ? Math.max(...watchedEpisodes) : 0;
  };

  return { watched, markWatched, markUnwatch, getLatestWatched }
}
