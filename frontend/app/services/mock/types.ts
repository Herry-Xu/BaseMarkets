import { Round as GameRound, RoundStatus } from '@/app/types/game';

export interface Round extends GameRound {
  id: number;
  status: RoundStatus;
  startTime: number;
  endTime: number;
  startPrice: number;
  endPrice?: number;
  prizePool: number;
  upPayout: number;
  downPayout: number;
  totalUpAmount: number;
  totalDownAmount: number;
}

export interface Rounds {
  expired: Round[];
  live: Round;
  next: Round;
  later: Round;
}

export interface Prediction {
  roundId: number;
  direction: 'up' | 'down';
  amount: number;
  claimed: boolean;
} 