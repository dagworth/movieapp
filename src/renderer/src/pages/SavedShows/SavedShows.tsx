import { useContext } from "react"
import styles from "./SavedShows.module.css"
import { FavoritesContext } from "@renderer/context/FavoritesContext";
import { SavedAnimeBox } from "@renderer/components/SavedAnimeBox/SavedAnimeBox";

export function SavedShows() {
  const context = useContext(FavoritesContext);
    
  const { favorites } = context!;
  const favoriteShows = Object.values(favorites);

  return (
    <div className={styles.container}>      
      {favoriteShows.length > 0 ? (
        <div className={styles.grid}>
          {favoriteShows.map((show) => (
            <SavedAnimeBox show = {show}/>
          ))}
        </div>
      ) : (
        <p className={styles.no}>no saved shows :(</p>
      )}
    </div>
  )
}