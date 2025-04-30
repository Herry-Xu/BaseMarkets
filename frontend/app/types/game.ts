export type RoundStatus = 'expired' | 'live' | 'next' | 'later';
export type TabType = 'predictions' | 'history' | 'leaderboard';
export type PredictionDirection = 'up' | 'down';

export interface PricePoint {
  price: number;
  timestamp: number;
}

export interface Round {
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
  priceHistory?: PricePoint[];
}

export interface RoundResult {
  startPrice: number;
  endPrice: number;
  result: PredictionDirection;
  timestamp: number;
  totalPrizePool: number;
  participants: number;
  priceHistory: PricePoint[];
}

export interface RoundCardProps {
  round: Round;
  currentPrice: number;
  isConnected: boolean;
  timeRemaining: number;
  onPredictionClick: (direction: PredictionDirection) => void;
}

export interface Market {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  active: boolean;
}

export const markets: Market[] = [
  {
    id: 'btc-usd',
    name: 'Bitcoin',
    symbol: 'BTC/USD',
    icon: '₿',
    active: true
  }
]; 