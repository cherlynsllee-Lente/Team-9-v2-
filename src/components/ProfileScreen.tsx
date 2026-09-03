import React from 'react';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  userProfile: UserProfile;
  onEditPreferences: () => void;
  onOpenNotifications: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  onEditPreferences,
  onOpenNotifications,
}) => {
  const { monthlyStats } = userProfile;
  const progressPercent = Math.min(
    100,
    Math.round((monthlyStats.totalActivities / monthlyStats.monthlyGoalTarget) * 100)
  );

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* User Card */}
      <div className="bg-slate-800/80 rounded-3xl p-4 border border-slate-700/50 shadow-md flex items-center gap-3.5 pt-4">
        <div className="relative shrink-0">
          <img
            alt={userProfile.name}
            src={userProfile.avatar}
            className="w-16 h-16 rounded-full object-cover ring-3 ring-orange-500"
            referrerPolicy="no-referrer"
          />
          <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full ring-2 ring-slate-900 flex items-center justify-center text-[10px] text-white font-bold">
            ✓
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-base text-slate-100 truncate">
              {userProfile.name}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold border border-orange-500/30">
              {userProfile.skillLevel}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate mt-0.5">{userProfile.email}</p>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-orange-400 font-medium">
            <span>📍 {userProfile.preferredLocation}</span>
            <span>(≤{userProfile.maxDistanceKm}km)</span>
          </div>
        </div>
      </div>

      {/* Monthly Goal & Streak Card */}
      <div className="bg-slate-800/80 rounded-3xl p-4 border border-slate-700/50 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Monthly Goal (September)
          </span>
          <span className="text-xs font-bold text-orange-400">
            {monthlyStats.totalActivities} of {monthlyStats.monthlyGoalTarget} sessions
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-750/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/50">
          <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-700/50 flex items-center gap-2.5">
            <span className="text-2xl">🔥</span>
            <div>
              <span className="text-xs font-bold text-slate-100 block">
                {monthlyStats.streakWeeks} Week Streak
              </span>
              <span className="text-[10px] text-slate-400">Consistently active</span>
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-700/50 flex items-center gap-2.5">
            <span className="text-2xl">🏆</span>
            <div>
              <span className="text-xs font-bold text-slate-100 block">ActiveSG Partner</span>
              <span className="text-[10px] text-emerald-400">Singpass Linked ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sports Breakdown */}
      <div className="bg-slate-800/80 rounded-3xl p-4 border border-slate-700/50 shadow-md space-y-2.5">
        <h3 className="font-heading font-bold text-sm text-slate-100">
          Your Sports Activity Breakdown
        </h3>
        <div className="space-y-2 text-xs">
          {monthlyStats.sportsBreakdown.map((item) => (
            <div key={item.sport} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/80 border border-slate-700/50">
              <span className="font-medium text-slate-200 flex items-center gap-2">
                <span>{item.sport === 'Badminton' ? '🏸' : item.sport === 'Swimming' ? '🏊' : '🏋️'}</span>
                <span>{item.sport}</span>
              </span>
              <span className="font-bold text-orange-400">{item.count} sessions this month</span>
            </div>
          ))}
        </div>
      </div>

      {/* Discovery Preferences */}
      <div className="bg-slate-800/80 rounded-3xl p-4 border border-slate-700/50 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-slate-100">
            Discovery Preferences
          </h3>
          <button
            onClick={onEditPreferences}
            className="text-xs text-orange-400 font-bold hover:underline"
          >
            Edit
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-700/50">
            <span className="text-slate-400">Preferred Sports:</span>
            <div className="flex gap-1">
              {userProfile.preferredSports.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] text-orange-400 border border-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-700/50">
            <span className="text-slate-400">Exercise Frequency:</span>
            <span className="font-semibold text-slate-200">{userProfile.exerciseFrequency}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-700/50">
            <span className="text-slate-400">Preferred Times:</span>
            <span className="font-semibold text-slate-200">{userProfile.preferredTimes.join(', ')}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400">Skill Level:</span>
            <span className="font-semibold text-slate-200">{userProfile.skillLevel}</span>
          </div>
        </div>
      </div>

      {/* App & Ecosystem Information */}
      <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/50 space-y-2 text-[11px] text-slate-400">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <span>PulseSport Companion SG</span>
          <span className="text-orange-400">v2.4.0</span>
        </div>
        <p>
          PulseSport is a third-party discovery and coordination companion designed for active Singaporeans. Official facility bookings are completed through ActiveSG and government sports portals.
        </p>
      </div>
    </div>
  );
};
