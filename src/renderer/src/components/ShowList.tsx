import { AnimeBox } from './AnimeBox'
export default function ShowList({ results }) {
    if (results.length === 0) return null;

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1%',
            padding: '20px'
        }}>
            {results.map((anime) => (
               <AnimeBox anime = {anime}/>
            ))}
        </div>
    );
}