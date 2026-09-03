import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  ThumbsUp,
  Reply,
  Sparkles,
  CheckCircle2,
  CornerDownRight,
  MessageCircle,
  ExternalLink,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile } from '../types';

// Real fixed values for Disqus canonical URL and identifier
const PAGE_URL = 'https://team9v2.vercel.app/talk-to-us';
const PAGE_IDENTIFIER = 'team9v2-talk-to-us';

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
      '💡 Tip for anyone trying to book badminton courts: ActiveSG slots open 14 days in advance at 7:00 AM sharp! Kallang Sports Centre and Jurong East fill up in seconds, so make sure your wallet is topped up beforehand.',
    timestamp: '2 hours ago',
    likes: 14,
    userLiked: false,
    replies: [
      {
        id: 'rep-1',
        author: 'Team Pulse',
        avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1UQOxS1w9sJazxwSdBWi95NrM24xjjabHSXu2XLyTcio0dlD5MaPieX_kbqxYp1v1LUSZIRyEyHTcXPf9TTsaH0qMBy0OqgGl5oIIxufn74cQUy-2QqA3rjNLPLElzmLRcwmbpMYSmNXoFEN6U28n9I5i5TprETx8tH6qfQc31kk_QF58YytgFiciMqk5r1GRyDbySVnCpZ_USpzNPlehUsJxcURAn7I7ffuDt-Kowssbglt2RF0-SfiQ',
        content:
          'Great tip Marcus! We are currently building automated dropped-slot notifications in PulseSport to help grab last-minute cancellations.',
        timestamp: '1 hour ago',
        likes: 6,
      },
    ],
  },
  {
    id: 'comm-2',
    author: 'Priya Nair',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    badge: 'Badminton & Tennis',
    tag: 'Venue Review',
    content:
      'Played at Bishan Sports Hall yesterday. Air conditioning was great and floor grip is solid! Does anyone know if the pro shop near Court 4 stays open past 8:00 PM for restringing?',
    timestamp: '5 hours ago',
    likes: 8,
    userLiked: true,
    replies: [
      {
        id: 'rep-2',
        author: 'David Koh',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        content: 'Yes! Uncle there usually stays until around 8:30 PM on weekdays.',
        timestamp: '3 hours ago',
        likes: 3,
      },
    ],
  },
  {
    id: 'comm-3',
    author: 'Leon Wong',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    badge: 'Pickleball Fan',
    tag: 'Looking for Players',
    content:
      'Looking for 2 more players for intermediate doubles pickleball at Heartbeat@Bedok next Tuesday around 7:30 PM. We have spare paddles if you need one! Feel free to ping here.',
    timestamp: 'Yesterday',
    likes: 11,
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
  'Questions',
];

const QUICK_PROMPTS = [
  '🏸 How are the courts at Kallang lately?',
  '⏰ When is the best time to book ActiveSG slots?',
  '🏓 Anyone keen on a casual weekend game?',
  '✨ Suggest a new feature for PulseSport!',
];

interface TalkToUsScreenProps {
  userProfile?: UserProfile;
}

