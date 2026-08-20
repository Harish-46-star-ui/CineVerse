import { BookingRecord, UserProfile, Cinema } from '../types';
import { CINEMAS } from '../data/mockData';

const BOOKINGS_KEY = 'cineverse_bookings';
const USER_KEY = 'cineverse_user_profile';
const SELECTED_CINEMA_KEY = 'cineverse_selected_cinema';
const SELECTED_CITY_KEY = 'cineverse_selected_city';

export const INITIAL_USER: UserProfile = {
  name: 'Alex Mercer',
  email: 'alex.mercer@cinemaverse.io',
  phone: '+1 (555) 234-5678',
  cinePoints: 450,
  tier: 'Gold',
  watchlistMovieIds: ['spider-verse-beyond', 'avatar-fire-ash'],
  savedPaymentCards: [
    {
      id: 'card-1',
      brand: 'visa',
      lastFour: '4242',
      expiry: '08/28'
    },
    {
      id: 'card-2',
      brand: 'mastercard',
      lastFour: '8821',
      expiry: '11/29'
    }
  ]
};

export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'bk-sample-01',
    bookingCode: 'CV-892401',
    qrData: 'CINEVERSE-TICKET-CV-892401-DUNE2-SEAT-E7-E8',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    movie: {
      id: 'dune-prophecy',
      title: 'Dune: Part Two',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
      ageRating: 'PG-13',
      durationMinutes: 166,
      genres: ['Sci-Fi', 'Adventure']
    },
    cinema: {
      id: 'cin-nyc-1',
      name: 'CineVerse Grand IMAX & Dolby Arena',
      city: 'New York',
      address: '1540 Broadway, Times Square, New York, NY 10036'
    },
    showtime: {
      id: 'show-sample-1',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      time: '19:45',
      hallName: 'IMAX Auditorium 1 (Laser 70mm)',
      experience: 'IMAX 3D'
    },
    seats: [
      { id: 'E7', row: 'E', number: 7, tier: 'premium', price: 26.50 },
      { id: 'E8', row: 'E', number: 8, tier: 'premium', price: 26.50 }
    ],
    concessions: [
      {
        item: {
          id: 'combo-megastar',
          name: 'CineVerse Mega Star Combo',
          category: 'Combos',
          price: 18.50,
          description: '1 Jumbo Warm Butter Popcorn + 2 Large Fountain Sodas + 1 Choice of Candy',
          imageUrl: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?auto=format&fit=crop&w=500&q=80'
        },
        quantity: 1
      }
    ],
    addons: {
      glasses3DCount: 2,
      glassesPriceEach: 3.50,
      parkingPass: true,
      parkingPrice: 10.00,
      cancellationProtection: true,
      cancellationPrice: 2.99
    },
    pricing: {
      ticketsSubtotal: 53.00,
      concessionsSubtotal: 18.50,
      addonsSubtotal: 19.99,
      bookingFee: 3.50,
      discountAmount: 10.00,
      taxAmount: 6.84,
      totalAmount: 91.83,
      promoCodeUsed: 'CINEPASS20',
      cinePointsEarned: 92,
      cinePointsUsed: 0
    },
    customer: {
      fullName: 'Alex Mercer',
      email: 'alex.mercer@cinemaverse.io',
      phone: '+1 (555) 234-5678',
      paymentMethod: 'apple_pay'
    },
    status: 'confirmed'
  }
];

export function getStoredBookings(): BookingRecord[] {
  try {
    const data = localStorage.getItem(BOOKINGS_KEY);
    if (!data) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_BOOKINGS;
  }
}

export function saveBooking(booking: BookingRecord): BookingRecord[] {
  const current = getStoredBookings();
  const updated = [booking, ...current];
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));

  // Update user points
  const user = getStoredUserProfile();
  user.cinePoints += booking.pricing.cinePointsEarned;
  if (booking.pricing.cinePointsUsed) {
    user.cinePoints -= booking.pricing.cinePointsUsed;
  }
  saveUserProfile(user);

  return updated;
}

export function cancelBooking(bookingId: string): BookingRecord[] {
  const current = getStoredBookings();
  const updated = current.map(b => {
    if (b.id === bookingId) {
      return { ...b, status: 'cancelled' as const };
    }
    return b;
  });
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  return updated;
}

export function markTicketAsScanned(bookingId: string): BookingRecord[] {
  const current = getStoredBookings();
  const updated = current.map(b => {
    if (b.id === bookingId) {
      return { ...b, status: 'used' as const, scannedAt: new Date().toISOString() };
    }
    return b;
  });
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  return updated;
}

export function getStoredUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (!data) {
      localStorage.setItem(USER_KEY, JSON.stringify(INITIAL_USER));
      return INITIAL_USER;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_USER;
  }
}

export function saveUserProfile(user: UserProfile) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function toggleWatchlistMovie(movieId: string): string[] {
  const user = getStoredUserProfile();
  const exists = user.watchlistMovieIds.includes(movieId);
  if (exists) {
    user.watchlistMovieIds = user.watchlistMovieIds.filter(id => id !== movieId);
  } else {
    user.watchlistMovieIds.push(movieId);
  }
  saveUserProfile(user);
  return user.watchlistMovieIds;
}

export function getSelectedCity(): string {
  return localStorage.getItem(SELECTED_CITY_KEY) || 'New York';
}

export function setSelectedCity(city: string) {
  localStorage.setItem(SELECTED_CITY_KEY, city);
}

export function getSelectedCinema(): Cinema {
  try {
    const data = localStorage.getItem(SELECTED_CINEMA_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return CINEMAS[0];
}

export function setSelectedCinema(cinema: Cinema) {
  localStorage.setItem(SELECTED_CINEMA_KEY, JSON.stringify(cinema));
}
