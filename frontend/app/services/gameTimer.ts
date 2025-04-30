import { useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';

const ROUND_DURATION = 30; // Match the duration in useGameState

export function useGameTimer() {
  const updateTime = useGameState((state) => state.updateTime);
  const timeRemaining = useGameState((state) => state.timeRemaining);
  const rotateRounds = useGameState((state) => state.rotateRounds);
  const calculateResult = useGameState((state) => state.calculateResult);
  const rounds = useGameState((state) => state.rounds);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRemaining > 0) {
        updateTime(timeRemaining - 1);
      } else {
        calculateResult(rounds.live.id);
        rotateRounds();
        updateTime(ROUND_DURATION); // Reset to 30s
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeRemaining, updateTime, rotateRounds, calculateResult, rounds.live.id]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  return {
    minutes,
    seconds,
    formattedTime,
    timeRemaining,
  };
} 