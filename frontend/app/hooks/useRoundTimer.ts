import { useState, useEffect } from 'react';

export function useRoundTimer(targetTime: number) {
  const [timeRemaining, setTimeRemaining] = useState(() => {
    return Math.max(0, targetTime - Date.now());
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, targetTime - Date.now());
      setTimeRemaining(remaining);
    }, 100);

    return () => clearInterval(interval);
  }, [targetTime]);

  return timeRemaining;
} 