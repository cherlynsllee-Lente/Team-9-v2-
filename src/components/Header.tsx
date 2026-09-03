import React from 'react';
import { PULSESPORT_LOGO_URL } from '../data/singaporeData';
import { UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile;
  selectedLocation: string;
  onSelectLocationClick: () => void;
  unreadNotificationsCount: number;
  onNotificationsClick: () => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  selectedLocation,
  onSelectLocationClick,
  unreadNotificationsCount,
  onNotificationsClick,
  onProfileClick,
}) => {
  return (
    <header className="sticky top-0 w-full z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 shadow-lg">
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img
            alt="PulseSport Logo"
            className="h-8 w-auto object-contain rounded-lg shadow-sm"
            src={PULSESPORT_LOGO_URL}
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-lg text-slate-100 tracking-tight leading-none">
                PulseSport
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 font-semibold tracking-wide border border-orange-500/30">
                ActiveSG Co.
              </span>
            </div>
          </div>
        </div>

        {/* Location selector */}
        <button
          onClick={onSelectLocationClick}
          className="min-h-[38px] px-3 py-1 flex items-center gap-1.5 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 transition-all text-left max-w-[145px]"
          title="Change location and travel radius"
        >
          <svg className="w-3.5 h-3.5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs font-semibold text-slate-200 truncate">
            {selectedLocation}
          </span>
          <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Right Actions: Notifications & Profile */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onNotificationsClick}
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/70"
            aria-label="Notifications"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <button
            onClick={onProfileClick}
            className="w-9 h-9 rounded-full ring-1 ring-orange-500/50 hover:ring-orange-500 transition-all overflow-hidden shrink-0"
            aria-label="User Profile"
          >
            <img
              alt={userProfile.name}
              className="w-full h-full object-cover"
              src={userProfile.avatar}
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
