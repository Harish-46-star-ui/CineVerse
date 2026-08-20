import React from 'react';
import { 
  Star, 
  Clock, 
  Play, 
  Ticket, 
  Bookmark, 
  Check, 
  Info,
  Sparkles
} from 'lucide-react';
import { Movie } from '../types';
import { soundFx } from '../utils/audio';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  onBook: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movieId: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  onBook,
  onWatchTrailer,
  isWatchlisted,
  onToggleWatchlist
}) => {
  return (
    <div className="group relative bg-[#1E293B] border border-slate-700 hover:border-slate-500 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col h-full">
      {/* Poster Container with Aspect Ratio */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-slate-900/30 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-slate-200 border border-slate-700 backdrop-blur-md">
              {movie.ageRating}
            </span>
            {movie.formats.includes('IMAX 3D') && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-900 shadow-sm">
                IMAX 3D
              </span>
            )}
            {movie.imdbRating >= 8.5 && !movie.formats.includes('IMAX 3D') && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-900 flex items-center gap-0.5 shadow-sm">
                <Sparkles className="w-2.5 h-2.5" /> TOP
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playClick();
              onToggleWatchlist(movie.id);
            }}
            title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            className={`w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
              isWatchlisted
                ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/30 font-bold'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
            }`}
          >
            {isWatchlisted ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Play Trailer Floating Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playClick();
              onWatchTrailer(movie);
            }}
            className="w-12 h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-900 flex items-center justify-center shadow-xl shadow-amber-500/30 transform scale-75 group-hover:scale-100 transition-transform pointer-events-auto cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-900 translate-x-0.5" />
          </button>
        </div>

        {/* Bottom Ratings bar inside poster */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs z-10">
          <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-700 text-amber-400 font-bold text-[11px]">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{movie.imdbRating.toFixed(1)}</span>
          </div>

          <div className="text-[11px] bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-700 text-rose-400 font-bold">
            🍅 {movie.rottenTomatoesScore}%
          </div>
        </div>
      </div>

      {/* Movie Details Info */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-[#1E293B]">
        <div>
          <h3 
            onClick={() => {
              soundFx.playClick();
              onSelect(movie);
            }}
            className="font-bold text-sm text-slate-100 line-clamp-1 group-hover:text-amber-400 transition-colors cursor-pointer"
          >
            {movie.title}
          </h3>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {Math.floor(movie.durationMinutes / 60)}h {movie.durationMinutes % 60}m
            </span>
            <span>•</span>
            <span className="line-clamp-1">{movie.genres.slice(0, 2).join(', ')}</span>
          </div>

          {/* Formats Pill List */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {movie.formats.map(fmt => (
              <span
                key={fmt}
                className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
          <button
            onClick={() => {
              soundFx.playClick();
              onBook(movie);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5 fill-slate-900" />
            <span>{movie.status === 'coming_soon' ? 'ADVANCE BOOK' : 'BOOK SEATS'}</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onSelect(movie);
            }}
            title="View Synopsis & Cast"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
