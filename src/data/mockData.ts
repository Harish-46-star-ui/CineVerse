import { Movie, Cinema, Showtime, ConcessionItem, PromoCode } from '../types';

export const CITIES = [
  'New York',
  'Los Angeles',
  'San Francisco',
  'Chicago',
  'Austin',
  'London',
  'Toronto',
  'Tokyo'
];

export const CINEMAS: Cinema[] = [
  {
    id: 'cin-nyc-1',
    name: 'CineVerse Grand IMAX & Dolby Arena',
    city: 'New York',
    address: '1540 Broadway, Times Square, New York, NY 10036',
    phone: '+1 (212) 555-0199',
    amenities: ['IMAX Laser 70mm', 'Dolby Atmos 128-ch', 'Zero-G VIP Recliners', 'Full Bar & Gourmet Dining', 'Reserved Heated Seats'],
    formatsAvailable: ['IMAX 3D', 'Dolby Cinema', 'VIP Recliner', 'Standard 2D'],
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
    parkingInfo: 'Underground Valet Parking with $10 Cinema validation (P2 Garage)'
  },
  {
    id: 'cin-nyc-2',
    name: 'Lumina Star Lounge & ScreenX',
    city: 'New York',
    address: '345 Hudson St, Greenwich Village, New York, NY 10014',
    phone: '+1 (212) 555-0144',
    amenities: ['ScreenX 270° Panoramic', 'Dolby Atmos', 'Artisan Cocktail Lounge', 'Laser 4K Projection'],
    formatsAvailable: ['ScreenX', 'Dolby Cinema', 'Standard 2D'],
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    parkingInfo: 'Street meter parking + Discounted garage at 120 7th Ave'
  },
  {
    id: 'cin-la-1',
    name: 'CineVerse Hollywood Dolby Palace',
    city: 'Los Angeles',
    address: '6801 Hollywood Blvd, Los Angeles, CA 90028',
    phone: '+1 (323) 555-0182',
    amenities: ['Dolby Vision & Atmos', '4DX Motion Seats', 'Red Carpet Photobooth', 'VIP Champagne Lounge'],
    formatsAvailable: ['Dolby Cinema', '4DX', 'IMAX 3D', 'VIP Recliner'],
    imageUrl: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&w=1200&q=80',
    parkingInfo: 'Validated parking at Hollywood & Highland structure'
  },
  {
    id: 'cin-sf-1',
    name: 'Metropolis IMAX & 4DX Dome',
    city: 'San Francisco',
    address: '845 Market St, San Francisco, CA 94103',
    phone: '+1 (415) 555-0177',
    amenities: ['Dual 4K Laser IMAX', 'D-BOX Motion Feedback', 'Organic Snack Bar'],
    formatsAvailable: ['IMAX 3D', '4DX', 'Standard 2D'],
    imageUrl: 'https://images.unsplash.com/photo-1518929458119-e5bf404ecb0f?auto=format&fit=crop&w=1200&q=80',
    parkingInfo: 'Powell Street Station validation available'
  },
  {
    id: 'cin-chi-1',
    name: 'The Chicago Regal Screen Palace',
    city: 'Chicago',
    address: '175 N State St, Chicago, IL 60601',
    phone: '+1 (312) 555-0138',
    amenities: ['Historic Auditorium Restoration', 'IMAX with Laser', 'In-Seat Food Delivery'],
    formatsAvailable: ['IMAX 3D', 'VIP Recliner', 'Dolby Cinema'],
    imageUrl: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=1200&q=80',
    parkingInfo: 'Loop Theatre district parking coupon with ticket'
  }
];

