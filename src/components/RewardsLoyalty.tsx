import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Gift, 
  Check, 
  Percent, 
  Popcorn, 
  ShieldCheck, 
  Crown, 
  Coffee, 
  Zap,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../types';
import { soundFx } from '../utils/audio';

interface RewardsLoyaltyProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const RewardsLoyalty: React.FC<RewardsLoyaltyProps> = ({
  userProfile,
  onUpdateProfile
}) => {
  const [claimedVouchers, setClaimedVouchers] = useState<string[]>([]);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const rewards = [
    {
      id: 'rw-popcorn',
      name: 'Free Jumbo Butter Popcorn',
      pointsCost: 150,
      icon: Popcorn,
      desc: 'Complimentary warm artisan kettle popcorn on your next booking.'
    },
    {
      id: 'rw-ticket-10',
      name: '$10 CinePass Box Office Voucher',
      pointsCost: 200,
      icon: Gift,
      desc: 'Instant $10 discount applied at checkout.'
    },
    {
      id: 'rw-glasses',
      name: 'Pair of Laser 3D RealD Glasses',
      pointsCost: 80,
      icon: Zap,
      desc: 'Zero-cost collectible 3D glasses for IMAX 3D showings.'
    },
    {
      id: 'rw-upgrade',
      name: 'Free VIP Recliner Seat Upgrade',
      pointsCost: 300,
      icon: Crown,
      desc: 'Upgrade standard ticket to Zero-G heated leather lounger.'
    }
  ];

  const handleClaim = (reward: typeof rewards[0]) => {
    if (userProfile.cinePoints < reward.pointsCost) {
      alert(`You need ${reward.pointsCost} points for this perk (Current: ${userProfile.cinePoints} pts).`);
      return;
    }

    soundFx.playSuccess();
    const updated = {
      ...userProfile,
      cinePoints: userProfile.cinePoints - reward.pointsCost
    };
    onUpdateProfile(updated);
    setClaimedVouchers(prev => [...prev, reward.id]);
    setActiveMessage(`Success! Voucher for "${reward.name}" added to your account wallet.`);
    setTimeout(() => setActiveMessage(null), 3500);
  };

  const nextTierPoints = 1000;
  const progressPercent = Math.min(100, Math.round((userProfile.cinePoints / nextTierPoints) * 100));

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8 max-w-5xl space-y-8 animate-in fade-in">
      
      {/* Top Membership Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-amber-700 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-amber-400/40">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/60 text-amber-300 border border-amber-400/50 backdrop-blur-md flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                {userProfile.tier} VIP MEMBER
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">{userProfile.name}</h2>
            <p className="text-xs sm:text-sm text-amber-100/80 font-mono">Member ID: CV-9824-GOLD</p>
          </div>

          {/* Points Display */}
          <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-amber-400/40 text-center sm:text-right space-y-1 min-w-[180px]">
            <div className="text-[11px] uppercase font-bold text-amber-300">Available Balance</div>
            <div className="text-3xl font-bold text-amber-400">{userProfile.cinePoints}</div>
            <div className="text-[10px] text-slate-300">CinePoints (~${((userProfile.cinePoints / 100) * 5).toFixed(2)} Value)</div>
          </div>
        </div>

        {/* Progress Bar to Platinum Tier */}
        <div className="mt-6 pt-4 border-t border-white/20 space-y-2 relative z-10">
          <div className="flex justify-between text-xs text-amber-100 font-semibold">
            <span>Progress to Platinum VIP ({userProfile.cinePoints} / {nextTierPoints} pts)</span>
            <span>{1000 - userProfile.cinePoints} pts needed</span>
          </div>
          <div className="w-full h-3 bg-slate-900/50 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-amber-200 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Alert toast */}
      {activeMessage && (
        <div className="p-4 rounded-2xl bg-[#1E293B] border border-amber-500/50 text-amber-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>{activeMessage}</span>
        </div>
      )}

      {/* Tier Perks Matrix */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>{userProfile.tier} Member Exclusive Privileges</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Earn 10% Points Back', desc: '1 CinePoint per $1 spent on tickets & snacks' },
            { title: 'Free Soda Refills', desc: 'Unlimited refills on Large Fountain drinks' },
            { title: 'Zero Online Booking Fees', desc: 'Save $2.50 on every single ticket purchase' },
            { title: 'Advance IMAX Screenings', desc: '48h early reservation window before public' },
          ].map((perk, i) => (
            <div key={i} className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700 space-y-1">
              <div className="text-amber-400 text-xs font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-500" />
                <span>{perk.title}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Redeemable Rewards Catalogue */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-500" />
          <span>Redeem Your Points</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rewards.map(r => {
            const Icon = r.icon;
            const isClaimed = claimedVouchers.includes(r.id);
            const canAfford = userProfile.cinePoints >= r.pointsCost;

            return (
              <div
                key={r.id}
                className="bg-[#1E293B] border border-slate-700 rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{r.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{r.desc}</p>
                    <div className="text-xs font-bold text-amber-400 mt-2">
                      {r.pointsCost} CinePoints
                    </div>
                  </div>
                </div>

                <button
                  disabled={isClaimed || !canAfford}
                  onClick={() => handleClaim(r)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isClaimed
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-md shadow-amber-500/20 active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  {isClaimed ? '✓ VOUCHER CLAIMED' : canAfford ? 'REDEEM NOW' : 'NOT ENOUGH POINTS'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
