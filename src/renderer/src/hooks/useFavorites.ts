import { useState, useEffect } from 'react'

export function useFavorites(animeId: string) {
  const [favorite, setFavorite] = useState<boolean>(false)

  useEffect(() => {
    const stored = localStorage.getItem('favorite_shows')
    const allFavorites = stored ? JSON.parse(stored) : {}
    setFavorite(!!allFavorites[animeId])
  }, [animeId])

  const toggleFavorite = () => {
    const raw = localStorage.getItem('favorite_shows')
    const allFavorites = raw ? JSON.parse(raw) : {}

    // Toggle logic
    const newState = !allFavorites[animeId]

    if (newState) {
      allFavorites[animeId] = true
    } else {
      delete allFavorites[animeId]
    }

    localStorage.setItem('favorite_shows', JSON.stringify(allFavorites))
    setFavorite(newState)
  }

  return { favorite, toggleFavorite }
}
