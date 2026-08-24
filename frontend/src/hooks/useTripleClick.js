import { useCallback, useRef } from 'react';

const CLICK_COUNT = 3;
const CLICK_WINDOW_MS = 600;

export const useTripleClick = (onTripleClick) => {
  const clickCountRef = useRef(0);
  const timeoutIdRef = useRef(null);

  const handleClick = useCallback(() => {
    clickCountRef.current += 1;

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    if (clickCountRef.current >= CLICK_COUNT) {
      clickCountRef.current = 0;
      onTripleClick();
      return;
    }

    timeoutIdRef.current = setTimeout(() => {
      clickCountRef.current = 0;
      timeoutIdRef.current = null;
    }, CLICK_WINDOW_MS);
  }, [onTripleClick]);

  return handleClick;
};
