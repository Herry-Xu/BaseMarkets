import { create } from 'zustand';
import { Round } from '@/app/types/game';

export interface PricePoint {
  time: number;
  price: number;
}

interface RoundPricePoint {
  timestamp: number;
  price: number;
}

interface RoundResult {
  startPrice: number;
  endPrice: number;
  result: 'up' | 'down';
  timestamp: number;
  totalPrizePool: number;
  participants: number;
  priceHistory: RoundPricePoint[];
}

interface GameState {
  currentPrice: number;
  lastPrice: number;
  timeRemaining: number;
  rounds: {
    expired: Round[];
    live: Round;
    next: Round;
    later: Round;
  };
  userPredictions: {
    roundId: number;
    position: 'up' | 'down';
    amount: number;
    status: 'won' | 'lost' | 'pending' | 'claimed';
    payout?: number;
    claimed?: boolean;
  }[];
  roundResults: {
    [key: number]: RoundResult;
  };
  userBalance: number;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  priceHistory: PricePoint[];
  notifications: boolean;
  sounds: boolean;
  chartType: 'line' | 'candle';
  // Actions
  placePrediction: (roundId: number, direction: 'up' | 'down', amount: number) => void;
  updatePrice: (price: number) => void;
  updateTime: (time: number) => void;
  rotateRounds: () => void;
  claimPrize: (roundId: number) => void;
  calculateResult: (roundId: number) => void;
  lockRound: (roundId: number) => void;
  updateRoundPrices: (roundId: number, prices: { start?: number; end?: number }) => void;
  addPriceToHistory: (roundId: number, price: number) => void;
  updateBalance: (amount: number) => void;
  setNotifications: (enabled: boolean) => void;
  setSounds: (enabled: boolean) => void;
  setChartType: (type: 'line' | 'candle') => void;
}

const BASE_PRICE = 99211.27;
const ROUND_DURATION = 60 * 1000; // 60 seconds in milliseconds

const createInitialRound = (id: number, status: Round['status'], priceChange?: number): Round => ({
  id,
  status,
  startTime: Date.now(),
  endTime: Date.now() + ROUND_DURATION,
  startPrice: BASE_PRICE,
  endPrice: status === 'expired' ? BASE_PRICE + (priceChange || 98.23) : undefined,
  prizePool: status === 'later' ? 0 : 0.1000,
  upPayout: status === 'later' ? 0 : 2.00,
  downPayout: status === 'later' ? 0 : 2.00,
  totalUpAmount: 0,
  totalDownAmount: 0,
});

