import {
  ConvexAuthProvider as ConvexAuthReactProvider,
  useAuthActions,
} from '@convex-dev/auth/react';
import { useConvexAuth } from 'convex/react';
import React, { createContext, useContext } from 'react';

import { convex, convexTokenStorage } from '../config/convex';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  userId: null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

function AuthStateProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userId: null,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthReactProvider
      client={convex}
      storage={convexTokenStorage}
      storageNamespace="rrdch-mobile"
    >
      <AuthStateProvider>{children}</AuthStateProvider>
    </ConvexAuthReactProvider>
  );
}
