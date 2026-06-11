import { useState, useEffect, useContext } from 'react'
import { context } from '../../App'
import styles from './AnimeBox.module.css'

export function AnimeBox({ anime }) {
  const [imgSrc, setImgSrc] = useState(anime.thumbnail)
  const { setPage, setAnimeId, setAnimeName, setAnimeEnded, setAnimeMaxEps, setAnimeImage } = useContext(context)
  const isMovie = anime.availableEpisodes.sub == 1 && anime.episodeCount == 1;

  useEffect(() => {
    if (anime.thumbnail.startsWith('mc')) {
      setImgSrc('/assets/qiqi.png')
    } else {
      setImgSrc(anime.thumbnail)
    }
  }, [anime.thumbnail])

  async function selectAnime() {
    setAnimeId(anime._id)
    setAnimeName(anime.name)
    setAnimeImage(imgSrc)
    setAnimeMaxEps(anime.episodeCount)
    setAnimeEnded(anime.episodeCount == anime.lastEpisodeInfo.sub.episodeString)
    setPage('episodes')
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img className={styles.img} src={imgSrc} alt={anime.name} onClick={() => selectAnime()} />
        <div className={styles.overlay}>
          <span className={styles.episodes}>
            {isMovie ? 'Movie' : `Ep ${anime.availableEpisodes.sub}`}
          </span>
          <span className={styles.score}>☆ {anime.score}</span>
        </div>
      </div>
      <div className={styles.title}>{anime.name}</div>
    </div>
  )
}
