import React, { useState } from 'react';
import { GroupPlan, SportType, Facility } from '../types';
import confetti from 'canvas-confetti';

interface PlanGameScreenProps {
  initialPlan: GroupPlan;
  facilities: Facility[];
  onCompleteHandoffToActiveSG: (plan: GroupPlan) => void;
  onExplorePublicGames: () => void;
}

export const PlanGameScreen: React.FC<PlanGameScreenProps> = ({
  initialPlan,
  facilities,
  onCompleteHandoffToActiveSG,
  onExplorePublicGames,
}) => {
  const [plan, setPlan] = useState<GroupPlan>(initialPlan);
  const [step, setStep] = useState<'create' | 'poll' | 'best_match'>(
    initialPlan.status === 'poll_sent' ? 'poll' : 'create'
  );
  const [selectedSport, setSelectedSport] = useState<SportType>('Badminton');
  const [playersNeeded, setPlayersNeeded] = useState<number>(4);
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [shareWhatsappDone, setShareWhatsappDone] = useState<boolean>(false);

  // Suggested facilities matching criteria (Kallang ActiveSG within 5km)
  const matchingFacility = facilities[0];

  const handleCreatePoll = () => {
    setStep('poll');
  };

  const handleSimulateAllVotes = () => {
    // Trigger confetti celebration when best match is reached
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    setStep('best_match');
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard?.writeText('https://pulsesport.sg/poll/badminton-weekend-alex')?.catch(() => {});
    } catch {
      // ignore clipboard permission rejection
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsapp = () => {
    setShareWhatsappDone(true);
    setTimeout(() => setShareWhatsappDone(false), 3000);
  };

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Title & Step tracker */}
      <div className="pt-1 px-1">
        <div className="flex items-center justify-between">
          <h1 className="font-heading font-extrabold text-xl text-slate-100">
            Plan a Game
          </h1>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
            Group Coordination
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Coordinate friends, poll availability, and auto-match courts.
        </p>
      </div>

      {/* 3-Step Progress Indicator */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-2.5 border border-slate-800 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'create'
                ? 'bg-orange-500 text-white ring-2 ring-orange-500/40 shadow-[0_2px_8px_rgba(249,115,22,0.4)]'
                : 'bg-emerald-500 text-white'
            }`}
          >
            {step === 'create' ? '1' : '✓'}
          </div>
          <span
            className={`text-xs font-semibold ${
              step === 'create' ? 'text-orange-400' : 'text-slate-400'
            }`}
          >
            Setup
          </span>
        </div>

        <div className="h-0.5 w-6 bg-slate-800" />

        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'poll'
                ? 'bg-orange-500 text-white ring-2 ring-orange-500/40 shadow-[0_2px_8px_rgba(249,115,22,0.4)]'
                : step === 'best_match'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {step === 'best_match' ? '✓' : '2'}
          </div>
          <span
            className={`text-xs font-semibold ${
              step === 'poll' ? 'text-orange-400' : 'text-slate-400'
            }`}
          >
            Friend Poll
          </span>
        </div>

        <div className="h-0.5 w-6 bg-slate-800" />

        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 'best_match'
                ? 'bg-orange-500 text-white ring-2 ring-orange-500/40 shadow-[0_2px_8px_rgba(249,115,22,0.4)]'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            3
          </div>
          <span
            className={`text-xs font-semibold ${
              step === 'best_match' ? 'text-orange-400' : 'text-slate-400'
            }`}
          >
            Best Match
          </span>
        </div>
      </div>

      {/* STEP 1: CREATE / SETUP */}
      {step === 'create' && (
        <div className="space-y-4 animate-fade-in">
          {/* Sport Selector */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Choose Sport
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Badminton', 'Pickleball', 'Tennis', 'Basketball', 'Swimming', 'Football'] as SportType[]).map(
                (sport) => (
                  <button
                    key={sport}
                    onClick={() => setSelectedSport(sport)}
                    className={`py-2 px-2 rounded-2xl text-xs font-semibold border transition-all text-center ${
                      selectedSport === sport
                        ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                        : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/80'
                    }`}
                  >
                    {sport === 'Badminton' ? '🏸 Badminton' : sport === 'Pickleball' ? '🏓 Pickleball' : sport}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Player Count & Radius */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Players Needed
              </label>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setPlayersNeeded(Math.max(2, playersNeeded - 1))}
                  className="w-8 h-8 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
                >
                  -
                </button>
                <span className="font-heading font-extrabold text-base text-slate-100">
                  {playersNeeded} players
                </span>
                <button
                  onClick={() => setPlayersNeeded(playersNeeded + 1)}
                  className="w-8 h-8 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-[10px] text-slate-400 block text-center">Doubles session (4 players)</span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Travel Radius
              </label>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setRadiusKm(Math.max(2, radiusKm - 1))}
                  className="w-8 h-8 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
                >
                  -
                </button>
                <span className="font-heading font-extrabold text-base text-slate-100">
                  {radiusKm} km
                </span>
                <button
                  onClick={() => setRadiusKm(radiusKm + 1)}
                  className="w-8 h-8 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-[10px] text-slate-400 block text-center">From Boon Keng / Kallang</span>
            </div>
          </div>

          {/* Dates & Time options for poll */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Proposed Timeslots to Poll
              </label>
              <span className="text-[11px] text-orange-400 font-semibold">4 slots selected</span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="font-bold text-slate-200">Friday, Sep 4</span>
                  <span className="text-slate-400">7:00 PM – 8:30 PM</span>
                </div>
                <span className="text-[11px] text-orange-400">Evening</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="font-bold text-slate-200">Friday, Sep 4</span>
                  <span className="text-slate-400">8:00 PM – 9:30 PM</span>
                </div>
                <span className="text-[11px] text-orange-400">Late Evening</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="font-bold text-slate-200">Saturday, Sep 5</span>
                  <span className="text-slate-400">10:00 AM – 11:30 AM</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-bold">Prime Morning</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="font-bold text-slate-200">Saturday, Sep 5</span>
                  <span className="text-slate-400">2:00 PM – 3:30 PM</span>
                </div>
                <span className="text-[11px] text-orange-400">Afternoon</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCreatePoll}
            className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <span>Create &amp; Share Poll</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      )}

      {/* STEP 2: AVAILABILITY POLL VIEW */}
      {step === 'poll' && (
        <div className="space-y-4 animate-fade-in">
          {/* Poll Summary Card */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                  Active Poll
                </span>
                <h3 className="font-heading font-extrabold text-base text-slate-100">
                  Weekend Badminton Doubles (4 Players)
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                Awaiting responses
              </span>
            </div>

            {/* Friend Avatars Status */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 block">Group Members:</span>
              <div className="grid grid-cols-2 gap-2">
                {plan.friends.map((friend) => (
                  <div key={friend.name} className="flex items-center gap-2 p-2 rounded-2xl bg-slate-800/80 border border-slate-700/50">
                    <img
                      alt={friend.name}
                      src={friend.avatar}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-slate-200 truncate block">
                        {friend.name}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-medium">✓ Voted</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share action buttons */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={handleShareWhatsapp}
                className="flex-1 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>💬 WhatsApp Invite</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700/60 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{copiedLink ? 'Copied! ✓' : '📋 Copy Link'}</span>
              </button>
            </div>
            {shareWhatsappDone && (
              <p className="text-[11px] text-emerald-400 text-center font-medium animate-fade-in">
                WhatsApp group invitation link ready to send!
              </p>
            )}
          </div>

          {/* Voting Results Table */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-sm text-slate-100">
                Availability Poll Results
              </h4>
              <span className="text-xs text-slate-400">4 friend votes</span>
            </div>

            <div className="space-y-2.5">
              {plan.pollOptions.map((opt) => {
                const yesVotes = Object.values(opt.votes).filter(Boolean).length;
                const totalFriends = plan.friends.length;
                const isAllYes = yesVotes === totalFriends;

                return (
                  <div
                    key={opt.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isAllYes
                        ? 'bg-orange-500/15 border-orange-500 shadow-[0_0_16px_rgba(249,115,22,0.3)]'
                        : 'bg-slate-800/80 border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-extrabold text-slate-200">
                            {opt.dayText}, {opt.dateText}
                          </span>
                          <span className="text-xs text-orange-400 font-bold">· {opt.timeSlot}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {yesVotes}/{totalFriends} players available
                        </span>
                      </div>

                      {isAllYes ? (
                        <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white text-xs font-black uppercase tracking-wider animate-bounce">
                          ★ 100% Match!
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">
                          {yesVotes} Yes
                        </span>
                      )}
                    </div>

                    {/* Vote progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-950 mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isAllYes ? 'bg-orange-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${(yesVotes / totalFriends) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action to view Best Match & book */}
          <button
            onClick={handleSimulateAllVotes}
            className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <span>View Best Match &amp; Find Courts (4/4 Ready)</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      )}

      {/* STEP 3: BEST MATCH FOUND */}
      {step === 'best_match' && (
        <div className="space-y-4 animate-fade-in">
          {/* Best Match Highlight Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-orange-500/25 via-slate-900/90 to-slate-950 p-4 border border-orange-500/60 shadow-[0_4px_24px_rgba(249,115,22,0.25)] space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider">
                Best Option for your group
              </span>
              <span className="text-xs text-emerald-400 font-bold">4 / 4 Available</span>
            </div>

            <div>
              <h2 className="font-heading font-black text-xl text-white">
                Saturday, Sep 5 at 10:00 AM
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Everyone is free! We matched nearby available badminton courts for your squad.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center -space-x-2">
                {plan.friends.map((f, i) => (
                  <img
                    key={i}
                    alt={f.name}
                    src={f.avatar}
                    className="w-7 h-7 rounded-full ring-2 ring-slate-900 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-orange-400">
                Alex, Sarah, John, Michelle ready to play
              </span>
            </div>
          </div>

          {/* Recommended Facility Card */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Matching Facility (Within 5 km)
              </span>
              <span className="text-xs font-bold text-emerald-400">Court Available</span>
            </div>

            <div className="flex gap-3">
              <img
                alt={matchingFacility.name}
                src={matchingFacility.imageUrl}
                className="w-20 h-20 rounded-2xl object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-orange-400 uppercase">
                    Official ActiveSG Centre
                  </span>
                  <span className="text-xs text-slate-400">{matchingFacility.distanceKm} km</span>
                </div>
                <h3 className="font-heading font-bold text-sm text-slate-100 truncate mt-0.5">
                  {matchingFacility.name}
                </h3>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {matchingFacility.nearestMrt}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs font-extrabold text-orange-400">$7.50 / hr</span>
                  <span className="text-[11px] text-slate-400 font-medium">($1.88 / player)</span>
                </div>
              </div>
            </div>

            {/* Selected Court Slot */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-200 block">Badminton Court 3 (Synthetic Mat)</span>
                <span className="text-slate-400">Saturday, Sep 5 · 10:00 AM – 11:30 AM</span>
              </div>
              <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                Slot Held for Group
              </span>
            </div>
          </div>

          {/* ActiveSG Transparent Handoff Button */}
          <div className="space-y-2">
            <button
              onClick={() => onCompleteHandoffToActiveSG(plan)}
              className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-[0_4px_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <span>Proceed to ActiveSG Booking ($7.50)</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Official court reservation is completed on ActiveSG. Once confirmed, all 4 friends are automatically added and notified!
            </p>
          </div>

          {/* Alternative: Find other public games if needed */}
          <div className="pt-2 text-center">
            <button
              onClick={onExplorePublicGames}
              className="text-xs font-semibold text-orange-400 hover:underline"
            >
              Need more players? Explore Open Community Games →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
