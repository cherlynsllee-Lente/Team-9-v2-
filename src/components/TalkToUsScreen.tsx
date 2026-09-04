import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Database,
  CheckCircle2,
  Copy,
  Info,
  Users,
  Flame,
} from 'lucide-react';
import { UserProfile } from '../types';

// Real canonical values for the Disqus forum & thread database
const DISQUS_SHORTNAME = 'https-team9v2-vercel-app';
const PAGE_URL = 'https://team9v2.vercel.app/talk-to-us';
const PAGE_IDENTIFIER = 'team9v2-talk-to-us';
const PAGE_TITLE = 'PulseSport Singapore - Talk to Us Community Discussion';

const DISCUSSION_PROMPTS = [
  '🏸 How are the courts and lighting at Kallang Sports Centre?',
  '⏰ What time do ActiveSG slot drops happen for badminton?',
  '🏓 Looking for intermediate pickleball players in the East/Bedok!',
  '💡 Tips on getting last-minute weekend badminton slots',
  '🎾 Best public tennis courts with shelter or evening floodlights',
];

const COMMUNITY_HIGHLIGHTS = [
  {
    topic: 'ActiveSG 14-Day Advance Rule',
    tip: 'Slots release daily at 7:00 AM sharp. Have Singpass or ActiveSG wallet pre-topped up.',
    badge: 'Pro Tip',
  },
  {
    topic: 'Court Etiquette',
    tip: 'Non-marking sports shoes only. Check-in via QR code at facility gantry before entry.',
    badge: 'Venue Rule',
  },
  {
    topic: 'Rain & Weather Contingency',
    tip: 'Outdoor courts get refunded automatically via ActiveSG app if downpour cancels booking.',
    badge: 'Refund Policy',
  },
];

interface TalkToUsScreenProps {
  userProfile?: UserProfile;
}

