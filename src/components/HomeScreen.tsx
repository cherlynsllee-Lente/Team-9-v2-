import React, { useState } from 'react';
import { Facility, SocialGame, SportType, UserProfile } from '../types';
import { CalendarView } from './CalendarView';

interface HomeScreenProps {
  userProfile: UserProfile;
  facilities: Facility[];
  socialGames: SocialGame[];
  onSelectFacility: (facility: Facility) => void;
  onSelectSocialGame: (game: SocialGame) => void;
  onOpenPlayNow: () => void;
  onOpenPlanGame: () => void;
  onOpenAiAssistant: () => void;
  onOpenSearch: (query?: string) => void;
  onSelectSlotBooking: (slotInfo: {
    facility: Facility;
    sport: SportType;
    courtName: string;
    time: string;
    price: string;
    date: string;
  }) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProfile,
  facilities,
  socialGames,
  onSelectFacility,
  onSelectSocialGame,
  onOpenPlayNow,
  onOpenPlanGame,
  onOpenAiAssistant,
  onOpenSearch,
  onSelectSlotBooking,
}) => {
  const [viewMode, setViewMode] = useState<'listing' | 'calendar'>('listing');
  const [activeFilter, setActiveFilter] = useState<string>('Nearby');
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('All');

  const quickFilters = ['Nearby', 'Today', 'This Weekend', 'Available Now', 'Under $10', 'Beginner Friendly'];

  const sportCategories = [
    { name: 'All', icon: '⚡' },
    { name: 'Badminton', icon: '🏸' },
    { name: 'Pickleball', icon: '🏓' },
    { name: 'Swimming', icon: '🏊' },
    { name: 'Gym', icon: '🏋️' },
    { name: 'Tennis', icon: '🎾' },
    { name: 'Basketball', icon: '🏀' },
    { name: 'Fitness Classes', icon: '⏱️' },
    { name: 'Pilates', icon: '🧘' },
    { name: 'Boxing', icon: '🥊' },
  ];

  // Specific recommended items matching prompt specifications
  const kallangFacility = facilities.find((f) => f.id === 'kallang-activesg') || facilities[0];
  const jalanBesarFacility = facilities.find((f) => f.id === 'jalan-besar-sports') || facilities[1];
  const apexFacility = facilities.find((f) => f.id === 'apex-athletics-tanjongpagar') || facilities[3];
  const pickleballGame = socialGames.find((g) => g.sport === 'Pickleball') || socialGames[1];

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Top Greeting Section */}
      <div className="pt-2 px-1 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-xl text-slate-100 tracking-tight">
            Good afternoon, {userProfile.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Ready to get moving? 18 courts &amp; games near you.
          </p>
        </div>
        <button
          onClick={onOpenAiAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-[0_2px_12px_rgba(249,115,22,0.4)] hover:brightness-110 active:scale-95 transition-all shrink-0"
        >
          <span className="text-sm">✨</span>
          <span>Pulse AI</span>
        </button>
      </div>

      {/* Natural Language Search Input Bar */}
      <div className="relative">
        <div
          onClick={() => onOpenSearch()}
          className="h-12 bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 rounded-2xl px-3.5 flex items-center gap-2.5 cursor-pointer shadow-sm transition-colors"
        >
          <svg className="w-5 h-5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs text-slate-400 font-normal truncate flex-1">
            Search sport, venue or activity (e.g., "Badminton near Paya Lebar")
          </span>
          <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-orange-400 shrink-0 border border-slate-700/60">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
        </div>
      </div>

      {/* View Switcher Segmented Control (Listing View vs Calendar View as in Image 6 & 8) */}
      <div className="p-1 bg-slate-900/80 rounded-full flex items-center border border-slate-800 shadow-inner">
        <button
          onClick={() => setViewMode('listing')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-bold transition-all ${
            viewMode === 'listing'
              ? 'bg-orange-500 text-white shadow-[0_4px_16px_rgba(249,115,22,0.4)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span>Listing View</span>
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-bold transition-all ${
            viewMode === 'calendar'
              ? 'bg-orange-500 text-white shadow-[0_4px_16px_rgba(249,115,22,0.4)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Calendar View</span>
        </button>
      </div>

      {/* Quick Filters Horizontal Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
        {quickFilters.map((filter) => {
          const isSelected = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50 shadow-[0_2px_8px_rgba(249,115,22,0.2)]'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Sport Category Icons Horizontal Scroll */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>Popular Sports</span>
          <button onClick={() => onOpenSearch()} className="text-orange-400 hover:underline text-[11px]">
            View All
          </button>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 py-1">
          {sportCategories.map((cat) => {
            const isSelected = selectedSportFilter === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedSportFilter(cat.name)}
                className={`flex flex-col items-center justify-center w-18 h-18 rounded-2xl p-1.5 shrink-0 transition-all border ${
                  isSelected
                    ? 'bg-slate-800 border-orange-500 text-orange-400 shadow-md ring-1 ring-orange-500/40'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <span className="text-xl mb-1">{cat.icon}</span>
                <span className="text-[10px] font-bold truncate max-w-[62px] text-center">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* If Calendar View is selected, show Calendar Matrix */}
      {viewMode === 'calendar' ? (
        <CalendarView onSelectSlot={onSelectSlotBooking} facilities={facilities} />
      ) : (
        /* Listing View Content */
        <div className="flex flex-col gap-4">
          {/* Hero Action: "Play Now" Spontaneous Exercise Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 p-4 border border-orange-500/35 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-orange-600/15 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="space-y-1 max-w-[72%]">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wider border border-orange-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                  <span>Instant Match</span>
                </div>
                <h3 className="font-heading font-extrabold text-base text-white">
                  Have 30–90 mins free right now?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Find nearby open lap lanes, gym pods, or walk-in community courts.
                </p>
              </div>
              <button
                onClick={onOpenPlayNow}
                className="w-12 h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(249,115,22,0.4)] active:scale-95 transition-transform shrink-0"
                aria-label="Find activities to play now"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>⚡ Gym Pod (650m) · Pool (1.1km)</span>
              <button onClick={onOpenPlayNow} className="text-orange-400 font-bold hover:underline">
                Explore "Play Now" →
              </button>
            </div>
          </div>

          {/* Group Coordination Callout: "Plan with Friends" */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-100 truncate">Planning a Game with Friends?</h4>
                <p className="text-[11px] text-slate-400 truncate">Send an availability poll &amp; auto-find matching courts</p>
              </div>
            </div>
            <button
              onClick={onOpenPlanGame}
              className="px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-orange-500 text-orange-300 hover:text-white text-xs font-bold transition-all shrink-0 border border-slate-700/60"
            >
              Plan Game
            </button>
          </div>

          {/* Section: "Recommended for you" */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-100">
                  Recommended for you
                </h3>
                <p className="text-xs text-slate-400">Based on your preferred sports in Downtown / Boon Keng</p>
              </div>
              <button
                onClick={() => onOpenSearch()}
                className="text-orange-400 text-xs font-semibold hover:underline"
              >
                See all
              </button>
            </div>

            {/* CARD 1: Badminton at Kallang ActiveSG Sports Centre */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3">
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 shrink-0 relative">
                  <img
                    alt="Kallang ActiveSG Badminton Courts"
                    className="w-full h-full object-cover"
                    src={kallangFacility.imageUrl}
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-slate-900/85 text-orange-400 text-[9px] font-bold border border-slate-700/60">
                    ActiveSG
                  </span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 truncate">
                      Kallang ActiveSG Sports Centre
                    </span>
                    <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-0.5">
                      <svg className="w-3 h-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      1.2 km
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-slate-100 truncate mt-0.5">
                    Badminton Court 3 &amp; 4
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    Today, 7:00 PM · 2 slots available
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      2 slots available
                    </span>
                    <span className="text-xs font-semibold text-orange-400">$7.50/hr</span>
                  </div>
                </div>
              </div>

              {/* Court Time Slot Selector Strip */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() =>
                      onSelectSlotBooking({
                        facility: kallangFacility,
                        sport: 'Badminton',
                        courtName: 'Court 3',
                        time: '06:00 PM – 07:00 PM',
                        price: '$7.50',
                        date: 'Today',
                      })
                    }
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-200 text-xs font-semibold transition-colors shrink-0 border border-slate-700/60"
                  >
                    06:00 PM
                  </button>
                  <button
                    onClick={() =>
                      onSelectSlotBooking({
                        facility: kallangFacility,
                        sport: 'Badminton',
                        courtName: 'Court 4',
                        time: '07:00 PM – 08:00 PM',
                        price: '$7.50',
                        date: 'Today',
                      })
                    }
                    className="px-2.5 py-1 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-sm shrink-0"
                  >
                    07:00 PM
                  </button>
                  <button
                    disabled
                    className="px-2.5 py-1 rounded-xl bg-slate-800/40 text-slate-600 text-xs font-medium line-through cursor-not-allowed shrink-0 border border-slate-800"
                  >
                    08:00 PM
                  </button>
                </div>
                <button
                  onClick={() => onSelectFacility(kallangFacility)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold shrink-0 transition-colors border border-slate-700/60"
                >
                  View Facility
                </button>
              </div>
            </div>

            {/* CARD 2: Pickleball Social Game at Bendemeer */}
            <div
              onClick={() => onSelectSocialGame(pickleballGame)}
              className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3 cursor-pointer"
            >
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 shrink-0 relative">
                  <img
                    alt="Pickleball Social Game"
                    className="w-full h-full object-cover"
                    src={pickleballGame.playerAvatars[0]?.avatar}
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-amber-500 text-black text-[9px] font-black uppercase">
                    3/4 Full
                  </span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 truncate">
                      Bendemeer / Boon Keng
                    </span>
                    <span className="text-[11px] text-slate-400 shrink-0">1.1 km</span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-slate-100 truncate mt-0.5">
                    Pickleball Social Game
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Saturday, 10:00 AM · 3 players joined
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                      Beginner friendly
                    </span>
                    <span className="text-xs font-semibold text-orange-400">$4 / player</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center -space-x-1.5">
                  {pickleballGame.playerAvatars.map((p, i) => (
                    <img
                      key={i}
                      alt={p.name}
                      src={p.avatar}
                      className="w-6 h-6 rounded-full ring-2 ring-slate-900 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-[9px] font-bold flex items-center justify-center ring-2 ring-slate-900 border border-slate-700">
                    +1
                  </span>
                </div>
                <button className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition-transform active:scale-95">
                  Join Game ($4)
                </button>
              </div>
            </div>

            {/* CARD 3: Swimming at Jalan Besar Swimming Complex */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3">
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 shrink-0 relative">
                  <img
                    alt="Jalan Besar Swimming Complex"
                    className="w-full h-full object-cover"
                    src={jalanBesarFacility.imageUrl}
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-slate-900/85 text-orange-400 text-[9px] font-bold border border-slate-700/60">
                    ActiveSG
                  </span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 truncate">
                      Jalan Besar Swimming Complex
                    </span>
                    <span className="text-[11px] text-slate-400 shrink-0">2.1 km</span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-slate-100 truncate mt-0.5">
                    Olympic 50m Lap Pool
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    Tomorrow, 8:00 AM · Low crowd expected
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      Low crowd expected
                    </span>
                    <span className="text-xs font-semibold text-orange-400">$2.00 entry</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Turnstile tap via ActiveSG pass</span>
                <button
                  onClick={() => onSelectFacility(jalanBesarFacility)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-200 text-xs font-bold transition-colors border border-slate-700/60"
                >
                  Book Pass
                </button>
              </div>
            </div>

            {/* CARD 4: HIIT & Functional Strength at Apex Athletics */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3">
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 shrink-0 relative">
                  <img
                    alt="Apex Athletics HIIT"
                    className="w-full h-full object-cover"
                    src={apexFacility.imageUrl}
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-orange-500 text-white text-[9px] font-bold">
                    8 Cred
                  </span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 truncate">
                      Apex Athletics Arena
                    </span>
                    <span className="text-[11px] text-slate-400 shrink-0">Tanjong Pagar</span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-slate-100 truncate mt-0.5">
                    HIIT &amp; Functional Strength
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    Coach Marcus · High Intensity
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                      3 spots left
                    </span>
                    <span className="text-[11px] text-slate-400">ClassPass Partner</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-200 font-semibold">Today · 09:00 AM – 09:50 AM</span>
                <button
                  onClick={() => onSelectFacility(apexFacility)}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
