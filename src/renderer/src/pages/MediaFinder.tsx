import { useState } from 'react';
import AnimeSearchBar from '../components/AnimeSearchBar/AnimeSearchBar';
import ShowList from '../components/ShowList/ShowList';

export function MediaFinder(){
    const [results, setResults] = useState([]);

    return (
        <div className="App">
            <AnimeSearchBar setResults = {setResults}/>
            <ShowList results = {results}/>
        </div>
    );
}