// hooks/useHouses.ts
import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { House, CreateHouseData, UpdateHouseData } from '@/types/house';

export function useHouses() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all houses
  const fetchHouses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const q = query(
        collection(db, 'houses'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const housesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to strings
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
        availableDate: doc.data().availableDate
      })) as House[];
      
      setHouses(housesData);
    } catch (err) {
      console.error('Error fetching houses:', err);
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  // Add a new house
  const addHouse = async (houseData: CreateHouseData) => {
    try {
      const docRef = await addDoc(collection(db, 'houses'), {
        ...houseData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const newHouse = {
        id: docRef.id,
        ...houseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as House;
      
      setHouses(prev => [newHouse, ...prev]);
      return docRef.id;
    } catch (err) {
      console.error('Error adding house:', err);
      throw new Error('Failed to add listing');
    }
  };

  // Update an existing house
  const updateHouse = async (houseId: string, updates: UpdateHouseData) => {
    try {
      const houseRef = doc(db, 'houses', houseId);
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await updateDoc(houseRef, updateData);
      
      setHouses(prev => prev.map(house => 
        house.id === houseId 
          ? { 
              ...house, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            }
          : house
      ));
    } catch (err) {
      console.error('Error updating house:', err);
      throw new Error('Failed to update listing');
    }
  };

  // Delete a house
  const deleteHouse = async (houseId: string) => {
    try {
      await deleteDoc(doc(db, 'houses', houseId));
      setHouses(prev => prev.filter(house => house.id !== houseId));
    } catch (err) {
      console.error('Error deleting house:', err);
      throw new Error('Failed to delete listing');
    }
  };

  // Get houses by landlord ID
  const getHousesByLandlord = async (landlordId: string) => {
    try {
      const q = query(
        collection(db, 'houses'),
        where('landlordId', '==', landlordId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
        availableDate: doc.data().availableDate
      })) as House[];
    } catch (err) {
      console.error('Error fetching landlord houses:', err);
      throw new Error('Failed to load your listings');
    }
  };

  // Toggle house active status
  const toggleHouseStatus = async (houseId: string, isActive: boolean) => {
    try {
      await updateHouse(houseId, { isActive });
    } catch (err) {
      console.error('Error toggling house status:', err);
      throw new Error('Failed to update listing status');
    }
  };

  // Get single house by ID
  const getHouseById = (houseId: string): House | undefined => {
    return houses.find(house => house.id === houseId);
  };

  // Initial fetch
  useEffect(() => {
    fetchHouses();
  }, []);

  return {
    houses,
    loading,
    error,
    addHouse,
    updateHouse,
    deleteHouse,
    getHousesByLandlord,
    toggleHouseStatus,
    getHouseById,
    refetch: fetchHouses
  };
}