import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Car, 
  Sparkles, 
  Film, 
  Check, 
  Navigation, 
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Cinema } from '../types';
import { CINEMAS } from '../data/mockData';
import { soundFx } from '../utils/audio';

interface CinemaExplorerProps {
  selectedCity: string;
  selectedCinema: Cinema;
  onSelectCinema: (cinema: Cinema) => void;
  onViewShowtimes: (cinema: Cinema) => void;
}

export const CinemaExplorer: React.FC<CinemaExplorerProps> = ({
  selectedCity,
  selectedCinema,
  onSelectCinema,
  onViewShowtimes
}) => {
  const [filterFormat, setFilterFormat] = useState<string>('All');

  const filteredCinemas = CINEMAS.filter(c => {
    const matchesCity = c.city.toLowerCase() === selectedCity.toLowerCase() || selectedCity === 'All';
    const matchesFormat = filterFormat === 'All' || c.formatsAvailable.includes(filterFormat as any);
    return matchesCity && matchesFormat;
  });

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8 max-w-6xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] p-6 rounded-3xl border border-slate-700 backdrop-blur-md">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <MapPin className="w-7 h-7 text-amber-500" />
            <span>Cinemas & Premium Arenas in {selectedCity}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover IMAX 70mm, Dolby Vision, 4DX motion seats, and VIP dining lounges near you.
          </p>
        </div>

        {/* Format Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'IMAX 3D', 'Dolby Cinema', '4DX', 'ScreenX', 'VIP Recliner'].map(fmt => (
            <button
              key={fmt}
              onClick={() => {
                soundFx.playClick();
                setFilterFormat(fmt);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                filterFormat === fmt
                  ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Cinemas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCinemas.map(cinema => {
          const isSelected = selectedCinema.id === cinema.id;

          return (
            <div
              key={cinema.id}
              className={`bg-[#1E293B] border rounded-3xl overflow-hidden shadow-2xl transition-all flex flex-col justify-between ${
                isSelected ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              {/* Cinema Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={cinema.imageUrl}
                  alt={cinema.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-[#1E293B]/40 to-transparent" />

                <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-slate-900/80 text-amber-400 border border-slate-700 backdrop-blur-md">
                    {cinema.city}
                  </span>
                  {isSelected && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500 text-slate-900 flex items-center gap-1 shadow-lg">
                      <Check className="w-3.5 h-3.5" /> Selected Venue
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-bold text-white">{cinema.name}</h3>
                </div>
              </div>

              {/* Cinema Details */}
              <div className="p-6 space-y-4 flex-1">
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{cinema.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span>{cinema.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Car className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>{cinema.parkingInfo}</span>
                  </div>
                </div>

                {/* Formats Pills */}
                <div className="space-y-1.5 pt-2 border-t border-slate-700/60">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Experiences Available:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {cinema.formatsAvailable.map(f => (
                      <span key={f} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 border border-slate-700">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-1.5 pt-2 border-t border-slate-700/60">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Lobby & Theater Amenities:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {cinema.amenities.map(a => (
                      <span key={a} className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-900 border-t border-slate-700 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onSelectCinema(cinema);
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-800 text-amber-400 border-amber-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {isSelected ? '✓ Current Cinema' : 'Set as My Cinema'}
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onSelectCinema(cinema);
                    onViewShowtimes(cinema);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <span>BROWSE MOVIES</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
