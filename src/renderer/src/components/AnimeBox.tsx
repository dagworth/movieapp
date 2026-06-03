import { useState, useEffect, useContext } from 'react';
import { context } from '../App';

export function AnimeBox({anime}){
    const [imgSrc, setImgSrc] = useState(anime.thumbnail);
    const { setPage, setAnimeId } = useContext(context);

    useEffect(() => {
        setImgSrc(anime.thumbnail);
    }, [anime.thumbnail]);

    async function selectAnime(){
        setPage?.('episodes')
        setAnimeId?.(anime._id)
    }

    return  (
        <div
            style={{ 
                width: '200px',
                height: '365px',
                textAlign: 'center' 
            }}
            onClick={() => selectAnime()}
            >
        <img src={imgSrc} width="200" height="283"
        onError={() => {
            setImgSrc('/assets/qiqi.png');
        }}/>
        {anime.name} ({anime.availableEpisodes.sub})
        </div>
    )
}