"use client";
import { motion } from 'framer-motion';
import { formatPrice } from '@/app/utils/format';
import { PriceChange } from './PriceChange';
import { Market } from '@/app/types/game';

interface TopBarProps {
  currentPrice: number;
  priceChange: number;
  selectedMarket: Market;
  onMarketChange: (market: Market) => void;
  onOpenHistory: () => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export function TopBar({ 
  currentPrice, 
  priceChange, 
  selectedMarket,
  onMarketChange,
  onOpenHistory,
  onOpenLeaderboard,
  onOpenSettings,
  onOpenHelp
}: TopBarProps) {
  return (
    <div className="glass p-3 rounded-2xl flex items-center justify-between">
      {/* Market & Price Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F7931A] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">₿</span>
          </div>
          <span className="font-medium">BTC/USD</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg">${formatPrice(currentPrice)}</span>
          <PriceChange 
            change={priceChange}
            basePrice={currentPrice - priceChange}
            showPercentage
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onOpenHelp()}
          className="p-2 hover:bg-card-hover rounded-lg transition-colors"
          aria-label="Help"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button
          onClick={() => onOpenHistory()}
          className="p-2 hover:bg-card-hover rounded-lg transition-colors"
          aria-label="History"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button
          onClick={() => onOpenLeaderboard()}
          className="p-2 hover:bg-card-hover rounded-lg transition-colors"
          aria-label="Leaderboard"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          onClick={() => onOpenSettings()}
          className="p-2 hover:bg-card-hover rounded-lg transition-colors"
          aria-label="Settings"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
} 