import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

interface CountdownTimerProps {
  initialSeconds?: number;
}

export interface CountdownTimerRef {
  start: () => void;
  stop: () => void;
  reset: () => void;
  setTime: (newSeconds: number) => void;
  getTime: () => number;
  hasCompleted: () => boolean; // New method to check if timer completed
}

const CountdownTimer = forwardRef<CountdownTimerRef, CountdownTimerProps>(({ initialSeconds = 0 }, ref) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Start countdown
  const start = () => {
    if (timerRef.current) return; // Prevent multiple intervals
    setIsCompleted(false); // Reset completion flag
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setIsCompleted(true); // Set flag when completed
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Stop countdown
  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Reset countdown
  const reset = () => {
    stop();
    setSecondsLeft(initialSeconds);
    setIsCompleted(false);
  };

  // Set custom time
  const setTime = (newSeconds: number) => {
    stop();
    setSecondsLeft(newSeconds);
    setIsCompleted(false);
  };

  // Get current time
  const getTime = () => secondsLeft;

  // Check if countdown completed
  const hasCompleted = () => isCompleted;

  // Cleanup interval when unmounted
  useEffect(() => {
    return () => stop();
  }, []);

  // Expose functions via ref for external access
  useImperativeHandle(ref, () => ({
    start,
    stop,
    reset,
    setTime,
    getTime,
    hasCompleted,
  }));

  return (
      <span className="text-sm text-textGray hover:text-navyLight hover:cursor-default">{formatTime(secondsLeft)}</span>
    // <div className="p-4 text-center bg-gray-800 text-white rounded-lg shadow-lg">
    // </div>
  );
});

export default CountdownTimer;
