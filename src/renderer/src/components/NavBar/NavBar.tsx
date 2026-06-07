import { useContext } from 'react'
import { context } from '../../App'
import styles from './NavBar.module.css'

export function NavBar() {
  const { page, setPage } = useContext(context)

  return (
    <nav className={styles.nav}>
      <button
        className={`${styles.button} ${page === 'search' ? styles.activeButton : ''}`}
        onClick={() => setPage('search')}
      >
        Search
      </button>

      <button
        className={`${styles.button} ${page === 'saved' ? styles.activeButton : ''}`}
        onClick={() => setPage('saved')}
      >
        Saved
      </button>
    </nav>
  )
}
