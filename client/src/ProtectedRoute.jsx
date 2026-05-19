import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/status', {
          credentials: 'include',
        });
        const data = await res.json();
        setIsAuth(data.loggedIn);
      } catch (err) {
          setIsAuth(false);
      } finally {
          setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  if (!authChecked) {
    return <div>Loading...</div>;
  }
  if (!isAuth) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
}
