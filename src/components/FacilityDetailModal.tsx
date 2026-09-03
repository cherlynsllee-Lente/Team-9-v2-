import React, { useState } from 'react';
import { Facility, TimeSlot } from '../types';

interface FacilityDetailModalProps {
  facility: Facility | null;
  onClose: () => void;
  onBookSlotViaActiveSG: (facility: Facility, slot: TimeSlot) => void;
  onPlanGameHere: (facility: Facility) => void;
}

export const FacilityDetailModal: React.FC<FacilityDetailModalProps> = ({
  facility,
  onClose,
  onBookSlotViaActiveSG,
  onPlanGameHere,
}) => {
  const [selectedSport, setSelectedSport] = useState<string>(facility?.sports[0] || 'Badminton');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(
    facility?.todaySlots.find((s) => s.status === 'available') || null
  );

  if (!facility) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md max-h-[92vh] bg-slate-900/95 backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Sticky Header with image banner */}
        <div className="relative h-48 sm:h-52 w-full shrink-0 bg-slate-950">
          <img
            alt={facility.name}
            src={facility.imageUrl}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center backdrop-blur-md hover:bg-slate-800 transition-colors border border-slate-700/50"
          >
            ✕
          </button>

          {/* Facility Type Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md ${
                facility.type === 'activesg'
                  ? 'bg-orange-500 text-white shadow-md'
                  : facility.type === 'community'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-purple-600 text-white shadow-md'
              }`}
            >
              {facility.type === 'activesg' ? 'Official ActiveSG Partner' : 'Community Sports Venue'}
            </span>
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white truncate">
                {facility.name}
              </h2>
              <span className="px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-amber-400 font-bold text-xs shrink-0 flex items-center gap-1 border border-slate-700/50">
                ★ {facility.rating}
              </span>
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5 truncate">
              <svg className="w-3.5 h-3.5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{facility.address}</span>
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 no-scrollbar">
          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Distance</span>
              <span className="text-xs font-bold text-slate-200">{facility.distanceKm} km</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Price</span>
              <span className="text-xs font-bold text-orange-400 truncate block">{facility.priceEstimate}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Crowd</span>
              <span className="text-xs font-bold text-emerald-400 truncate block">{facility.crowdLevel}</span>
            </div>
          </div>

          {/* Transportation & Parking Info */}
          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/50 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-slate-900 flex items-center justify-center text-sm shrink-0 border border-slate-700/60">
                🚇
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-200 block">Nearest MRT Station</span>
                <span className="text-slate-400">{facility.nearestMrt}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-700/50">
              <div className="w-7 h-7 rounded-xl bg-slate-900 flex items-center justify-center text-sm shrink-0 border border-slate-700/60">
                🚗
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-200 block">Parking &amp; Vehicle Access</span>
                <span className="text-slate-400">{facility.parkingInfo}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-700/50">
              <div className="w-7 h-7 rounded-xl bg-slate-900 flex items-center justify-center text-sm shrink-0 border border-slate-700/60">
                🕒
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-200 block">Operating Hours</span>
                <span className="text-slate-400">{facility.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Amenities Chips */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Facility Amenities
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {facility.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-slate-800/80 text-xs text-slate-300 border border-slate-700/50 flex items-center gap-1"
                >
                  <span className="text-emerald-400 font-bold">✓</span> {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Real-time Time Slots Matrix */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Slot Availability (Today)
              </h4>
              <span className="text-[11px] text-orange-400 font-semibold">
                Updated 2m ago
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {facility.todaySlots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                const isFull = slot.status === 'full';
                return (
                  <button
                    key={slot.id}
                    disabled={isFull}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2.5 rounded-2xl text-left border transition-all flex flex-col justify-between min-h-[64px] ${
                      isSelected
                        ? 'bg-orange-500/20 border-orange-500 shadow-[0_0_0_1px_rgba(249,115,22,1)]'
                        : isFull
                        ? 'bg-slate-900/40 border-slate-800 opacity-50 cursor-not-allowed'
                        : 'bg-slate-800/80 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{slot.time}</span>
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                          slot.status === 'available'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : slot.status === 'limited'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {slot.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      <span className="text-slate-400">{slot.courtName}</span>
                      <span className="font-bold text-orange-400">{slot.price}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transparent ActiveSG Ecosystem Notice */}
          <div className="rounded-2xl bg-slate-800/60 p-3 border border-orange-500/30 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs shrink-0 font-bold">
              i
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-slate-100">ActiveSG Booking Notice:</strong> PulseSport discovers and coordinates slots for your group. When completing your booking, you will be redirected to the official ActiveSG booking checkout.
            </p>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0">
          <button
            onClick={() => onPlanGameHere(facility)}
            className="flex-1 h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Plan with Friends</span>
          </button>

          <button
            disabled={!selectedSlot}
            onClick={() => selectedSlot && onBookSlotViaActiveSG(facility, selectedSlot)}
            className="flex-1 h-11 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-[0_4px_16px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-98 flex items-center justify-center gap-1.5"
          >
            <span>Book via ActiveSG</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
