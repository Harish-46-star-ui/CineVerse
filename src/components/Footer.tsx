import React, { useState } from 'react';
import { 
  Film, 
  Mail, 
  Send, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Heart,
  Check
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    soundFx.playSuccess();
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#0F172A] border-t border-slate-800 text-slate-400 text-xs">
      {/* Newsletter Strip */}
      <div className="border-b border-slate-800 py-10 bg-slate-900/60">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Get Weekly Cinema Premieres & Secret Deals</span>
            </div>
            <p className="text-slate-400 text-xs">
              Subscribe to receive 20% off your next ticket booking and advance IMAX invitations.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-950 border border-slate-700 px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-full sm:w-64"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20 whitespace-nowrap active:scale-95"
            >
              {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-3.5 h-3.5" />}
              <span>{subscribed ? 'Subscribed!' : 'Join VIP'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 lg:px-6 py-12 max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-3 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-900 font-bold">
              <Film className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-white">
              CINE<span className="text-amber-500">VERSE</span>
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            The next-generation cinema ticketing ecosystem. Experience world-class 70mm IMAX, Dolby Vision HDR, and plush Zero-G loungers.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Experiences</h4>
          <ul className="space-y-2 text-slate-400 text-xs">
            <li className="hover:text-amber-400 cursor-pointer">IMAX with Laser 70mm</li>
            <li className="hover:text-amber-400 cursor-pointer">Dolby Cinema & Atmos</li>
            <li className="hover:text-amber-400 cursor-pointer">4DX Extreme Sensory</li>
            <li className="hover:text-amber-400 cursor-pointer">VIP Star Recliners</li>
            <li className="hover:text-amber-400 cursor-pointer">ScreenX 270° Panoramic</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Club & Support</h4>
          <ul className="space-y-2 text-slate-400 text-xs">
            <li className="hover:text-amber-400 cursor-pointer">CineRewards Loyalty</li>
            <li className="hover:text-amber-400 cursor-pointer">Gift Cards & Vouchers</li>
            <li className="hover:text-amber-400 cursor-pointer">100% Refund Guarantee</li>
            <li className="hover:text-amber-400 cursor-pointer">Accessibility & Wheelchair</li>
            <li className="hover:text-amber-400 cursor-pointer">Private Theater Hire</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Food & Bar</h4>
          <ul className="space-y-2 text-slate-400 text-xs">
            <li className="hover:text-amber-400 cursor-pointer">Artisan Kettle Popcorn</li>
            <li className="hover:text-amber-400 cursor-pointer">In-Seat Lounge Dining</li>
            <li className="hover:text-amber-400 cursor-pointer">Craft Beers & Cocktails</li>
            <li className="hover:text-amber-400 cursor-pointer">Vegan & Gluten-Free Menu</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 py-6 text-center text-slate-500 text-[11px]">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} CineVerse Entertainment Inc. All rights reserved.</span>
          <span className="flex items-center gap-1 text-slate-500">
            Crafted for true cinema lovers with Dolby precision
          </span>
        </div>
      </div>
    </footer>
  );
};