export const MOVIES: Movie[] = [
  {
    id: 'dune-prophecy',
    title: 'Dune: Part Two',
    originalTitle: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    trailerYoutubeId: 'Way9Dexny3w',
    genres: ['Sci-Fi', 'Adventure', 'Action', 'Drama'],
    durationMinutes: 166,
    releaseDate: '2024-03-01',
    ageRating: 'PG-13',
    imdbRating: 8.6,
    rottenTomatoesScore: 93,
    director: 'Denis Villeneuve',
    cast: [
      { name: 'Timothée Chalamet', character: 'Paul Atreides', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      { name: 'Zendaya', character: 'Chani', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      { name: 'Rebecca Ferguson', character: 'Lady Jessica', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
      { name: 'Austin Butler', character: 'Feyd-Rautha', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['IMAX 3D', 'Dolby Cinema', 'VIP Recliner', 'Standard 2D'],
    status: 'now_showing',
    featuredHero: true,
    languages: ['English', 'Fremen (Subtitled)', 'Chakobsa'],
    reviews: [
      {
        id: 'rev-1',
        author: 'Marcus Sterling',
        rating: 5,
        date: 'Yesterday',
        comment: 'An absolute audio-visual masterpiece in IMAX 70mm! The sound design vibrates through your entire body.',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
      },
      {
        id: 'rev-2',
        author: 'Elena Rostova',
        rating: 5,
        date: '3 days ago',
        comment: 'Hans Zimmer score paired with the sandworm sequences is cinema at its absolute finest.',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
      }
    ]
  },
  {
    id: 'cyberpunk-neon',
    title: 'Cyberpulse: Neo-Tokyo 2099',
    tagline: 'When neural dreams bleed into synthetic reality.',
    synopsis: 'In a rain-slicked mega-city powered by rogue quantum algorithms, an ex-cybernetic detective discovers a hidden frequency capable of overwriting human consciousness before a planetary eclipse.',
    posterUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    trailerYoutubeId: '8qB8EGNOtr8',
    genres: ['Sci-Fi', 'Cyberpunk', 'Thriller', 'Action'],
    durationMinutes: 142,
    releaseDate: '2025-05-18',
    ageRating: 'R',
    imdbRating: 8.8,
    rottenTomatoesScore: 96,
    director: 'Kavita Chen',
    cast: [
      { name: 'Kenji Sato', character: 'Detective Ren', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
      { name: 'Aria Vance', character: 'Nyx Quantum', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
      { name: 'Michael Thorne', character: 'Archon Vale', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['IMAX 3D', '4DX', 'Dolby Cinema', 'ScreenX'],
    status: 'now_showing',
    featuredHero: true,
    languages: ['English', 'Japanese (Subtitled)'],
    reviews: [
      {
        id: 'rev-3',
        author: 'Liam O\'Connor',
        rating: 5,
        date: '2 days ago',
        comment: 'Mind-bending visual effects! 4DX motion seats made the flying hovercar chase feel 100% real.',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80'
      }
    ]
  },
  {
    id: 'interstellar-anniversary',
    title: 'Interstellar: 10th Anniversary IMAX',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    synopsis: 'A team of explorers travel through a newly discovered wormhole in an attempt to ensure humanity\'s survival as blight ravages Earth. Experience Christopher Nolan\'s timeless space epic remastered in full 70mm IMAX.',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=80',
    trailerYoutubeId: 'zSWdZVtXT7E',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    durationMinutes: 169,
    releaseDate: '2024-09-27',
    ageRating: 'PG-13',
    imdbRating: 8.7,
    rottenTomatoesScore: 88,
    director: 'Christopher Nolan',
    cast: [
      { name: 'Matthew McConaughey', character: 'Cooper', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      { name: 'Anne Hathaway', character: 'Brand', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
      { name: 'Jessica Chastain', character: 'Murph', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['IMAX 3D', 'Dolby Cinema', 'VIP Recliner'],
    status: 'now_showing',
    featuredHero: true,
    languages: ['English'],
    reviews: [
      {
        id: 'rev-4',
        author: 'Sarah Jenkins',
        rating: 5,
        date: 'Today',
        comment: 'Crying in the theater again after 10 years. The docking scene with organ music never gets old.',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
      }
    ]
  },
  {
    id: 'gladiator-2',
    title: 'Gladiator II',
    tagline: 'What we do in life echoes in eternity.',
    synopsis: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
    posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1920&q=80',
    trailerYoutubeId: '4rgYUipGJNo',
    genres: ['Action', 'Adventure', 'Drama', 'History'],
    durationMinutes: 148,
    releaseDate: '2024-11-22',
    ageRating: 'R',
    imdbRating: 7.8,
    rottenTomatoesScore: 82,
    director: 'Ridley Scott',
    cast: [
      { name: 'Paul Mescal', character: 'Lucius', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      { name: 'Pedro Pascal', character: 'General Acacius', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      { name: 'Denzel Washington', character: 'Macrinus', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['Dolby Cinema', 'IMAX 3D', 'VIP Recliner', 'Standard 2D'],
    status: 'now_showing',
    languages: ['English'],
    reviews: []
  },
  {
    id: 'alien-romulus',
    title: 'Alien: Romulus',
    tagline: 'In space, no one can hear you scream.',
    synopsis: 'While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.',
    posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
    trailerYoutubeId: 'x0XDEhP4-Gg',
    genres: ['Horror', 'Sci-Fi', 'Thriller'],
    durationMinutes: 119,
    releaseDate: '2024-08-16',
    ageRating: 'R',
    imdbRating: 7.9,
    rottenTomatoesScore: 87,
    director: 'Fede Álvarez',
    cast: [
      { name: 'Cailee Spaeny', character: 'Rain', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      { name: 'David Jonsson', character: 'Andy', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['Dolby Cinema', '4DX', 'Standard 2D'],
    status: 'now_showing',
    languages: ['English'],
    reviews: []
  },
  {
    id: 'spider-verse-beyond',
    title: 'Spider-Man: Beyond the Spider-Verse',
    tagline: 'Every universe has a destiny. Choose yours.',
    synopsis: 'Miles Morales traverses the endless multiverse to break a canon event and rescue his loved ones against the multiversal Spot and Spider-Society.',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1920&q=80',
    trailerYoutubeId: 'cqGjhVJWtEg',
    genres: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    durationMinutes: 140,
    releaseDate: '2025-06-15',
    ageRating: 'PG',
    imdbRating: 9.1,
    rottenTomatoesScore: 98,
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: [
      { name: 'Shameik Moore', character: 'Miles Morales (voice)', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
      { name: 'Hailee Steinfeld', character: 'Gwen Stacy (voice)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['IMAX 3D', 'Dolby Cinema', '4DX', 'Standard 2D'],
    status: 'coming_soon',
    languages: ['English', 'Spanish'],
    reviews: []
  },
  {
    id: 'avatar-fire-ash',
    title: 'Avatar: Fire and Ash',
    tagline: 'Return to Pandora. Discover the Ash People.',
    synopsis: 'Jake Sully and Neytiri encounter a new, volatile clan of Na\'vi known as the Ash People who dwell in the volcanic regions of Pandora, testing the fragile peace of the world.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    trailerYoutubeId: 'd9MyW72ELq0',
    genres: ['Action', 'Adventure', 'Sci-Fi', 'Fantasy'],
    durationMinutes: 185,
    releaseDate: '2025-12-19',
    ageRating: 'PG-13',
    imdbRating: 8.9,
    rottenTomatoesScore: 91,
    director: 'James Cameron',
    cast: [
      { name: 'Sam Worthington', character: 'Jake Sully', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      { name: 'Zoe Saldana', character: 'Neytiri', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['IMAX 3D', 'Dolby Cinema', 'ScreenX', 'VIP Recliner'],
    status: 'coming_soon',
    languages: ['English', 'Na\'vi'],
    reviews: []
  },
  {
    id: 'inside-out-2',
    title: 'Inside Out 2',
    tagline: 'Make room for new emotions.',
    synopsis: 'Joy, Sadness, Anger, Fear and Disgust find themselves joined by a whole new set of emotions as Riley enters teenage years, led by the frenetic Anxiety.',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    trailerYoutubeId: 'LEjhY15eCx0',
    genres: ['Animation', 'Comedy', 'Family', 'Fantasy'],
    durationMinutes: 96,
    releaseDate: '2024-06-14',
    ageRating: 'PG',
    imdbRating: 8.0,
    rottenTomatoesScore: 91,
    director: 'Kelsey Mann',
    cast: [
      { name: 'Amy Poehler', character: 'Joy (voice)', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
      { name: 'Maya Hawke', character: 'Anxiety (voice)', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' }
    ],
    formats: ['Standard 2D', 'Dolby Cinema', 'VIP Recliner'],
    status: 'now_showing',
    languages: ['English'],
    reviews: []
  }
];

export const CONCESSIONS: ConcessionItem[] = [
  {
    id: 'combo-megastar',
    name: 'CineVerse Mega Star Combo',
    category: 'Combos',
    price: 18.50,
    description: '1 Jumbo Warm Butter Popcorn + 2 Large Fountain Sodas + 1 Choice of Candy (M&Ms or Sour Patch Kids)',
    imageUrl: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?auto=format&fit=crop&w=500&q=80',
    calories: '1,420 kcal',
    isPopular: true,
    badge: 'Best Value • Save $6'
  },
  {
    id: 'combo-duo-deluxe',
    name: 'Couples Deluxe Date Combo',
    category: 'Combos',
    price: 24.00,
    description: '1 Large Gourmet Popcorn (Caramel or Truffle) + 2 Artisanal ICEE Slushies + Warm Nachos with Jalapeño Cheese Dip',
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=500&q=80',
    calories: '1,890 kcal',
    isPopular: true,
    badge: 'Popular for Two'
  },
  {
    id: 'popcorn-truffle',
    name: 'Black Truffle & Parmesan Popcorn',
    category: 'Popcorn',
    price: 11.50,
    description: 'Freshly popped warm artisan corn drizzled with organic white truffle oil and dusted with aged Reggiano parmesan.',
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=500&q=80',
    calories: '680 kcal',
    isPopular: true,
    badge: 'Chef Special'
  },
  {
    id: 'popcorn-caramel',
    name: 'Golden Caramel Crunch Popcorn',
    category: 'Popcorn',
    price: 9.75,
    description: 'Handcrafted kettle-cooked popcorn glazed in velvety salted sea salt caramel.',
    imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=500&q=80',
    calories: '750 kcal',
    isVegan: true
  },
  {
    id: 'popcorn-classic-butter',
    name: 'Classic Golden Butter Popcorn (Large)',
    category: 'Popcorn',
    price: 8.50,
    description: 'Traditional movie theater popcorn with real melted creamery butter and seasoned cinema salt.',
    imageUrl: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?auto=format&fit=crop&w=500&q=80',
    calories: '620 kcal'
  },
  {
    id: 'snack-nachos-supreme',
    name: 'Ultimate Loaded Nachos Supreme',
    category: 'Snacks',
    price: 12.00,
    description: 'Crispy stone-ground tortilla chips with warm spiced queso cheese, fresh guacamole, jalapeños, and smoky salsa.',
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=500&q=80',
    calories: '940 kcal',
    isPopular: true
  },
  {
    id: 'snack-hotdog-artisan',
    name: 'Gourmet Angus Beef Cinema Dog',
    category: 'Snacks',
    price: 10.50,
    description: '1/4 lb grilled Angus beef frank on a toasted brioche bun with caramelized onions, relish, and Dijon mustard.',
    imageUrl: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=500&q=80',
    calories: '540 kcal'
  },
  {
    id: 'snack-pretzel-bites',
    name: 'Bavarian Soft Pretzel Bites',
    category: 'Snacks',
    price: 9.00,
    description: 'Warm salted pretzel nuggets served with hot beer cheese dip and sweet cinnamon sugar glaze.',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
    calories: '510 kcal',
    isVegan: false
  },
  {
    id: 'bev-icee-cherry',
    name: 'Wild Cherry ICEE Slushie (XL)',
    category: 'Beverages',
    price: 7.25,
    description: 'Sub-zero frozen cherry sensation in a collectible CineVerse insulated cup.',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80',
    calories: '260 kcal',
    isVegan: true,
    isPopular: true
  },
  {
    id: 'bev-craft-soda',
    name: 'Cinema Fountain Soda (Large Refillable)',
    category: 'Beverages',
    price: 6.50,
    description: 'Coca-Cola Freestyle with over 100 flavor blends + 1 Free In-Theater Refill.',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80',
    calories: '210 kcal'
  },
  {
    id: 'sweet-churros',
    name: 'Cinnamon Sugar Churro Loops',
    category: 'Sweets',
    price: 8.25,
    description: 'Warm crispy Spanish pastry loops dusted with Mexican cinnamon sugar, served with Belgian dark chocolate dip.',
    imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80',
    calories: '490 kcal'
  },
  {
    id: 'sweet-candy-box',
    name: 'Movie Night Candy Theater Box',
    category: 'Sweets',
    price: 5.50,
    description: 'Choose between M&M Peanut, Sour Patch Kids, Red Vines, or Reese\'s Pieces.',
    imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=500&q=80',
    calories: '380 kcal'
  }
];

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'CINEPASS20',
    discountPercentage: 20,
    description: '20% off your entire booking!'
  },
  {
    code: 'POPCORN50',
    discountPercentage: 15,
    description: '15% instant discount on tickets and snack bundles'
  },
  {
    code: 'FIRSTTICKET',
    discountFlat: 10,
    discountPercentage: 0,
    minAmount: 30,
    description: '$10 OFF on orders over $30 for new cinema goers'
  },
  {
    code: 'VIPWEEKEND',
    discountPercentage: 25,
    description: '25% VIP Weekend screening discount'
  }
];

// Helper to generate dynamic showtimes for dates
export function generateShowtimesForMovie(movieId: string, cinemaId: string): Showtime[] {
  const dates = [
    getDateOffset(0), // Today
    getDateOffset(1), // Tomorrow
    getDateOffset(2), // Day +2
    getDateOffset(3), // Day +3
  ];

  const formats: { exp: Showtime['experience']; hall: string; times: string[]; pStd: number; pPrem: number; pVip: number }[] = [
    {
      exp: 'IMAX 3D',
      hall: 'IMAX Auditorium 1 (Laser 70mm)',
      times: ['11:00', '14:15', '17:45', '21:15', '23:50'],
      pStd: 21.50,
      pPrem: 26.50,
      pVip: 34.00
    },
    {
      exp: 'Dolby Cinema',
      hall: 'Dolby Screen 2 (Atmos)',
      times: ['12:30', '15:45', '19:00', '22:15'],
      pStd: 18.50,
      pPrem: 23.50,
      pVip: 29.50
    },
    {
      exp: 'VIP Recliner',
      hall: 'Lounge Hall 3 (Heated Loungers)',
      times: ['13:00', '16:30', '20:00'],
      pStd: 22.00,
      pPrem: 27.00,
      pVip: 36.00
    },
    {
      exp: 'Standard 2D',
      hall: 'Grand Screen 4',
      times: ['10:30', '13:45', '17:00', '20:30'],
      pStd: 14.50,
      pPrem: 18.50,
      pVip: 24.00
    }
  ];

  const showtimes: Showtime[] = [];

  dates.forEach((dateStr, dIdx) => {
    formats.forEach((fmt, fIdx) => {
      fmt.times.forEach((timeStr, tIdx) => {
        // Pre-fill some randomly realistic booked seats for atmosphere
        const booked = generateRandomBookedSeats(dIdx, tIdx);
        showtimes.push({
          id: `show-${movieId}-${cinemaId}-${dateStr}-${fmt.exp.replace(/\s+/g, '')}-${timeStr.replace(':', '')}`,
          movieId,
          cinemaId,
          hallName: fmt.hall,
          experience: fmt.exp,
          date: dateStr,
          time: timeStr,
          priceStandard: fmt.pStd,
          pricePremium: fmt.pPrem,
          priceVip: fmt.pVip,
          totalSeats: 96,
          availableSeatsCount: 96 - booked.length,
          bookedSeats: booked
        });
      });
    });
  });

  return showtimes;
}

function getDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function generateRandomBookedSeats(seedA: number, seedB: number): string[] {
  const possibleSeats = [
    'D5', 'D6', 'D7', 'D8',
    'E6', 'E7', 'E8', 'E9',
    'F5', 'F6', 'F7', 'F8', 'F9', 'F10',
    'G6', 'G7', 'G8',
    'C4', 'C5', 'H7', 'H8'
  ];
  const count = ((seedA * 3 + seedB * 5 + 4) % 12) + 4;
  return possibleSeats.slice(0, count);
}
