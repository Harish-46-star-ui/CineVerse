import { Seat, SeatTier } from '../types';

export interface AuditoriumConfig {
  rows: string[]; // e.g. ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  seatsPerRow: number; // 12
  aislesAfter: number[]; // e.g. [3, 9] (left aisle after seat 3, right aisle after seat 9)
}

export const DEFAULT_AUDITORIUM: AuditoriumConfig = {
  rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  seatsPerRow: 12,
  aislesAfter: [3, 9]
};

export function getTierForRow(row: string): { tier: SeatTier; label: string; description: string } {
  switch (row) {
    case 'A':
      return { tier: 'accessible', label: 'Accessible / Companion', description: 'Step-free access & extra wheelchair space' };
    case 'B':
    case 'C':
      return { tier: 'standard', label: 'Standard Classic', description: 'Comfortable contoured cinema seating' };
    case 'D':
    case 'E':
    case 'F':
      return { tier: 'premium', label: 'Prime Club', description: 'Optimal center sightline & wide armrests' };
    case 'G':
    case 'H':
      return { tier: 'vip', label: 'VIP Zero-G Recliner', description: 'Motorized leather lounger with food tray' };
    default:
      return { tier: 'standard', label: 'Standard', description: 'Standard seating' };
  }
}

export function generateAuditoriumSeats(
  prices: { standard: number; premium: number; vip: number },
  bookedSeatIds: string[] = []
): Seat[] {
  const seats: Seat[] = [];
  const rows = DEFAULT_AUDITORIUM.rows;
  const count = DEFAULT_AUDITORIUM.seatsPerRow;

  rows.forEach(row => {
    const { tier } = getTierForRow(row);
    let price = prices.standard;
    if (tier === 'premium') price = prices.premium;
    if (tier === 'vip') price = prices.vip;
    if (tier === 'accessible') price = prices.standard;

    for (let num = 1; num <= count; num++) {
      const id = `${row}${num}`;
      const isBooked = bookedSeatIds.includes(id);

      // Couple pair tagging for back row H
      let pairId: string | undefined = undefined;
      if (row === 'H') {
        const pairNum = num % 2 === 1 ? num + 1 : num - 1;
        pairId = `${row}${pairNum}`;
      }

      seats.push({
        id,
        row,
        number: num,
        tier: row === 'H' ? 'couple' : tier,
        price: row === 'H' ? prices.vip + 2.50 : price,
        status: isBooked ? 'reserved' : 'available',
        pairId
      });
    }
  });

  return seats;
}

export function findAdjacentSeats(seats: Seat[], groupSize: number): string[] | null {
  // Best row priority: E, F, D, G, C, H, B, A
  const rowPriority = ['E', 'F', 'D', 'G', 'C', 'H', 'B', 'A'];

  for (const r of rowPriority) {
    const rowSeats = seats.filter(s => s.row === r).sort((a, b) => a.number - b.number);
    // Find contiguous available seats closest to center (seat 6-7)
    for (let start = 0; start <= rowSeats.length - groupSize; start++) {
      const slice = rowSeats.slice(start, start + groupSize);
      const allAvailable = slice.every(s => s.status === 'available');
      if (allAvailable) {
        return slice.map(s => s.id);
      }
    }
  }

  return null;
}
