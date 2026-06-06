import { useContext } from 'react';
import { context } from '../../App';
import styles from './NavBar.module.css';

export function NavBar() {
  const { page, setPage } = useContext(context);

  return (
    <nav className={styles.nav}>
      <button
        className={`${styles.button} ${page === 'finder' ? styles.activeButton : ''}`}
        onClick={() => setPage('finder')}
      >Finder</button>

      <button
        className={`${styles.button} ${page === 'following' ? styles.activeButton : ''}`}
        onClick={() => setPage('following')}
      >Following</button>
    </nav>
  );
}