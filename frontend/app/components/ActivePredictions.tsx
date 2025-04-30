"use client";
import { useGameState } from '@/app/hooks/useGameState';
import { formatUSDC, formatPrice } from '@/app/utils/format';
import { motion } from 'framer-motion';
import { PriceChange } from './PriceChange';

export function ActivePredictions() {
  const { userPredictions, roundResults, currentPrice } = useGameState();
  const activePredictions = userPredictions.filter(p => p.status === 'pending');

  if (activePredictions.length === 0) {
    return (
      <div className="glass p-8 rounded-2xl text-center">
        <div className="w-16 h-16 bg-card-hover rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">No Active Predictions</h3>
        <p className="text-text-secondary">
          Make your first prediction to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activePredictions.map((prediction) => {
        const result = roundResults[prediction.roundId];
        const startPrice = result?.startPrice || currentPrice;
        const currentPriceChange = currentPrice - startPrice;

        return (
          <motion.div
            key={`${prediction.roundId}-${prediction.position}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-text-secondary mb-1">Round #{prediction.roundId}</div>
                <div className="flex items-center gap-2">
                  <span className={prediction.position === 'up' ? 'text-success' : 'text-warning'}>
                    {prediction.position.toUpperCase()}
                  </span>
                  <span className="text-text-secondary">@</span>
                  <span className="font-mono">{formatPrice(startPrice)}</span>
                </div>
              </div>
              <div className="text-right">
                <PriceChange 
                  change={currentPriceChange}
                  basePrice={startPrice}
                  showPercentage
                />
                <div className="text-sm text-text-secondary mt-1">
                  {formatUSDC(prediction.amount)} USDC
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-card-hover rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${prediction.position === 'up' ? 'bg-success' : 'bg-warning'}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max((currentPriceChange / startPrice) * 100, 0)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Potential Win */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-text-secondary">Potential Win</div>
              <div className="font-mono text-success">
                {formatUSDC(prediction.amount * 2)} {/* Assuming 2x payout */}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
} 