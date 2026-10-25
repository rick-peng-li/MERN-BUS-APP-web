import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as authService from '@/services/authService';
import {
  clearSession,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken
} from '@/utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken);
  const [user, setUserState] = useState(getStoredUser);

  const signIn = useCallback(async credentials => {
    const data = await authService.login(credentials);
    setToken(data.token);
    setStoredUser(data.user);
    setTokenState(data.token);
    setUserState(data.user);
    return data.user;
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setTokenState(null);
    setUserState(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const data = await authService.me();
    setStoredUser(data.user);
    setUserState(data.user);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      signIn,
      signOut,
      refreshUser
    }),
    [token, user, signIn, signOut, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
