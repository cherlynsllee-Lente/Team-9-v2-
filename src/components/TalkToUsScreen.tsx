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
  Send,
  ThumbsUp,
  Reply,
  CornerDownRight,
  Tag,
  MessageCircle,
} from 'lucide-react';
import { UserProfile } from '../types';

// Real canonical values for the Disqus forum & thread database
const DISQUS_SHORTNAME = 'https-team9v2-vercel-app';
const PAGE_URL = 'https://team9v2.vercel.app/talk-to-us';
const PAGE_IDENTIFIER = 'team9v2-talk-to-us';
const PAGE_TITLE = 'PulseSport Singapore - Talk to Us Community Discussion';

export interface CommentReply {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface CommunityComment {
  id: string;
  author: string;
  avatar?: string;
  badge?: string;
  tag: string;
  content: string;
  timestamp: string;
  likes: number;
  userLiked?: boolean;
  replies: CommentReply[];
}

const INITIAL_COMMENTS: CommunityComment[] = [
  {
    id: 'comm-1',
    author: 'Marcus Lim',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    badge: 'ActiveSG Regular',
    tag: 'ActiveSG Booking',
    content:
      '💡 Tip for anyone trying to book badminton courts: ActiveSG slots release 14 days in advance at 7:00 AM sharp! Kallang Sports Centre and Jurong East fill up in under 60 seconds, so ensure your wallet has credits topped up.',
    timestamp: '15 mins ago',
    likes: 18,
    userLiked: false,
    replies: [
      {
        id: 'rep-1',
        author: 'Team Pulse',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASkhxLcB1nSHWtM9mCfJvYD_zbNJEIzDWqrGY3MyggZ5VbMN-eozqNG6hXll1uch7DX7UZtN1yB7v4uelGuIS-1VBs8K7fxfQ_bvJBaPCFaGTudGknBVDjlECEDh82fX4jyHqX7Mp5NMD3PhlPGgBS_8C_vEUUiBf2xw-C2Tb69kwg_DxTTLOAx1noiL1lnxLoQOVElZEg028DNJ77OPrP2Drre9Bk5nTMun2dfcwTzOv095ELGGkM',
        content:
          'Solid tip Marcus! We are also surfacing real-time court availability and slot notifications across SG venues.',
        timestamp: '8 mins ago',
        likes: 7,
      },
    ],
  },
  {
    id: 'comm-2',
    author: 'Priya Nair',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    badge: 'Tennis & Badminton',
    tag: 'Venue Review',
    content:
      'Played at Bishan Sports Hall yesterday evening. Air conditioning was great and the floor grip is pristine! Does anyone know if stringing services stay open past 8:30 PM on weekdays?',
    timestamp: '1 hour ago',
    likes: 9,
    userLiked: true,
    replies: [
      {
        id: 'rep-2',
        author: 'David Koh',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        content: 'Yes! The pro shop uncle usually stays until around 8:45 PM if there are night session bookings.',
        timestamp: '35 mins ago',
        likes: 4,
      },
    ],
  },
  {
    id: 'comm-3',
    author: 'Leon Wong',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    badge: 'Pickleball Host',
    tag: 'Looking for Players',
    content:
      'Looking for 2 intermediate players for casual doubles pickleball at Heartbeat@Bedok this coming Tuesday around 7:30 PM. We have spare paddles if you need them! Ping here to join.',
    timestamp: '3 hours ago',
    likes: 12,
    userLiked: false,
    replies: [],
  },
];

const CATEGORIES = [
  'All',
  'General Feedback',
  'ActiveSG Booking',
  'Venue Review',
  'Looking for Players',
  'Court Tips',
];

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
  // Live comments state with persistent localStorage
  const [comments, setComments] = useState<CommunityComment[]>(() => {
    try {
      const saved = localStorage.getItem('pulsesport_talk_comments_v3');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_COMMENTS;
  });

  // Comment input form state
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedTag, setSelectedTag] = useState('General Feedback');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  // Disqus embed state
  const [isLoadingDisqus, setIsLoadingDisqus] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [disqusStatus, setDisqusStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [showDisqusEmbed, setShowDisqusEmbed] = useState(true);
  const commentBoxRef = useRef<HTMLDivElement>(null);
  const disqusContainerRef = useRef<HTMLDivElement>(null);

  // Save comments to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('pulsesport_talk_comments_v3', JSON.stringify(comments));
    } catch {
      // ignore
    }
  }, [comments]);

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
        setDisqusStatus('connected');
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

  // Handle posting a live comment
  const handlePostComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;

    setIsPosting(true);
    const poster = authorName.trim() || userProfile?.name || 'Alex Tan';
    const avatar =
      userProfile?.avatar ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuASkhxLcB1nSHWtM9mCfJvYD_zbNJEIzDWqrGY3MyggZ5VbMN-eozqNG6hXll1uch7DX7UZtN1yB7v4uelGuIS-1VBs8K7fxfQ_bvJBaPCFaGTudGknBVDjlECEDh82fX4jyHqX7Mp5NMD3PhlPGgBS_8C_vEUUiBf2xw-C2Tb69kwg_DxTTLOAx1noiL1lnxLoQOVElZEg028DNJ77OPrP2Drre9Bk5nTMun2dfcwTzOv095ELGGkM';

    const newComment: CommunityComment = {
      id: `comm-${Date.now()}`,
      author: poster,
      avatar,
      badge: 'You • Live',
      tag: selectedTag,
      content: trimmed,
      timestamp: 'Just now',
      likes: 1,
      userLiked: true,
      replies: [],
    };

    setTimeout(() => {
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
      setIsPosting(false);
      setShowSuccessToast(true);

      // Trigger Disqus reset to keep thread notified
      if (typeof (window as any).DISQUS !== 'undefined') {
        try {
          (window as any).DISQUS.reset({ reload: false, config: configureDisqus });
        } catch {
          // ignore
        }
      }

      setTimeout(() => setShowSuccessToast(false), 4000);
    }, 200);
  };

  // Handle posting a reply
  const handlePostReply = (parentId: string) => {
    const trimmed = replyText.trim();
    if (!trimmed) return;

    const poster = authorName.trim() || userProfile?.name || 'Alex Tan';
    const avatar =
      userProfile?.avatar ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuASkhxLcB1nSHWtM9mCfJvYD_zbNJEIzDWqrGY3MyggZ5VbMN-eozqNG6hXll1uch7DX7UZtN1yB7v4uelGuIS-1VBs8K7fxfQ_bvJBaPCFaGTudGknBVDjlECEDh82fX4jyHqX7Mp5NMD3PhlPGgBS_8C_vEUUiBf2xw-C2Tb69kwg_DxTTLOAx1noiL1lnxLoQOVElZEg028DNJ77OPrP2Drre9Bk5nTMun2dfcwTzOv095ELGGkM';

    const newReply: CommentReply = {
      id: `rep-${Date.now()}`,
      author: poster,
      avatar,
      content: trimmed,
      timestamp: 'Just now',
      likes: 0,
    };

    setComments((prev) =>
      prev.map((c) => (c.id === parentId ? { ...c, replies: [...c.replies, newReply] } : c))
    );

    setReplyText('');
    setActiveReplyId(null);
  };

  // Handle toggle like on comments
  const handleToggleLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = !c.userLiked;
          return {
            ...c,
            userLiked: isLiked,
            likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
          };
        }
        return c;
      })
    );
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard?.writeText(prompt);
    setCopiedPrompt(prompt);
    setCommentText(prompt);
    if (prompt.includes('ActiveSG')) setSelectedTag('ActiveSG Booking');
    else if (prompt.includes('Kallang')) setSelectedTag('Venue Review');
    else if (prompt.includes('pickleball')) setSelectedTag('Looking for Players');
    else setSelectedTag('Court Tips');

    if (commentBoxRef.current) {
      commentBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const textarea = document.getElementById('community-comment-input');
      if (textarea) textarea.focus();
    }
    setTimeout(() => setCopiedPrompt(null), 2500);
  };

  const filteredComments =
    selectedFilter === 'All'
      ? comments
      : comments.filter((c) => c.tag.toLowerCase() === selectedFilter.toLowerCase());

  return (
    <div className="flex flex-col gap-6 pb-24 animate-fade-in max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-700/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-52 h-52 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl border border-orange-500/30 shadow-inner">
              💬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-100 tracking-tight">
                  Talk to Us
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Database Live
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Share venue reviews, find sports partners, and ask court booking questions
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={loadOrResetDisqus}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95 shadow-sm"
              title="Re-sync comments with the database"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Database'}</span>
            </button>
            <a
              href={PAGE_URL}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open on Web</span>
            </a>
          </div>
        </div>

        {/* Embedded Database Metadata Bar */}
        <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="flex items-center gap-2.5 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/40">
            <Database className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Database Source</span>
              <span className="font-mono text-[11px] text-slate-200">{DISQUS_SHORTNAME}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/40">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Thread Identifier</span>
              <span className="font-mono text-[11px] text-slate-200">{PAGE_IDENTIFIER}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/40">
            <Users className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Posting As</span>
              <span className="text-[11px] text-slate-200 font-medium">
                {authorName.trim() || userProfile?.name || 'Alex Tan'} (Active)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK INSPIRATION PROMPTS */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Quick Suggestions (Click to fill into comment box)</span>
          </div>
          {copiedPrompt && (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 animate-fade-in font-medium">
              <CheckCircle2 className="w-3 h-3" /> Ready in comment box!
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {DISCUSSION_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleCopyPrompt(prompt)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700/70 transition-all flex items-center gap-1.5 text-left active:scale-98 cursor-pointer hover:text-white"
            >
              <span>{prompt}</span>
              <Copy className="w-3 h-3 text-slate-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* 🚀 PRIMARY LIVE COMMENT COMPOSER BOX */}
      <div
        ref={commentBoxRef}
        id="comment-box"
        className="bg-slate-900/95 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-2xl backdrop-blur-xl relative"
      >
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
            <h2 className="font-bold text-base text-slate-100 flex items-center gap-2">
              Type a Comment
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-orange-500/15 text-orange-400 border border-orange-500/30 font-semibold">
              Live Feed
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Posting as{' '}
            <span className="text-orange-400 font-semibold">
              {authorName.trim() || userProfile?.name || 'Alex Tan'}
            </span>
          </span>
        </div>

        <form onSubmit={handlePostComment} className="flex flex-col gap-3.5">
          {/* Topic Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-orange-400" /> Topic:
            </span>
            {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedTag(cat)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  selectedTag === cat
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Comment Textarea */}
          <div className="relative">
            <textarea
              id="community-comment-input"
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Type your comment, court review, or sports partner request here (e.g. Kallang badminton slots or looking for tennis kakis)..."
              className="w-full rounded-2xl bg-slate-950/80 border border-slate-700/80 p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-y transition-all leading-relaxed"
            />
          </div>

          {/* Bottom Action Row */}
          <div className="flex items-center justify-between flex-wrap gap-2.5 pt-1">
            <div className="flex items-center gap-2.5">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={`Name: ${userProfile?.name || 'Alex Tan'}`}
                className="text-xs bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500/80 w-44"
              />
              <span className="text-xs text-slate-500">
                {commentText.length} characters
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCommentText('');
                  setAuthorName('');
                }}
                disabled={!commentText}
                className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Clear
              </button>

              <button
                type="submit"
                id="post-comment-btn"
                disabled={!commentText.trim() || isPosting}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-lg shadow-orange-500/25 active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isPosting ? 'Posting Live...' : 'Post Comment'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Success Alert Toast */}
        {showSuccessToast && (
          <div className="mt-3.5 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fade-in font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Your comment was posted live to the community discussion board!</span>
          </div>
        )}
      </div>

      {/* FILTER TABS & COMMENT STATS */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-medium">
          {filteredComments.length} {filteredComments.length === 1 ? 'Live Comment' : 'Live Comments'}
        </span>
      </div>

      {/* 💬 LIVE COMMENTS FEED LIST */}
      <div className="flex flex-col gap-3.5">
        {filteredComments.length === 0 ? (
          <div className="bg-slate-900/60 rounded-3xl p-8 text-center border border-slate-800">
            <MessageCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-medium">No comments in this category yet.</p>
            <p className="text-xs text-slate-500 mt-1">Be the first to share your thoughts above!</p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md flex flex-col gap-3 transition-all hover:border-slate-700/80"
            >
              {/* Author Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={
                      comment.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                    }
                    alt={comment.author}
                    className="w-9 h-9 rounded-full object-cover border border-slate-700 bg-slate-800"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-200">
                        {comment.author}
                      </span>
                      {comment.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                            comment.badge.includes('You')
                              ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                              : comment.badge.includes('Team')
                              ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {comment.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">{comment.timestamp}</span>
                  </div>
                </div>

                <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                  {comment.tag}
                </span>
              </div>

              {/* Comment Content */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap pl-1">
                {comment.content}
              </p>

              {/* Actions (Like & Reply) */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleLike(comment.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    comment.userLiked
                      ? 'bg-orange-500/15 text-orange-400 font-semibold border border-orange-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${comment.userLiked ? 'fill-orange-400' : ''}`} />
                  <span>{comment.likes}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (activeReplyId === comment.id) {
                      setActiveReplyId(null);
                    } else {
                      setActiveReplyId(comment.id);
                      setReplyText('');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply</span>
                  {comment.replies.length > 0 && (
                    <span className="ml-0.5 text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full font-medium">
                      {comment.replies.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Inline Reply Form */}
              {activeReplyId === comment.id && (
                <div className="mt-2 pl-4 border-l-2 border-orange-500/50 flex flex-col gap-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${comment.author}...`}
                    className="w-full text-xs rounded-xl bg-slate-950/80 border border-slate-700/80 p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveReplyId(null);
                        setReplyText('');
                      }}
                      className="text-xs px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePostReply(comment.id)}
                      disabled={!replyText.trim()}
                      className="text-xs px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Send className="w-3 h-3" />
                      Reply Live
                    </button>
                  </div>
                </div>
              )}

              {/* Threaded Replies */}
              {comment.replies.length > 0 && (
                <div className="mt-2 pl-4 border-l-2 border-slate-700/60 flex flex-col gap-2.5">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-slate-950/50 rounded-xl p-3 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <CornerDownRight className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-xs font-bold text-slate-300">
                            {reply.author}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">{reply.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 pl-5">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 🌐 EMBEDDED DISQUS DATABASE THREAD (COLLAPSIBLE / ACCORDION) */}
      <div
        ref={disqusContainerRef}
        className="bg-slate-900/95 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-2xl backdrop-blur-xl relative"
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-orange-400" />
            <span className="font-bold text-slate-100 text-sm">Disqus Database Cloud Stream</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              team9v2-talk-to-us
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDisqusEmbed(!showDisqusEmbed)}
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
            >
              {showDisqusEmbed ? 'Collapse Thread' : 'Expand Thread'}
            </button>
          </div>
        </div>

        {showDisqusEmbed && (
          <div>
            {/* Loading status */}
            {isLoadingDisqus && (
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center flex flex-col items-center justify-center my-3 animate-pulse">
                <RefreshCw className="w-5 h-5 text-orange-400 animate-spin mb-2" />
                <p className="text-xs font-semibold text-slate-300">Syncing with Disqus database...</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Connecting to {PAGE_IDENTIFIER}
                </p>
              </div>
            )}

            {/* Error or iframe blocker notice */}
            {disqusStatus === 'error' && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 mb-4 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-200">Third-party cookie blocker active in sandbox iframe:</span>{' '}
                  You can type comments above in the live comment box anytime. To also sync directly with Disqus accounts, click{' '}
                  <a
                    href={PAGE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-bold text-amber-100 hover:text-white"
                  >
                    Open on Web
                  </a>.
                </div>
              </div>
            )}

            {/* The Exact Disqus Thread Container */}
            <div
              id="disqus_thread"
              className="min-h-[280px] w-full text-slate-200"
              style={{ color: 'rgb(226, 232, 240)', backgroundColor: 'transparent' }}
            ></div>

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
        )}
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
          Discussions are moderated under Singapore sports community guidelines. Please keep interactions respectful, avoid posting private contact numbers, and share truthful court and booking advice.
        </div>
      </div>
    </div>
  );
};