export const TalkToUsScreen: React.FC<TalkToUsScreenProps> = ({ userProfile }) => {
  // Local state for comments
  const [comments, setComments] = useState<CommunityComment[]>(() => {
    try {
      const saved = localStorage.getItem('pulsesport_talk_comments_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore JSON parse errors
    }
    return INITIAL_COMMENTS;
  });

  // Filter & Form state
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('General Feedback');
  const [customAuthorName, setCustomAuthorName] = useState<string>('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'community' | 'disqus'>('community');

  // Save comments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pulsesport_talk_comments_v2', JSON.stringify(comments));
    } catch {
      // ignore storage errors
    }
  }, [comments]);

  // Disqus Embed Loader
  useEffect(() => {
    // Real fixed configuration for Disqus
    const configureDisqus = function (this: any) {
      try {
        if (!this) return;
        if (!this.page) {
          this.page = {};
        }
        this.page.url = PAGE_URL;
        this.page.identifier = PAGE_IDENTIFIER;
      } catch (err) {
        // Safe guard against unexpected configurator context
      }
    };

    // Set global disqus_config
    (window as any).disqus_config = configureDisqus;

    const timer = setTimeout(() => {
      if (
        typeof (window as any).DISQUS !== 'undefined' &&
        typeof (window as any).DISQUS.reset === 'function'
      ) {
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
          s.onerror = () => {
            console.warn('Disqus embed script blocked or failed to load.');
          };
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
          s.onerror = () => {
            console.warn('Disqus count script blocked or failed to load.');
          };
          (d.head || d.body).appendChild(s);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [viewMode]);

  // Handle posting a new top-level comment
  const handlePostComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCommentText.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    const authorName = customAuthorName.trim() || userProfile?.name || 'Alex Tan';
    const authorAvatar =
      userProfile?.avatar ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuASkhxLcB1nSHWtM9mCfJvYD_zbNJEIzDWqrGY3MyggZ5VbMN-eozqNG6hXll1uch7DX7UZtN1yB7v4uelGuIS-1VBs8K7fxfQ_bvJBaPCFaGTudGknBVDjlECEDh82fX4jyHqX7Mp5NMD3PhlPGgBS_8C_vEUUiBf2xw-C2Tb69kwg_DxTTLOAx1noiL1lnxLoQOVElZEg028DNJ77OPrP2Drre9Bk5nTMun2dfcwTzOv095ELGGkM';

    const newComment: CommunityComment = {
      id: `comm-${Date.now()}`,
      author: authorName,
      avatar: authorAvatar,
      badge: 'You',
      tag: selectedTag,
      content: trimmed,
      timestamp: 'Just now',
      likes: 1,
      userLiked: true,
      replies: [],
    };

    setTimeout(() => {
      setComments((prev) => [newComment, ...prev]);
      setNewCommentText('');
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3500);
    }, 200);
  };

  // Handle posting a reply to a comment
  const handlePostReply = (parentCommentId: string) => {
    const trimmed = replyText.trim();
    if (!trimmed) return;

    const authorName = customAuthorName.trim() || userProfile?.name || 'Alex Tan';
    const authorAvatar =
      userProfile?.avatar ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuASkhxLcB1nSHWtM9mCfJvYD_zbNJEIzDWqrGY3MyggZ5VbMN-eozqNG6hXll1uch7DX7UZtN1yB7v4uelGuIS-1VBs8K7fxfQ_bvJBaPCFaGTudGknBVDjlECEDh82fX4jyHqX7Mp5NMD3PhlPGgBS_8C_vEUUiBf2xw-C2Tb69kwg_DxTTLOAx1noiL1lnxLoQOVElZEg028DNJ77OPrP2Drre9Bk5nTMun2dfcwTzOv095ELGGkM';

    const newReply: CommentReply = {
      id: `rep-${Date.now()}`,
      author: authorName,
      avatar: authorAvatar,
      content: trimmed,
      timestamp: 'Just now',
      likes: 0,
    };

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === parentCommentId) {
          return {
            ...c,
            replies: [...c.replies, newReply],
          };
        }
        return c;
      })
    );

    setReplyText('');
    setActiveReplyId(null);
  };

  // Handle like toggle on comment
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

  // Filtered comments
  const filteredComments =
    selectedFilter === 'All'
      ? comments
      : comments.filter((c) => c.tag.toLowerCase() === selectedFilter.toLowerCase());

  return (
    <div className="flex flex-col gap-5 pb-24 animate-fade-in max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-700/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
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
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold border border-orange-500/30">
                  Community Hub
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Share feedback, ask questions, or connect with players in Singapore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('community')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'community'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Community Board ({comments.length})
            </button>
            <button
              onClick={() => setViewMode('disqus')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'disqus'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Disqus Feed
            </button>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-slate-700/50 text-xs text-slate-300">
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/40">
            <span className="text-emerald-400">⚡</span>
            <span>Real-time player tips</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/40">
            <span className="text-orange-400">🏸</span>
            <span>ActiveSG court updates</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/40">
            <span className="text-sky-400">🤝</span>
            <span>Open community replies</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'community' ? (
        <div className="flex flex-col gap-5">
          {/* COMMENT COMPOSER BOX */}
          <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <h2 className="font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
                  Leave a Comment or Question
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">
                Posting as{' '}
                <span className="text-orange-400 font-semibold">
                  {customAuthorName.trim() || userProfile?.name || 'Alex Tan'}
                </span>
              </span>
            </div>

            {/* Quick Inspiration Prompts */}
            <div className="mb-3">
              <div className="text-[11px] text-slate-400 font-medium mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-400" />
                <span>Quick inspiration:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNewCommentText(prompt);
                      if (prompt.includes('ActiveSG')) setSelectedTag('ActiveSG Booking');
                      else if (prompt.includes('Kallang')) setSelectedTag('Venue Review');
                      else if (prompt.includes('weekend')) setSelectedTag('Looking for Players');
                      else setSelectedTag('General Feedback');
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handlePostComment} className="flex flex-col gap-3">
              {/* Category Tag Selector */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Topic:
                </span>
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedTag(cat)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium transition-all ${
                      selectedTag === cat
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Textarea Input */}
              <div className="relative">
                <textarea
                  id="community-comment-input"
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Type your comment, court review, or question here (e.g. Which courts have the best air-con?)..."
                  className="w-full rounded-2xl bg-slate-950/70 border border-slate-700/70 p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 resize-y transition-all"
                />
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customAuthorName}
                    onChange={(e) => setCustomAuthorName(e.target.value)}
                    placeholder={`Name: ${userProfile?.name || 'Alex Tan'}`}
                    className="text-xs bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-600 w-36"
                  />
                  <span className="text-[11px] text-slate-500">
                    {newCommentText.length} characters
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!newCommentText.trim() || isSubmitting}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-orange-500/20 active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>

            {/* Success Toast */}
            {showSuccessToast && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Your comment has been posted to the community board!</span>
              </div>
            )}
          </div>

          {/* FILTER TABS */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedFilter === cat
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500">
              {filteredComments.length} {filteredComments.length === 1 ? 'comment' : 'comments'}
            </span>
          </div>

          {/* COMMENTS LIST */}
          <div className="flex flex-col gap-3.5">
            {filteredComments.length === 0 ? (
              <div className="bg-slate-900/60 rounded-2xl p-8 text-center border border-slate-800">
                <MessageCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">No comments in this category yet.</p>
                <p className="text-xs text-slate-500 mt-1">Be the first to share your thoughts!</p>
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
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
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
                              className={`text-[10px] px-2 py-0.2 rounded-md font-semibold border ${
                                comment.badge === 'You'
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

                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                      {comment.tag}
                    </span>
                  </div>

                  {/* Comment Body */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-1 whitespace-pre-wrap">
                    {comment.content}
                  </p>

                  {/* Actions (Like & Reply) */}
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(comment.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
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
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply</span>
                      {comment.replies.length > 0 && (
                        <span className="ml-0.5 text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full">
                          {comment.replies.length}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Inline Reply Input */}
                  {activeReplyId === comment.id && (
                    <div className="mt-2 pl-4 border-l-2 border-orange-500/50 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${comment.author}...`}
                          className="w-full text-xs rounded-xl bg-slate-950/70 border border-slate-700/80 p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveReplyId(null);
                            setReplyText('');
                          }}
                          className="text-xs px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePostReply(comment.id)}
                          disabled={!replyText.trim()}
                          className="text-xs px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Reply
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
                              <CornerDownRight className="w-3 h-3 text-slate-500" />
                              <span className="text-xs font-bold text-slate-300">
                                {reply.author}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500">{reply.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-300 pl-4">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* DISQUS EMBED SECTION */
        <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">Disqus Thread</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Universal Embed
              </span>
            </div>
            <span className="text-[11px] text-orange-400/90 font-medium">team9v2 discussion</span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Loaded from <code className="text-slate-300">team9v2-talk-to-us</code> on Disqus.
          </p>

          {/* The Disqus container required by Disqus universal code */}
          <div
            id="disqus_thread"
            className="min-h-[320px] w-full text-slate-200"
            style={{ color: 'rgb(226, 232, 240)', backgroundColor: 'transparent' }}
          ></div>

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
      )}

      {/* Community Guidelines Card */}
      <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/40 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300">Community Safety &amp; Etiquette:</span>{' '}
          Please keep conversations respectful, avoid sharing personal contact numbers publicly, and focus on sports venue reviews, group matchmaking, and booking questions.
        </div>
      </div>
    </div>
  );
};

