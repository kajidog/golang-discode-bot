import React, { ReactNode } from 'react'
import { AuthContext } from './AuthContext'

export interface AuthProvider {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProvider> = ({ children }) => {
    const signOut = async() => {
        console.log("sign out")
    }

    return (
        <AuthContext.Provider
            value={{
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}