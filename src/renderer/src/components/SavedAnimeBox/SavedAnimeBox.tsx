import styles from './SavedAnimeBox.module.css'
import { useContext } from "react"
import { context as AppContext } from '../../App'
import { FavoritesContext } from "@renderer/context/FavoritesContext";
// import { useWatchedEpisodes } from "@renderer/hooks/useWatchedEpisodes";


export function SavedAnimeBox({show}) {
    const context = useContext(FavoritesContext);
    const { toggleFavorite } = context!;
    const { setPage, setAnimeId, setAnimeName, setAnimeEnded, setAnimeMaxEps, setAnimeImage } = useContext(AppContext)

    // const { getLatestWatched } = useWatchedEpisodes(String(show.id));

    async function selectAnime() {
        setAnimeId(show.id)
        setAnimeName(show.name)
        setAnimeImage(show.image)
        setAnimeMaxEps(show.max_episodes)
        setAnimeEnded(show.ended)
        setPage('episodes')
    }

    return (
        <div key={show.id} className={styles.card}>
            <img src={show.image}
                className={styles.image}
                onClick={()=>selectAnime()}/>
            <div className={styles.rowView}>
            <p className= {styles.title}>{show.name}</p>
            <p className= {styles.status}>Airing: {String(show.ended)}</p>
            {/* <button 
                className={styles.button}
                onClick={() => playAnime(getLatestWatched()+1)}
            >
                Resume Watching {getLatestWatched()+1}
            </button> */}
            <button 
                className={styles.button} 
                onClick={() => toggleFavorite(show)}
            >
                Remove from Favorites
            </button>
            </div>
        </div>
    )
}