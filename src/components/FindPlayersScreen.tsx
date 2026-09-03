import React, { useState } from 'react';
import { SocialGame, SportType, SkillLevel } from '../types';

interface FindPlayersScreenProps {
  games: SocialGame[];
  onSelectGame: (game: SocialGame) => void;
  onCreateGame: () => void;
}

export const FindPlayersScreen: React.FC<FindPlayersScreenProps> = ({
  games,
  onSelectGame,
  onCreateGame,
}) => {
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');

  const filteredGames = games.filter((g) => {
    if (selectedSport !== 'All' && g.sport !== selectedSport) return false;
    if (selectedSkill !== 'All' && g.skillLevel !== selectedSkill) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Header */}
      <div className="pt-1 px-1 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-xl text-slate-100">
            Find Players &amp; Games
          </h1>
          <p className="text-xs text-slate-400">Join friendly community sessions in Singapore</p>
        </div>
        <button
          onClick={onCreateGame}
          className="px-3.5 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-[0_2px_12px_rgba(249,115,22,0.35)] flex items-center gap-1 transition-transform active:scale-95"
        >
          <span>+ Host Game</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
        {['All', 'Badminton', 'Pickleball', 'Basketball', 'Tennis'].map((sport) => (
          <button
            key={sport}
            onClick={() => setSelectedSport(sport)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSport === sport
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* Skill filter */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Skill level:</span>
        <div className="flex items-center gap-1">
          {['All', 'Beginner', 'Recreational', 'Intermediate'].map((sk) => (
            <button
              key={sk}
              onClick={() => setSelectedSkill(sk)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                selectedSkill === sk
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800'
              }`}
            >
              {sk}
            </button>
          ))}
        </div>
      </div>

      {/* Game Cards List */}
      <div className="space-y-3">
        {filteredGames.map((game) => {
          const spotsLeft = game.totalPlayers - game.playersJoined;
          return (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3 cursor-pointer"
            >
              {/* Top line: Sport tag, Spots remaining, Cost */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-xs font-bold text-orange-400 border border-slate-700/60">
                    {game.sport === 'Badminton' ? '🏸 Badminton' : game.sport === 'Pickleball' ? '🏓 Pickleball' : game.sport}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                    {game.skillLevel}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-heading font-extrabold text-sm text-orange-400">
                    ${game.costPerPlayer}
                  </span>
                  <span className="text-[10px] text-slate-400 block">per player</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-100 hover:text-white transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{game.description}</p>
              </div>

              {/* Venue & Date/Time */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/80 border border-slate-700/50 p-2.5 rounded-2xl">
                <div className="flex items-center gap-1.5 text-slate-200 truncate">
                  <svg className="w-3.5 h-3.5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="truncate">{game.venueName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-200 justify-end">
                  <svg className="w-3.5 h-3.5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{game.date} · {game.time}</span>
                </div>
              </div>

              {/* Player avatars & Join button */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center -space-x-1.5">
                    {game.playerAvatars.map((p, i) => (
                      <img
                        key={i}
                        alt={p.name}
                        src={p.avatar}
                        className="w-6 h-6 rounded-full ring-2 ring-slate-900 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {game.playersJoined}/{game.totalPlayers} joined
                  </span>
                </div>

                <button className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition-transform active:scale-95">
                  {spotsLeft > 0 ? `Join (${spotsLeft} left)` : 'Waitlist'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
