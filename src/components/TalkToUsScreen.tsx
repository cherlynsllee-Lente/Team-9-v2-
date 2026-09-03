import React, { useEffect } from 'react';

// Real fixed values for Disqus canonical URL and identifier
const PAGE_URL = 'https://team9v2.vercel.app/talk-to-us';
const PAGE_IDENTIFIER = 'team9v2-talk-to-us';

export const TalkToUsScreen: React.FC = () => {
  useEffect(() => {
    // Real fixed configuration for Disqus
    const configureDisqus = function (this: any) {
      this.page.url = PAGE_URL;
      this.page.identifier = PAGE_IDENTIFIER;
    };

    // Set global disqus_config
    (window as any).disqus_config = configureDisqus;

    // In a Single-Page Application, if DISQUS is already initialized on the window,
    // we MUST use DISQUS.reset to reload the comments thread into the newly mounted #disqus_thread container.
    if (typeof (window as any).DISQUS !== 'undefined') {
      try {
        (window as any).DISQUS.reset({
          reload: true,
          config: configureDisqus,
        });
      } catch (err) {
        console.warn('Disqus reset error:', err);
      }
    } else {
      // First-time load: append embed.js script if not present
      const embedScriptId = 'disqus-embed-script';
      if (!document.getElementById(embedScriptId)) {
        const d = document;
        const s = d.createElement('script');
        s.id = embedScriptId;
        s.src = 'https://https-team9v2-vercel-app.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        (d.head || d.body).appendChild(s);
      }

      // Append count.js script if not present
      const countScriptId = 'dsq-count-scr';
      if (!document.getElementById(countScriptId)) {
        const d = document;
        const s = d.createElement('script');
        s.id = countScriptId;
        s.src = 'https://https-team9v2-vercel-app.disqus.com/count.js';
        s.async = true;
        (d.head || d.body).appendChild(s);
      }
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 pb-20 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-slate-800/80 rounded-3xl p-4 sm:p-5 border border-slate-700/50 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl border border-orange-500/30">
              💬
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-lg sm:text-xl text-slate-100 leading-tight">
                Talk to Us
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Community forum, feedback &amp; questions
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Forum
          </span>
        </div>

        <p className="text-xs text-slate-300 mt-3 leading-relaxed">
          Have feedback on court bookings, want to report venue conditions, or looking for fellow players? Leave a comment below or join the community discussion.
        </p>

        {/* Quick Guidelines */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700/50 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>🛡️</span>
            <span>Respectful community</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>⚡</span>
            <span>Team replies regularly</span>
          </div>
        </div>
      </div>

      {/* Disqus Embed Container Card */}
      <div className="bg-slate-900/90 rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">Community Comments</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              Disqus
            </span>
          </div>
          <span className="text-[11px] text-orange-400/90 font-medium">team9v2 discussion</span>
        </div>

        {/* The Disqus container required by Disqus universal code */}
        <div id="disqus_thread" className="min-h-[320px] w-full text-slate-200"></div>

        {/* Noscript fallback required by Disqus code */}
        <noscript>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 text-center">
            Please enable JavaScript to view the{' '}
            <a
              href="https://disqus.com/?ref_noscript"
              target="_blank"
              rel="noreferrer"
              className="text-orange-400 underline font-semibold"
            >
              comments powered by Disqus.
            </a>
          </div>
        </noscript>
      </div>
    </div>
  );
};
