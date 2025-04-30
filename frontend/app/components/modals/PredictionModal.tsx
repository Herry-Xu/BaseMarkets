"use client";
import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { formatUSDC, formatPrice } from '@/app/utils/format';
import { useGameState } from '@/app/hooks/useGameState';
import { toast } from 'sonner';

export interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  direction: 'up' | 'down';
  currentPrice: number;
  payout: number;
  onConfirm: (amount: number) => void;
}

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 1000;
const PRESET_AMOUNTS = [50, 100, 500, 1000];

export function PredictionModal({
  isOpen,
  onClose,
  direction,
  currentPrice,
  payout,
  onConfirm
}: PredictionModalProps): React.ReactElement {
  const [amount, setAmount] = useState<number>(10);
  const userBalance = useGameState((state) => state.userBalance);
  const potentialWin = amount * payout;

  const validateAmount = (value: number): string | null => {
    if (isNaN(value)) return 'Please enter a valid number';
    if (value < MIN_AMOUNT) return `Minimum amount is ${formatUSDC(MIN_AMOUNT)}`;
    if (value > MAX_AMOUNT) return `Maximum amount is ${formatUSDC(MAX_AMOUNT)}`;
    if (value > userBalance) return 'Insufficient balance';
    return null;
  };

  const handlePresetClick = (preset: number) => {
    if (preset <= userBalance) {
      setAmount(preset);
    } else {
      toast.error('Insufficient balance');
    }
  };

  const handleConfirm = (): void => {
    const error = validateAmount(amount);
    if (error) {
      toast.error(error);
      return;
    }
    onConfirm(amount);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={`Place ${direction.toUpperCase()} Prediction`}
    >
      <div className="p-6 space-y-6">
        <div className="bg-card-hover rounded-xl p-4">
          <div className="text-text-secondary mb-2">Current Price</div>
          <div className="text-xl font-bold">{formatPrice(currentPrice)}</div>
        </div>
        
        <div className="bg-card-hover rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <label className="text-text-secondary">Amount</label>
            <span className="text-text-secondary">Balance: {formatUSDC(userBalance)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className={`bg-transparent border rounded-lg p-2 w-full focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                validateAmount(amount) 
                  ? 'border-warning text-warning' 
                  : 'border-border-light focus:border-primary'
              }`}
              placeholder="Enter amount"
            />
            <span className="text-text-secondary">USDC</span>
          </div>

          <div className={`text-xs mt-2 ${validateAmount(amount) ? 'text-warning' : 'text-text-secondary'}`}>
            {validateAmount(amount) || `Min: ${formatUSDC(MIN_AMOUNT)} • Max: ${formatUSDC(MAX_AMOUNT)}`}
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetClick(preset)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                  amount === preset 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-text-secondary hover:border-border-light'
                  }
                  ${preset > userBalance ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {formatUSDC(preset)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-card-hover rounded-xl p-4">
          <div className="text-text-secondary mb-2">Potential Win</div>
          <div className="text-xl font-bold text-success">{formatUSDC(potentialWin)}</div>
          <div className="text-text-secondary text-sm">
            {payout}x payout
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-card-hover hover:bg-card text-text-primary font-bold py-3 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!!validateAmount(amount)}
            className={`flex-1 font-bold py-3 rounded-xl transition-all ${
              direction === 'up' 
                ? 'bg-success hover:opacity-90 text-white' 
                : 'bg-warning hover:opacity-90 text-white'
            } ${validateAmount(amount) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
} 