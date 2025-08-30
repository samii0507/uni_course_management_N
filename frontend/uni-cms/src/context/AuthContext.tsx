import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'


type AuthCtx = {
  user: User | null
  isAdmin: boolean
  login: (u: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('uniUser')
    return raw ? (JSON.parse(raw) as User) : null
  })

  useEffect(() => {
    if (user) localStorage.setItem('uniUser', JSON.stringify(user))
    else localStorage.removeItem('uniUser')
  }, [user])

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      isAdmin: !!(user?.isAdmin ?? user?.admin),
      login: setUser,
      logout: () => setUser(null),
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
export interface User {
  id: number
  email: string
  username: string
  isAdmin?: boolean
  admin?: boolean
}