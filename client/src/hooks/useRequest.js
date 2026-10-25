import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '@/services/api';

/**
 * Small wrapper around an async request with loading and error state.
 * `requestFn` is stored in a ref so it does not have to be memoised by callers.
 */
export default function useRequest(
  requestFn,
  { immediate = true, errorMessage = 'Something went wrong. Please try again.', deps = [] } = {}
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState('');
  const requestRef = useRef(requestFn);
  const mountedRef = useRef(true);

  requestRef.current = requestFn;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await requestRef.current();
      if (mountedRef.current) {
        setData(result);
      }
      return result;
    } catch (requestError) {
      if (mountedRef.current) {
        setError(getErrorMessage(requestError, errorMessage));
      }
      throw requestError;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [errorMessage]);

  useEffect(() => {
    if (immediate) {
      run().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, run, ...deps]);

  return { data, loading, error, run, setData };
}
