export type ExperienceFormat = 'IMAX 3D' | 'Dolby Cinema' | '4DX' | 'Standard 2D' | 'ScreenX' | 'VIP Recliner';

export type SeatTier = 'standard' | 'premium' | 'vip' | 'accessible' | 'couple';

export type SeatStatus = 'available' | 'reserved' | 'selected' | 'locked';

export interface Seat {
  id: string; // e.g. "A1", "F12"
  row: string;
  number: number;
  tier: SeatTier;
  price: number;
  status: SeatStatus;
  pairId?: string; // for couple seats
}

export interface Showtime {
  id: string;
  movieId: string;
  cinemaId: string;
  hallName: string;
  experience: ExperienceFormat;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "14:30", "19:00"
  priceStandard: number;
  pricePremium: number;
  priceVip: number;
  totalSeats: number;
  availableSeatsCount: number;
  bookedSeats: string[]; // e.g. ["C4", "C5", "D6"]
}

export interface CastMember {
  name: string;
  character: string;
  avatarUrl: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  verified: boolean;
  avatar: string;
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  tagline: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  trailerYoutubeId: string;
  genres: string[];
  durationMinutes: number;
  releaseDate: string;
  ageRating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
  imdbRating: number;
  rottenTomatoesScore: number;
  director: string;
  cast: CastMember[];
  formats: ExperienceFormat[];
  status: 'now_showing' | 'coming_soon' | 'trending';
  featuredHero?: boolean;
  languages: string[];
  reviews: Review[];
}

export interface Cinema {
  id: string;
  name: string;
  city: string;
  address: string;
  distanceKm?: number;
  phone: string;
  amenities: string[];
  formatsAvailable: ExperienceFormat[];
  imageUrl: string;
  parkingInfo: string;
}

export interface ConcessionItem {
  id: string;
  name: string;
  category: 'Combos' | 'Popcorn' | 'Snacks' | 'Beverages' | 'Sweets';
  price: number;
  description: string;
  imageUrl: string;
  calories?: string;
  isPopular?: boolean;
  isVegan?: boolean;
  badge?: string;
}

export interface CartConcession {
  item: ConcessionItem;
  quantity: number;
}

export interface PromoCode {
  code: string;
  discountPercentage: number;
  discountFlat?: number;
  minAmount?: number;
  description: string;
}

export interface BookingAddons {
  glasses3DCount: number;
  glassesPriceEach: number;
  parkingPass: boolean;
  parkingPrice: number;
  cancellationProtection: boolean;
  cancellationPrice: number;
}

export interface BookingRecord {
  id: string;
  bookingCode: string;
  qrData: string;
  createdAt: string;
  movie: {
    id: string;
    title: string;
    posterUrl: string;
    backdropUrl: string;
    ageRating: string;
    durationMinutes: number;
    genres: string[];
  };
  cinema: {
    id: string;
    name: string;
    city: string;
    address: string;
  };
  showtime: {
    id: string;
    date: string;
    time: string;
    hallName: string;
    experience: ExperienceFormat;
  };
  seats: {
    id: string;
    row: string;
    number: number;
    tier: SeatTier;
    price: number;
  }[];
  concessions: CartConcession[];
  addons: BookingAddons;
  pricing: {
    ticketsSubtotal: number;
    concessionsSubtotal: number;
    addonsSubtotal: number;
    bookingFee: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    promoCodeUsed?: string;
    cinePointsEarned: number;
    cinePointsUsed?: number;
  };
  customer: {
    fullName: string;
    email: string;
    phone: string;
    paymentMethod: 'credit_card' | 'apple_pay' | 'google_pay' | 'cine_wallet' | 'cash_box_office';
    cardLastFour?: string;
  };
  status: 'confirmed' | 'cancelled' | 'used';
  scannedAt?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  cinePoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum VIP';
  watchlistMovieIds: string[];
  savedPaymentCards: {
    id: string;
    brand: 'visa' | 'mastercard' | 'amex';
    lastFour: string;
    expiry: string;
  }[];
}
