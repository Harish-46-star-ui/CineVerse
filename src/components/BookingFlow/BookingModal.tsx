import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Ticket, 
  Popcorn, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Info, 
  Eye, 
  Users, 
  Tag, 
  Plus, 
  Minus, 
  Download, 
  QrCode,
  Armchair,
  Car,
  Glasses,
  Check,
  Percent,
  CalendarPlus,
  Share2,
  Printer
} from 'lucide-react';
import { 
  Movie, 
  Cinema, 
  Showtime, 
  Seat, 
  CartConcession, 
  BookingAddons, 
  BookingRecord, 
  UserProfile, 
  ExperienceFormat 
} from '../../types';
import { 
  CINEMAS, 
  CONCESSIONS, 
  PROMO_CODES, 
  generateShowtimesForMovie 
} from '../../data/mockData';
import { 
  DEFAULT_AUDITORIUM, 
  generateAuditoriumSeats, 
  findAdjacentSeats 
} from '../../utils/seatLayout';
import { soundFx } from '../../utils/audio';
import { saveBooking } from '../../utils/storage';

interface BookingModalProps {
  movie: Movie;
  cinema: Cinema;
  initialShowtime?: Showtime;
  onClose: () => void;
  userProfile: UserProfile;
  onBookingComplete: (booking: BookingRecord) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  movie,
  cinema: initialCinema,
  initialShowtime,
  onClose,
  userProfile,
  onBookingComplete
}) => {
  // Step navigation: 1: Showtime -> 2: Seats -> 3: Snacks -> 4: Addons & Promo -> 5: Payment -> 6: E-Ticket
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Selection states
  const [currentCinema, setCurrentCinema] = useState<Cinema>(initialCinema);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return initialShowtime ? initialShowtime.date : new Date().toISOString().split('T')[0];
  });
  const [selectedFormat, setSelectedFormat] = useState<ExperienceFormat>('IMAX 3D');
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(initialShowtime || null);

  // Available showtimes generated for this movie & cinema
  const allShowtimes = useMemo(() => {
    return generateShowtimesForMovie(movie.id, currentCinema.id);
  }, [movie.id, currentCinema.id]);

  const filteredShowtimes = useMemo(() => {
    return allShowtimes.filter(s => s.date === selectedDate);
  }, [allShowtimes, selectedDate]);

  // If initialShowtime wasn't provided, select first available
  useEffect(() => {
    if (!selectedShowtime && filteredShowtimes.length > 0) {
      const match = filteredShowtimes.find(s => s.experience === selectedFormat) || filteredShowtimes[0];
      setSelectedShowtime(match);
      if (match) setSelectedFormat(match.experience);
    }
  }, [filteredShowtimes, selectedShowtime, selectedFormat]);

  // Seats State
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [highlightBestView, setHighlightBestView] = useState(false);
  const [focusedSeatForPerspective, setFocusedSeatForPerspective] = useState<Seat | null>(null);

  // Update seats whenever showtime changes
  useEffect(() => {
    if (!selectedShowtime) return;
    const prices = {
      standard: selectedShowtime.priceStandard,
      premium: selectedShowtime.pricePremium,
      vip: selectedShowtime.priceVip
    };
    const generated = generateAuditoriumSeats(prices, selectedShowtime.bookedSeats);
    setSeats(generated);
    setSelectedSeats([]);
  }, [selectedShowtime]);

  // Concessions State
  const [concessionsCart, setConcessionsCart] = useState<CartConcession[]>([]);
  const [selectedConcessionCategory, setSelectedConcessionCategory] = useState<string>('All');

  // Add-ons State
  const [addons, setAddons] = useState<BookingAddons>({
    glasses3DCount: 0,
    glassesPriceEach: 3.50,
    parkingPass: false,
    parkingPrice: 10.00,
    cancellationProtection: true,
    cancellationPrice: 2.99
  });

  // Promo code & Points state
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; description: string } | null>({
    code: 'CINEPASS20',
    discount: 0.20,
    description: '20% off your booking'
  });
  const [promoError, setPromoError] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);

  // Customer & Payment state
  const [customerName, setCustomerName] = useState(userProfile.name);
  const [customerEmail, setCustomerEmail] = useState(userProfile.email);
  const [customerPhone, setCustomerPhone] = useState(userProfile.phone);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'apple_pay' | 'google_pay' | 'cine_wallet' | 'cash_box_office'>('credit_card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Completed booking record
  const [completedBooking, setCompletedBooking] = useState<BookingRecord | null>(null);
  const [isCopiedCode, setIsCopiedCode] = useState(false);

  // Calculations
  const ticketsSubtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const concessionsSubtotal = concessionsCart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const addonsSubtotal = 
    (addons.glasses3DCount * addons.glassesPriceEach) +
    (addons.parkingPass ? addons.parkingPrice : 0) +
    (addons.cancellationProtection ? addons.cancellationPrice : 0);

  const bookingFee = selectedSeats.length > 0 ? 2.50 : 0;
  const rawSubtotal = ticketsSubtotal + concessionsSubtotal + addonsSubtotal + bookingFee;
  
  const discountAmount = appliedPromo 
    ? (appliedPromo.discount <= 1 ? rawSubtotal * appliedPromo.discount : appliedPromo.discount) 
    : 0;
  
  const pointsDiscount = (pointsToRedeem / 100) * 5.00; // 100 pts = $5
  const totalDiscount = Math.min(rawSubtotal, discountAmount + pointsDiscount);
  const taxableAmount = Math.max(0, rawSubtotal - totalDiscount);
  const taxAmount = taxableAmount * 0.08875; // NYC standard sales tax 8.875%
  const finalTotal = Math.max(0, taxableAmount + taxAmount);
  const cinePointsEarned = Math.round(finalTotal);

  // Seat toggle handler
  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'reserved') return;

    const isSelected = selectedSeats.some(s => s.id === seat.id);

    if (isSelected) {
      soundFx.playSeatDeselect();
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
      if (seat.tier === 'couple' && seat.pairId) {
        setSelectedSeats(prev => prev.filter(s => s.id !== seat.pairId));
      }
    } else {
      if (selectedSeats.length >= 8) {
        alert('Maximum 8 tickets per booking.');
        return;
      }
      soundFx.playSeatSelect();
      
      // If couple seat, auto-select partner seat
      if (seat.tier === 'couple' && seat.pairId) {
        const partnerSeat = seats.find(s => s.id === seat.pairId);
        if (partnerSeat && partnerSeat.status === 'available') {
          setSelectedSeats(prev => [...prev, seat, partnerSeat]);
          setFocusedSeatForPerspective(seat);
          return;
        }
      }

      setSelectedSeats(prev => [...prev, seat]);
      setFocusedSeatForPerspective(seat);
    }
  };

  // Group quick finder
  const handleGroupSelect = (size: number) => {
    soundFx.playClick();
    const adjacentIds = findAdjacentSeats(seats, size);
    if (adjacentIds) {
      soundFx.playSuccess();
      const foundSeats = seats.filter(s => adjacentIds.includes(s.id));
      setSelectedSeats(foundSeats);
      setFocusedSeatForPerspective(foundSeats[0]);
    } else {
      alert(`Could not find ${size} contiguous seats together. Please select individually.`);
    }
  };

  // Concession quantity changer
  const handleConcessionChange = (item: typeof CONCESSIONS[0], delta: number) => {
    soundFx.playPopcorn();
    setConcessionsCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (!existing) {
        if (delta > 0) return [...prev, { item, quantity: delta }];
        return prev;
      }
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        return prev.filter(c => c.item.id !== item.id);
      }
      return prev.map(c => c.item.id === item.id ? { ...c, quantity: newQty } : c);
    });
  };

  // Promo code apply
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    const found = PROMO_CODES.find(p => p.code === code);
    if (found) {
      soundFx.playSuccess();
      setAppliedPromo({
        code: found.code,
        discount: found.discountPercentage ? found.discountPercentage / 100 : (found.discountFlat || 0),
        description: found.description
      });
      setPromoInput('');
    } else {
      setPromoError('Invalid promo code. Try CINEPASS20 or POPCORN50');
    }
  };

  // Process final payment & create booking record
  const handleCompletePayment = () => {
    if (!selectedShowtime || selectedSeats.length === 0) return;

    soundFx.playSuccess();

    // Trigger celebratory confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const bookingCode = `CV-${Math.floor(100000 + Math.random() * 900000)}`;
    const qrData = `CINEVERSE-TICKET-${bookingCode}-${movie.title.replace(/\s+/g, '')}-${selectedSeats.map(s => s.id).join('-')}`;

    const newBooking: BookingRecord = {
      id: `bk-${Date.now()}`,
      bookingCode,
      qrData,
      createdAt: new Date().toISOString(),
      movie: {
        id: movie.id,
        title: movie.title,
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl,
        ageRating: movie.ageRating,
        durationMinutes: movie.durationMinutes,
        genres: movie.genres
      },
      cinema: {
        id: currentCinema.id,
        name: currentCinema.name,
        city: currentCinema.city,
        address: currentCinema.address
      },
      showtime: {
        id: selectedShowtime.id,
        date: selectedShowtime.date,
        time: selectedShowtime.time,
        hallName: selectedShowtime.hallName,
        experience: selectedShowtime.experience
      },
      seats: selectedSeats.map(s => ({
        id: s.id,
        row: s.row,
        number: s.number,
        tier: s.tier,
        price: s.price
      })),
      concessions: concessionsCart,
      addons,
      pricing: {
        ticketsSubtotal,
        concessionsSubtotal,
        addonsSubtotal,
        bookingFee,
        discountAmount: totalDiscount,
        taxAmount,
        totalAmount: finalTotal,
        promoCodeUsed: appliedPromo?.code,
        cinePointsEarned,
        cinePointsUsed: pointsToRedeem
      },
      customer: {
        fullName: customerName,
        email: customerEmail,
        phone: customerPhone,
        paymentMethod,
        cardLastFour: paymentMethod === 'credit_card' ? '4242' : undefined
      },
      status: 'confirmed'
    };

    saveBooking(newBooking);
    setCompletedBooking(newBooking);
    onBookingComplete(newBooking);
    setStep(6);
  };

  // Format date helper tabs
  const dateOptions = [
    { offset: 0, label: 'Today', date: getDateString(0) },
    { offset: 1, label: 'Tomorrow', date: getDateString(1) },
    { offset: 2, label: getDayName(2), date: getDateString(2) },
    { offset: 3, label: getDayName(3), date: getDateString(3) },
  ];

  function getDateString(daysOffset: number) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
  }

  function getDayName(daysOffset: number) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  const copyBookingCode = () => {
    if (!completedBooking) return;
    navigator.clipboard.writeText(completedBooking.bookingCode);
    setIsCopiedCode(true);
    setTimeout(() => setIsCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-xl overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-[#0F172A] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header & Progress Stepper */}
        <div className="bg-[#1E293B] border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-9 h-12 rounded-lg object-cover border border-slate-700 hidden sm:block"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{movie.title}</h2>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-900">
                  {movie.ageRating}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <MapPin className="w-3 h-3 text-amber-500" />
                <span className="truncate max-w-xs">{currentCinema.name}</span>
              </div>
            </div>
          </div>

          {/* Stepper Dots / Labels */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { num: 1, label: 'Showtime' },
              { num: 2, label: 'Seats' },
              { num: 3, label: 'Snacks' },
              { num: 4, label: 'Extras' },
              { num: 5, label: 'Pay' },
              { num: 6, label: 'Ticket' }
            ].map(s => (
              <div key={s.num} className="flex items-center">
                <div 
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                    step === s.num
                      ? 'bg-amber-500 text-slate-900 shadow-md shadow-amber-500/20'
                      : step > s.num
                        ? 'bg-slate-800 text-amber-400 border border-slate-700'
                        : 'bg-slate-800/60 text-slate-500'
                  }`}
                >
                  {step > s.num ? <Check className="w-3 h-3" /> : <span>{s.num}</span>}
                  <span className="hidden md:inline">{s.label}</span>
                </div>
                {s.num < 6 && <ChevronRight className="w-3 h-3 text-slate-600 mx-0.5 hidden md:inline" />}
              </div>
            ))}

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="ml-2 w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ================= STEP 1: SHOWTIME & EXPERIENCE ================= */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Cinema Picker dropdown */}
              <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Selected Cinema Venue</div>
                    <div className="text-sm font-bold text-white">{currentCinema.name}</div>
                  </div>
                </div>

                <select
                  value={currentCinema.id}
                  onChange={(e) => {
                    soundFx.playClick();
                    const found = CINEMAS.find(c => c.id === e.target.value);
                    if (found) setCurrentCinema(found);
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {CINEMAS.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.city}: {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Tabs */}
              <div>
                <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-4 bg-amber-500 rounded-full" />
                  <span>1. Select Screening Date</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {dateOptions.map(d => (
                    <button
                      key={d.date}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedDate(d.date);
                      }}
                      className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedDate === d.date
                          ? 'bg-amber-500 border-amber-500 text-slate-900 shadow-md shadow-amber-500/20 font-bold'
                          : 'bg-[#1E293B] border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      <div className={`text-xs font-bold ${selectedDate === d.date ? 'text-slate-900' : 'text-slate-400'}`}>{d.label}</div>
                      <div className={`text-sm font-black mt-1 ${selectedDate === d.date ? 'text-slate-950' : 'text-slate-100'}`}>{d.date}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Showtimes Grid grouped by Experience */}
              <div>
                <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-1 h-4 bg-amber-500 rounded-full" />
                    <span>2. Choose Experience & Showtime</span>
                  </span>
                  <span className="text-[11px] text-amber-400 normal-case font-medium">
                    ⚡ Live seat inventory available
                  </span>
                </div>

                <div className="space-y-4">
                  {['IMAX 3D', 'Dolby Cinema', 'VIP Recliner', 'Standard 2D'].map(expName => {
                    const timesForExp = filteredShowtimes.filter(s => s.experience === expName);
                    if (timesForExp.length === 0) return null;

                    return (
                      <div key={expName} className="bg-[#1E293B] border border-slate-700 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              {expName}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              {timesForExp[0].hallName}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-300">
                            From <span className="text-amber-400">${timesForExp[0].priceStandard.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                          {timesForExp.map(st => {
                            const isSelected = selectedShowtime?.id === st.id;
                            return (
                              <button
                                key={st.id}
                                onClick={() => {
                                  soundFx.playClick();
                                  setSelectedShowtime(st);
                                  setSelectedFormat(st.experience);
                                }}
                                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-slate-700 text-amber-400 font-bold border-amber-500 shadow-md scale-102'
                                    : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:border-slate-600'
                                }`}
                              >
                                <div className="text-sm font-bold flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                                  <span>{st.time}</span>
                                </div>
                                <div className={`text-[10px] ${isSelected ? 'text-amber-300/80 font-medium' : 'text-slate-400'}`}>
                                  {st.availableSeatsCount} seats left
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: INTERACTIVE SEAT SELECTION ================= */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Top Controls: Group Finder & Best View Highlight */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1E293B] p-3.5 rounded-2xl border border-slate-700">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Users className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold">Quick Group Finder:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 6].map(num => (
                      <button
                        key={num}
                        onClick={() => handleGroupSelect(num)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
                      >
                        {num} {num === 1 ? 'Seat' : 'Seats'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setHighlightBestView(!highlightBestView)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    highlightBestView
                      ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-sm'
                      : 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Highlight Optimal Sweet Spot</span>
                </button>
              </div>

              {/* Cinema Curved Screen visual */}
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="w-full max-w-md h-1.5 bg-amber-500/30 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
                <div className="text-[11px] font-bold text-amber-400/80 uppercase tracking-widest mt-2">
                  SCREEN (AUDITORIUM 1)
                </div>
              </div>

              {/* Auditorium Seat Map Grid */}
              <div className="overflow-x-auto py-2">
                <div className="min-w-[620px] max-w-3xl mx-auto space-y-2">
                  {DEFAULT_AUDITORIUM.rows.map(rowLetter => {
                    const rowSeats = seats.filter(s => s.row === rowLetter);

                    return (
                      <div key={rowLetter} className="flex items-center justify-center gap-2">
                        {/* Row letter left */}
                        <div className="w-5 text-center text-xs font-bold text-slate-500">
                          {rowLetter}
                        </div>

                        {/* Seats with Aisle gaps */}
                        <div className="flex items-center gap-1.5">
                          {rowSeats.map((seat, index) => {
                            const isSelected = selectedSeats.some(s => s.id === seat.id);
                            const isReserved = seat.status === 'reserved';
                            const isSweetSpot = highlightBestView && (rowLetter === 'E' || rowLetter === 'F') && (seat.number >= 4 && seat.number <= 9);

                            let seatBg = 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:border-slate-500 border border-slate-600';
                            if (isReserved) {
                              seatBg = 'bg-slate-900 text-slate-700 border-slate-800 cursor-not-allowed opacity-40';
                            } else if (isSelected) {
                              seatBg = 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(245,158,11,0.5)] scale-110 border-amber-400 ring-2 ring-white/60';
                            } else if (isSweetSpot) {
                              seatBg = 'bg-amber-950/80 text-amber-300 border-amber-500 animate-pulse';
                            } else if (seat.tier === 'vip') {
                              seatBg = 'bg-purple-950/70 text-purple-300 border-purple-500/50 hover:bg-purple-900/80';
                            } else if (seat.tier === 'premium') {
                              seatBg = 'bg-blue-950/70 text-blue-300 border-blue-500/50 hover:bg-blue-900/80';
                            } else if (seat.tier === 'accessible') {
                              seatBg = 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/80';
                            }

                            const addLeftAisle = DEFAULT_AUDITORIUM.aislesAfter.includes(index);

                            return (
                              <React.Fragment key={seat.id}>
                                <button
                                  disabled={isReserved}
                                  onClick={() => handleSeatClick(seat)}
                                  title={`Seat ${seat.id} (${seat.tier}) - $${seat.price.toFixed(2)}`}
                                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${seatBg}`}
                                >
                                  {seat.tier === 'accessible' ? '♿' : seat.number}
                                </button>
                                {addLeftAisle && <div className="w-5 sm:w-8" />}
                              </React.Fragment>
                            );
                          })}
                        </div>

                        {/* Row letter right */}
                        <div className="w-5 text-center text-xs font-bold text-slate-500">
                          {rowLetter}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Seating Tier Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-3 border-t border-slate-700/60">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-slate-700 border border-slate-600" />
                  <span className="text-slate-300">Standard (${selectedShowtime?.priceStandard.toFixed(2)})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-blue-950 border border-blue-500 text-blue-300" />
                  <span className="text-slate-300">Prime Club (${selectedShowtime?.pricePremium.toFixed(2)})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-purple-950 border border-purple-500 text-purple-300" />
                  <span className="text-slate-300">VIP Recliner (${selectedShowtime?.priceVip.toFixed(2)})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-emerald-950 border border-emerald-500 text-emerald-300" />
                  <span className="text-slate-300">Accessible Wheelchair</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-amber-500 border border-amber-400" />
                  <span className="text-amber-400 font-bold">Selected ({selectedSeats.length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-slate-900 border border-slate-700 opacity-40" />
                  <span className="text-slate-500">Booked</span>
                </div>
              </div>

              {/* View From Seat 3D Perspective Simulator */}
              {focusedSeatForPerspective && (
                <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-amber-500" />
                      <span>Virtual Sightline View from Seat {focusedSeatForPerspective.id}</span>
                    </div>
                    <span className="text-amber-400 font-semibold text-[11px]">
                      {focusedSeatForPerspective.tier.toUpperCase()} • Row {focusedSeatForPerspective.row}
                    </span>
                  </div>

                  {/* Simulated auditorium perspective viewport */}
                  <div className="relative h-28 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                    <div 
                      className="w-3/5 h-16 bg-gradient-to-b from-amber-500/30 via-orange-500/20 to-transparent border border-amber-500/50 rounded-t-xl shadow-[0_0_30px_rgba(245,158,11,0.25)] flex items-center justify-center text-center p-2 transition-transform duration-300"
                      style={{
                        transform: `scale(${1.2 - (focusedSeatForPerspective.row.charCodeAt(0) - 65) * 0.08}) translateY(${(focusedSeatForPerspective.row.charCodeAt(0) - 65) * 2}px)`
                      }}
                    >
                      <div className="text-[10px] font-bold text-amber-300 uppercase">
                        {movie.title} • IMAX 3D Perspective
                      </div>
                    </div>

                    <div className="absolute bottom-1 text-[10px] text-slate-500">
                      Simulated 140° Field of View • Dolby Atmos Audio Focus
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3: GOURMET CONCESSIONS & SNACKS ================= */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Category selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {['All', 'Combos', 'Popcorn', 'Snacks', 'Beverages', 'Sweets'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedConcessionCategory(cat);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedConcessionCategory === cat
                        ? 'bg-amber-500 text-slate-900 shadow-sm'
                        : 'bg-[#1E293B] text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Concessions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CONCESSIONS
                  .filter(c => selectedConcessionCategory === 'All' || c.category === selectedConcessionCategory)
                  .map(item => {
                    const cartItem = concessionsCart.find(c => c.item.id === item.id);
                    const qty = cartItem ? cartItem.quantity : 0;

                    return (
                      <div 
                        key={item.id}
                        className="bg-[#1E293B] border border-slate-700 rounded-2xl overflow-hidden p-3.5 flex flex-col justify-between gap-3 hover:border-slate-500 transition-colors"
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-20 h-20 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                          />
                          <div className="flex-1 space-y-1">
                            {item.badge && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500 text-slate-900">
                                {item.badge}
                              </span>
                            )}
                            <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                            <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                            <div className="text-xs font-bold text-amber-400">${item.price.toFixed(2)}</div>
                          </div>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                          <span className="text-[10px] text-slate-500">{item.calories}</span>
                          <div className="flex items-center gap-2">
                            {qty > 0 && (
                              <button
                                onClick={() => handleConcessionChange(item, -1)}
                                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer transition-colors border border-slate-700"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {qty > 0 && (
                              <span className="text-xs font-bold text-white w-4 text-center">{qty}</span>
                            )}
                            <button
                              onClick={() => handleConcessionChange(item, 1)}
                              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-md shadow-amber-500/20"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>{qty === 0 ? 'Add' : 'More'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ================= STEP 4: EXTRAS, PERKS & PROMO CODE ================= */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Add-ons List */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-4 bg-amber-500 rounded-full" />
                  <span>Cinema Extras & VIP Services</span>
                </div>

                {/* 3D RealD Glasses */}
                <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Glasses className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">IMAX / RealD 3D Glasses</div>
                      <div className="text-[11px] text-slate-400">Ultra-clarity laser filtered circular polarized lenses</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xs font-bold text-amber-400">${addons.glassesPriceEach.toFixed(2)} each</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setAddons(prev => ({ ...prev, glasses3DCount: Math.max(0, prev.glasses3DCount - 1) }));
                        }}
                        className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center cursor-pointer border border-slate-700"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-white w-4 text-center">{addons.glasses3DCount}</span>
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setAddons(prev => ({ ...prev, glasses3DCount: prev.glasses3DCount + 1 }));
                        }}
                        className="w-7 h-7 rounded-lg bg-amber-500 text-slate-900 font-bold flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Priority Parking Spot Pass */}
                <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Guaranteed Valet / Garage Parking Pass</div>
                      <div className="text-[11px] text-slate-400">Direct VIP elevator access to cinema lobby</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xs font-bold text-amber-400">+$10.00</div>
                    <input
                      type="checkbox"
                      checked={addons.parkingPass}
                      onChange={(e) => {
                        soundFx.playClick();
                        setAddons(prev => ({ ...prev, parkingPass: e.target.checked }));
                      }}
                      className="w-5 h-5 accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 100% Refund Cancellation Protection */}
                <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">100% Refund Cancellation Guarantee</div>
                      <div className="text-[11px] text-slate-400">Cancel or reschedule up to 30 mins before showtime</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xs font-bold text-amber-400">+$2.99</div>
                    <input
                      type="checkbox"
                      checked={addons.cancellationProtection}
                      onChange={(e) => {
                        soundFx.playClick();
                        setAddons(prev => ({ ...prev, cancellationProtection: e.target.checked }));
                      }}
                      className="w-5 h-5 accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Promo Code & Loyalty Points Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Promo Code */}
                <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700 space-y-3">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-500" />
                    <span>Apply Promo Coupon</span>
                  </div>

                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. CINEPASS20"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 uppercase font-mono text-xs px-3 py-2 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold cursor-pointer transition-colors"
                    >
                      Apply
                    </button>
                  </form>

                  {appliedPromo && (
                    <div className="flex items-center justify-between text-xs bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-amber-400">
                      <span>✓ Applied: <strong>{appliedPromo.code}</strong> ({appliedPromo.description})</span>
                      <button onClick={() => setAppliedPromo(null)} className="text-slate-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {promoError && (
                    <div className="text-[11px] text-rose-400">{promoError}</div>
                  )}
                </div>

                {/* CineRewards Points Redemption */}
                <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Redeem CinePoints</span>
                    </span>
                    <span className="text-amber-400 font-bold">Balance: {userProfile.cinePoints} pts</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Points: {pointsToRedeem}</span>
                      <span>Discount: -${((pointsToRedeem / 100) * 5).toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={Math.min(userProfile.cinePoints, 400)}
                      step={50}
                      value={pointsToRedeem}
                      onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 5: PAYMENT & CHECKOUT ================= */}
          {step === 5 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
              
              {/* Left 2 Cols: Payment Methods & Contact */}
              <div className="md:col-span-2 space-y-5">
                
                {/* Contact Information */}
                <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700 space-y-3">
                  <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 bg-amber-500 rounded-full" />
                    <span>E-Ticket Delivery Details</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile Phone (SMS pass)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Payment Methods Tabs */}
                <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700 space-y-4">
                  <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 bg-amber-500 rounded-full" />
                    <span>Select Payment Method</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                      { id: 'apple_pay', label: 'Apple Pay', icon: CheckCircle2 },
                      { id: 'google_pay', label: 'Google Pay', icon: CheckCircle2 },
                      { id: 'cine_wallet', label: 'CineWallet', icon: Sparkles },
                    ].map(pm => {
                      const Icon = pm.icon;
                      const isSel = paymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          onClick={() => {
                            soundFx.playClick();
                            setPaymentMethod(pm.id as typeof paymentMethod);
                          }}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            isSel
                              ? 'bg-amber-500 text-slate-900 font-bold border-amber-500 shadow-md shadow-amber-500/20'
                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-bold">{pm.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-3 pt-2">
                      <div className="relative p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl space-y-3">
                        <div className="flex justify-between items-center text-xs text-slate-400">
                          <span className="font-mono">CINEPASS PREMIER CARD</span>
                          <span className="text-amber-500 font-bold">VISA</span>
                        </div>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="Card Number"
                          className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                          <input
                            type="password"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="CVC"
                            maxLength={4}
                            className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'apple_pay' && (
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                      <p className="text-xs text-slate-300">Biometric Touch ID / Face ID authorized</p>
                      <button
                        onClick={handleCompletePayment}
                        className="w-full py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer shadow-lg"
                      >
                         Pay ${finalTotal.toFixed(2)}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Col: Order Receipt Summary */}
              <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-700 space-y-4 h-fit">
                <div className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-2 flex items-center gap-2">
                  <span className="w-1 h-3.5 bg-amber-500 rounded-full" />
                  <span>Order Summary</span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Tickets ({selectedSeats.length}x {selectedFormat})</span>
                    <span className="font-bold text-white">${ticketsSubtotal.toFixed(2)}</span>
                  </div>

                  {concessionsCart.map(c => (
                    <div key={c.item.id} className="flex justify-between text-slate-400 text-[11px]">
                      <span>{c.quantity}x {c.item.name}</span>
                      <span>${(c.item.price * c.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  {addonsSubtotal > 0 && (
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Cinema Add-ons</span>
                      <span>${addonsSubtotal.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Convenience Fee</span>
                    <span>${bookingFee.toFixed(2)}</span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Total Savings</span>
                      <span>-${totalDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Est. Tax (8.875%)</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-slate-700 pt-2 flex justify-between text-base font-bold text-white">
                    <span>Total Amount</span>
                    <span className="text-amber-400 font-black">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-700 text-[11px] text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <span>You will earn <strong>+{cinePointsEarned} CinePoints</strong> on this booking!</span>
                </div>

                <button
                  onClick={handleCompletePayment}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
                >
                  CONFIRM & PAY ${finalTotal.toFixed(2)}
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 6: DIGITAL E-TICKET PASS ================= */}
          {step === 6 && completedBooking && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 max-w-xl mx-auto">
              
              {/* Success Badge */}
              <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 mb-1">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">Booking Confirmed!</h3>
                <p className="text-xs text-slate-400">
                  Your digital cinema pass is ready. An SMS & email receipt has been sent to {customerEmail}.
                </p>
              </div>

              {/* Digital Cinema Ticket Card */}
              <div className="relative bg-[#1E293B] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
                
                {/* Ticket Top Movie Banner */}
                <div className="relative h-28 overflow-hidden bg-slate-950">
                  <img
                    src={completedBooking.movie.backdropUrl}
                    alt={completedBooking.movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-[#1E293B]/60 to-transparent" />
                  <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-900">
                      {completedBooking.showtime.experience}
                    </span>
                    <span className="text-xs font-mono font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-md border border-slate-700">
                      Ref: {completedBooking.bookingCode}
                    </span>
                  </div>
                </div>

                {/* Ticket Content Info */}
                <div className="p-5 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{completedBooking.movie.title}</h2>
                    <p className="text-xs text-amber-400 font-semibold">{completedBooking.cinema.name}</p>
                    <p className="text-[11px] text-slate-400">{completedBooking.cinema.address}</p>
                  </div>

                  {/* Grid details */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-900 p-3 rounded-2xl border border-slate-800 text-center">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Date</div>
                      <div className="text-xs font-bold text-white">{completedBooking.showtime.date}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Time</div>
                      <div className="text-xs font-bold text-amber-400">{completedBooking.showtime.time}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Hall</div>
                      <div className="text-xs font-bold text-white truncate">{completedBooking.showtime.hallName.split('(')[0]}</div>
                    </div>
                  </div>

                  {/* Seats List Pill */}
                  <div className="flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <div className="text-xs text-slate-400 font-semibold">Reserved Seats:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {completedBooking.seats.map(s => (
                        <span key={s.id} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500 text-slate-900">
                          {s.id}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* QR Code & Barcode Simulation */}
                  <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl text-slate-950 space-y-2">
                    {/* SVG QR Code pattern generator */}
                    <div className="w-36 h-36 bg-slate-100 p-2 rounded-xl border border-slate-300 flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-slate-950" />
                    </div>

                    <div className="text-center font-mono text-[11px] tracking-widest font-bold text-slate-800">
                      {completedBooking.bookingCode}
                    </div>

                    {/* Barcode lines */}
                    <div className="w-48 h-8 flex items-center justify-center gap-1 opacity-80 overflow-hidden">
                      {Array.from({ length: 32 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="h-full bg-slate-950" 
                          style={{ width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '1px' : '2px' }} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ticket Cutout notched circles */}
                <div className="absolute left-0 top-[28%] -translate-x-1/2 w-6 h-6 rounded-full bg-[#0F172A] border-r border-slate-700" />
                <div className="absolute right-0 top-[28%] translate-x-1/2 w-6 h-6 rounded-full bg-[#0F172A] border-l border-slate-700" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Ticket</span>
                </button>

                <button
                  onClick={copyBookingCode}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isCopiedCode ? 'Copied Code!' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onClose();
                  }}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  DONE & VIEW ALL MY TICKETS
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar (Steps 1 to 4) */}
        {step < 5 && (
          <div className="bg-[#1E293B] border-t border-slate-800 px-6 py-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Total Price</div>
              <div className="text-xl font-bold text-amber-400">
                ${rawSubtotal.toFixed(2)}
                <span className="text-xs text-slate-400 font-normal ml-1">
                  ({selectedSeats.length} seats)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setStep((prev) => (prev - 1) as typeof step);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer border border-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}

              <button
                disabled={step === 2 && selectedSeats.length === 0}
                onClick={() => {
                  if (step === 2 && selectedSeats.length === 0) {
                    alert('Please select at least 1 seat to proceed.');
                    return;
                  }
                  soundFx.playClick();
                  setStep((prev) => (prev + 1) as typeof step);
                }}
                className={`px-8 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  step === 2 && selectedSeats.length === 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/20 active:scale-95'
                }`}
              >
                <span>{step === 4 ? 'PROCEED TO PAYMENT' : 'CONTINUE'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
