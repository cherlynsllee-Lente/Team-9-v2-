import React, { useState } from 'react';
import { ActivityBooking, GroupPlan } from '../types';

interface MyActivitiesScreenProps {
  bookings: ActivityBooking[];
  activePlan: GroupPlan;
  onOpenPlan: () => void;
  onOpenDirections: (venue: string) => void;
  onCancelBooking: (id: string) => void;
}

export const MyActivitiesScreen: React.FC<MyActivitiesScreenProps> = ({
  bookings,
  activePlan,
  onOpenPlan,
  onOpenDirections,
  onCancelBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'completed'>('upcoming');
  const [calendarToast, setCalendarToast] = useState<string | null>(null);

  const upcomingBookings = bookings.filter((b) => b.status === 'Facility booked');
  const completedBookings = bookings.filter((b) => b.status === 'Completed');

  const handleAddToCalendar = (b: ActivityBooking) => {
    setCalendarToast(`Added "${b.title}" to device calendar!`);
    setTimeout(() => setCalendarToast(null), 3000);
  };

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Title */}
      <div className="pt-1 px-1 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-xl text-slate-100">
            My Activities
          </h1>
          <p className="text-xs text-slate-400">Manage your sports plans, passes &amp; polls</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
          {upcomingBookings.length} Upcoming
        </span>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/90 rounded-full p-1 border border-slate-800 flex items-center shadow-inner">
        {(['upcoming', 'pending', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
              activeTab === tab
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
            {tab === 'pending' && activePlan.status !== 'booked' && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[9px] font-black">
                1
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Toast */}
      {calendarToast && (
        <div className="bg-emerald-600 text-white p-3 rounded-2xl text-xs font-bold text-center shadow-lg animate-fade-in flex items-center justify-center gap-1.5">
          <span>📅</span>
          <span>{calendarToast}</span>
        </div>
      )}

      {/* Tab Content: Upcoming */}
      {activeTab === 'upcoming' && (
        <div className="space-y-3">
          {upcomingBookings.map((b) => (
            <div
              key={b.id}
              className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/50 shadow-md space-y-3"
            >
              {/* Top line */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase border border-orange-500/30">
                    {b.sport}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Official ActiveSG Booked
                  </span>
                </div>
                <span className="text-xs font-bold text-orange-400">{b.costPerPerson} / person</span>
              </div>

              {/* Title & Venue */}
              <div>
                <h3 className="font-heading font-bold text-base text-slate-100">{b.title}</h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">{b.venueName}</p>
                <p className="text-xs text-slate-400 mt-0.5">{b.court}</p>
              </div>

              {/* Timing */}
              <div className="flex items-center gap-3 bg-slate-900/80 p-2.5 rounded-xl text-xs border border-slate-750/50">
                <div className="flex items-center gap-1.5 text-slate-100 font-semibold">
                  <span>📅</span>
                  <span>{b.date}</span>
                </div>
                <span className="text-slate-500">·</span>
                <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                  <span>⏰</span>
                  <span>{b.time}</span>
                </div>
              </div>

              {/* Players */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center -space-x-1.5">
                  {b.players.map((p, idx) => (
                    <img
                      key={idx}
                      alt={p.name}
                      src={p.avatar}
                      title={p.name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-800"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  Ref: {b.bookingRef}
                </span>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-700/50 grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => handleAddToCalendar(b)}
                  className="py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-750 text-slate-300 font-semibold transition-colors flex items-center justify-center gap-1 border border-slate-700/50"
                >
                  <span>📅 Calendar</span>
                </button>
                <button
                  onClick={() => onOpenDirections(b.venueName)}
                  className="py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-750 text-slate-300 font-semibold transition-colors flex items-center justify-center gap-1 border border-slate-700/50"
                >
                  <span>🧭 Directions</span>
                </button>
                <button
                  onClick={() => onCancelBooking(b.id)}
                  className="py-1.5 rounded-xl bg-slate-900/80 hover:bg-red-500/20 text-red-400 font-semibold transition-colors flex items-center justify-center border border-slate-700/50"
                >
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Pending */}
      {activeTab === 'pending' && (
        <div className="space-y-3">
          {activePlan.status !== 'booked' ? (
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-orange-500/30 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase border border-amber-500/30">
                  Friend Availability Poll
                </span>
                <span className="text-xs text-emerald-400 font-bold">4/4 Friends Voted!</span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-sm text-slate-100">
                  Weekend Badminton Doubles (Boon Keng / Kallang)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Best match identified: <strong className="text-slate-200">Saturday 10:00 AM</strong> at Kallang ActiveSG.
                </p>
              </div>

              <div className="flex items-center -space-x-1.5">
                {activePlan.friends.map((f, i) => (
                  <img
                    key={i}
                    alt={f.name}
                    src={f.avatar}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-800"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>

              <button
                onClick={onOpenPlan}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Complete Court Booking (ActiveSG) →</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-800/80 rounded-2xl p-8 text-center text-xs text-slate-400 border border-slate-700/50">
              No pending polls right now. All sessions are confirmed!
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Completed */}
      {activeTab === 'completed' && (
        <div className="space-y-3">
          {completedBookings.map((b) => (
            <div
              key={b.id}
              className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/40 space-y-2 opacity-90"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{b.sport}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-bold">
                  Completed
                </span>
              </div>
              <h3 className="font-heading font-bold text-sm text-slate-200">{b.title}</h3>
              <p className="text-xs text-slate-400">{b.venueName} · {b.date}</p>
              <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                <span>Attended ✓</span>
                <button
                  onClick={() => handleAddToCalendar(b)}
                  className="text-orange-400 font-bold hover:underline"
                >
                  Book Again
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
