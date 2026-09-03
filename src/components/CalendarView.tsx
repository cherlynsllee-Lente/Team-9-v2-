import React, { useState } from 'react';
import { Facility, SportType } from '../types';

interface CalendarViewProps {
  onSelectSlot: (slotInfo: {
    facility: Facility;
    sport: SportType;
    courtName: string;
    time: string;
    price: string;
    date: string;
  }) => void;
  facilities: Facility[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onSelectSlot, facilities }) => {
  const [selectedDay, setSelectedDay] = useState<number>(3); // Sep 3, 2026 (Thu)
  const [selectedSport, setSelectedSport] = useState<string>('Badminton');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string>('Anytime');
  const [alertNotified, setAlertNotified] = useState(false);

  // Reference facility for court slot bookings (Kallang ActiveSG or Jurong West)
  const defaultFacility = facilities[0];

  // Sessions on Thursday Sep 3
  const day3Sessions = [
    {
      id: 'sess-1',
      sport: 'Badminton' as SportType,
      title: 'Badminton Court 2 (Synthetic)',
      venue: 'Downtown Sports Hub · Arena Hall B',
      statusTag: 'Available (2 courts)',
      statusType: 'available',
      time: '08:00 AM – 09:30 AM',
      price: '$12 / hr',
      credits: '6 credits',
      courtName: 'Court 2',
      facility: defaultFacility,
    },
    {
      id: 'sess-2',
      sport: 'Fitness Classes' as SportType,
      title: 'Staff Appreciation HIIT Class',
      venue: 'Studio Arena · Coach Marcus',
      statusTag: '4 spots left',
      statusType: 'filling',
      time: '11:00 AM – 12:00 PM',
      price: 'Included pass',
      credits: '7 credits',
      courtName: 'Studio A',
      facility: facilities[3] || defaultFacility,
    },
    {
      id: 'sess-3',
      sport: 'Badminton' as SportType,
      title: 'Monthly Squash & Racket Club',
      venue: 'Downtown Glass Court 1',
      statusTag: '1 slot left (Filling fast!)',
      statusType: 'filling',
      time: '04:00 PM – 05:00 PM',
      price: '$18 / hr',
      credits: '9 credits',
      courtName: 'Glass Court 1',
      facility: defaultFacility,
    },
    {
      id: 'sess-4',
      sport: 'Pilates' as SportType,
      title: 'Twilight Pilates & Stretch',
      venue: 'Mind & Body Suite · Coach Elena',
      statusTag: 'Full · 3 Waitlisted',
      statusType: 'full',
      time: '06:30 PM – 07:30 PM',
      price: '5 credits',
      credits: '5 credits',
      courtName: 'Studio 4',
      facility: facilities[4] || defaultFacility,
    },
    {
      id: 'sess-5',
      sport: 'Badminton' as SportType,
      title: 'ActiveSG Prime Badminton Doubles',
      venue: 'Kallang ActiveSG Sports Centre',
      statusTag: 'Available (1 court)',
      statusType: 'available',
      time: '07:30 PM – 09:00 PM',
      price: '$7.50 / hr',
      credits: '4 credits',
      courtName: 'Court 4',
      facility: defaultFacility,
    },
  ];

  // Other days dynamically generate mock availability
  const sessions =
    selectedDay === 3
      ? day3Sessions.filter(
          (s) =>
            selectedSport === 'All Sports' ||
            s.sport === selectedSport ||
            (selectedSport === 'Badminton' && s.sport === 'Badminton')
        )
      : [
          {
            id: `dyn-1`,
            sport: selectedSport === 'All Sports' ? ('Badminton' as SportType) : (selectedSport as SportType),
            title: `${selectedSport === 'All Sports' ? 'Badminton' : selectedSport} Reserved Court`,
            venue: 'Kallang ActiveSG Sports Centre',
            statusTag: 'Available (3 courts)',
            statusType: 'available',
            time: '09:00 AM – 10:30 AM',
            price: '$7.50 / hr',
            credits: '4 credits',
            courtName: 'Court 1',
            facility: defaultFacility,
          },
          {
            id: `dyn-2`,
            sport: selectedSport === 'All Sports' ? ('Swimming' as SportType) : (selectedSport as SportType),
            title: 'Evening Training Slot',
            venue: 'Jalan Besar Sports Centre',
            statusTag: '2 slots left',
            statusType: 'filling',
            time: '06:00 PM – 07:30 PM',
            price: '$7.50 / hr',
            credits: '4 credits',
            courtName: 'Court 3',
            facility: facilities[1] || defaultFacility,
          },
        ];

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Month Navigation & Sports Filter Bar */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1">
          <span className="font-heading font-bold text-base text-slate-100">
            September 2026
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-orange-400 border border-orange-500/30 font-semibold">
            Live
          </span>
        </div>
        <button
          onClick={() => setSelectedDay(3)}
          className="px-2.5 py-1 rounded-full bg-slate-800 text-orange-400 text-xs font-bold uppercase tracking-wider hover:bg-slate-700 transition-colors border border-slate-700/60"
        >
          Today (Sep 3)
        </button>
      </div>

      {/* Horizontal Sports Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
        {['All Sports', 'Badminton', 'Boxing', 'Yoga', 'Swimming', 'Tennis'].map((sport) => {
          const isActive = selectedSport === sport;
          return (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-orange-500 text-white shadow-[0_2px_10px_rgba(249,115,22,0.4)]'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <span>{sport === 'Badminton' ? '🏸 ' + sport : sport}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </button>
          );
        })}
      </div>

      {/* Quick Time of Day strip */}
      <div className="flex items-center justify-between gap-1 text-xs">
        <span className="text-slate-400 font-medium text-[11px]">Filter time:</span>
        <div className="flex items-center gap-1">
          {['Anytime', 'Morning', 'Afternoon', 'Evening'].map((tod) => (
            <button
              key={tod}
              onClick={() => setSelectedTimeOfDay(tod)}
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                selectedTimeOfDay === tod
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tod}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Calendar Matrix Card */}
      <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl p-3.5 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
            <span
              key={day}
              className={`text-[10px] font-bold uppercase tracking-wider ${
                idx === 3 ? 'text-orange-400' : 'text-slate-400'
              }`}
            >
              {day}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 select-none">
          {/* Aug 31 prev month */}
          <div className="flex flex-col items-center justify-between min-h-[44px] p-1 rounded-xl bg-slate-800/20 opacity-30 cursor-not-allowed">
            <span className="text-[11px] text-slate-500">31</span>
            <span className="w-1 h-1 rounded-full bg-transparent" />
          </div>

          {/* Sep 1 */}
          <button
            onClick={() => setSelectedDay(1)}
            className={`flex flex-col items-center justify-between min-h-[44px] p-1 rounded-xl transition-all ${
              selectedDay === 1
                ? 'bg-slate-800 ring-2 ring-orange-500'
                : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800'
            }`}
          >
            <span className="text-[11px] font-semibold text-slate-200">01</span>
            <div className="flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </button>

          {/* Sep 2 */}
          <button
            onClick={() => setSelectedDay(2)}
            className={`flex flex-col items-center justify-between min-h-[44px] p-1 rounded-xl transition-all ${
              selectedDay === 2
                ? 'bg-slate-800 ring-2 ring-orange-500'
                : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800'
            }`}
          >
            <span className="text-[11px] font-semibold text-slate-200">02</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          </button>

          {/* Sep 3 (Selected) */}
          <button
            onClick={() => setSelectedDay(3)}
            className={`flex flex-col items-center justify-between min-h-[44px] p-1 rounded-xl transition-all scale-[1.02] ${
              selectedDay === 3
                ? 'bg-slate-800 shadow-[0_0_0_2px_#f97316,0_4px_16px_rgba(249,115,22,0.4)]'
                : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800'
            }`}
          >
            <span className="text-[11px] font-bold text-white px-1.5 py-0.5 rounded-full bg-orange-500 leading-none">
              03
            </span>
            <span className="text-[8px] text-orange-400 font-bold tracking-tight uppercase">6 Slots</span>
            <div className="flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </button>

          {/* Sep 4 */}
          <button
            onClick={() => setSelectedDay(4)}
            className={`flex flex-col items-center justify-between min-h-[44px] p-1 rounded-xl transition-all ${
              selectedDay === 4
                ? 'bg-slate-800 ring-2 ring-orange-500'
                : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800'
            }`}
          >
            <span className="text-[11px] font-semibold text-slate-200">04</span>
            <div className="flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
          </button>

          {/* Sep 5 (Weekend - Demo Day) */}
          <button
            onClick={() => setSelectedDay(5)}
            className={`flex flex-col items-center justify-between min-h-[44px] p-1 rounded-xl transition-all ${
              selectedDay === 5
                ? 'bg-slate-800 ring-2 ring-orange-500'
                : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800'
            }`}
          >
            <span className="text-[11px] font-semibold text-orange-400">05</span>
            <div className="flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
          </button>

          {/* Sep 6 (Weekend) */}
          <button
            onClick={() => setSelectedDay(6)}
            className={`flex flex-col items-center justify-between min-h-[44px] p-1 rounded-xl transition-all ${
              selectedDay === 6
                ? 'bg-slate-800 ring-2 ring-orange-500'
                : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800'
            }`}
          >
            <span className="text-[11px] font-semibold text-slate-400">06</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          </button>

          {/* Row 2: Sep 7 - 13 */}
          {[7, 8, 9, 10, 11, 12, 13].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`flex flex-col items-center justify-between min-h-[44px] p-1 rounded-xl transition-all ${
                selectedDay === d
                  ? 'bg-slate-800 ring-2 ring-orange-500'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              <span className="text-[11px] font-medium text-slate-200">{d < 10 ? `0${d}` : d}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  d % 3 === 0 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Open Slots</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Filling Fast</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            <span>Fully Booked</span>
          </div>
        </div>
      </div>

      {/* Live Court Sync Information Banner */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-3.5 border border-slate-800 flex items-center gap-3 shadow-md">
        <div className="w-10 h-10 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-orange-400">
              ActiveSG Sync
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h4 className="text-xs font-bold text-slate-100 truncate">Synchronized Facility Matrix</h4>
          <p className="text-[11px] text-slate-400 truncate">Direct court availability from ActiveSG Government Portal</p>
        </div>
      </div>

      {/* Selected Day Schedule Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-100">
              {selectedDay === 3
                ? 'Thursday, Sep 3'
                : selectedDay === 5
                ? 'Saturday, Sep 5 (Weekend)'
                : `Day ${selectedDay}, Sep 2026`}
            </h3>
            <p className="text-xs text-slate-400">{sessions.length} sessions and court slots available</p>
          </div>
          <span className="text-[11px] text-orange-400 font-semibold bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
            {selectedSport}
          </span>
        </div>

        {sessions.map((sess) => (
          <div
            key={sess.id}
            className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-orange-400 shrink-0 border border-slate-700/60">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sess.statusType === 'available'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : sess.statusType === 'filling'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {sess.statusTag}
                    </span>
                    <span className="text-[11px] text-slate-400">{sess.courtName}</span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-slate-100 mt-0.5 truncate">{sess.title}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <svg className="w-3 h-3 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="truncate">{sess.venue}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-200">
                <svg className="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{sess.time}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-orange-400">{sess.price}</span>
              </div>
            </div>

            {sess.statusType !== 'full' ? (
              <button
                onClick={() =>
                  onSelectSlot({
                    facility: sess.facility,
                    sport: sess.sport,
                    courtName: sess.courtName,
                    time: sess.time,
                    price: sess.price,
                    date: selectedDay === 3 ? 'Today, Sep 3' : `Sep ${selectedDay}, 2026`,
                  })
                }
                className="w-full h-10 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-[0_2px_12px_rgba(249,115,22,0.4)] flex items-center justify-center gap-1.5 transition-transform active:scale-98"
              >
                <span>Select &amp; Reserve Court</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <button
                disabled
                className="w-full h-10 rounded-2xl bg-slate-800/60 text-slate-500 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed opacity-75 border border-slate-800"
              >
                <span>Join Priority Waitlist</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Slot Release Alert Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800/80 p-4 border border-slate-800 flex items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">Slot Release Alerts</h4>
            <p className="text-[11px] text-slate-400">Get pinged when peak 7–9 PM ActiveSG slots drop</p>
          </div>
        </div>
        <button
          onClick={() => setAlertNotified(!alertNotified)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            alertNotified
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-slate-800 hover:bg-orange-500 hover:text-white text-orange-300 border border-slate-700/60'
          }`}
        >
          {alertNotified ? 'Subscribed ✓' : 'Notify Me'}
        </button>
      </div>
    </div>
  );
};
