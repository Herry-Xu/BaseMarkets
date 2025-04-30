"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { formatPrice } from '@/app/utils/format';

interface PriceTickerProps {
  price: number;
  change: number;
}

export function PriceTicker({ price, change }: PriceTickerProps) {
  const changePercent = (change / (price - change)) * 100;
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass px-4 py-2 rounded-xl flex items-center gap-4"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#F7931A] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">₿</span>
        </div>
        <span className="font-medium">BTC/USD</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono">${formatPrice(price)}</span>
        <span className={`text-sm ${isPositive ? 'text-success' : 'text-warning'}`}>
          {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
        </span>
      </div>
    </motion.div>
  );
} 