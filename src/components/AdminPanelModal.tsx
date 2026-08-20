import React, { useState } from 'react';
import { 
  X, 
  BarChart3, 
  Users, 
  DollarSign, 
  Ticket, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Tag
} from 'lucide-react';
import { BookingRecord } from '../types';
import { soundFx } from '../utils/audio';

interface AdminPanelModalProps {
  bookings: BookingRecord[];
  onClose: () => void;
  onResetData: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  bookings,
  onClose,
  onResetData
}) => {
  const totalRevenue = bookings.reduce((sum, b) => b.status !== 'cancelled' ? sum + b.pricing.totalAmount : sum, 0);
  const totalTickets = bookings.reduce((sum, b) => b.status !== 'cancelled' ? sum + b.seats.length : sum, 0);
  const averageTicketPrice = totalTickets > 0 ? totalRevenue / totalTickets : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Theater Operations & Analytics</h2>
              <p className="text-xs text-slate-400">Live box office gross, occupancy, and system controls</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>Gross Box Office</span>
            </div>
            <div className="text-xl font-bold text-amber-400">${totalRevenue.toFixed(2)}</div>
          </div>

          <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              <span>Tickets Issued</span>
            </div>
            <div className="text-xl font-bold text-white">{totalTickets}</div>
          </div>

          <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
              <Users className="w-3.5 h-3.5 text-slate-300" />
              <span>Avg Basket Size</span>
            </div>
            <div className="text-xl font-bold text-amber-400">${averageTicketPrice.toFixed(2)}</div>
          </div>
        </div>

        {/* Promo codes active */}
        <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700 space-y-2">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-amber-500" />
            <span>Active Promotion Coupons</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            {['CINEPASS20 (-20%)', 'POPCORN50 (-15%)', 'FIRSTTICKET (-$10)', 'VIPWEEKEND (-25%)'].map(c => (
              <div key={c} className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 text-center font-bold">
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* System reset */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-700">
          <div className="text-xs text-slate-400">
            Reset demo data to default sample tickets & points:
          </div>
          <button
            onClick={() => {
              if (confirm('Reset demo bookings to initial state?')) {
                soundFx.playClick();
                onResetData();
                onClose();
              }
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
