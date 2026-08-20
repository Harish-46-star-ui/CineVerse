import React from 'react';
import { X, Sparkles, Film } from 'lucide-react';
import { Movie } from '../types';
import { soundFx } from '../utils/audio';

interface TrailersModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const TrailersModal: React.FC<TrailersModalProps> = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-2xl">
      <div 
        className="relative w-full max-w-4xl bg-[#0F172A] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-900">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{movie.title}</span>
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  Official 4K Trailer
                </span>
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Embed */}
        <div className="relative aspect-video w-full bg-slate-950">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${movie.trailerYoutubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${movie.title} Trailer`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Footer info strip */}
        <div className="px-6 py-4 bg-[#0F172A] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">{movie.imdbRating.toFixed(1)} IMDb</span>
            <span>•</span>
            <span>{movie.genres.join(', ')}</span>
            <span>•</span>
            <span>Directed by {movie.director}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Remastered with Dolby Atmos Sound Mixing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
