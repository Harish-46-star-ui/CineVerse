import React, { useState } from 'react';
import { 
  Film, 
  MapPin, 
  Search, 
  Ticket, 
  Award, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  SlidersHorizontal,
  Popcorn,
  User,
  X
} from 'lucide-react';
import { CITIES, CINEMAS } from '../data/mockData';
import { Cinema, UserProfile } from '../types';
import { soundFx } from '../utils/audio';

interface NavbarProps {
  activeTab: 'now_showing' | 'coming_soon' | 'cinemas' | 'concessions' | 'rewards' | 'my_tickets';
  setActiveTab: (tab: 'now_showing' | 'coming_soon' | 'cinemas' | 'concessions' | 'rewards' | 'my_tickets') => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedCinema: Cinema;
  setSelectedCinema: (cinema: Cinema) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userProfile: UserProfile;
  bookingCount: number;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCity,
  setSelectedCity,
  selectedCinema,
  setSelectedCinema,
  searchQuery,
  setSearchQuery,
  userProfile,
  bookingCount,
  onOpenAdmin,
}) => {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());
  const [showSearchInput, setShowSearchInput] = useState(false);

  const toggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  const handleCitySelect = (city: string) => {
    soundFx.playClick();
    setSelectedCity(city);
    // Automatically find a cinema in that city or keep current
    const cinemaInCity = CINEMAS.find(c => c.city.toLowerCase() === city.toLowerCase()) || CINEMAS[0];
    setSelectedCinema(cinemaInCity);
    setIsCityDropdownOpen(false);
  };

  interface NavItem {
    id: 'now_showing' | 'coming_soon' | 'cinemas' | 'concessions' | 'rewards' | 'my_tickets';
    label: string;
    icon: typeof Film;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'now_showing', label: 'Now Showing', icon: Film },
    { id: 'coming_soon', label: 'Coming Soon', icon: SlidersHorizontal },
    { id: 'cinemas', label: 'Cinemas & IMAX', icon: MapPin },
    { id: 'concessions', label: 'Food & Drinks', icon: Popcorn },
    { id: 'rewards', label: 'CineRewards', icon: Award },
    { id: 'my_tickets', label: 'My Bookings', icon: Ticket, badge: bookingCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#1E293B] border-b border-slate-800 transition-all duration-300">
      {/* Top micro bar for cinema announcement */}
      <div className="bg-slate-900/90 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between border-b border-slate-800">
        <div className="container mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
            <span className="font-semibold text-amber-400">Exclusive Offer:</span>
            <span>Use code <strong className="text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-mono">CINEPASS20</strong> for 20% off all IMAX & Dolby Screenings!</span>
          </div>

          <div className="flex items-center gap-4 hidden sm:flex">
            <button 
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-slate-200 transition-colors text-[11px] underline underline-offset-2"
            >
              Theater Ops Console
            </button>
            <div className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Award className="w-3.5 h-3.5" />
              <span>{userProfile.cinePoints} CinePoints ({userProfile.tier})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('now_showing');
              }}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-900 font-black group-hover:scale-105 transition-all">
                <Film className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-bold tracking-tighter text-amber-500">
                    CINE<span className="text-white">VERSE</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    VIP
                  </span>
                </div>
              </div>
            </button>

            {/* City Selector Dropdown */}
            <div className="relative ml-1">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsCityDropdownOpen(!isCityDropdownOpen);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs text-slate-300 transition-all cursor-pointer shadow-sm hover:bg-slate-700/60"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold text-slate-200">{selectedCity}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-52 bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl z-50 p-2 backdrop-blur-xl">
                  <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                    Select Your City
                  </div>
                  <div className="space-y-1 mt-1">
                    {CITIES.map(city => (
                      <button
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          selectedCity === city
                            ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                            : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                        }`}
                      >
                        <span>{city}</span>
                        {selectedCity === city && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all relative cursor-pointer ${
                    isActive
                      ? 'text-amber-500 font-semibold bg-slate-800/80 shadow-sm border border-slate-700/60'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-amber-400 border border-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input Bar */}
            <div className="relative">
              <div className="hidden sm:flex items-center bg-slate-800 border border-slate-700 focus-within:border-amber-500 rounded-xl px-3 py-1.5 transition-all w-48 md:w-56">
                <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search movies, actors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none w-full"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-slate-400 hover:text-slate-200 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile search toggle */}
              <button
                onClick={() => setShowSearchInput(!showSearchInput)}
                className="sm:hidden w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Sound Effects Audio Toggle */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            {/* User Account / Profile Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('rewards');
              }}
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer group"
            >
              <div className="bg-slate-700 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-amber-400 border border-slate-600">
                {userProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-slate-200 leading-tight group-hover:text-amber-400 transition-colors">
                  {userProfile.name}
                </div>
                <div className="text-[10px] text-slate-400 font-medium leading-none">
                  {userProfile.tier} Member
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search dropdown */}
        {showSearchInput && (
          <div className="sm:hidden pb-3">
            <div className="flex items-center bg-slate-800 border border-amber-500 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search movies, genre, actor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-800">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-900 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-slate-900 text-amber-400' : 'bg-amber-500 text-slate-900'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
