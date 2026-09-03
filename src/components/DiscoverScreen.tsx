import React, { useState, useMemo } from 'react';
import { Facility, SportType } from '../types';

interface DiscoverScreenProps {
  facilities: Facility[];
  onSelectFacility: (facility: Facility) => void;
  initialSearchQuery?: string;
  onSelectSlotBooking: (slotInfo: {
    facility: Facility;
    sport: SportType;
    courtName: string;
    time: string;
    price: string;
    date: string;
  }) => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  facilities,
  onSelectFacility,
  initialSearchQuery = '',
  onSelectSlotBooking,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [selectedProvider, setSelectedProvider] = useState<'all' | 'activesg' | 'community' | 'private'>('all');
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [sortBy, setSortBy] = useState<'nearest' | 'earliest' | 'price' | 'rating'>('nearest');
  const [activeMapPin, setActiveMapPin] = useState<Facility | null>(facilities[0]);

  // Natural language query quick suggestions
  const suggestedQueries = [
    'Badminton near Kallang Saturday morning',
    'Swimming pool with lap lanes',
    'Pickleball beginner friendly',
    'ActiveSG indoor courts under $10',
  ];

  const handleApplyQuickQuery = (query: string) => {
    setSearchQuery(query);
    if (query.toLowerCase().includes('badminton')) setSelectedSport('Badminton');
    else if (query.toLowerCase().includes('swimming')) setSelectedSport('Swimming');
    else if (query.toLowerCase().includes('pickleball')) setSelectedSport('Pickleball');
    if (query.toLowerCase().includes('activesg')) setSelectedProvider('activesg');
  };

