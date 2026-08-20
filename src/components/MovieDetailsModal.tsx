import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Clock, 
  Play, 
  Ticket, 
  Bookmark, 
  Check, 
  Calendar, 
  Globe, 
  ShieldCheck, 
  Send,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { Movie, Review } from '../types';
import { soundFx } from '../utils/audio';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onBook: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movieId: string) => void;
  onAddReview: (movieId: string, review: Omit<Review, 'id' | 'date' | 'avatar' | 'verified'>) => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  onBook,
  onWatchTrailer,
  isWatchlisted,
  onToggleWatchlist,
  onAddReview
}) => {
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [activeTab, setActiveTab] = useState<'about' | 'cast' | 'reviews'>('about');

  if (!movie) return null;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    soundFx.playSuccess();
    onAddReview(movie.id, {
      author: authorName.trim(),
      rating: newRating,
      comment: newComment.trim()
    });

    setNewComment('');
    setAuthorName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#0F172A] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Backdrop Banner Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-transparent to-[#0F172A]/70" />

          {/* Close button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center backdrop-blur-md cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Watch trailer floating button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onWatchTrailer(movie);
            }}
            className="absolute left-6 bottom-6 z-20 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-slate-900" />
            <span>PLAY OFFICIAL TRAILER</span>
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Poster Thumbnail */}
            <div className="hidden sm:block -mt-24 relative z-20 flex-shrink-0 w-36 sm:w-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-slate-900 aspect-[2/3]">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500 text-slate-900">
                  {movie.ageRating}
                </span>
                {movie.formats.map(fmt => (
                  <span key={fmt} className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-800 text-amber-400 border border-slate-700">
                    {fmt}
                  </span>
                ))}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {movie.title}
              </h2>

              <p className="text-amber-400/90 text-sm font-medium italic">
                "{movie.tagline}"
              </p>

              {/* Meta stats */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-1.5 text-amber-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{movie.imdbRating.toFixed(1)} IMDb</span>
                </div>
                <div className="flex items-center gap-1 text-rose-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                  <span>🍅 {movie.rottenTomatoesScore}% Rotten Tomatoes</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{Math.floor(movie.durationMinutes / 60)}h {movie.durationMinutes % 60}m</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{movie.releaseDate}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Top Right */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                  onBook(movie);
                }}
                className="w-full sm:w-48 py-3 px-6 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Ticket className="w-4 h-4 fill-slate-900" />
                <span>BOOK TICKETS</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onToggleWatchlist(movie.id);
                }}
                className={`w-full sm:w-48 py-2.5 px-4 rounded-xl font-semibold text-xs border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isWatchlisted
                    ? 'bg-slate-800 text-amber-400 border-slate-700'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {isWatchlisted ? <Check className="w-3.5 h-3.5 text-amber-500" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pt-2">
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === 'about'
                  ? 'text-amber-400 border-b-2 border-amber-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Synopsis & Info
            </button>
            <button
              onClick={() => setActiveTab('cast')}
              className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === 'cast'
                  ? 'text-amber-400 border-b-2 border-amber-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cast & Crew ({movie.cast.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === 'reviews'
                  ? 'text-amber-400 border-b-2 border-amber-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Audience Reviews ({movie.reviews.length})
            </button>
          </div>

          {/* Tab Content: About */}
          {activeTab === 'about' && (
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>{movie.synopsis}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="bg-[#1E293B] p-3.5 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-xs">Director</div>
                  <div className="text-white font-bold mt-0.5">{movie.director}</div>
                </div>
                <div className="bg-[#1E293B] p-3.5 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-xs">Languages & Audio</div>
                  <div className="text-white font-bold mt-0.5">{movie.languages.join(', ')}</div>
                </div>
                <div className="bg-[#1E293B] p-3.5 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-xs">Available Formats</div>
                  <div className="text-amber-400 font-bold mt-0.5">{movie.formats.join(', ')}</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Cast */}
          {activeTab === 'cast' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {movie.cast.map(c => (
                <div key={c.name} className="flex items-center gap-3 bg-[#1E293B] p-3 rounded-2xl border border-slate-700">
                  <img
                    src={c.avatarUrl}
                    alt={c.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-white line-clamp-1">{c.name}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{c.character}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Review Input Form */}
              <form onSubmit={handleReviewSubmit} className="bg-[#1E293B] border border-slate-700 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Leave a Verified Audience Review</span>
                  </div>

                  {/* Rating Selector */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name (e.g. CinemaFan24)"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="What did you think of the visuals, sound & plot?"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Review</span>
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {movie.reviews.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No reviews yet. Be the first to review this movie!
                  </div>
                ) : (
                  movie.reviews.map(r => (
                    <div key={r.id} className="bg-[#1E293B] border border-slate-700 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={r.avatar}
                            alt={r.author}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{r.author}</span>
                              {r.verified && (
                                <span className="text-[10px] text-amber-400 font-medium bg-slate-900 px-1.5 rounded border border-slate-700">
                                  Verified Ticket Holder
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500">{r.date}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pl-9">
                        {r.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
