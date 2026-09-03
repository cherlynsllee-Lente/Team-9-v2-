import React, { useState } from 'react';
import { SocialGame } from '../types';
import confetti from 'canvas-confetti';

interface GameDetailModalProps {
  game: SocialGame | null;
  onClose: () => void;
  onJoinSuccess: (game: SocialGame) => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  game,
  onClose,
  onJoinSuccess,
}) => {
  const [hasJoined, setHasJoined] = useState(false);

  if (!game) return null;

  const handleJoin = () => {
    setHasJoined(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      onJoinSuccess(game);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md max-h-[90vh] bg-slate-900/95 backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase shadow-sm">
              {game.sport}
            </span>
            <span className="text-xs text-slate-400 font-semibold">{game.skillLevel} Level</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-850 text-slate-300 flex items-center justify-center text-xs hover:bg-slate-800 border border-slate-700/50"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 no-scrollbar">
          <div>
            <h2 className="font-heading font-extrabold text-lg text-slate-100">{game.title}</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{game.description}</p>
          </div>

          {/* Organiser Profile Card */}
          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/50 flex items-center gap-3">
            <img
              alt={game.organiserName}
              src={game.organiserAvatar}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-500/50 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100 truncate block">
                  Hosted by {game.organiserName}
                </span>
                <span className="text-[11px] text-amber-400 font-bold flex items-center gap-0.5">
                  ★ {game.organiserRating}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                <span>{game.attendanceRate}% Attendance rate</span>
                <span>· Verified Player</span>
              </div>
            </div>
          </div>

          {/* Time & Venue Details */}
          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/50 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Date &amp; Time</span>
              <span className="font-bold text-slate-200">{game.date} · {game.time} – {game.endTime}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
              <span className="text-slate-400">Location</span>
              <span className="font-bold text-slate-200 truncate max-w-[200px]">{game.venueName}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
              <span className="text-slate-400">Court Cost Split</span>
              <span className="font-extrabold text-orange-400">${game.costPerPlayer} / player (${game.totalCourtCost} total)</span>
            </div>
          </div>

          {/* Players Roster */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Players ({game.playersJoined}/{game.totalPlayers})
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                {game.totalPlayers - game.playersJoined} spot(s) remaining
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {game.playerAvatars.map((player, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-2xl bg-slate-800/80 border border-slate-700/50">
                  <img
                    alt={player.name}
                    src={player.avatar}
                    className="w-7 h-7 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-semibold text-slate-200 truncate">{player.name}</span>
                </div>
              ))}
              {Array.from({ length: game.totalPlayers - game.playersJoined }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-2xl bg-slate-800/40 border border-dashed border-slate-700/60 text-xs text-slate-500">
                  <div className="w-7 h-7 rounded-full bg-slate-700/50 flex items-center justify-center font-bold">?</div>
                  <span>Open Spot</span>
                </div>
              ))}
            </div>
          </div>

          {/* Community Standards */}
          <div className="rounded-2xl bg-slate-800/60 p-3 border border-slate-700/50 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-200 block">Community Code:</span>
            <p>Arrive 5 minutes before game time. Please bring clean indoor court shoes and notify the host if you need to cancel at least 12h in advance.</p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
          <button
            disabled={hasJoined}
            onClick={handleJoin}
            className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-[0_4px_16px_rgba(249,115,22,0.4)] disabled:opacity-50 transition-transform active:scale-98 flex items-center justify-center gap-2"
          >
            {hasJoined ? (
              <span>Spot Reserved! Added to Activities ✓</span>
            ) : (
              <span>Join Game (${game.costPerPlayer})</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
