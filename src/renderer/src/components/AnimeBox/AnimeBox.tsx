import { useState, useEffect, useContext } from 'react'
import { context } from '../../App'
import styles from './AnimeBox.module.css'

export function AnimeBox({ anime }) {
  const [imgSrc, setImgSrc] = useState(anime.thumbnail)
  const { setPage, setAnimeId, setAnimeName } = useContext(context)

  useEffect(() => {
    if (anime.thumbnail.startsWith('mc')) {
      setImgSrc('/assets/qiqi.png')
    } else {
      setImgSrc(anime.thumbnail)
    }
  }, [anime.thumbnail])

  async function selectAnime() {
    setPage('episodes')
    setAnimeId(anime._id)
    setAnimeName(anime.name)
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img className={styles.img} src={imgSrc} alt={anime.name} onClick={() => selectAnime()} />
        <div className={styles.overlay}>
          <span className={styles.episodes}>Ep {anime.availableEpisodes.sub}</span>
          <span className={styles.score}>☆{anime.score}</span>
        </div>
      </div>
      <div className={styles.title}>{anime.name}</div>
    </div>
  )
}
