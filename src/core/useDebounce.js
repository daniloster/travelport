import { useCallback, useEffect, useRef } from 'react';

export default function useDebounce(callback, debounce = 500) {
  const callbackTicketRef = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debounced = useCallback(
    (...args) => {
      if (callbackRef.current) {
        clearTimeout(callbackTicketRef.current);
        callbackTicketRef.current = setTimeout(() => {
          callbackRef.current(...args);
        }, debounce);
      }
    },
    [debounce]
  );

  return debounced;
}
