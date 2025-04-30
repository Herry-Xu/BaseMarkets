'use client';
import React from 'react';
import { Modal } from '../ui/Modal';
import { useGameState } from '@/app/hooks/useGameState';
import { formatPrice, formatBTC } from '@/app/utils/format';
import { PriceChange } from '../PriceChange';
import { useState } from 'react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  const roundResults = useGameState((state) => state.roundResults);
  const userPredictions = useGameState((state) => state.userPredictions);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="History">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-card-hover rounded-lg">
          <button 
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-2 px-4 rounded-md font-medium relative
              ${activeTab === 'my' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            My History
            {activeTab === 'my' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-md font-medium relative
              ${activeTab === 'all' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            All Rounds
            {activeTab === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* History List */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {userPredictions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">No History Yet</h3>
              <p className="text-text-secondary max-w-sm">
                Make your first prediction to start building your trading history!
              </p>
            </div>
          ) : (
            userPredictions.map((prediction) => {
              const round = roundResults[prediction.roundId];
              if (!round) return null;

              return (
                <div key={`${prediction.roundId}-${prediction.position}`} className="bg-card-hover p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-sm text-text-secondary">Round #{prediction.roundId}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`font-medium ${
                          prediction.position === 'up' ? 'text-success' : 'text-warning'
                        }`}>
                          {prediction.position.toUpperCase()}
                        </span>
                        <span className="text-text-secondary">@</span>
                        <span className="font-mono">{formatPrice(round.startPrice)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <PriceChange 
                        change={round.endPrice - round.startPrice}
                        basePrice={round.startPrice}
                      />
                      <div className="text-sm text-text-secondary mt-1">
                        {formatBTC(prediction.amount)} BTC
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className={`text-sm font-medium ${
                      prediction.status === 'won' ? 'text-success' :
                      prediction.status === 'lost' ? 'text-warning' :
                      'text-text-secondary'
                    }`}>
                      {prediction.status === 'won' ? '+' : ''}{prediction.payout || 0} BTC
                    </div>
                    {prediction.status === 'won' && !prediction.claimed && (
                      <button className="px-3 py-1 bg-success text-white text-sm rounded-lg hover:opacity-90 transition-opacity">
                        Claim
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}