// hooks/useFavorites.ts
import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  doc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface Favorite {
  id: string;
  userId: string;
  houseId: string;
  createdAt: string;
}

export function useFavorites() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's favorites
  useEffect(() => {
    if (!currentUser) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'favorites'),
          where('userId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const favoriteHouseIds = querySnapshot.docs.map(doc => doc.data().houseId);
        setFavorites(favoriteHouseIds);
        setError(null);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  // Add a house to favorites
  const addToFavorites = async (houseId: string) => {
    if (!currentUser) {
      throw new Error('Please sign in to add favorites');
    }

    try {
      await addDoc(collection(db, 'favorites'), {
        userId: currentUser.uid,
        houseId: houseId,
        createdAt: new Date()
      });
      
      setFavorites(prev => [...prev, houseId]);
    } catch (err) {
      console.error('Error adding to favorites:', err);
      throw new Error('Failed to add to favorites');
    }
  };

  // Remove a house from favorites
  const removeFromFavorites = async (houseId: string) => {
    if (!currentUser) {
      throw new Error('Please sign in to manage favorites');
    }

    try {
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', currentUser.uid),
        where('houseId', '==', houseId)
      );
      
      const querySnapshot = await getDocs(q);
      const promises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(promises);
      
      setFavorites(prev => prev.filter(id => id !== houseId));
    } catch (err) {
      console.error('Error removing from favorites:', err);
      throw new Error('Failed to remove from favorites');
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (houseId: string) => {
    if (!currentUser) {
      throw new Error('Please sign in to manage favorites');
    }

    try {
      if (favorites.includes(houseId)) {
        await removeFromFavorites(houseId);
      } else {
        await addToFavorites(houseId);
      }
    } catch (err) {
      throw err;
    }
  };

  // Check if a house is favorited
  const isFavorite = (houseId: string): boolean => {
    return favorites.includes(houseId);
  };

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite
  };
}