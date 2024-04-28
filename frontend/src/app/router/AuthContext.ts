import { createContext } from 'react'

interface AuthContext {
    signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContext>(null!)
