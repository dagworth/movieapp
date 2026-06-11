import { FavoritesContext, ShowDetails } from "@renderer/context/FavoritesContext";
import { useContext } from 'react';

export function useFavorites(show: ShowDetails) {
  const context = useContext(FavoritesContext);  
  const { favorites, toggleFavorite } = context!;
  
  return { 
    favorite: !!favorites[show.id],     
    toggleFavorite: () => toggleFavorite(show) 
  };
}