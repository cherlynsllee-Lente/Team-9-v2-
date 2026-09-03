import React, { useState } from 'react';
import confetti from 'canvas-confetti';

interface ActiveSGRedirectModalProps {
  bookingDetails: {
    facilityName: string;
    sport: string;
    court: string;
    date: string;
    time: string;
    price: string;
    friendsCount: number;
  };
  onClose: () => void;
  onBookingSuccess: (bookingRef: string) => void;
}

export const ActiveSGRedirectModal: React.FC<ActiveSGRedirectModalProps> = ({
  bookingDetails,
  onClose,
  onBookingSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [useSingpass, setUseSingpass] = useState<boolean>(true);

  const handleConfirmActiveSgBooking = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
      });
      const generatedRef = `ASG-2026-${Math.floor(1000 + Math.random() * 9000)}-KAL`;
      onBookingSuccess(generatedRef);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Government Portal Header Simulation */}
        <div className="bg-red-700 p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm">
              <span className="text-red-700 font-black text-xs">SG</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight leading-none">ActiveSG</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono uppercase font-semibold">Official</span>
              </div>
              <span className="text-[10px] text-white/80 block mt-0.5">Sport Singapore Booking System</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Handoff Notice Banner */}
        <div className="bg-slate-950/90 px-4 py-2.5 border-b border-slate-800 flex items-center gap-2 text-xs text-slate-300">
          <span className="text-orange-400 font-bold">ℹ️ External Handoff:</span>
          <span className="text-slate-400 text-[11px]">
            Handoff from PulseSport with group session data pre-filled.
          </span>
        </div>

        {/* Booking Summary Card */}
        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/50 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block">
              Reservation Summary
            </span>

            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-base text-slate-100">
                {bookingDetails.facilityName}
              </h3>
              <p className="text-xs text-slate-400">{bookingDetails.court}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/50 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Date</span>
                <span className="font-bold text-slate-200">{bookingDetails.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Timeslot</span>
                <span className="font-bold text-slate-200">{bookingDetails.time}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
              <span className="text-xs text-slate-400">Total Fee:</span>
              <span className="font-heading font-extrabold text-base text-orange-400">
                {bookingDetails.price}
              </span>
            </div>
          </div>

          {/* Singpass / ActiveSG Credentials Auth Simulation */}
          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/50 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Verification &amp; Account
            </span>

            <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-900/80 border border-slate-700/60">
              <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 font-bold flex items-center justify-center text-xs shrink-0 border border-red-500/30">
                Sg
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-200 block">
                  Singpass Authenticated (Alex Tan)
                </span>
                <span className="text-[10px] text-emerald-400">ActiveSG Balance: $82.50 Credits</span>
              </div>
              <span className="text-xs text-emerald-400 font-bold">✓ Ready</span>
            </div>

            {/* Notification to friends alert */}
            <div className="flex items-start gap-2 text-[11px] text-slate-400">
              <input
                type="checkbox"
                defaultChecked
                id="notifyFriends"
                className="mt-0.5 rounded accent-orange-500 bg-slate-800 border-slate-700"
              />
              <label htmlFor="notifyFriends" className="cursor-pointer">
                Automatically invite and send calendar passes to Sarah, John, and Michelle.
              </label>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-2 pt-1">
            <button
              disabled={isProcessing}
              onClick={handleConfirmActiveSgBooking}
              className="w-full h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-[0_4px_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 transition-transform active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing ActiveSG Transaction...</span>
                </>
              ) : (
                <>
                  <span>Confirm Official ActiveSG Booking</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              ActiveSG refund &amp; cancellation policies apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
