import { useEffect, useState } from 'react';

export function useAsync(fn, deps = []) {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);

    Promise.resolve()
      .then(fn)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message || 'Something went wrong.');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { status, data, error, isLoading: status === 'loading' };
}
