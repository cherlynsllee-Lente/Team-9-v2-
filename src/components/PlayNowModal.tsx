import React, { useState } from 'react';
import { Facility } from '../types';

interface PlayNowModalProps {
  onClose: () => void;
  onSelectFacility: (facility: Facility) => void;
  facilities: Facility[];
}

export const PlayNowModal: React.FC<PlayNowModalProps> = ({
  onClose,
  onSelectFacility,
  facilities,
}) => {
  const [duration, setDuration] = useState<'30m' | '1h' | '2h'>('1h');
  const [radius, setRadius] = useState<'1km' | '3km' | '5km'>('3km');

  // Immediate spontaneous options matching selected time & distance
  const spontaneousActivities = [
    {
      id: 'sp-1',
      title: 'Quick 45m Lap Swim',
      venue: 'Jalan Besar Swimming Complex',
      facility: facilities[1],
      sport: 'Swimming',
      distance: '1.1 km · 14 min walk',
      tag: 'Walk-in NFC entry',
      price: '$2.00',
      timing: 'Open until 9:30 PM',
      crowd: 'Low crowd right now',
    },
    {
      id: 'sp-2',
      title: 'Open Gym Pod Workout',
      venue: 'Bishan ActiveSG Gym Pod',
      facility: facilities[6] || facilities[0],
      sport: 'Gym',
      distance: '650 m · 8 min walk',
      tag: 'Turnstile tap',
      price: '$2.50',
      timing: 'Immediate walk-in',
      crowd: '4 spots free',
    },
    {
      id: 'sp-3',
      title: 'Casual Half-Court Hoops',
      venue: 'Boon Keng Sports Community Hub',
      facility: facilities[5] || facilities[0],
      sport: 'Basketball',
      distance: '1.1 km',
      tag: 'Free community court',
      price: 'Free',
      timing: 'Lit until 10:00 PM',
      crowd: 'Friendly pick-up game active',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-[0_2px_8px_rgba(249,115,22,0.4)]">
              ⚡
            </span>
            <div>
              <h2 className="font-heading font-extrabold text-base text-slate-100">
                What Can I Play Right Now?
              </h2>
              <p className="text-[11px] text-slate-400">Spontaneous sports within your reach</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs hover:bg-slate-750 border border-slate-700/50"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 no-scrollbar">
          {/* Controls: Duration & Distance */}
          <div className="grid grid-cols-2 gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                Time Available
              </span>
              <div className="grid grid-cols-3 gap-1">
                {(['30m', '1h', '2h'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`py-1 rounded-xl text-xs font-bold transition-all ${
                      duration === d
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                Max Distance
              </span>
              <div className="grid grid-cols-3 gap-1">
                {(['1km', '3km', '5km'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadius(r)}
                    className={`py-1 rounded-xl text-xs font-bold transition-all ${
                      radius === r
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Instant Options */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Immediate Activities Ready Now
            </span>

            {spontaneousActivities.map((act) => (
              <div
                key={act.id}
                className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/50 hover:border-slate-600 transition-all space-y-2.5 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {act.tag}
                    </span>
                    <h3 className="font-heading font-bold text-sm text-slate-100 mt-1">{act.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{act.venue}</p>
                  </div>
                  <span className="font-heading font-extrabold text-sm text-orange-400">{act.price}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-700/50 text-[11px] text-slate-400">
                  <span>📍 {act.distance}</span>
                  <span className="text-emerald-400 font-medium">● {act.crowd}</span>
                </div>

                <button
                  onClick={() => onSelectFacility(act.facility)}
                  className="w-full h-9 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                >
                  <span>Go Now / Book Pass</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
