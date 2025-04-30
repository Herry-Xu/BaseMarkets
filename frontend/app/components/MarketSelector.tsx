"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Market } from '@/app/types/game';

interface MarketSelectorProps {
  selectedMarket: Market;
  onMarketChange: (market: Market) => void;
}

const markets: Market[] = [
  {
    id: 'btc-usd',
    name: 'Bitcoin',
    symbol: 'BTC/USD',
    icon: '₿',
    active: true
  },
  {
    id: 'eth-usd',
    name: 'Ethereum',
    symbol: 'ETH/USD',
    icon: 'Ξ',
    active: false
  },
  {
    id: 'sol-usd',
    name: 'Solana',
    symbol: 'SOL/USD',
    icon: '◎',
    active: false
  }
];

export function MarketSelector({ selectedMarket, onMarketChange }: MarketSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card-hover rounded-xl hover:bg-card transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
          <span className="text-white font-bold">{selectedMarket.icon}</span>
        </div>
        <span className="font-medium">{selectedMarket.symbol}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="w-5 h-5 text-text-secondary"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-border-light z-50"
          >
            {markets.map((market) => (
              <button
                key={market.id}
                onClick={() => {
                  if (market.active) {
                    onMarketChange(market);
                    setIsOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-card-hover transition-colors ${
                  !market.active ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold">{market.icon}</span>
                </div>
                <div className="text-left">
                  <div className="font-medium">{market.symbol}</div>
                  <div className="text-sm text-text-secondary">{market.name}</div>
                </div>
                {!market.active && (
                  <span className="ml-auto text-xs font-medium text-text-secondary">
                    Coming Soon
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 