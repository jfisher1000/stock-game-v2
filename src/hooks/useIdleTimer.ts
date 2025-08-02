import { useEffect, useRef } from 'react';

/**
 * A custom hook that detects when a user is idle.
 * @param onIdle - The function to call when the user is idle.
 * @param timeout - The idle time in milliseconds.
 */
export const useIdleTimer = (onIdle: () => void, timeout: number) => {
  const timeoutId = useRef<number>();

  // Function to reset the timer
  const resetTimer = () => {
    if (timeoutId.current) {
      window.clearTimeout(timeoutId.current);
    }
    // Set a new timer
    timeoutId.current = window.setTimeout(onIdle, timeout);
  };

  // This function is called on any user activity
  const handleEvent = () => {
    resetTimer();
  };

  useEffect(() => {
    // List of events that indicate user activity
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

    // Set up event listeners for each event
    events.forEach(event => {
      window.addEventListener(event, handleEvent);
    });

    // Initialize the timer when the component mounts
    resetTimer();

    // Cleanup function to remove listeners and clear the timer
    return () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleEvent);
      });
    };
  }, [onIdle, timeout]); // Rerun the effect if the callback or timeout changes

  return null; // This hook does not render any UI
};
