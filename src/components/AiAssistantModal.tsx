import React, { useState } from 'react';
import { Facility } from '../types';

interface AiAssistantModalProps {
  onClose: () => void;
  onSelectFacility: (facility: Facility) => void;
  onStartPlanGame: () => void;
  facilities: Facility[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  recommendation?: {
    facility: Facility;
    reason: string;
    actionText: string;
  };
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  onClose,
  onSelectFacility,
  onStartPlanGame,
  facilities,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi Alex! I'm your PulseSport AI Sports Assistant. Tell me what you're looking for, or pick a scenario below:",
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'Badminton for 4 Saturday morning',
    '1 hour free after work',
    'Beginner friendly pickleball',
    'Indoor rainy day sport',
  ];

  const handleSendPrompt = (promptText: string) => {
    const userMsg: Message = { role: 'user', content: promptText };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let reply: Message;
      const lower = promptText.toLowerCase();

      if (lower.includes('badminton') || lower.includes('saturday')) {
        reply = {
          role: 'assistant',
          content:
            "For a group of 4 on Saturday morning, **Kallang ActiveSG Sports Centre** is your best bet! There's an open slot at 10:00 AM on Court 3 ($7.50/hr). I can set up an availability poll for your friends right away:",
          recommendation: {
            facility: facilities[0],
            reason: 'Synthetic indoor courts · 1.4 km from Boon Keng · $1.88/player',
            actionText: 'Open Group Plan & Poll Friends',
          },
        };
      } else if (lower.includes('after work') || lower.includes('1 hour')) {
        reply = {
          role: 'assistant',
          content:
            "If you have 1 hour after work, **Jalan Besar Swimming Complex** has low crowd lap swimming open until 9:30 PM, or you can do a walk-in HIIT circuit at Apex Athletics in Tanjong Pagar!",
          recommendation: {
            facility: facilities[1],
            reason: 'Olympic 50m lap pool · Lavender MRT · $2.00 walk-in',
            actionText: 'View Lap Pool Availability',
          },
        };
      } else if (lower.includes('pickleball') || lower.includes('beginner')) {
        reply = {
          role: 'assistant',
          content:
            "Pickleball is very easy to pick up! **Boon Keng Sports Community Hub** has an open social doubles session on Saturday 10 AM with 3 friendly players already joined ($4/player, paddles provided).",
          recommendation: {
            facility: facilities[5] || facilities[0],
            reason: 'Covered courts · Free paddle loan · Beginner friendly',
            actionText: 'View Community Hub',
          },
        };
      } else {
        reply = {
          role: 'assistant',
          content:
            "On rainy days, air-conditioned indoor facilities like **Kallang ActiveSG Sports Hall** or **Bishan ActiveSG** are fully sheltered from Stadium/Bishan MRT stations with no wet-weather interruptions!",
          recommendation: {
            facility: facilities[0],
            reason: 'Fully sheltered walkway from Stadium MRT Exit B',
            actionText: 'Explore Sheltered Courts',
          },
        };
      }

      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 900);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    const q = inputQuery.trim();
    setInputQuery('');
    handleSendPrompt(q);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center text-sm shadow-[0_2px_8px_rgba(249,115,22,0.4)]">
              ✨
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-base text-slate-100">
                Pulse AI Sports Assistant
              </h2>
              <p className="text-[11px] text-slate-400">Grounded in live Singapore facilities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs hover:bg-slate-750 border border-slate-700/50"
          >
            ✕
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 no-scrollbar">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-orange-500 text-white font-medium rounded-tr-none shadow-sm'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/50 rounded-tl-none shadow-sm'
                }`}
              >
                <p>{m.content}</p>

                {/* Direct Action Card in AI Reply */}
                {m.recommendation && (
                  <div className="mt-2.5 pt-2 border-t border-slate-700/50 space-y-2">
                    <div className="flex items-center gap-2">
                      <img
                        alt={m.recommendation.facility.name}
                        src={m.recommendation.facility.imageUrl}
                        className="w-10 h-10 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-slate-100 block truncate">
                          {m.recommendation.facility.name}
                        </span>
                        <span className="text-[10px] text-orange-400 block truncate">
                          {m.recommendation.reason}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (m.recommendation?.actionText.includes('Group Plan')) {
                          onStartPlanGame();
                          onClose();
                        } else {
                          onSelectFacility(m.recommendation!.facility);
                        }
                      }}
                      className="w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition-transform active:scale-95"
                    >
                      {m.recommendation.actionText} →
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-800/90 border border-slate-700/50 w-20">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
        </div>

        {/* Quick prompt chips */}
        <div className="px-3 py-2.5 bg-slate-950/90 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendPrompt(p)}
              className="px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-750 text-[11px] text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap shrink-0 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleFormSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything (e.g., Badminton with 3 friends)..."
            className="flex-1 h-11 bg-slate-800 border border-slate-700/60 rounded-2xl px-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            className="w-11 h-11 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0 shadow-md"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
