"use client";
import { Round } from '@/app/types/game';
import { formatPrice, formatUSDC } from '@/app/utils/format';
import { motion } from 'framer-motion';

interface PreviousRoundsProps {
  rounds: Round[];
}

export function PreviousRounds({ rounds }: PreviousRoundsProps) {
  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">Previous Rounds</h3>
      <div className="grid grid-cols-2 gap-4">
        {rounds.map((round) => {
          const priceChange = (round.endPrice || 0) - round.startPrice;
          const isUp = priceChange >= 0;

          return (
            <motion.div
              key={round.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card-hover/50 border border-border-light p-4 rounded-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-text-secondary">Round #{round.id}</span>
                <div className={`px-2 py-0.5 text-xs font-medium rounded-lg ${
                  isUp ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}>
                  {isUp ? 'UP' : 'DOWN'}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="font-mono">
                  <span className="text-text-secondary">$</span>
                  {formatPrice(round.startPrice)}
                  <span className="text-text-secondary mx-1.5">→</span>
                  <span className={isUp ? 'text-success' : 'text-warning'}>
                    ${formatPrice(round.endPrice || 0)}
                  </span>
                </div>
                <span className="text-text-secondary text-xs">
                  {formatUSDC(round.prizePool)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 