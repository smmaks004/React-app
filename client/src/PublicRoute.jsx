import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/status', {
          credentials: 'include',
          signal: controller.signal,
        });
        if (!res.ok) {
          setIsAuth(false);
          return;
        }
        const data = await res.json();
        setIsAuth(Boolean(data.loggedIn));
      } catch {
        setIsAuth(false);
      } finally {
        clearTimeout(timeoutId);
        setAuthChecked(true);
      }
    };

    checkAuth();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  if (!authChecked) {
    return <div>Loading...</div>;
  }
  if (isAuth) {
    return <Navigate to="/" replace />;
  }
  return children;
}
