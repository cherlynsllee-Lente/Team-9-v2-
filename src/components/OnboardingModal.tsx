import React, { useState } from 'react';
import { UserProfile, SportType, ExerciseFrequency, ExerciseTime, SkillLevel } from '../types';

interface OnboardingModalProps {
  initialProfile: UserProfile;
  onClose: () => void;
  onSaveProfile: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  onClose,
  onSaveProfile,
}) => {
  const [sports, setSports] = useState<SportType[]>(initialProfile.preferredSports);
  const [frequency, setFrequency] = useState<ExerciseFrequency>(initialProfile.exerciseFrequency);
  const [preferredTimes, setPreferredTimes] = useState<ExerciseTime[]>(initialProfile.preferredTimes);
  const [location, setLocation] = useState(initialProfile.preferredLocation);
  const [radiusKm, setRadiusKm] = useState(initialProfile.maxDistanceKm);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(initialProfile.skillLevel);

  const sportOptions: SportType[] = [
    'Badminton',
    'Pickleball',
    'Swimming',
    'Gym',
    'Tennis',
    'Basketball',
    'Fitness Classes',
    'Pilates',
    'Boxing',
    'Yoga',
  ];

  const frequencyOptions: ExerciseFrequency[] = [
    'Less than once a week',
    'Once a week',
    '2–3 times a week',
    '4–6 times a week',
    'Daily',
  ];

  const timeOptions: ExerciseTime[] = [
    'Morning',
    'Lunch time',
    'After work',
    'Evening',
    'Weekends',
  ];

  const toggleSport = (s: SportType) => {
    if (sports.includes(s)) {
      if (sports.length > 1) setSports(sports.filter((item) => item !== s));
    } else {
      setSports([...sports, s]);
    }
  };

  const toggleTime = (t: ExerciseTime) => {
    if (preferredTimes.includes(t)) {
      if (preferredTimes.length > 1) setPreferredTimes(preferredTimes.filter((item) => item !== t));
    } else {
      setPreferredTimes([...preferredTimes, t]);
    }
  };

  const handleSave = () => {
    const updated: UserProfile = {
      ...initialProfile,
      preferredSports: sports,
      exerciseFrequency: frequency,
      preferredTimes,
      preferredLocation: location,
      maxDistanceKm: radiusKm,
      skillLevel,
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-extrabold text-base text-slate-100">
              Sports Preferences
            </h2>
            <p className="text-xs text-slate-400">Personalize recommendations &amp; matchmaking</p>
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
          {/* Sports Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Sports You Play / Want to Try
            </label>
            <div className="flex flex-wrap gap-1.5">
              {sportOptions.map((s) => {
                const isSelected = sports.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSport(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                        : 'bg-slate-800/90 border-slate-700/60 text-slate-300 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exercise Frequency */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Exercise Frequency
            </label>
            <div className="grid grid-cols-2 gap-2">
              {frequencyOptions.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={`p-2 rounded-xl text-xs font-medium text-left border transition-all ${
                    frequency === f
                      ? 'bg-orange-500/20 border-orange-500 text-orange-400 font-bold'
                      : 'bg-slate-800/90 border-slate-700/60 text-slate-300 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Times */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Preferred Exercise Times
            </label>
            <div className="flex flex-wrap gap-1.5">
              {timeOptions.map((t) => {
                const isSelected = preferredTimes.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTime(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'bg-slate-800/90 border-slate-700/60 text-slate-300 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location & Radius */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Primary Location &amp; Radius
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-11 bg-slate-800 border border-slate-700/60 rounded-2xl px-3 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
            />
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Travel distance radius:</span>
              <span className="font-bold text-orange-400">{radiusKm} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseInt(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          {/* Skill Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Self-Assessed Skill Level
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Beginner', 'Recreational', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSkillLevel(lvl)}
                  className={`py-1.5 rounded-xl text-xs font-medium border text-center transition-all ${
                    skillLevel === lvl
                      ? 'bg-orange-500 border-orange-500 text-white font-bold'
                      : 'bg-slate-800/90 border-slate-700/60 text-slate-300 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-[0_4px_16px_rgba(249,115,22,0.4)] transition-transform active:scale-98"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
