import { AnimeBox } from '../AnimeBox/AnimeBox'
import styles from './ShowList.module.css'

export default function ShowList({ results }) {
  console.table(results)
  if (results.length === 0) return null
  const sorted = [...results].sort((a, b) => b.score - a.score)

  return (
    <div className={styles.list}>
      {sorted.map((anime) => (
        <AnimeBox key={anime._id} anime={anime} />
      ))}
    </div>
  )
}
