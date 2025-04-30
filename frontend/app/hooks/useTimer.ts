import { useState, useEffect } from 'react';

export function useTimer(endTime: number) {
  const [timeRemaining, setTimeRemaining] = useState(() => {
    return Math.max(0, endTime - Date.now());
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return timeRemaining;
} 