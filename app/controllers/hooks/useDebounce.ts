import { useState, useEffect } from 'react';
import { DEBOUNCE_CONFIG } from '../constants';

export const useDebounce = <T>(value: T, delay: number = DEBOUNCE_CONFIG.SEARCH): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}; 