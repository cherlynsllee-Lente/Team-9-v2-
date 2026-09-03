import React from 'react';

export type NavTab = 'home' | 'discover' | 'plan' | 'activities' | 'profile';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activitiesBadgeCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  activitiesBadgeCount = 0,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/85 backdrop-blur-xl border-t border-slate-800 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]">
      <div className="max-w-md mx-auto h-16 px-3 flex items-center justify-between relative">
        {/* Home Tab */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 gap-1 transition-colors ${
            activeTab === 'home' ? 'text-orange-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg className="w-5 h-5" fill={activeTab === 'home' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-medium tracking-wide">Home</span>
        </button>

        {/* Discover / Search Tab */}
        <button
          onClick={() => onTabChange('discover')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 gap-1 transition-colors ${
            activeTab === 'discover' ? 'text-orange-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[10px] font-medium tracking-wide">Discover</span>
        </button>

        {/* Prominent Center Plan Button */}
        <div className="relative -top-3">
          <button
            onClick={() => onTabChange('plan')}
            className={`w-13 h-13 rounded-full flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95 ${
              activeTab === 'plan'
                ? 'bg-orange-500 text-white shadow-[0_4px_22px_rgba(249,115,22,0.65)] ring-4 ring-slate-900'
                : 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-[0_4px_18px_rgba(249,115,22,0.45)] ring-4 ring-slate-900 hover:brightness-110'
            }`}
            aria-label="Plan a Game"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-[9px] font-bold tracking-tight mt-0.5">Plan</span>
          </button>
        </div>

        {/* Activities Tab */}
        <button
          onClick={() => onTabChange('activities')}
          className={`relative flex flex-col items-center justify-center min-w-[56px] py-1 gap-1 transition-colors ${
            activeTab === 'activities' ? 'text-orange-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-medium tracking-wide">Activities</span>
          {activitiesBadgeCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-slate-900" />
          )}
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 gap-1 transition-colors ${
            activeTab === 'profile' ? 'text-orange-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[10px] font-medium tracking-wide">Profile</span>
        </button>
      </div>
    </nav>
  );
};
