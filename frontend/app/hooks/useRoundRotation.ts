import { useEffect, useRef } from 'react';
import { useGameState } from './useGameState';

export function useRoundRotation() {
  const rotationInProgress = useRef(false);
  const { rounds, rotateRounds } = useGameState();

  useEffect(() => {
    const checkAndRotate = () => {
      const now = Date.now();
      if (now >= rounds.live.endTime && !rotationInProgress.current) {
        rotationInProgress.current = true;
        
        // Add small delay to ensure clean state transition
        setTimeout(() => {
          rotateRounds();
          rotationInProgress.current = false;
        }, 100);
      }
    };

    // Check every second
    const interval = setInterval(checkAndRotate, 1000);

    // Cleanup
    return () => {
      clearInterval(interval);
      rotationInProgress.current = false;
    };
  }, [rounds.live.endTime, rotateRounds]);
} 