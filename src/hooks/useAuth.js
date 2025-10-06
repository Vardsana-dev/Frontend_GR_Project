import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredUserData, getAuthToken, isAuthenticated, logout, getAuthCookie, getUserDataCookie, clearAllCookies } from '@/lib/auth'

export const useAuth = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = () => {
            try {
                // Check cookies only
                const userData = getStoredUserData()
                const token = getAuthToken()
                const authenticated = isAuthenticated()

                if (authenticated && userData && token) {
                    setUser(userData)
                    setIsLoggedIn(true)
                } else {
                    setUser(null)
                    setIsLoggedIn(false)
                    // Clear invalid cookies
                    if (typeof window !== 'undefined') {
                        clearAllCookies()
                    }
                }
            } catch (error) {
                console.error('Auth check error:', error)
                setUser(null)
                setIsLoggedIn(false)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    const handleLogout = () => {
        logout()
        setUser(null)
        setIsLoggedIn(false)
        router.push('/login')
    }

    const requireAuth = () => {
        if (!loading && !isLoggedIn) {
            router.push('/login')
            return false
        }
        return isLoggedIn
    }

    return {
        user,
        loading,
        isLoggedIn,
        logout: handleLogout,
        requireAuth
    }
}