export const useGameState = create<GameState>((set, get) => ({
  currentPrice: BASE_PRICE,
  lastPrice: BASE_PRICE + 98.23,
  timeRemaining: ROUND_DURATION,
  rounds: {
    expired: [
      createInitialRound(335673, 'expired', 98.23),
      createInitialRound(335672, 'expired', -45.67),
      createInitialRound(335671, 'expired', 156.89),
      createInitialRound(335670, 'expired', -78.34),
      createInitialRound(335669, 'expired', 234.56),
      createInitialRound(335668, 'expired', -123.45),
      createInitialRound(335667, 'expired', 89.67),
      createInitialRound(335666, 'expired', -167.89),
    ],
    live: createInitialRound(335674, 'live'),
    next: createInitialRound(335675, 'next'),
    later: createInitialRound(335676, 'later'),
  },
  userPredictions: [],
  roundResults: {},
  userBalance: 1000,
  isConnected: false,
  isLoading: false,
  error: null,
  priceHistory: [],
  notifications: true,
  sounds: true,
  chartType: 'line',
  
  placePrediction: (roundId: number, direction: 'up' | 'down', amount: number) => {
    set((state) => {
      try {
        set({ isLoading: true, error: null });
        
        const newBalance = state.userBalance - amount;
        
        return {
          userPredictions: [
            ...state.userPredictions,
            {
              roundId,
              position: direction,
              amount,
              status: 'pending'
            }
          ],
          userBalance: newBalance
        };
      } catch (err) {
        return {
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to place prediction'
        };
      }
    });
  },
    
  updatePrice: (price: number) => 
    set((state) => {
      try {
        const now = Date.now();
        const newPricePoint: PricePoint = {
          time: now,
          price
        };
        
        const cutoffTime = now - 60000;
        const filteredHistory = state.priceHistory
          .filter(point => point.time > cutoffTime);

        return {
          isLoading: false,
          error: null,
          currentPrice: price,
          lastPrice: state.currentPrice,
          priceHistory: [...filteredHistory, newPricePoint]
        };
      } catch (error) {
        console.error('Failed to update price:', error);
        return {
          ...state,
          error: 'Failed to update price'
        };
      }
    }),
    
  updateTime: (time) => 
    set({ timeRemaining: time }),
    
  rotateRounds: () => 
    set((state) => {
      const now = Date.now();
      const liveRound = state.rounds.live;

      // Only rotate if the round has actually ended
      if (now < liveRound.endTime) {
        return state;
      }

      // Create new rounds with proper timing
      const newLiveRound = {
        ...state.rounds.next,
        status: 'live' as const,
        startTime: now,
        endTime: now + ROUND_DURATION,
        startPrice: state.currentPrice
      };

      const newNextRound = {
        id: state.rounds.next.id + 1,
        status: 'next' as const,
        startTime: newLiveRound.endTime,
        endTime: newLiveRound.endTime + ROUND_DURATION,
        startPrice: state.currentPrice,
        prizePool: 0.1,
        upPayout: 2,
        downPayout: 2,
        totalUpAmount: 0,
        totalDownAmount: 0
      };

      // Calculate results and update state
      const result = {
        startPrice: liveRound.startPrice,
        endPrice: state.currentPrice,
        result: state.currentPrice > liveRound.startPrice ? 'up' as const : 'down' as const,
        timestamp: now,
        totalPrizePool: liveRound.prizePool,
        participants: state.userPredictions.filter(p => p.roundId === liveRound.id).length,
        priceHistory: state.roundResults[liveRound.id]?.priceHistory || []
      };

      // Update round results
      const updatedResults = {
        ...state.roundResults,
        [liveRound.id]: result
      };

      // Update predictions and calculate payouts
      let totalPayout = 0;
      const updatedPredictions = state.userPredictions.map(pred => {
        if (pred.roundId !== liveRound.id || pred.status !== 'pending') return pred;

        const isWinner = (pred.position === 'up' && result.result === 'up') ||
                        (pred.position === 'down' && result.result === 'down');

        if (isWinner) {
          const payout = pred.amount * 2;
          totalPayout += payout;
          return { ...pred, status: 'won' as const, payout, claimed: true };
        }

        return { ...pred, status: 'lost' as const };
      });

      // Update user balance with winnings
      const newBalance = state.userBalance + totalPayout;

      // Update rounds
      const updatedRounds = {
        expired: [liveRound, ...state.rounds.expired].slice(0, 50),
        live: newLiveRound,
        next: newNextRound,
        later: {
          ...state.rounds.later,
          id: newNextRound.id + 1
        }
      };

      return {
        rounds: updatedRounds,
        roundResults: updatedResults,
        userPredictions: updatedPredictions,
        userBalance: newBalance,
        priceHistory: [], // Reset price history
        timeRemaining: ROUND_DURATION // Reset time remaining
      };
    }),

  claimPrize: (roundId: number) => {
    set((state) => {
      const prediction = state.userPredictions.find(
        p => p.roundId === roundId && p.status === 'won' && !p.claimed
      );

      if (!prediction || !prediction.payout) return state;

      const newBalance = state.userBalance + prediction.payout;

      return {
        userPredictions: state.userPredictions.map(p =>
          p.roundId === roundId ? { ...p, claimed: true } : p
        ),
        userBalance: newBalance
      };
    });
  },

  calculateResult: (roundId: number) => {
    set((state) => {
      const round = state.roundResults[roundId];
      if (!round) return state;

      const predictions = state.userPredictions.map(pred => {
        if (pred.roundId !== roundId || pred.status !== 'pending') return pred;

        const isWinner = (pred.position === 'up' && round.endPrice > round.startPrice) ||
                        (pred.position === 'down' && round.endPrice < round.startPrice);

        if (isWinner) {
          const payout = pred.amount * 2;
          return { ...pred, status: 'won' as const, payout };
        }

        return { ...pred, status: 'lost' as const };
      });

      return {
        ...state,
        userPredictions: predictions
      };
    });
  },

  lockRound: (roundId: number) =>
    set((state) => ({
      rounds: {
        ...state.rounds,
        next: roundId === state.rounds.next.id 
          ? { ...state.rounds.next, locked: true }
          : state.rounds.next,
        live: roundId === state.rounds.live.id
          ? { ...state.rounds.live, locked: true }
          : state.rounds.live
      }
    })),

  updateRoundPrices: (roundId: number, prices: { start?: number; end?: number }) =>
    set((state) => ({
      rounds: {
        ...state.rounds,
        live: roundId === state.rounds.live.id
          ? { 
              ...state.rounds.live, 
              startPrice: prices.start ?? state.rounds.live.startPrice,
              endPrice: prices.end
            }
          : state.rounds.live
      }
    })),

  addPriceToHistory: (roundId: number, price: number) => 
    set((state) => {
      const pricePoint: RoundPricePoint = {
        timestamp: Date.now(),
        price
      };

      const currentResult = state.roundResults[roundId] || {
        startPrice: price,
        endPrice: 0,
        result: 'up',
        timestamp: Date.now(),
        totalPrizePool: 0,
        participants: 0,
        priceHistory: []
      };

      return {
        roundResults: {
          ...state.roundResults,
          [roundId]: {
            ...currentResult,
            priceHistory: [...currentResult.priceHistory, pricePoint]
          }
        }
      };
    }),

  updateBalance: (amount) => 
    set((state) => ({
      userBalance: state.userBalance + amount
    })),

  setNotifications: (enabled) => set({ notifications: enabled }),
  setSounds: (enabled) => set({ sounds: enabled }),
  setChartType: (type) => set({ chartType: type }),
})); 