// Authentication utility functions

export const getStoredUserData = () => {
    if (typeof window === 'undefined') return null
    return getUserDataCookie() // Use cookie instead of localStorage
}

export const getAuthToken = () => {
    if (typeof window === 'undefined') return null
    return getAuthCookie() // Use cookie instead of localStorage
}

// Cookie-based functions for server-side access
export const setAuthCookie = (token, userData) => {
    if (typeof document === 'undefined') return

    try {
        document.cookie = `token=${token}; path=/; max-age=86400`
        document.cookie = `userData=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=86400`
        // const testToken = getAuthCookie()
        // const testUserData = getUserDataCookie()
    } catch (error) {
        return null
    }
}

export const getAuthCookie = () => {
    if (typeof document === 'undefined') return null
    
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
    
    if (tokenCookie) {
        return tokenCookie.split('=')[1]
    }
    return null
}

export const getUserDataCookie = () => {
    if (typeof document === 'undefined') return null
    
    const cookies = document.cookie.split(';')
    const userDataCookie = cookies.find(cookie => cookie.trim().startsWith('userData='))
    
    if (userDataCookie) {
        try {
            const userData = decodeURIComponent(userDataCookie.split('=')[1])
            return JSON.parse(userData)
        } catch (error) {
            return null
        }
    }
    return null
}

export const clearAuthCookies = () => {
    if (typeof document === 'undefined') return
    
    // Clear all auth-related cookies
    const cookiesToClear = ['token', 'userData']
    
    cookiesToClear.forEach(cookieName => {
        // Clear with different path and domain combinations to ensure complete removal
        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        document.cookie = `${cookieName}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        document.cookie = `${cookieName}=; path=/; domain=.${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    })
    
    // console.log(' All auth cookies cleared')
}

export const clearAllCookies = () => {
    if (typeof document === 'undefined') return
    
    // Get all cookies
    const cookies = document.cookie.split(';')
    
    // Clear each cookie
    cookies.forEach(cookie => {
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
        
        // Clear with different path and domain combinations
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        document.cookie = `${name}=; path=/; domain=.${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    })
    
    // console.log(' All cookies cleared')
}

export const getSelectedApiUrl = () => {
    const userData = getStoredUserData()
    return userData?.selectedApiUrl || null
}

export const getSelectedOffice = () => {
    const userData = getStoredUserData()
    return userData?.selectedOffice || null
}

export const logout = () => {
    if (typeof window === 'undefined') return
    
    // Clear all cookies only
    clearAllCookies()
    
    // Redirect to login page
    window.location.href = '/login'
}

export const isAuthenticated = () => {
    const token = getAuthToken()
    const userData = getStoredUserData()
    
    if (!token || !userData) return false
    
    // Check if token is expired (optional)
    try {
        const loginTime = new Date(userData.loginTime)
        const now = new Date()
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60)
        
        // Token expires after 24 hours (adjust as needed)
        if (hoursDiff > 24) {
            logout()
            return false
        }
    } catch (error) {
        console.error('Error checking token expiry:', error)
        return false
    }
    
    return true
}

// API call helper with authentication
export const apiCall = async (endpoint, options = {}) => {
    const userData = getStoredUserData()
    const token = getAuthToken()
    
    if (!userData || !token) {
        throw new Error('User not authenticated')
    }
    
    const apiUrl = userData.selectedApiUrl
    if (!apiUrl) {
        throw new Error('No API URL selected')
    }
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    }
    
    const response = await fetch(`${apiUrl}${endpoint}`, {
        ...defaultOptions,
        ...options
    })
    
    if (response.status === 401) {
        // Token expired or invalid
        logout()
        throw new Error('Session expired. Please login again.')
    }
    
    return response
}
