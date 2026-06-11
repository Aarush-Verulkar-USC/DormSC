import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { api } from '../lib/api';
import { Listing } from '../types';
import ListingCard from '../components/listings/ListingCard';
import HomeMap from '../components/maps/HomeMap';
import { ListingCardSkeleton, Skeleton } from '../components/ui/Skeleton';

/* ── Why DormSC tile ── */
function WhyCard({ title, desc, animation }: { title: string; desc: string; animation: React.ReactNode }) {
  return (
    <div className="bg-white border border-line rounded-xl overflow-hidden group">
      <div className="h-36 bg-white border-b border-line flex items-center justify-center overflow-hidden">
        {animation}
      </div>
      <div className="p-6">
        <h3 className="text-sm font-semibold text-ink mb-1.5">{title}</h3>
        <p className="text-sm text-muted leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

/* Tile 1 — Filtered: a price filter chip appears, non-matching listings dim, the match gets picked */
function FilterAnimation() {
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const pop = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  const cards = [
    { price: '$1,840', cls: 'fl-dim1', match: false },
    { price: '$1,250', cls: 'fl-card', match: true },
    { price: '$2,400', cls: 'fl-dim2', match: false },
  ];
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <style>{`
        @keyframes fl-scene { 0%,2% { opacity:0; } 6%,93% { opacity:1; } 98%,100% { opacity:0; } }
        @keyframes fl-chip  { 0%,4% { opacity:0; transform:translateY(-7px); } 12%,100% { opacity:1; transform:translateY(0); } }
        @keyframes fl-dim   { 0%,26% { opacity:1; transform:scale(1); } 38%,100% { opacity:0.3; transform:scale(0.94); } }
        @keyframes fl-pick  { 0%,30% { box-shadow:0 0 0 0 rgba(147,34,16,0); transform:scale(1); }
                              44%,100% { box-shadow:0 0 0 2px #932210; transform:scale(1.06); } }
        @keyframes fl-check { 0%,42% { opacity:0; transform:scale(0.4); } 56%,100% { opacity:1; transform:scale(1); } }
        .fl-scene { animation: fl-scene 5.4s linear infinite; }
        .fl-chip  { animation: fl-chip  5.4s ${ease} infinite; }
        .fl-dim1  { animation: fl-dim   5.4s ${ease} infinite; }
        .fl-dim2  { animation: fl-dim   5.4s ${ease} 0.15s infinite; }
        .fl-pick  { animation: fl-pick  5.4s ${pop} infinite; }
        .fl-check { animation: fl-check 5.4s ${pop} infinite; }
        @media (prefers-reduced-motion: reduce) {
          .fl-scene, .fl-chip, .fl-dim1, .fl-dim2, .fl-pick, .fl-check { animation: none; }
        }
      `}</style>
      <div className="fl-scene flex flex-col items-center gap-3">
        {/* Filter chip */}
        <div className="fl-chip inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-brand/30 bg-brand/5 text-[10px] font-bold text-brand">
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4h18M7 12h10m-7 8h4" />
          </svg>
          Max $1,500
        </div>
        {/* Listing cards */}
        <div className="flex gap-2 items-center">
          {cards.map(c => (
            <div key={c.price}
              className={`${c.match ? 'fl-pick' : c.cls} relative w-14 rounded-md bg-white border border-line p-1.5 shadow-sm`}>
              <div className="h-7 rounded bg-surface mb-1" />
              <div className="text-[9px] font-bold text-ink leading-none">{c.price}</div>
              {c.match && (
                <div className="fl-check absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-brand flex items-center justify-center shadow">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Tile 2 — Focused: a pin drops, a route traces to campus, the distance pops in */
function FocusedAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <style>{`
        @keyframes fo-scene { 0%,2% { opacity:0; } 6%,93% { opacity:1; } 98%,100% { opacity:0; } }
        @keyframes fo-pin   { 0%,4% { opacity:0; transform:translateY(-16px); }
                              13% { opacity:1; transform:translateY(2px); }
                              19%,100% { opacity:1; transform:translateY(0); } }
        @keyframes fo-route { 0%,16% { stroke-dashoffset:100; } 44%,100% { stroke-dashoffset:0; } }
        @keyframes fo-rip   { 0% { transform:scale(0.5); opacity:0.5; } 70%,100% { transform:scale(2.4); opacity:0; } }
        @keyframes fo-label { 0%,46% { opacity:0; transform:translate(-50%,5px) scale(0.85); }
                              58%,100% { opacity:1; transform:translate(-50%,0) scale(1); } }
        .fo-scene { animation: fo-scene 5.8s linear infinite; }
        .fo-pin   { animation: fo-pin   5.8s cubic-bezier(0.34, 1.4, 0.64, 1) infinite; }
        .fo-route { animation: fo-route 5.8s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
        .fo-rip   { animation: fo-rip   2.9s ease-out infinite; }
        .fo-label { animation: fo-label 5.8s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .fo-scene, .fo-pin, .fo-route, .fo-rip, .fo-label { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>
      {/* Map grid */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'linear-gradient(#e3d8d0 1px,transparent 1px),linear-gradient(90deg,#e3d8d0 1px,transparent 1px)', backgroundSize: '18px 18px' }} />

      <div className="fo-scene relative w-[200px] h-28">
        {/* Route (draws from pin to campus) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 112" fill="none">
          <path
            className="fo-route"
            d="M48 44 C 76 88, 118 92, 148 72"
            stroke="#932210" strokeWidth="2" strokeLinecap="round"
            strokeDasharray="6 5" pathLength={100}
          />
        </svg>

        {/* Listing pin */}
        <div className="fo-pin absolute left-[37px] top-[14px] flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-brand border-2 border-white shadow flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div className="w-0.5 h-2 bg-brand" />
        </div>

        {/* USC campus dot */}
        <div className="absolute left-[148px] top-[72px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="fo-rip absolute w-6 h-6 rounded-full border-2 border-brand" />
          <div className="w-3 h-3 rounded-full bg-gold border-2 border-brand z-10" />
          <span className="absolute top-3.5 text-[8px] font-extrabold tracking-wider text-brand">USC</span>
        </div>

        {/* Distance label */}
        <div className="fo-label absolute left-[98px] top-[42px] px-2 py-0.5 rounded-full bg-white border border-line shadow-sm text-[9px] font-bold text-ink whitespace-nowrap">
          0.6 mi to campus
        </div>
      </div>
    </div>
  );
}

/* Tile 3 — Fast: a student messages, the landlord types, then replies — in minutes */
function FastAnimation() {
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
  return (
    <div className="relative w-full h-full flex items-center justify-center px-8">
      <style>{`
        @keyframes ft-scene  { 0%,2% { opacity:0; } 6%,93% { opacity:1; } 98%,100% { opacity:0; } }
        @keyframes ft-left   { 0%,4% { opacity:0; transform:translateX(-12px); } 13%,100% { opacity:1; transform:translateX(0); } }
        @keyframes ft-typing { 0%,18% { opacity:0; transform:translateY(4px); } 25%,48% { opacity:1; transform:translateY(0); } 54%,100% { opacity:0; transform:translateY(0); } }
        @keyframes ft-reply  { 0%,52% { opacity:0; transform:translateX(12px); } 61%,100% { opacity:1; transform:translateX(0); } }
        @keyframes ft-badge  { 0%,66% { opacity:0; transform:scale(0.8); } 75%,100% { opacity:1; transform:scale(1); } }
        @keyframes ft-dot    { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-3px); } }
        .ft-scene  { animation: ft-scene  6s linear infinite; }
        .ft-left   { animation: ft-left   6s ${ease} infinite; }
        .ft-typing { animation: ft-typing 6s ${ease} infinite; }
        .ft-reply  { animation: ft-reply  6s ${ease} infinite; }
        .ft-badge  { animation: ft-badge  6s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; }
        .ft-d1 { animation: ft-dot 0.8s ease-in-out infinite; }
        .ft-d2 { animation: ft-dot 0.8s ease-in-out 0.15s infinite; }
        .ft-d3 { animation: ft-dot 0.8s ease-in-out 0.3s infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ft-scene, .ft-left, .ft-typing, .ft-reply, .ft-badge, .ft-d1, .ft-d2, .ft-d3 { animation: none; }
          .ft-typing { opacity: 0; }
        }
      `}</style>

      <div className="ft-scene w-full max-w-[180px] flex flex-col gap-2">
        {/* Student message */}
        <div className="ft-left self-start bg-white border border-line rounded-2xl rounded-bl-md px-3 py-2 shadow-sm">
          <div className="h-1.5 w-20 rounded-full bg-line mb-1.5" />
          <div className="h-1.5 w-12 rounded-full bg-line" />
        </div>

        {/* Landlord: typing indicator swaps to reply */}
        <div className="relative self-end">
          <div className="ft-reply bg-brand rounded-2xl rounded-br-md px-3 py-2 shadow-sm">
            <div className="h-1.5 w-16 rounded-full bg-white/60 mb-1.5" />
            <div className="h-1.5 w-10 rounded-full bg-white/60" />
          </div>
          <div className="ft-typing absolute top-0 right-0 bg-brand rounded-2xl rounded-br-md px-3 py-2.5 flex items-center gap-1 shadow-sm">
            <span className="ft-d1 w-1.5 h-1.5 rounded-full bg-white/80" />
            <span className="ft-d2 w-1.5 h-1.5 rounded-full bg-white/80" />
            <span className="ft-d3 w-1.5 h-1.5 rounded-full bg-white/80" />
          </div>
        </div>

        {/* Replied-fast badge */}
        <div className="ft-badge self-center inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-gold/50 bg-cream text-[9px] font-bold text-ink">
          <svg className="w-2.5 h-2.5 text-brand" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L4.5 12.5h5L11 22l8.5-10.5h-5L13 2z" />
          </svg>
          Replied in minutes
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getListings({ limit: '50', sort: 'newest' })
      .then(data => { setListings(data.listings); setTotal(data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = listings.slice(0, 3);

  const stats = useMemo(() => {
    if (listings.length === 0) return null;
    const prices = listings.map(l => l.price);
    const min = Math.min(...prices);
    const avg = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length);
    return { min, avg };
  }, [listings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/listings${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-white text-ink selection:bg-brand/20">
      <div className="pt-20">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start pt-10 lg:pt-20 pb-14">

            {/* Left: hero + search */}
            <div className="pt-2 lg:pt-6">
              {loading ? (
                <Skeleton className="h-6 w-52 rounded-full mb-8" />
              ) : total > 0 ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/40 bg-cream text-xs text-muted mb-8">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-gold" />
                  <span>{total} listing{total !== 1 ? 's' : ''} available near USC</span>
                </div>
              ) : null}

              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-normal leading-[1.15] tracking-tight text-ink mb-5">
                Find a home.
                <br />
                <span className="text-brand italic">Not just a house.</span>
              </h1>

              <p className="text-base text-muted mb-8 leading-relaxed max-w-lg">
                A housing marketplace built for USC students. Browse places near campus and talk to landlords directly — no middlemen, no fees.
              </p>

              <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by area or keyword..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-sm bg-white border border-line text-ink placeholder-faint outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>
                <button type="submit"
                  className="bg-brand hover:bg-brand/90 text-white rounded-lg px-5 py-3 text-sm font-medium transition-colors">
                  Search
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Under $1,500', href: '/listings?maxPrice=1500' },
                  { label: '1 Bed', href: '/listings?bedrooms=1' },
                  { label: '2+ Beds', href: '/listings?bedrooms=2' },
                  { label: 'Near Campus', href: '/listings?sort=newest' },
                ].map(f => (
                  <Link key={f.label} to={f.href}
                    className="px-3 py-1.5 bg-white border border-line rounded-lg text-sm text-muted hover:border-brand/40 hover:text-ink transition-colors">
                    {f.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: live map */}
            <div className="relative">
              <HomeMap
                listings={listings}
                className="h-[400px] lg:h-[520px] rounded-xl overflow-hidden border border-line z-0"
              />
              <div className="absolute bottom-3 left-3 z-[500] bg-white/95 backdrop-blur-sm border border-line rounded-lg px-3 py-1.5 flex items-center gap-4 text-xs text-muted shadow-sm pointer-events-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gold ring-1 ring-brand" />
                  <span>USC Campus</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white ring-1 ring-ink/40" />
                  <span>Listings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      {stats && (
        <div className="border-t border-line bg-surface/30">
          <div className="container-main">
            <dl className="grid grid-cols-3 divide-x divide-line">
              {[
                { label: 'Active listings', value: String(total) },
                { label: 'Starting at', value: `$${stats.min.toLocaleString()}/mo` },
                { label: 'Average rent', value: `$${stats.avg.toLocaleString()}/mo` },
              ].map(s => (
                <div key={s.label} className="py-6 text-center">
                  <dt className="text-xs text-muted uppercase tracking-widest mb-1">{s.label}</dt>
                  <dd className="text-xl md:text-2xl font-semibold text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {/* Featured listings */}
      {(loading || featured.length > 0) && (
        <section className="py-16 border-t border-line bg-white">
          <div className="container-main">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs text-muted uppercase tracking-widest mb-2">Browse</p>
                <h2 className="text-2xl md:text-3xl font-semibold text-ink">Latest Listings</h2>
                <p className="text-muted text-sm mt-1">Recently posted near USC</p>
              </div>
              <Link to="/listings" className="hidden sm:inline-flex items-center gap-1 text-sm text-brand hover:text-brand/80 transition-colors">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {Array.from({ length: 3 }, (_, i) => <ListingCardSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {featured.map(l => <ListingCard key={l._id} listing={l} showFavoriteButton={false} />)}
              </div>
            )}
            <div className="sm:hidden mt-6 text-center">
              <Link to="/listings" className="inline-flex items-center gap-1 text-sm text-brand hover:text-brand/80 transition-colors">
                View all listings <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why DormSC */}
      <section className="py-16 border-t border-line">
        <div className="container-main max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-xs text-muted uppercase tracking-widest mb-2">Why DormSC</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-ink mb-2">Built for finding housing near campus</h2>
            <p className="text-muted text-sm">Everything is designed around one thing: USC students finding a place to live</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WhyCard
              title="Filtered"
              desc="Narrow by price, beds, baths, and move-in date to find the right fit fast."
              animation={<FilterAnimation />}
            />
            <WhyCard
              title="Focused"
              desc="Every listing is near USC, with the distance to campus shown up front."
              animation={<FocusedAnimation />}
            />
            <WhyCard
              title="Fast"
              desc="From browsing to messaging a landlord in minutes, not weeks."
              animation={<FastAnimation />}
            />
          </div>
        </div>
      </section>

      {/* Landlord CTA */}
      <section className="py-16 border-t border-line bg-white">
        <div className="container-main">
          <div className="relative overflow-hidden rounded-2xl bg-brand px-6 py-12 md:px-12 md:py-14 text-center">
            {/* subtle dot texture */}
            <div className="absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Have a place near USC?</h2>
              <p className="text-white/75 mb-7 text-sm max-w-md mx-auto leading-relaxed">
                Post your property in minutes and hear directly from students looking for housing. Free to list.
              </p>
              <Link to="/listings/new"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-brand text-sm font-semibold hover:bg-cream transition-colors">
                List Your Property <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
