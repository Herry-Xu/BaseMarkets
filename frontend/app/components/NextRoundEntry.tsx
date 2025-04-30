"use client";
import { formatTime, formatPrice } from '@/app/utils/format';
import { Round, PredictionDirection } from '@/app/types/game';

interface NextRoundEntryProps {
  round: Round;
  currentPrice: number;
  timeRemaining: number;
  onPredictionClick: (direction: PredictionDirection) => void;
}

export function NextRoundEntry({ round, currentPrice, timeRemaining, onPredictionClick }: NextRoundEntryProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Next Round #{round.id}</h3>
        <div className="text-sm text-text-secondary">
          Starts in {formatTime(timeRemaining)}
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-card-hover rounded-lg mb-4">
        <span className="text-sm text-text-secondary">Prize Pool</span>
        <span className="font-mono font-medium">${formatPrice(round.prizePool)}</span>
      </div>

      <div className="space-y-3">
        <h3 className="text-center text-text-secondary text-sm font-medium">
          Enter Your Prediction
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onPredictionClick('up')}
            className="group relative overflow-hidden"
          >
            <div className="p-4 rounded-xl border-2 border-success/20 bg-success/5 hover:bg-success/10 transition-colors">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="text-lg font-bold text-success">UP</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-success/80">
                  <span className="font-mono font-bold">{round.upPayout}x</span>
                  <span>Payout</span>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => onPredictionClick('down')}
            className="group relative overflow-hidden"
          >
            <div className="p-4 rounded-xl border-2 border-warning/20 bg-warning/5 hover:bg-warning/10 transition-colors">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span className="text-lg font-bold text-warning">DOWN</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-warning/80">
                  <span className="font-mono font-bold">{round.downPayout}x</span>
                  <span>Payout</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 