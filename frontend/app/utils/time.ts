import { Round } from '@/app/types/game';

export function getTimeRemaining(round: Round): number {
  if (round.status === 'expired') return 0;
  const now = Date.now();
  return Math.max(0, round.endTime - now);
} 