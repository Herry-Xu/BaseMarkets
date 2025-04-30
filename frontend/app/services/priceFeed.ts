"use client";
import { useEffect } from 'react';
import { useGameState } from '@/app/hooks/useGameState';

const VOLATILITY = 0.0002; // 0.02% volatility per update
const UPDATE_INTERVAL = 1000; // 1 second updates

export function usePriceFeed() {
  const updatePrice = useGameState((state) => state.updatePrice);
  const currentPrice = useGameState((state) => state.currentPrice);

  useEffect(() => {
    const generateNewPrice = () => {
      const change = (Math.random() - 0.5) * 2 * VOLATILITY;
      const newPrice = currentPrice * (1 + change);
      updatePrice(newPrice);
    };

    const interval = setInterval(generateNewPrice, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [currentPrice, updatePrice]);
} 