export const TalkToUsScreen: React.FC<TalkToUsScreenProps> = ({ userProfile }) => {
  const [isLoadingDisqus, setIsLoadingDisqus] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [disqusStatus, setDisqusStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const disqusContainerRef = useRef<HTMLDivElement>(null);

  // Define configureDisqus function
  const configureDisqus = function (this: any) {
    try {
      if (!this) return;
      if (!this.page) {
        this.page = {};
      }
      this.page.url = PAGE_URL;
      this.page.identifier = PAGE_IDENTIFIER;
      this.page.title = PAGE_TITLE;
    } catch (err) {
      console.warn('Disqus configure error:', err);
    }
  };

  // Function to initialize or reset Disqus
  const loadOrResetDisqus = () => {
    setIsRefreshing(true);
    setDisqusStatus('connecting');

    // Register global disqus_config
    (window as any).disqus_config = configureDisqus;

    if (
      typeof (window as any).DISQUS !== 'undefined' &&
      typeof (window as any).DISQUS.reset === 'function'
    ) {
      try {
        (window as any).DISQUS.reset({
          reload: true,
          config: configureDisqus,
        });
        setDisqusStatus('connected');
        setIsLoadingDisqus(false);
        setIsRefreshing(false);
      } catch (err) {
        console.warn('Disqus reset error:', err);
        setDisqusStatus('connected'); // Usually still working
        setIsLoadingDisqus(false);
        setIsRefreshing(false);
      }
    } else {
      // First-time load: append embed.js script if not present
      const embedScriptId = 'disqus-embed-script';
      let script = document.getElementById(embedScriptId) as HTMLScriptElement | null;

      if (!script) {
        script = document.createElement('script');
        script.id = embedScriptId;
        script.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
        script.setAttribute('data-timestamp', String(+new Date()));
        script.async = true;

        script.onload = () => {
          setDisqusStatus('connected');
          setIsLoadingDisqus(false);
          setIsRefreshing(false);
        };

        script.onerror = () => {
          console.warn('Disqus script blocked or network error.');
          setDisqusStatus('error');
          setIsLoadingDisqus(false);
          setIsRefreshing(false);
        };

        (document.head || document.body).appendChild(script);
      } else {
        // Script already exists in DOM; give it a brief moment to finish booting
        const checkTimer = setTimeout(() => {
          if (
            typeof (window as any).DISQUS !== 'undefined' &&
            typeof (window as any).DISQUS.reset === 'function'
          ) {
            try {
              (window as any).DISQUS.reset({
                reload: true,
                config: configureDisqus,
              });
            } catch (e) {
              console.warn(e);
            }
          }
          setDisqusStatus('connected');
          setIsLoadingDisqus(false);
          setIsRefreshing(false);
        }, 300);

        return () => clearTimeout(checkTimer);
      }
    }

    // Also ensure count.js is present for comment counts
    const countScriptId = 'dsq-count-scr';
    if (!document.getElementById(countScriptId)) {
      const countScript = document.createElement('script');
      countScript.id = countScriptId;
      countScript.src = `https://${DISQUS_SHORTNAME}.disqus.com/count.js`;
      countScript.async = true;
      (document.head || document.body).appendChild(countScript);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrResetDisqus();
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard?.writeText(prompt);
    setCopiedPrompt(prompt);
    setTimeout(() => setCopiedPrompt(null), 2500);

    // Smooth scroll down to disqus thread
    if (disqusContainerRef.current) {
      disqusContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-24 animate-fade-in max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-700/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-52 h-52 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl border border-orange-500/30 shadow-inner">
              💬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-100 tracking-tight">
                  Talk to Us
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Database Embedded
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official community discussions &amp; player feedback powered by Disqus
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={loadOrResetDisqus}
              disabled={isRefreshing}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
              title="Re-sync comments with the database"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Database'}</span>
            </button>
            <a
              href={PAGE_URL}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/20"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open on Web</span>
            </a>
          </div>
        </div>

        {/* Embedded Database Metadata Bar */}
        <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/40">
            <Database className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Database Source</span>
              <span className="font-mono text-[11px] text-slate-200">{DISQUS_SHORTNAME}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/40">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Thread Identifier</span>
              <span className="font-mono text-[11px] text-slate-200">{PAGE_IDENTIFIER}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/40">
            <Users className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Comment Typing</span>
              <span className="text-[11px] text-slate-200">
                {userProfile?.name ? `Active as ${userProfile.name}` : 'Direct & Guest Typing'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Discussion Starters & Fast Prompts */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Popular Discussion Prompts (Click to copy &amp; jump to comment box)</span>
          </div>
          {copiedPrompt && (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-3 h-3" /> Copied to clipboard!
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {DISCUSSION_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleCopyPrompt(prompt)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700/70 transition-all flex items-center gap-1.5 text-left active:scale-98 cursor-pointer"
            >
              <span>{prompt}</span>
              <Copy className="w-3 h-3 text-slate-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* PRIMARY EMBEDDED DISQUS DATABASE THREAD */}
      <div
        ref={disqusContainerRef}
        className="bg-slate-900/95 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-2xl backdrop-blur-xl relative"
      >
        {/* Thread Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-orange-400" />
            <span className="font-bold text-slate-100 text-sm">Embedded Discussion Thread</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Live Disqus Database
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Post comments, reply to players, and upvote
          </span>
        </div>

        {/* Loading / Connecting Status Overlay */}
        {isLoadingDisqus && (
          <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center flex flex-col items-center justify-center my-4 animate-pulse">
            <RefreshCw className="w-6 h-6 text-orange-400 animate-spin mb-2" />
            <p className="text-xs font-semibold text-slate-300">Connecting to Disqus Database...</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Loading real-time comments for {PAGE_IDENTIFIER}
            </p>
          </div>
        )}

        {/* Error Fallback Notice */}
        {disqusStatus === 'error' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 mb-4 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-200">Third-party cookie or tracker blocker detected:</span>{' '}
              If your browser blocks third-party Disqus embeds in iframes, click{' '}
              <a
                href={PAGE_URL}
                target="_blank"
                rel="noreferrer"
                className="underline font-bold text-amber-100 hover:text-white"
              >
                Open on Web
              </a>{' '}
              to comment directly on the verified discussion thread.
            </div>
          </div>
        )}

        {/* The Exact Disqus Thread Container Required by Universal Code */}
        <div
          id="disqus_thread"
          className="min-h-[380px] w-full text-slate-200"
          style={{ color: 'rgb(226, 232, 240)', backgroundColor: 'transparent' }}
        ></div>

        {/* Noscript fallback required by Disqus specification */}
        <noscript>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 text-center">
            Please enable JavaScript to view the{' '}
            <a
              href="https://disqus.com/?ref_noscript"
              target="_blank"
              rel="noreferrer"
              className="text-orange-400 underline font-semibold"
            >
              comments powered by Disqus database.
            </a>
          </div>
        </noscript>
      </div>

      {/* Singapore Sports Community Reference & FAQs */}
      <div className="bg-slate-900/60 rounded-3xl p-5 border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-400" />
          <h3 className="font-bold text-sm text-slate-200">Frequently Discussed Venue Rules &amp; Tips</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {COMMUNITY_HIGHLIGHTS.map((item, idx) => (
            <div key={idx} className="bg-slate-950/50 rounded-2xl p-3.5 border border-slate-800/80 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{item.topic}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20 font-semibold">
                  {item.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Safety & Guidelines Card */}
      <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/40 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300">Community Safety &amp; Etiquette:</span>{' '}
          Disqus comments are moderated under Singapore sports community guidelines. Please keep interactions respectful, avoid posting private contact numbers, and share truthful court and booking advice.
        </div>
      </div>
    </div>
  );
};

