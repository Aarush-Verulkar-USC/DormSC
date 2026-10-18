import { useEffect, useState } from 'react';
import { Users, Building2, ShieldAlert, BarChart3, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';
import { AdminStats, User, Listing } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ConfirmModal from '../components/ui/ConfirmModal';
import toast from 'react-hot-toast';

type Tab = 'users' | 'listings';

function StatCard({ icon, label, value, accent = false }: { icon: React.ReactNode; label: string; value: number; accent?: boolean }) {
  return (
    <div className={`bg-white border rounded-xl p-5 ${accent ? 'border-red-200' : 'border-line'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${accent ? 'bg-red-50' : 'bg-brand/10'}`}>
        {icon}
      </div>
      <p className="text-2xl font-semibold text-ink">{value.toLocaleString()}</p>
      <p className="text-sm text-muted mt-0.5">{label}</p>
    </div>
  );
}

export default function Admin() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('users');
  const [search, setSearch] = useState('');
  const [blockingId, setBlockingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getAdminStats(), api.getAdminUsers(), api.getAdminListings()])
      .then(([s, u, l]) => { setStats(s); setUsers(u); setListings(l); })
      .catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const handleBlock = async () => {
    if (!blockingId) return;
    try {
      const result = await api.blockUser(blockingId);
      setUsers(prev => prev.map(u => u._id === blockingId ? { ...u, isBlocked: result.isBlocked } : u));
      toast.success(result.isBlocked ? 'User blocked' : 'User unblocked');
      if (stats) {
        setStats({ ...stats, blockedUsers: result.isBlocked ? stats.blockedUsers + 1 : stats.blockedUsers - 1 });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setBlockingId(null);
    }
  };

  const handleDeleteListing = async () => {
    if (!deletingId) return;
    try {
      await api.deleteListing(deletingId);
      setListings(prev => prev.filter(l => l._id !== deletingId));
      toast.success('Listing deleted');
      if (stats) setStats({ ...stats, totalListings: stats.totalListings - 1 });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete listing');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-white"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="container-main pt-24 pb-12">
        <h1 className="text-2xl font-semibold text-ink mb-8">Admin Dashboard</h1>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            <StatCard icon={<Building2 className="w-5 h-5 text-brand" />} label="Total Listings" value={stats.totalListings} />
            <StatCard icon={<CheckCircle2 className="w-5 h-5 text-brand" />} label="Active Listings" value={stats.activeListings} />
            <StatCard icon={<Users className="w-5 h-5 text-brand" />} label="Total Users" value={stats.totalUsers} />
            <StatCard icon={<ShieldAlert className="w-5 h-5 text-danger" />} label="Blocked Users" value={stats.blockedUsers} accent />
            <StatCard icon={<BarChart3 className="w-5 h-5 text-brand" />} label="Total Reviews" value={stats.totalReviews} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex rounded-lg bg-white border border-line p-1 mb-6 w-fit gap-1">
          {(['users', 'listings'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${
                tab === t
                  ? 'bg-surface text-ink border border-line'
                  : 'text-muted hover:text-muted'
              }`}
            >
              {t === 'users' ? 'Users' : 'Listings'}
            </button>
          ))}
        </div>

        {tab === 'users' && (
          <div>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mb-4 w-full max-w-sm bg-surface border border-line rounded-lg text-ink text-sm px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand/20 transition-colors"
            />
            <div className="bg-white rounded-xl border border-line overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface border-b border-line">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-muted">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Listings</th>
                    <th className="text-left px-4 py-3 font-medium text-muted">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-muted">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredUsers.map(u => (
                    <tr key={u._id} className="hover:bg-surface transition-colors">
                      <td className="px-4 py-3 text-ink font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-muted">{u.email}</td>
                      <td className="px-4 py-3 text-muted">{u.listingCount ?? 0}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.isBlocked
                            ? 'bg-red-50 text-danger'
                            : 'bg-green-50 text-green-700'
                        }`}>
                          {u.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => setBlockingId(u._id)}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                              u.isBlocked
                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                : 'bg-red-50 text-danger hover:bg-red-100'
                            }`}
                          >
                            {u.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-muted">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'listings' && (
          <div className="bg-white rounded-xl border border-line overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-line">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Landlord</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-muted">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {listings.map(l => {
                  const landlord = typeof l.landlord === 'string' ? null : l.landlord;
                  return (
                    <tr key={l._id} className="hover:bg-surface transition-colors">
                      <td className="px-4 py-3 text-ink font-medium max-w-[200px] truncate">{l.title}</td>
                      <td className="px-4 py-3 text-muted">{landlord ? landlord.name : '-'}</td>
                      <td className="px-4 py-3 text-ink">${l.price.toLocaleString()}/mo</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          l.isActive
                            ? 'bg-green-50 text-green-700'
                            : 'bg-surface text-muted border border-line'
                        }`}>
                          {l.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setDeletingId(l._id)}
                          className="px-3 py-1 text-xs font-medium rounded-lg bg-red-50 text-danger hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {listings.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-muted">No listings found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {blockingId && (
          <ConfirmModal
            title={users.find(u => u._id === blockingId)?.isBlocked ? 'Unblock User' : 'Block User'}
            message={
              users.find(u => u._id === blockingId)?.isBlocked
                ? 'This user will be able to log in again.'
                : 'This user will be immediately logged out and unable to access the platform.'
            }
            confirmLabel={users.find(u => u._id === blockingId)?.isBlocked ? 'Unblock' : 'Block'}
            danger={!users.find(u => u._id === blockingId)?.isBlocked}
            onConfirm={handleBlock}
            onCancel={() => setBlockingId(null)}
          />
        )}

        {deletingId && (
          <ConfirmModal
            title="Delete Listing"
            message="This will permanently delete the listing and all its reviews."
            confirmLabel="Delete"
            danger
            onConfirm={handleDeleteListing}
            onCancel={() => setDeletingId(null)}
          />
        )}
      </div>
    </div>
  );
}
