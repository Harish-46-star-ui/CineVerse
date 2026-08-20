import React, { useState } from 'react';
import { 
  Ticket, 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Trash2, 
  Scan, 
  Printer, 
  Share2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { BookingRecord } from '../types';
import { soundFx } from '../utils/audio';

interface TicketWalletProps {
  bookings: BookingRecord[];
  onCancelBooking: (bookingId: string) => void;
  onScanTicket: (bookingId: string) => void;
  onBookMore: () => void;
}

export const TicketWallet: React.FC<TicketWalletProps> = ({
  bookings,
  onCancelBooking,
  onScanTicket,
  onBookMore
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedTicket, setSelectedTicket] = useState<BookingRecord | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const now = new Date();
  
  const upcomingBookings = bookings.filter(b => {
    const showtimeDate = new Date(`${b.showtime.date}T${b.showtime.time}`);
    return showtimeDate >= now && b.status !== 'cancelled';
  });

  const pastBookings = bookings.filter(b => {
    const showtimeDate = new Date(`${b.showtime.date}T${b.showtime.time}`);
    return showtimeDate < now || b.status === 'cancelled' || b.status === 'used';
  });

  const displayList = activeSubTab === 'upcoming' ? upcomingBookings : pastBookings;

  const handleSimulateScan = (booking: BookingRecord) => {
    soundFx.playSuccess();
    onScanTicket(booking.id);
    setScannedResult(`SUCCESS: Ticket #${booking.bookingCode} for "${booking.movie.title}" validated at Gate #1! Seats: ${booking.seats.map(s => s.id).join(', ')}.`);
    setTimeout(() => {
      setScannedResult(null);
      setIsScannerOpen(false);
    }, 2800);
  };

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8 max-w-6xl space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] p-6 rounded-3xl border border-slate-700 backdrop-blur-md">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Ticket className="w-7 h-7 text-amber-500" />
            <span>Digital Ticket Wallet</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access your QR boarding passes, showtimes, and cinema concessions vouchers.
          </p>
        </div>

        {/* Sub-tabs & Usher Scanner simulator button */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 p-1 rounded-2xl border border-slate-700 flex items-center">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveSubTab('upcoming');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'upcoming'
                  ? 'bg-amber-500 text-slate-900 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upcoming ({upcomingBookings.length})
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveSubTab('past');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'past'
                  ? 'bg-amber-500 text-slate-900 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              History ({pastBookings.length})
            </button>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              setIsScannerOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold cursor-pointer transition-colors active:scale-95"
          >
            <Scan className="w-4 h-4" />
            <span className="hidden sm:inline">Usher Gate Scanner</span>
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {displayList.length === 0 ? (
        <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No {activeSubTab} tickets found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Ready to experience blockbusters on the giant screen? Explore now showing movies and book in seconds.
          </p>
          <button
            onClick={onBookMore}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            EXPLORE MOVIES
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayList.map(b => {
            const isConfirmed = b.status === 'confirmed';
            const isCancelled = b.status === 'cancelled';
            const isUsed = b.status === 'used';

            return (
              <div
                key={b.id}
                className="bg-[#1E293B] border border-slate-700 hover:border-slate-600 rounded-3xl overflow-hidden shadow-xl transition-all flex flex-col justify-between"
              >
                {/* Top Banner Header */}
                <div className="relative h-32 overflow-hidden bg-slate-950">
                  <img
                    src={b.movie.backdropUrl}
                    alt={b.movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-[#1E293B]/60 to-transparent" />
                  
                  <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-900">
                      {b.showtime.experience}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isConfirmed ? 'bg-slate-800 text-amber-400 border border-slate-700' :
                      isCancelled ? 'bg-slate-800 text-rose-400 border border-slate-700' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {b.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white line-clamp-1">{b.movie.title}</h3>
                    <div className="text-xs text-amber-400 font-semibold">{b.cinema.name}</div>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 space-y-4 flex-1">
                  <div className="grid grid-cols-3 gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-700 text-center">
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Date</div>
                      <div className="text-xs font-bold text-white">{b.showtime.date}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Time</div>
                      <div className="text-xs font-bold text-amber-400">{b.showtime.time}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Hall</div>
                      <div className="text-xs font-bold text-white truncate">{b.showtime.hallName.split('(')[0]}</div>
                    </div>
                  </div>

                  {/* Reserved Seats List */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Seats:</span>
                    <div className="flex flex-wrap gap-1">
                      {b.seats.map(s => (
                        <span key={s.id} className="font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 text-xs border border-slate-700">
                          {s.id} ({s.tier})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Concessions ordered */}
                  {b.concessions.length > 0 && (
                    <div className="text-xs bg-slate-900 p-2.5 rounded-xl border border-slate-700 space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Pre-ordered Snacks:</div>
                      <div className="text-slate-300 text-xs">
                        {b.concessions.map(c => `${c.quantity}x ${c.item.name}`).join(' • ')}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-700">
                    <span className="text-slate-400 font-mono">Ref: {b.bookingCode}</span>
                    <span className="text-white font-bold">Total Paid: ${b.pricing.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-slate-900 border-t border-slate-700 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedTicket(b);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10 active:scale-95 transition-all"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>VIEW DIGITAL PASS</span>
                  </button>

                  {isConfirmed && (
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        if (confirm(`Cancel booking ${b.bookingCode}? 100% refund of $${b.pricing.totalAmount.toFixed(2)} will be credited back.`)) {
                          onCancelBooking(b.id);
                        }
                      }}
                      title="Cancel Booking"
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Pass Viewer Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl">
          <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-900">
                {selectedTicket.showtime.experience} PASS
              </span>
              <h2 className="text-xl font-bold text-white">{selectedTicket.movie.title}</h2>
              <p className="text-xs text-amber-400">{selectedTicket.cinema.name}</p>
            </div>

            {/* QR View */}
            <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 text-slate-900 border border-slate-200">
              <QrCode className="w-40 h-40" />
              <div className="font-mono text-xs font-bold tracking-widest">{selectedTicket.bookingCode}</div>
              <div className="text-[10px] text-slate-600">Scan at entrance turnstile or box office concession</div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#1E293B] border border-slate-700 p-3 rounded-2xl text-center text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Date</div>
                <div className="font-bold text-white">{selectedTicket.showtime.date}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Time</div>
                <div className="font-bold text-amber-400">{selectedTicket.showtime.time}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Seats</div>
                <div className="font-bold text-white">{selectedTicket.seats.map(s => s.id).join(', ')}</div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-slate-700 active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Boarding Pass</span>
            </button>
          </div>
        </div>
      )}

      {/* Gate Usher Simulator Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl">
          <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Scan className="w-5 h-5" />
                <span>Auditorium Gate Usher Simulator</span>
              </div>
              <button
                onClick={() => setIsScannerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select any active ticket below to simulate the optical scanner at the cinema hall entrance:
            </p>

            {scannedResult ? (
              <div className="p-4 rounded-2xl bg-[#1E293B] border border-slate-700 text-amber-400 text-xs font-bold animate-in fade-in flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-amber-500" />
                <span>{scannedResult}</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {bookings.map(bk => (
                  <button
                    key={bk.id}
                    onClick={() => handleSimulateScan(bk)}
                    className="w-full p-3 rounded-2xl bg-[#1E293B] hover:bg-slate-800 border border-slate-700 text-left flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{bk.movie.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Code: {bk.bookingCode} • Seats: {bk.seats.map(s => s.id).join(', ')}</div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-amber-500 text-slate-900">
                      Scan Pass
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
