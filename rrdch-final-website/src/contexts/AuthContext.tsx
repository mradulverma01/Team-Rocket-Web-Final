import { ConvexAuthProvider, useAuthActions } from '@convex-dev/auth/react'
import { useConvexAuth, useQuery } from 'convex/react'
import React, { ReactNode, createContext, useContext } from 'react'
import { convex } from '../convex'
import { ViewerProfile, convexApi } from '../convex-api'

interface AuthContextType {
  user: ViewerProfile | null
  loading: boolean
  isAuthenticated: boolean
  signInWithCredentials: (identifier: string, password: string) => Promise<void>
  signUpWithCredentials: (name: string, identifier: string, password: string) => Promise<void>
  signInWithGoogle: (redirectTo?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const isPhoneIdentifier = (value: string) => !value.includes('@')

function AuthStateProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signIn, signOut } = useAuthActions()
  const profile = useQuery(convexApi.users.viewerProfile)

  const loading = isLoading || (isAuthenticated && profile === undefined)

  const signInWithCredentials = async (identifier: string, password: string) => {
    const normalizedIdentifier = identifier.trim()

    if (isPhoneIdentifier(normalizedIdentifier)) {
      await signIn('phone-password', { phone: normalizedIdentifier, password, flow: 'signIn' })
      return
    }

    await signIn('password', { email: normalizedIdentifier, password, flow: 'signIn' })
  }

  const signUpWithCredentials = async (name: string, identifier: string, password: string) => {
    const normalizedIdentifier = identifier.trim()

    if (isPhoneIdentifier(normalizedIdentifier)) {
      await signIn('phone-password', { name, phone: normalizedIdentifier, password, flow: 'signUp' })
      return
    }

    await signIn('password', { name, email: normalizedIdentifier, password, flow: 'signUp' })
  }

  const signInWithGoogle = async (redirectTo = '/') => {
    await signIn('google', { redirectTo })
  }

  return (
    <AuthContext.Provider
      value={{
        user: profile ?? null,
        loading,
        isAuthenticated,
        signInWithCredentials,
        signUpWithCredentials,
        signInWithGoogle,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ConvexAuthProvider client={convex}>
      <AuthStateProvider>{children}</AuthStateProvider>
    </ConvexAuthProvider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
