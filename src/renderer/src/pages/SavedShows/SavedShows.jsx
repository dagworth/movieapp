import { useContext } from "react"
import styles from "./SavedShows.module.css"
import { FavoritesContext } from "@renderer/context/FavoritesContext";

export function SavedShows() {
  const context = useContext(FavoritesContext);
  
  if (!context) return null;
  
  const { favorites, toggleFavorite } = context;
  const favoriteShows = Object.values(favorites);

  console.table(favorites)

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Saved Shows</h2>
      
      {favoriteShows.length > 0 ? (
        <div className={styles.grid}>
          {favoriteShows.map((show) => (
            <div key={show.id} className={styles.card}>
              <img src={show.image} alt={show.name} className={styles.image} />
              <h3>{show.name}</h3>
              <p>status: {String(show.ended)}</p>
              <button 
                className={styles.removeButton} 
                onClick={() => toggleFavorite(show)}
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>no saved shows</p>
      )}
    </div>
  )
}