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

    currentAnime[episodeId] = false
    info[animeId] = currentAnime

    localStorage.setItem('watched_episodes', JSON.stringify(info))

    setWatched(currentAnime)
  }

  return { watched, markWatched, markUnwatch }
}
