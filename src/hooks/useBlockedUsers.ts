import { useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface BlockedUser {
  email: string;
  blockedAt: string;
  blockedBy: string;
}

export function useBlockedUsers() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlockedUsers = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'blockedUsers'));
      const users = snapshot.docs.map(d => ({
        email: d.id,
        blockedAt: d.data().blockedAt?.toDate?.()?.toISOString() || d.data().blockedAt,
        blockedBy: d.data().blockedBy || '',
      }));
      setBlockedUsers(users);
    } catch (err) {
      console.error('Error fetching blocked users:', err);
    } finally {
      setLoading(false);
    }
  };

  const blockUser = async (email: string, adminEmail: string) => {
    const key = email.toLowerCase();
    try {
      await setDoc(doc(db, 'blockedUsers', key), {
        blockedAt: new Date(),
        blockedBy: adminEmail,
      });
      setBlockedUsers(prev => [...prev, { email: key, blockedAt: new Date().toISOString(), blockedBy: adminEmail }]);
    } catch (err) {
      console.error('Error blocking user:', err);
      throw new Error('Failed to block user');
    }
  };

  const unblockUser = async (email: string) => {
    const key = email.toLowerCase();
    try {
      await deleteDoc(doc(db, 'blockedUsers', key));
      setBlockedUsers(prev => prev.filter(u => u.email !== key));
    } catch (err) {
      console.error('Error unblocking user:', err);
      throw new Error('Failed to unblock user');
    }
  };

  const isBlocked = (email: string | null | undefined): boolean => {
    if (!email) return false;
    return blockedUsers.some(u => u.email === email.toLowerCase());
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  return { blockedUsers, loading, blockUser, unblockUser, isBlocked, refetch: fetchBlockedUsers };
}
