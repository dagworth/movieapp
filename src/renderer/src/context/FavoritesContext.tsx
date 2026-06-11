import { createContext, useState, useEffect } from 'react';

export interface ShowDetails {
  id: string;
  name: string;
  max_episodes: number;
  ended: boolean;
  image: string;
}

export const FavoritesContext = createContext<{
  favorites: Record<string, ShowDetails>;
  toggleFavorite: (show: ShowDetails) => void;
} | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Record<string, ShowDetails>>({});

  useEffect(() => {
    const stored = localStorage.getItem('asd');
    setFavorites(stored ? JSON.parse(stored) : {});
  }, []);

  const toggleFavorite = (show: ShowDetails) => {
    setFavorites((prev) => {
      const newFavorites = { ...prev };
      
      if (newFavorites[show.id]) {
        delete newFavorites[show.id];
      } else {
        newFavorites[show.id] = show;
      }
      
      localStorage.setItem('asd', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}