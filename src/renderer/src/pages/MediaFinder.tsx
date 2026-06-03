import { useState } from 'react';
import AnimeSearchBar from './../components/AnimeSearchBar';
import ShowList from './../components/ShowList';

export function MediaFinder(){
    const [results, setResults] = useState([]);

    return (
        <div className="App">
            <h1>u can watch cool pirated stuff here</h1>
            <AnimeSearchBar setResults = {setResults}/>
            <ShowList results = {results}/>
        </div>
    );
}