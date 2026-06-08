import { FavoritesContext, ShowDetails } from "@renderer/context/FavoritesContext";
import { useContext } from 'react';

export function useFavorites(show: ShowDetails) {
  const context = useContext(FavoritesContext);  
  const { favorites, toggleFavorite } = context!;
  
  return { 
    // Check if the show exists in the dictionary by ID
    favorite: !!favorites[show.id], 
    
    // Pass the entire show object to the toggle function
    toggleFavorite: () => toggleFavorite(show) 
  };
}