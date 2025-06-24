'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHouses } from '@/hooks/useHouses';
import { sampleHouses } from '@/lib/sampleData';

export default function SeedData() {
  const { currentUser } = useAuth();
  const { addHouse } = useHouses();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const seedDatabase = async () => {
    if (!currentUser) {
      setMessage('Please sign in first');
      return;
    }

    try {
      setLoading(true);
      setMessage('Adding sample houses...');

      for (const house of sampleHouses) {
        const houseData = {
          ...house,
          landlordId: currentUser.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await addHouse(houseData);
      }

      setMessage(`Successfully added ${sampleHouses.length} sample houses!`);
    } catch (error) {
      console.error('Error seeding data:', error);
      setMessage('Error adding sample data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Seed Database</h1>
        <p className="text-gray-600 mb-6">
          Add sample house listings to test the application
        </p>
        
        <button
          onClick={seedDatabase}
          disabled={loading || !currentUser}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Adding Data...' : 'Add Sample Data'}
        </button>
        
        {message && (
          <p className={`mt-4 text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
        
        {!currentUser && (
          <p className="mt-4 text-sm text-red-600">
            Please sign in to add sample data
          </p>
        )}
      </div>
    </div>
  );
}