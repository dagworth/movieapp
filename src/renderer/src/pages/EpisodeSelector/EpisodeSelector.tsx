import { useState, useEffect, useContext } from 'react';
import { context } from '../../App';
import { MPVLogViwer } from '../../components/MPVLogViewer'

import styles from './EpisodeSelector.module.css'

export function EpisodeSelector(){
    const { animeId, animeName } = useContext(context);
    const [ animeEpisodes, setAnimeEpisodes ] = useState([]);

    async function playAnime(episodeId) {
        const streamData = await window.api.api_getAnimeVideo(animeId!, episodeId);
        console.log("sources:", streamData);

        const playableSource = 
            streamData.find(s => s.isM3U8) || // m3u8 priority
            streamData.find(s => s.provider === 'S-mp4') || // fast internal mirrors
            streamData.find(s => s.provider === 'Yt-mp4') || //dnld source
            streamData[0];

        if (playableSource?.sourceUrl) {
            console.log("Selected Source:", playableSource.sourceUrl);
            window.api.api_launchPlayer(playableSource.sourceUrl);
        } else {
            console.log("no source :(")
        }
    }

    useEffect(() => {
        if (animeId) {
            async function a() {
                const data = await window.api.api_getAnimeEpisodeList(animeId!);
                setAnimeEpisodes(data)
            }
            
            a();
        }
    }, [animeId]);

    return (
        <div>
            <p>{animeName}</p>
            <div className={styles.episodeContainer}>
                {animeEpisodes.length > 0 ? (
                    animeEpisodes.map((ep: any) => (
                        <button className={styles.episodeButton} onClick={() => playAnime(ep)}>
                            Episode {ep}
                        </button>
                    ))
                ) : (
                    <p>loading</p>
                )}
            </div>
            <MPVLogViwer/>
        </div>
    )
}