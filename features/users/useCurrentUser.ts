// hooks/useCurrentUser.ts


import { useState, useEffect } from 'react';

interface CurrentUser {
  name: string;
  email: string;
  role?: string;
  profile_photo?: string | null;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr) as CurrentUser;
          if (parsed.email && parsed.name) {
            setUser(parsed);
          } else {
            throw new Error('Invalid user data');
          }
        } catch (err) {
          console.error('Invalid user in localStorage', err);
          localStorage.removeItem('user');
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    loadUser();

    // Optional: dengarkan perubahan dari tab lain
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  return { user, isLoading };
}