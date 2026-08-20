import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Ticket, 
  Star, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Check, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Movie } from '../types';
import { soundFx } from '../utils/audio';

interface HeroCarouselProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onBookMovie: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  movies,
  onSelectMovie,
  onBookMovie,
  onWatchTrailer,
  watchlist,
  onToggleWatchlist
}) => {
  const heroMovies = movies.filter(m => m.featuredHero || m.imdbRating >= 8.5).slice(0, 4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay || heroMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isAutoPlay, heroMovies.length]);

  if (!heroMovies.length) return null;

  const current = heroMovies[currentIndex];
  const isWatchlisted = watchlist.includes(current.id);

  const handleNext = () => {
    soundFx.playClick();
    setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
  };

  const handlePrev = () => {
    soundFx.playClick();
    setCurrentIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
  };

  return (
    <section 
      className="relative w-full h-[520px] md:h-[620px] overflow-hidden bg-[#0F172A] select-none group/hero"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Background Backdrop with Cinema lighting gradient */}
      <div className="absolute inset-0">
        <img
          src={current.backdropUrl}
          alt={current.title}
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Dark film atmospheric vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/85 to-transparent w-full md:w-3/4 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0F172A]/30 to-[#0F172A]/90 z-10" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 container mx-auto px-4 lg:px-8 h-full flex flex-col justify-end pb-12 md:pb-16 max-w-7xl">
        <div className="max-w-2xl space-y-4">
          
          {/* Format Badges & Tagline */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold tracking-wider bg-amber-500 text-slate-900 shadow-md shadow-amber-500/25">
              <Sparkles className="w-3.5 h-3.5" />
              SPOTLIGHT PREMIERE
            </span>

            {current.formats.slice(0, 3).map(fmt => (
              <span 
                key={fmt}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800/90 text-amber-400 border border-slate-700 backdrop-blur-md"
              >
                {fmt}
              </span>
            ))}

            <span className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-300 border border-slate-700">
              {current.ageRating}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-2xl leading-tight">
            {current.title}
          </h1>

          {/* Tagline or Synopsis */}
          <p className="text-amber-400 font-medium italic text-sm md:text-base">
            "{current.tagline}"
          </p>

          <p className="text-slate-300 text-xs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed max-w-xl">
            {current.synopsis}
          </p>

          {/* Movie Meta Stats */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300 pt-1">
            <div className="flex items-center gap-1 text-amber-400 font-bold bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-700">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{current.imdbRating.toFixed(1)} IMDb</span>
            </div>

            <div className="flex items-center gap-1 text-rose-400 font-bold bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-700">
              <span>🍅 {current.rottenTomatoesScore}% Fresh</span>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{Math.floor(current.durationMinutes / 60)}h {current.durationMinutes % 60}m</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <span>{current.genres.join(' • ')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {current.status === 'now_showing' ? (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onBookMovie(current);
                }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Ticket className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>BOOK TICKETS</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onBookMovie(current);
                }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>ADVANCE BOOKING</span>
              </button>
            )}

            <button
              onClick={() => {
                soundFx.playClick();
                onWatchTrailer(current);
              }}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 backdrop-blur-md active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Watch Trailer</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onSelectMovie(current);
              }}
              className="hidden sm:flex items-center gap-1.5 px-4 py-3.5 rounded-xl font-medium text-sm bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Details & Cast</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onToggleWatchlist(current.id);
              }}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isWatchlisted
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {isWatchlisted ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover/hero:opacity-100 transition-all cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover/hero:opacity-100 transition-all cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom Thumbnails / Indicators */}
      <div className="absolute right-8 bottom-6 z-30 hidden md:flex items-center gap-2">
        {heroMovies.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => {
              soundFx.playClick();
              setCurrentIndex(idx);
            }}
            className={`group/thumb relative rounded-xl overflow-hidden border transition-all cursor-pointer ${
              currentIndex === idx
                ? 'border-amber-500 ring-2 ring-amber-500/40 scale-105'
                : 'border-slate-700 opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={m.posterUrl}
              alt={m.title}
              className="w-12 h-16 object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/30 group-hover/thumb:bg-transparent transition-colors" />
          </button>
        ))}
      </div>
    </section>
  );
};
