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
      color: 'text-brand',
      bg: 'bg-brand/10'
    },
    {
      title: 'Active Users',
      value: users.length,
      change: '+5%',
      icon: Users,
      color: 'text-brand',
      bg: 'bg-brand/10'
    },
    {
      title: 'Global Reports',
      value: '2',
      change: '-5%',
      icon: Activity,
      color: 'text-brand',
      bg: 'bg-brand/10'
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
    <div className="min-h-screen relative overflow-hidden bg-[#f0f4ff] text-gray-900 font-sans">
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your platform's listings and user base.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
                System Operational
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-5 hover:bg-gray-50/80 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium rounded-full bg-gray-100 px-2 py-1 text-gray-600">
                  {stat.change} <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 font-mono">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Controls Bar */}
          <div className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-center">

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-full w-full sm:w-auto">
              <button
                onClick={() => { setActiveTab('listings'); setSearchTerm(''); }}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'listings'
                  ? 'rounded-full bg-brand text-white hover:opacity-90 active:scale-[0.98] transition-all'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200 active:scale-[0.98] transition-all'
                  }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Listings
              </button>
              <button
                onClick={() => { setActiveTab('users'); setSearchTerm(''); }}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'users'
                  ? 'rounded-full bg-brand text-white hover:opacity-90 active:scale-[0.98] transition-all'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200 active:scale-[0.98] transition-all'
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
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
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
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Landlord</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/80">
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-4"><div className="h-10 bg-gray-100 rounded-lg w-48"></div></td>
                          <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                          <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
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
                        <tr key={house.id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              {house.images?.[0] ? (
                                <img src={house.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-200" />
                              ) : (
                                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                                  <Home className="w-6 h-6 text-gray-500" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">{house.title}</div>
                                <div className="text-xs text-gray-500">{house.address}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">{house.landlordContact?.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">
                              {house.landlordContact?.email}
                              {isBlocked(house.landlordContact?.email) && (
                                <span className="ml-2 text-red-400 text-[10px] uppercase font-bold tracking-wider">[Blocked]</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-900">
                              ${house.price.toLocaleString()}/mo
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* View Button */}
                              <Link
                                href={`/listing/${house.id}`}
                                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all active:scale-[0.98]"
                                title="View details"
                              >
                                <ArrowUpRight className="w-4 h-4" />
                              </Link>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDelete(house.id)}
                                disabled={deleteLoading === house.id}
                                className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 active:scale-[0.98] transition-all disabled:opacity-50"
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
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Listings</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/80">
                    {loading || blockedLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-4"><div className="h-10 bg-gray-100 rounded-lg w-48"></div></td>
                          <td className="px-6 py-4 text-center"><div className="h-4 bg-gray-100 rounded w-8 mx-auto"></div></td>
                          <td className="px-6 py-4 text-center"><div className="h-6 bg-gray-100 rounded-full w-20 mx-auto"></div></td>
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
                          <tr key={user.email} className={`group transition-colors ${blocked ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-gray-50/50'}`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold shadow-sm">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{user.name}</div>
                                  <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-gray-600 font-medium">{user.listingCount}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {blocked ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                  Blocked
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
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
                                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all disabled:opacity-50 active:scale-[0.98] ${blocked
                                    ? 'rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200'
                                    : 'rounded-full bg-red-50 text-red-500 hover:bg-red-100'
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
