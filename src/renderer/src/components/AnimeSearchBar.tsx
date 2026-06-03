import { useState } from 'react';

export default function AnimeSearchBar({setResults}) {
    const [query, setQuery] = useState('');

    const handleSearch = async () => {
        const data = await window.api.api_searchAnime(query);
        setResults(data); 
        console.log(data);
    };

    return (
        <div>
            <input
                className='input'
                style={{
                    width: '90%',
                    height: '30px',
                    textAlign: 'left',
                    color: 'white'
                }}
                value={query}
                onChange={(e) => setQuery(e.target.value)} 
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
                placeholder="Search anime..." 
            />
        </div>
    );
}