  const filteredFacilities = useMemo(() => {
    return facilities
      .filter((fac) => {
        // Query match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = fac.name.toLowerCase().includes(q);
          const matchNeighbourhood = fac.neighbourhood.toLowerCase().includes(q);
          const matchSport = fac.sports.some((s) => s.toLowerCase().includes(q));
          if (!matchName && !matchNeighbourhood && !matchSport) return false;
        }

        // Sport filter
        if (selectedSport !== 'All' && !fac.sports.includes(selectedSport as SportType)) {
          return false;
        }

        // Provider filter
        if (selectedProvider !== 'all' && fac.type !== selectedProvider) {
          return false;
        }

        // Distance filter
        if (fac.distanceKm > maxDistance) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'nearest') return a.distanceKm - b.distanceKm;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price') {
          const priceA = parseFloat(a.priceEstimate.replace(/[^0-9.]/g, '')) || 10;
          const priceB = parseFloat(b.priceEstimate.replace(/[^0-9.]/g, '')) || 10;
          return priceA - priceB;
        }
        return 0;
      });
  }, [facilities, searchQuery, selectedSport, selectedProvider, maxDistance, sortBy]);

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Header & View Mode Switch */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="font-heading font-extrabold text-xl text-slate-100">
            Discover Facilities
          </h1>
          <p className="text-xs text-slate-400">ActiveSG centres, community hubs &amp; studios</p>
        </div>
        <div className="flex items-center bg-slate-900/80 rounded-full p-1 border border-slate-800 shadow-inner">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              viewMode === 'list'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>List</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              viewMode === 'map'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>Map</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by sport, venue, or MRT station..."
          className="w-full h-12 bg-slate-900/70 border border-slate-800 rounded-2xl pl-10 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm"
        />
        <svg className="w-4 h-4 text-orange-500 absolute left-3.5 top-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 hover:text-white absolute right-3 top-3 flex items-center justify-center text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick query chips */}
      {!searchQuery && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1 py-0.5">
          {suggestedQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleApplyQuickQuery(sq)}
              className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-[11px] text-slate-400 hover:text-white border border-slate-800 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
            >
              <span>🔍</span>
              <span>{sq}</span>
            </button>
          ))}
        </div>
      )}

      {/* Filter Row: Sports Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
        {['All', 'Badminton', 'Pickleball', 'Swimming', 'Gym', 'Tennis', 'Fitness Classes'].map((sport) => (
          <button
            key={sport}
            onClick={() => setSelectedSport(sport)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
              selectedSport === sport
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* Filter Row: Provider & Distance & Sort */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar text-xs">
        {/* Provider toggle */}
        <div className="flex items-center bg-slate-900/80 rounded-xl p-0.5 border border-slate-800 shrink-0">
          <button
            onClick={() => setSelectedProvider('all')}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              selectedProvider === 'all' ? 'bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30' : 'text-slate-400'
            }`}
          >
            All Venues
          </button>
          <button
            onClick={() => setSelectedProvider('activesg')}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              selectedProvider === 'activesg' ? 'bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30' : 'text-slate-400'
            }`}
          >
            ActiveSG Only
          </button>
          <button
            onClick={() => setSelectedProvider('community')}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              selectedProvider === 'community' ? 'bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30' : 'text-slate-400'
            }`}
          >
            Community Hubs
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] text-slate-400">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-900/80 text-slate-200 text-[11px] font-semibold rounded-xl px-2 py-1 border border-slate-800 focus:outline-none"
          >
            <option value="nearest">Nearest</option>
            <option value="rating">Top Rated</option>
            <option value="price">Lowest Price</option>
          </select>
        </div>
      </div>

      {/* MAP VIEW */}
      {viewMode === 'map' ? (
        <div className="space-y-3">
          <div className="bg-slate-900/70 rounded-3xl border border-slate-800 overflow-hidden relative shadow-xl h-80 flex flex-col justify-between">
            {/* Map Top Bar */}
            <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
              <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-white text-[10px] font-bold backdrop-blur-md border border-slate-700/60 pointer-events-auto">
                Singapore Sports Map (8 Facilities)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white text-[10px] font-bold pointer-events-auto shadow-md">
                GPS: Downtown Central
              </span>
            </div>

            {/* Singapore SVG Interactive Map Canvas */}
            <div className="w-full h-full relative bg-slate-950 flex items-center justify-center select-none overflow-hidden">
              <svg viewBox="0 0 500 320" className="w-full h-full object-contain opacity-90">
                {/* Water body & Island outline representation */}
                <path
                  d="M40,160 Q80,110 140,90 Q220,70 310,75 Q380,80 440,110 Q470,140 460,180 Q430,220 370,245 Q310,270 230,265 Q150,260 90,230 Q45,200 40,160 Z"
                  fill="#0e1726"
                  stroke="#1e293b"
                  strokeWidth="2"
                />
                {/* Johor Straits / Coastline details */}
                <path
                  d="M140,85 Q250,65 370,75"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                {/* Sentosa island hint */}
                <ellipse cx="235" cy="272" rx="28" ry="10" fill="#0e1726" stroke="#1e293b" strokeWidth="1.5" />
                {/* Region boundary accents */}
                <path d="M250,90 L240,240" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M150,160 L350,170" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

                {/* Region Names */}
                <text x="130" y="150" fill="#334155" fontSize="11" fontWeight="bold" letterSpacing="1">WEST</text>
                <text x="235" y="130" fill="#334155" fontSize="11" fontWeight="bold" letterSpacing="1">CENTRAL</text>
                <text x="360" y="150" fill="#334155" fontSize="11" fontWeight="bold" letterSpacing="1">EAST</text>
                <text x="240" y="90" fill="#334155" fontSize="10" fontWeight="bold">NORTH</text>
              </svg>

              {/* Pin Coordinates overlay (positioned across Singapore geography) */}
              {/* Kallang ActiveSG */}
              <button
                onClick={() => setActiveMapPin(facilities[0])}
                className="absolute left-[54%] top-[56%] -translate-x-1/2 -translate-y-1/2 group z-20"
              >
                <div className={`flex flex-col items-center transition-transform ${activeMapPin?.id === facilities[0].id ? 'scale-125' : 'hover:scale-110'}`}>
                  <div className="px-1.5 py-0.5 rounded-md bg-orange-500 text-white text-[9px] font-bold shadow-md whitespace-nowrap mb-0.5">
                    🏸 Kallang
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full bg-orange-500 ring-4 ring-orange-500/30 animate-pulse" />
                </div>
              </button>

              {/* Jalan Besar */}
              <button
                onClick={() => setActiveMapPin(facilities[1])}
                className="absolute left-[49%] top-[50%] -translate-x-1/2 -translate-y-1/2 group z-20"
              >
                <div className={`flex flex-col items-center transition-transform ${activeMapPin?.id === facilities[1].id ? 'scale-125' : 'hover:scale-110'}`}>
                  <div className="px-1.5 py-0.5 rounded-md bg-sky-500 text-white text-[9px] font-bold shadow-md whitespace-nowrap mb-0.5">
                    🏊 Jalan Besar
                  </div>
                  <div className="w-3 h-3 rounded-full bg-sky-400 ring-4 ring-sky-400/30" />
                </div>
              </button>

              {/* Boon Keng Community */}
              <button
                onClick={() => setActiveMapPin(facilities[5] || facilities[0])}
                className="absolute left-[52%] top-[44%] -translate-x-1/2 -translate-y-1/2 group z-20"
              >
                <div className="flex flex-col items-center hover:scale-110 transition-transform">
                  <div className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-bold shadow-md whitespace-nowrap mb-0.5">
                    🏓 Boon Keng
                  </div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/30" />
                </div>
              </button>

              {/* Bishan ActiveSG */}
              <button
                onClick={() => setActiveMapPin(facilities[6] || facilities[0])}
                className="absolute left-[47%] top-[35%] -translate-x-1/2 -translate-y-1/2 group z-20"
              >
                <div className="flex flex-col items-center hover:scale-110 transition-transform">
                  <div className="px-1.5 py-0.5 rounded-md bg-orange-500 text-white text-[9px] font-bold shadow-md whitespace-nowrap mb-0.5">
                    🏸 Bishan
                  </div>
                  <div className="w-3 h-3 rounded-full bg-orange-500 ring-4 ring-orange-500/30" />
                </div>
              </button>

              {/* Paya Lebar Quarter ActiveArena */}
              <button
                onClick={() => setActiveMapPin(facilities[7] || facilities[0])}
                className="absolute left-[62%] top-[52%] -translate-x-1/2 -translate-y-1/2 group z-20"
              >
                <div className="flex flex-col items-center hover:scale-110 transition-transform">
                  <div className="px-1.5 py-0.5 rounded-md bg-purple-500 text-white text-[9px] font-bold shadow-md whitespace-nowrap mb-0.5">
                    🏟️ Paya Lebar
                  </div>
                  <div className="w-3 h-3 rounded-full bg-purple-400 ring-4 ring-purple-400/30" />
                </div>
              </button>

              {/* Jurong West Hall */}
              <button
                onClick={() => setActiveMapPin(facilities[2])}
                className="absolute left-[20%] top-[48%] -translate-x-1/2 -translate-y-1/2 group z-20"
              >
                <div className="flex flex-col items-center hover:scale-110 transition-transform">
                  <div className="px-1.5 py-0.5 rounded-md bg-orange-500 text-white text-[9px] font-bold shadow-md whitespace-nowrap mb-0.5">
                    🏸 Jurong West
                  </div>
                  <div className="w-3 h-3 rounded-full bg-orange-500 ring-4 ring-orange-500/30" />
                </div>
              </button>
            </div>
          </div>

          {/* Active Pin Card Preview */}
          {activeMapPin && (
            <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl p-4 border border-orange-500/40 shadow-xl space-y-3 animate-fade-in">
              <div className="flex gap-3">
                <img
                  alt={activeMapPin.name}
                  src={activeMapPin.imageUrl}
                  className="w-18 h-18 rounded-2xl object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 uppercase border border-orange-500/30">
                      {activeMapPin.type === 'activesg' ? 'Official ActiveSG' : 'Community Partner'}
                    </span>
                    <span className="text-xs text-orange-400 font-bold">{activeMapPin.distanceKm} km away</span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-slate-100 truncate mt-1">
                    {activeMapPin.name}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{activeMapPin.address}</p>
                  <p className="text-[11px] text-orange-400 font-semibold mt-1">
                    {activeMapPin.priceEstimate}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {activeMapPin.todaySlots.filter((s) => s.status === 'available').length} slots available today
                </span>
                <button
                  onClick={() => onSelectFacility(activeMapPin)}
                  className="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md transition-transform active:scale-95"
                >
                  View Facility &amp; Slots →
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>{filteredFacilities.length} facilities matching criteria</span>
            <span>Radius: {maxDistance}km</span>
          </div>

          {filteredFacilities.length === 0 ? (
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 text-center border border-slate-800 space-y-2">
              <span className="text-3xl">🔍</span>
              <h3 className="font-heading font-bold text-sm text-slate-100">No facilities found</h3>
              <p className="text-xs text-slate-400">Try expanding your distance radius or clearing filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSport('All');
                  setSelectedProvider('all');
                  setMaxDistance(10);
                }}
                className="mt-2 px-3.5 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredFacilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3"
              >
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 shrink-0 relative">
                    <img
                      alt={fac.name}
                      className="w-full h-full object-cover"
                      src={fac.imageUrl}
                      referrerPolicy="no-referrer"
                    />
                    <span
                      className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        fac.type === 'activesg'
                          ? 'bg-orange-500 text-white'
                          : fac.type === 'community'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-purple-600 text-white'
                      }`}
                    >
                      {fac.type === 'activesg' ? 'ActiveSG' : fac.type === 'community' ? 'Community' : 'Studio'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 truncate">
                        {fac.neighbourhood}
                      </span>
                      <span className="text-[11px] text-slate-400 shrink-0">{fac.distanceKm} km</span>
                    </div>
                    <h3 className="font-heading font-bold text-sm text-slate-100 truncate mt-0.5">
                      {fac.name}
                    </h3>
                    <p className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1">
                      <span>🚇 {fac.nearestMrt.split('-')[0]}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-bold text-orange-400">{fac.priceEstimate}</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                        <span className="text-amber-400">★</span> {fac.rating} ({fac.reviewsCount})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sports tags */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                  {fac.sports.map((sport) => (
                    <span
                      key={sport}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 whitespace-nowrap border border-slate-700/60"
                    >
                      {sport}
                    </span>
                  ))}
                </div>

                {/* Next available court slots */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {fac.todaySlots.slice(0, 2).map((slot) => (
                      <button
                        key={slot.id}
                        disabled={slot.status === 'full'}
                        onClick={() =>
                          onSelectSlotBooking({
                            facility: fac,
                            sport: fac.sports[0],
                            courtName: slot.courtName,
                            time: slot.time,
                            price: slot.price,
                            date: 'Today',
                          })
                        }
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                          slot.status === 'available'
                            ? 'bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-200 border border-slate-700/60'
                            : slot.status === 'limited'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800/40 text-slate-600 line-through cursor-not-allowed border border-slate-800'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => onSelectFacility(fac)}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition-transform active:scale-95 shrink-0"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
