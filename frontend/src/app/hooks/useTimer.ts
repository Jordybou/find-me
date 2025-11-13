import { useEffect, useState, useCallback } from "react";

export default function useTimer(onExpire?: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) {
      if (isRunning && secondsLeft <= 0 && onExpire) onExpire();
      return;
    }

    const timeout = setTimeout(() => {
      setSecondsLeft((s) => Math.max(s - 1, 0));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isRunning, secondsLeft, onExpire]);

  const start = useCallback((seconds: number) => {
    setSecondsLeft(Math.max(0, Math.floor(seconds)));
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(0);
  }, []);

  return { secondsLeft, isRunning, start, stop, reset };
}