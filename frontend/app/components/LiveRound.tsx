"use client";
import { motion } from 'framer-motion';
import { Round } from '@/app/types/game';
import { formatPrice, formatTime, formatUSDC } from '@/app/utils/format';
import { PriceChange } from './PriceChange';
import { useGameState } from '@/app/hooks/useGameState';

interface LiveRoundProps {
  round: Round;
  currentPrice: number;
  timeRemaining: number;
  className?: string;
}

export function LiveRound({ round, currentPrice, timeRemaining, className = '' }: LiveRoundProps) {
  const userPredictions = useGameState(state => state.userPredictions);
  const activePrediction = userPredictions.find(p => p.roundId === round.id && p.status === 'pending');
  const priceChange = currentPrice - round.startPrice;
  const isUp = priceChange >= 0;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Live Round #{round.id}</h3>
          <div className="w-2 h-2 rounded-full bg-live animate-pulse" />
        </div>
        <div className="text-sm text-text-secondary">
          Ends in {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Price Display */}
      <div className={`p-4 rounded-xl ${isUp ? 'bg-success/5' : 'bg-warning/5'} mb-4`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">Current Price</span>
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={isUp ? 'up' : 'down'}
              className={`text-sm font-medium ${isUp ? 'text-success' : 'text-warning'}`}
            >
              {isUp ? '↑ Rising' : '↓ Falling'}
            </motion.div>
          </div>
        </div>
        <div className="flex items-end gap-3">
          <div className={`text-2xl font-mono font-bold ${isUp ? 'text-success' : 'text-warning'}`}>
            ${formatPrice(currentPrice)}
          </div>
          <PriceChange 
            change={priceChange}
            basePrice={round.startPrice}
            showPercentage
          />
        </div>
      </div>

      {/* Start Price Reference */}
      <div className="flex items-center justify-between p-3 bg-card-hover rounded-lg mb-4">
        <span className="text-sm text-text-secondary">Start Price</span>
        <span className="font-mono font-medium">${formatPrice(round.startPrice)}</span>
      </div>

      {activePrediction ? (
        // Active Prediction Display
        <div className={`rounded-xl border ${
          activePrediction.position === 'up' 
            ? 'border-success/20 bg-success/5' 
            : 'border-warning/20 bg-warning/5'
        } p-4`}>
          <div className="flex justify-between items-center mb-3">
            <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
              activePrediction.position === 'up' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
            }`}>
              {activePrediction.position === 'up' ? '↑ UP' : '↓ DOWN'}
            </div>
            <span className="font-mono font-bold">{formatUSDC(activePrediction.amount)}</span>
          </div>
          <div className="h-2 bg-card rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${activePrediction.position === 'up' ? 'bg-success' : 'bg-warning'}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max((priceChange / round.startPrice) * 100, 0)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      ) : (
        // No Active Prediction State
        <div className="text-center p-4 bg-card-hover rounded-xl">
          <p className="text-text-secondary">
            No active predictions for this round
          </p>
        </div>
      )}
    </div>
  );
} 