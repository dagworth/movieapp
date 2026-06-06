import { useState, useEffect } from 'react';
import styles from './AnimeSearchBar.module.css'

export default function AnimeSearchBar({setResults}) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const last = localStorage.getItem('last_search');
        if (last) {
            setQuery(last);
            const performInitialSearch = async () => {
                const data = await window.api.api_searchAnime(last);
                setResults(data);
            };
            
            performInitialSearch();
        }
    }, []);

    const handleSearch = async () => {
        localStorage.setItem('last_search', query);
        const data = await window.api.api_searchAnime(query);
        setResults(data); 
    };

    return (
        <div>
            <input
                className={styles.input}
                value={query}
                onChange={(e) => setQuery(e.target.value)} 
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
                placeholder="search anime..." 
            />
        </div>
    );
}