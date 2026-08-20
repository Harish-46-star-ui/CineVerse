/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Film, 
  Sparkles, 
  Ticket, 
  SlidersHorizontal, 
  Search, 
  Flame, 
  Popcorn, 
  Award, 
  MapPin, 
  Filter, 
  Check, 
  Bookmark 
} from 'lucide-react';
import { Movie, Cinema, BookingRecord, UserProfile, Review } from './types';
import { MOVIES, CINEMAS, CONCESSIONS } from './data/mockData';
import { 
  getStoredBookings, 
  getStoredUserProfile, 
  getSelectedCity, 
  getSelectedCinema, 
  saveUserProfile, 
  setSelectedCity as storeCity, 
  setSelectedCinema as storeCinema, 
  cancelBooking, 
  markTicketAsScanned, 
  toggleWatchlistMovie,
  INITIAL_BOOKINGS,
  INITIAL_USER
} from './utils/storage';
import { soundFx } from './utils/audio';

import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { MovieCard } from './components/MovieCard';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { TrailersModal } from './components/TrailersModal';
import { BookingModal } from './components/BookingFlow/BookingModal';
import { TicketWallet } from './components/TicketWallet';
import { RewardsLoyalty } from './components/RewardsLoyalty';
import { CinemaExplorer } from './components/CinemaExplorer';
import { AdminPanelModal } from './components/AdminPanelModal';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'now_showing' | 'coming_soon' | 'cinemas' | 'concessions' | 'rewards' | 'my_tickets'>('now_showing');

  // Persistence State
  const [movies, setMovies] = useState<Movie[]>(MOVIES);
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredUserProfile);
  const [bookings, setBookings] = useState<BookingRecord[]>(getStoredBookings);
  const [selectedCity, setSelectedCity] = useState<string>(getSelectedCity);
  const [selectedCinema, setSelectedCinema] = useState<Cinema>(getSelectedCinema);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [onlyWatchlist, setOnlyWatchlist] = useState(false);

  // Modals state
  const [detailMovie, setDetailMovie] = useState<Movie | null>(null);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const [bookingMovie, setBookingMovie] = useState<Movie | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync city & cinema changes to storage
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    storeCity(city);
  };

  const handleCinemaChange = (cinema: Cinema) => {
    setSelectedCinema(cinema);
    storeCinema(cinema);
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    saveUserProfile(updated);
  };

  // Watchlist toggle
  const handleToggleWatchlist = (movieId: string) => {
    const updated = toggleWatchlistMovie(movieId);
    setUserProfile(prev => ({ ...prev, watchlistMovieIds: updated }));
  };

  // Booking handlers
  const handleBookingComplete = (newBooking: BookingRecord) => {
    setBookings(getStoredBookings());
    setUserProfile(getStoredUserProfile());
  };

  const handleCancelBooking = (bookingId: string) => {
    const updated = cancelBooking(bookingId);
    setBookings(updated);
  };

  const handleScanTicket = (bookingId: string) => {
    const updated = markTicketAsScanned(bookingId);
    setBookings(updated);
  };

  // Add review handler
  const handleAddReview = (movieId: string, reviewData: Omit<Review, 'id' | 'date' | 'avatar' | 'verified'>) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: reviewData.author,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: 'Just now',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
    };

    setMovies(prev => prev.map(m => {
      if (m.id === movieId) {
        return {
          ...m,
          reviews: [newRev, ...m.reviews]
        };
      }
      return m;
    }));

    if (detailMovie && detailMovie.id === movieId) {
      setDetailMovie(prev => prev ? { ...prev, reviews: [newRev, ...prev.reviews] } : null);
    }
  };

  // Reset demo data handler
  const handleResetData = () => {
    localStorage.clear();
    setBookings(INITIAL_BOOKINGS);
    setUserProfile(INITIAL_USER);
    setSelectedCity('New York');
    setSelectedCinema(CINEMAS[0]);
    setMovies(MOVIES);
  };

  // Extract all unique genres
  const allGenres = useMemo(() => {
    const genresSet = new Set<string>();
    movies.forEach(m => m.genres.forEach(g => genresSet.add(g)));
    return ['All', ...Array.from(genresSet)];
  }, [movies]);

  // Filtered movies
  const filteredMovies = useMemo(() => {
    return movies.filter(m => {
      // Tab matching
      if (activeTab === 'now_showing' && m.status !== 'now_showing') return false;
      if (activeTab === 'coming_soon' && m.status !== 'coming_soon') return false;

      // Watchlist filter
      if (onlyWatchlist && !userProfile.watchlistMovieIds.includes(m.id)) return false;

      // Genre filter
      if (selectedGenre !== 'All' && !m.genres.includes(selectedGenre)) return false;

      // Experience format filter
      if (selectedExperience !== 'All' && !m.formats.includes(selectedExperience as any)) return false;

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesDirector = m.director.toLowerCase().includes(q);
        const matchesCast = m.cast.some(c => c.name.toLowerCase().includes(q));
        const matchesGenre = m.genres.some(g => g.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDirector && !matchesCast && !matchesGenre) return false;
      }

      return true;
    });
  }, [movies, activeTab, onlyWatchlist, selectedGenre, selectedExperience, searchQuery, userProfile.watchlistMovieIds]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-900">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCity={selectedCity}
        setSelectedCity={handleCityChange}
        selectedCinema={selectedCinema}
        setSelectedCinema={handleCinemaChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        userProfile={userProfile}
        bookingCount={bookings.filter(b => b.status === 'confirmed').length}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Body Routing */}
      <main className="flex-1">

        {/* 1. NOW SHOWING & COMING SOON VIEW */}
        {(activeTab === 'now_showing' || activeTab === 'coming_soon') && (
          <div className="space-y-8">
            
            {/* Hero Carousel (Only on Now Showing and when no active text search) */}
            {activeTab === 'now_showing' && !searchQuery && (
              <HeroCarousel
                movies={movies}
                onSelectMovie={(m) => setDetailMovie(m)}
                onBookMovie={(m) => setBookingMovie(m)}
                onWatchTrailer={(m) => setTrailerMovie(m)}
                watchlist={userProfile.watchlistMovieIds}
                onToggleWatchlist={handleToggleWatchlist}
              />
            )}

            {/* Movie Catalog Section */}
            <div className="container mx-auto px-4 lg:px-6 max-w-7xl space-y-6 pb-12">
              
              {/* Section Header & Interactive Filter Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-7 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {activeTab === 'now_showing' ? 'Now Showing in Theaters' : 'Upcoming Blockbuster Premieres'}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 pl-4.5">
                    Showing laser projections & Dolby Atmos sessions at <strong className="text-amber-400">{selectedCinema.name}</strong>
                  </p>
                </div>

                {/* Filter Pill Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Watchlist toggle */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setOnlyWatchlist(!onlyWatchlist);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      onlyWatchlist
                        ? 'bg-amber-500 text-slate-900 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-[#1E293B] text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Watchlist ({userProfile.watchlistMovieIds.length})</span>
                  </button>

                  {/* Format Filter */}
                  <select
                    value={selectedExperience}
                    onChange={(e) => {
                      soundFx.playClick();
                      setSelectedExperience(e.target.value);
                    }}
                    className="bg-[#1E293B] border border-slate-700 text-xs text-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer font-medium"
                  >
                    <option value="All">All Formats</option>
                    <option value="IMAX 3D">IMAX 3D</option>
                    <option value="Dolby Cinema">Dolby Cinema</option>
                    <option value="VIP Recliner">VIP Recliner</option>
                    <option value="4DX">4DX Motion</option>
                    <option value="Standard 2D">Standard 2D</option>
                  </select>
                </div>
              </div>

              {/* Genre Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {allGenres.map(g => (
                  <button
                    key={g}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedGenre(g);
                    }}
                    className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      selectedGenre === g
                        ? 'bg-amber-500 text-slate-900 font-bold shadow-md shadow-amber-500/25'
                        : 'bg-[#1E293B]/70 text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] border border-slate-700/60'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {/* Movie Grid */}
              {filteredMovies.length === 0 ? (
                <div className="bg-[#1E293B]/60 border border-slate-700 rounded-3xl p-16 text-center space-y-3">
                  <Film className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="text-lg font-bold text-white">No Movies Match Your Filter</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try adjusting your search query, genre, or format options.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedGenre('All');
                      setSelectedExperience('All');
                      setOnlyWatchlist(false);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-900 font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
                  {filteredMovies.map(movie => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onSelect={(m) => setDetailMovie(m)}
                      onBook={(m) => setBookingMovie(m)}
                      onWatchTrailer={(m) => setTrailerMovie(m)}
                      isWatchlisted={userProfile.watchlistMovieIds.includes(movie.id)}
                      onToggleWatchlist={handleToggleWatchlist}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. CINEMAS & VENUES VIEW */}
        {activeTab === 'cinemas' && (
          <CinemaExplorer
            selectedCity={selectedCity}
            selectedCinema={selectedCinema}
            onSelectCinema={handleCinemaChange}
            onViewShowtimes={() => setActiveTab('now_showing')}
          />
        )}

        {/* 3. FOOD & DRINKS STANDALONE VIEW */}
        {activeTab === 'concessions' && (
          <div className="container mx-auto px-4 lg:px-6 py-8 max-w-6xl space-y-8 animate-in fade-in">
            <div className="bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-2 text-center md:text-left relative z-10">
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-900">
                  Cinema Concessions & Bar
                </span>
                <h1 className="text-2xl sm:text-4xl font-bold text-white">Gourmet Movie Snacks & Drinks</h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Pre-order freshly made artisan truffle popcorn, ice cold ICEE slushies, and warm Angus hot dogs delivered right to your heated cinema recliner.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('now_showing')}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs shadow-lg shadow-amber-500/25 cursor-pointer transition-all active:scale-95 whitespace-nowrap relative z-10"
              >
                ORDER WITH MOVIE TICKETS
              </button>
            </div>

            {/* Concession Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CONCESSIONS.map(item => (
                <div key={item.id} className="bg-[#1E293B] border border-slate-700 hover:border-slate-600 rounded-2xl overflow-hidden p-5 flex flex-col justify-between gap-4 shadow-md transition-colors">
                  <div className="space-y-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-44 rounded-xl object-cover border border-slate-700/80"
                    />
                    <div>
                      {item.badge && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-900">
                          {item.badge}
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-white mt-1">{item.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-700/80">
                    <div>
                      <span className="text-xs text-slate-400">{item.calories}</span>
                      <div className="text-base font-bold text-amber-400">${item.price.toFixed(2)}</div>
                    </div>
                    <button
                      onClick={() => {
                        soundFx.playPopcorn();
                        setBookingMovie(movies[0]);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-700/80 hover:bg-amber-500 hover:text-slate-900 text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-600"
                    >
                      Pre-order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. REWARDS LOYALTY CLUB VIEW */}
        {activeTab === 'rewards' && (
          <RewardsLoyalty
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {/* 5. MY TICKETS & BOOKINGS WALLET VIEW */}
        {activeTab === 'my_tickets' && (
          <TicketWallet
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onScanTicket={handleScanTicket}
            onBookMore={() => setActiveTab('now_showing')}
          />
        )}
      </main>

      {/* ================= MODALS ================= */}

      {/* Movie Details Modal */}
      {detailMovie && (
        <MovieDetailsModal
          movie={detailMovie}
          onClose={() => setDetailMovie(null)}
          onBook={(m) => {
            setDetailMovie(null);
            setBookingMovie(m);
          }}
          onWatchTrailer={(m) => setTrailerMovie(m)}
          isWatchlisted={userProfile.watchlistMovieIds.includes(detailMovie.id)}
          onToggleWatchlist={handleToggleWatchlist}
          onAddReview={handleAddReview}
        />
      )}

      {/* Trailer Video Player Modal */}
      {trailerMovie && (
        <TrailersModal
          movie={trailerMovie}
          onClose={() => setTrailerMovie(null)}
        />
      )}

      {/* Multi-step Booking Flow Modal */}
      {bookingMovie && (
        <BookingModal
          movie={bookingMovie}
          cinema={selectedCinema}
          onClose={() => setBookingMovie(null)}
          userProfile={userProfile}
          onBookingComplete={handleBookingComplete}
        />
      )}

      {/* Admin Panel / Theater Operations Console */}
      {isAdminOpen && (
        <AdminPanelModal
          bookings={bookings}
          onClose={() => setIsAdminOpen(false)}
          onResetData={handleResetData}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
