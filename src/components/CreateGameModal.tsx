import React, { useState } from 'react';
import { SocialGame, SportType, SkillLevel, UserProfile } from '../types';

interface CreateGameModalProps {
  userProfile: UserProfile;
  onClose: () => void;
  onCreateGame: (newGame: SocialGame) => void;
}

export const CreateGameModal: React.FC<CreateGameModalProps> = ({
  userProfile,
  onClose,
  onCreateGame,
}) => {
  const [sport, setSport] = useState<SportType>('Badminton');
  const [title, setTitle] = useState('Badminton Friendly Doubles & Rallies');
  const [totalPlayers, setTotalPlayers] = useState(4);
  const [totalCost, setTotalCost] = useState(24);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Recreational');
  const [date, setDate] = useState('Saturday, Sep 5');
  const [time, setTime] = useState('10:00 AM');
  const [venueName, setVenueName] = useState('Kallang ActiveSG Sports Centre');

  const costPerPlayer = Math.round(totalCost / totalPlayers);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGame: SocialGame = {
      id: `game-${Date.now()}`,
      title,
      sport,
      venueId: 'kallang-activesg',
      venueName,
      neighbourhood: 'Kallang',
      date,
      time,
      endTime: '12:00 PM',
      skillLevel,
      playersJoined: 1,
      totalPlayers,
      playerAvatars: [{ name: userProfile.name, avatar: userProfile.avatar }],
      costPerPlayer,
      totalCourtCost: totalCost,
      isPublic: true,
      description: 'Friendly casual game. Good rallies, fun atmosphere, shuttlecocks provided!',
      organiserName: userProfile.name,
      organiserAvatar: userProfile.avatar,
      organiserRating: 5.0,
      attendanceRate: 100,
      intensity: 'Social',
    };
    onCreateGame(newGame);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md max-h-[90vh] bg-slate-900/95 backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-extrabold text-base text-slate-100">Host a Community Game</h2>
            <p className="text-xs text-slate-400">Open your session for local players to join</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs hover:bg-slate-750 border border-slate-700/50"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 no-scrollbar">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Sport</label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value as SportType)}
              className="w-full h-11 bg-slate-800 border border-slate-700/60 rounded-2xl px-3 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
            >
              <option value="Badminton">Badminton</option>
              <option value="Pickleball">Pickleball</option>
              <option value="Tennis">Tennis</option>
              <option value="Basketball">Basketball</option>
              <option value="Swimming">Swimming</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Game Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 bg-slate-800 border border-slate-700/60 rounded-2xl px-3 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Venue</label>
            <input
              type="text"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              className="w-full h-11 bg-slate-800 border border-slate-700/60 rounded-2xl px-3 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 bg-slate-800 border border-slate-700/60 rounded-2xl px-3 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-11 bg-slate-800 border border-slate-700/60 rounded-2xl px-3 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Skill Level</label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
                className="w-full h-11 bg-slate-800 border border-slate-700/60 rounded-2xl px-3 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Recreational">Recreational</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Total Spots</label>
              <input
                type="number"
                min="2"
                max="12"
                value={totalPlayers}
                onChange={(e) => setTotalPlayers(parseInt(e.target.value) || 4)}
                className="w-full h-11 bg-slate-800 border border-slate-700/60 rounded-2xl px-3 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Split Cost Calculator */}
          <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Court Fee ($)</span>
              <input
                type="number"
                value={totalCost}
                onChange={(e) => setTotalCost(parseFloat(e.target.value) || 0)}
                className="w-20 h-8 bg-slate-900 text-right px-2 rounded-xl text-xs font-bold text-slate-100 border border-slate-700"
              />
            </div>
            <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-700/50">
              <span className="text-slate-200">Cost per Player:</span>
              <span className="text-orange-400 text-sm">${costPerPlayer} / person</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-[0_4px_16px_rgba(249,115,22,0.4)] transition-transform active:scale-98"
          >
            Publish Game to Feed
          </button>
        </form>
      </div>
    </div>
  );
};
