'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHouses } from '@/hooks/useHouses';
import { useBlockedUsers } from '@/hooks/useBlockedUsers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { House } from '@/types/house';
import { isAdminEmail } from '@/lib/admin';
import {
  LayoutDashboard,
  Users,
  Home,
  Search,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  MoreVertical,
  Activity,
  ArrowUpRight,
  UserX
} from 'lucide-react';

type Tab = 'listings' | 'users';

interface UserInfo {
  email: string;
  name: string;
  landlordId: string;
  listingCount: number;
}

export default function AdminDashboard() {
  const { currentUser, isAdmin } = useAuth();
  const { houses, loading, error, deleteHouse } = useHouses();
  const { blockedUsers, loading: blockedLoading, blockUser, unblockUser, isBlocked } = useBlockedUsers();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [blockLoading, setBlockLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('listings');
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!currentUser || !isAdmin)) {
      router.push('/');
    }
  }, [currentUser, isAdmin, loading, router]);

  const users = useMemo(() => {
    const map = new Map<string, UserInfo>();
    (houses as House[]).forEach((house) => {
      const email = house.landlordContact?.email?.toLowerCase() || '';
      if (!email) return;
      const existing = map.get(email);
      if (existing) {
        existing.listingCount++;
      } else {
        map.set(email, {
          email,
          name: house.landlordContact?.name || 'Unknown',
          landlordId: house.landlordId,
          listingCount: 1,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.listingCount - a.listingCount);
  }, [houses]);

  const filteredListings = (houses as House[]).filter((house) => {
    const term = searchTerm.toLowerCase();
    return (
      house.title.toLowerCase().includes(term) ||
      house.address.toLowerCase().includes(term) ||
      house.landlordContact?.email?.toLowerCase().includes(term)
    );
  });

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return user.email.includes(term) || user.name.toLowerCase().includes(term);
  });

  // Calculate Stats
  const stats = [
    {
      title: 'Total Listings',
      value: houses.length,
      change: '+12%',
      icon: Home,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
    {
      title: 'Active Users',
      value: users.length,
      change: '+5%',
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
    {
      title: 'Global Reports',
      value: '2',
      change: '-5%',
      icon: Activity,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
    {
      title: 'Blocked Users',
      value: users.filter(u => isBlocked(u.email)).length,
      change: '0%',
      icon: UserX,
      color: 'text-red-400',
      bg: 'bg-red-400/10'
    }
  ];

  const handleDelete = async (houseId: string) => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      try {
        setDeleteLoading(houseId);
        await deleteHouse(houseId);
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing. Please try again.');
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const handleBlock = async (email: string) => {
    if (isAdminEmail(email)) {
      alert('Cannot block an admin account.');
      return;
    }
    const action = isBlocked(email) ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} ${email}?`)) return;
    try {
      setBlockLoading(email);
      if (action === 'block') {
        await blockUser(email, currentUser!.email!);
      } else {
        await unblockUser(email);
      }
    } catch (err) {
      alert(`Failed to ${action} user.`);
    } finally {
      setBlockLoading(null);
    }
  };

  if (!currentUser || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950 text-white font-sans">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gray-950"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your platform's listings and user base.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm shadow-sm">
              <span className="text-sm font-medium text-purple-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                System Operational
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-2xl hover:bg-white/[0.07] transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium bg-white/5 px-2 py-1 rounded-lg text-gray-300">
                  {stat.change} <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-white font-mono">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl">
          {/* Controls Bar */}
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center">

            {/* Tabs */}
            <div className="flex p-1 bg-black/20 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => { setActiveTab('listings'); setSearchTerm(''); }}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'listings'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Listings
              </button>
              <button
                onClick={() => { setActiveTab('users'); setSearchTerm(''); }}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'users'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Users className="w-4 h-4" />
                Users
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'listings' ? 'Search listings...' : 'Search users...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-black/30 transition-all"
              />
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto min-h-[400px]">
            {activeTab === 'listings' ? (
              // Listings Table
              <div className="w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Landlord</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-4"><div className="h-10 bg-white/5 rounded-lg w-48"></div></td>
                          <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-32"></div></td>
                          <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded w-20"></div></td>
                          <td className="px-6 py-4"></td>
                        </tr>
                      ))
                    ) : filteredListings.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                          No listings found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredListings.map((house) => (
                        <tr key={house.id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              {house.images?.[0] ? (
                                <img src={house.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-800" />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                                  <Home className="w-6 h-6 text-gray-500" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-white group-hover:text-purple-400 transition-colors">{house.title}</div>
                                <div className="text-xs text-gray-500">{house.address}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-300">{house.landlordContact?.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">
                              {house.landlordContact?.email}
                              {isBlocked(house.landlordContact?.email) && (
                                <span className="ml-2 text-red-400 text-[10px] uppercase font-bold tracking-wider">[Blocked]</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              ${house.price.toLocaleString()}/mo
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* View Button */}
                              <Link
                                href={`/listing/${house.id}`}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                title="View details"
                              >
                                <ArrowUpRight className="w-4 h-4" />
                              </Link>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDelete(house.id)}
                                disabled={deleteLoading === house.id}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                                title="Delete listing"
                              >
                                {deleteLoading === house.id ? (
                                  <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              // Users Table
              <div className="w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Listings</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading || blockedLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-4"><div className="h-10 bg-white/5 rounded-lg w-48"></div></td>
                          <td className="px-6 py-4 text-center"><div className="h-4 bg-white/5 rounded w-8 mx-auto"></div></td>
                          <td className="px-6 py-4 text-center"><div className="h-6 bg-white/5 rounded-full w-20 mx-auto"></div></td>
                          <td className="px-6 py-4"></td>
                        </tr>
                      ))
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                          No users found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const blocked = isBlocked(user.email);
                        return (
                          <tr key={user.email} className={`group transition-colors ${blocked ? 'bg-red-500/[0.02] hover:bg-red-500/[0.05]' : 'hover:bg-white/[0.02]'}`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium text-white">{user.name}</div>
                                  <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-gray-300 font-medium">{user.listingCount}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {blocked ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                  Blocked
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {isAdminEmail(user.email) ? (
                                <span className="text-xs text-gray-500">Admin</span>
                              ) : (
                                <button
                                  onClick={() => handleBlock(user.email)}
                                  disabled={blockLoading === user.email}
                                  className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 ${blocked
                                    ? 'border-purple-500/20 text-purple-400 hover:bg-purple-500/10'
                                    : 'border-red-500/20 text-red-400 hover:bg-red-500/10'
                                    }`}
                                >
                                  {blockLoading === user.email ? (
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto"></div>
                                  ) : (
                                    blocked ? 'Unblock User' : 'Block User'
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
