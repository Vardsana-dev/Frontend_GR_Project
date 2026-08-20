/**
 * 🔐 Auth Utils - จัดการ Authentication แบบเรียบง่าย
 */

// 🍪 Cookie utilities
const getCookie = (name) => {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
    return match ? match[2] : null
}

const setCookie = (name, value) => {
    if (typeof document !== 'undefined') {
        document.cookie = `${name}=${value}; path=/; max-age=86400`
    }
}

const clearCookie = (name) => {
    if (typeof document !== 'undefined') {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
}

// 📊 Auth data functions
export const getAuthToken = () => getCookie('token')

export const getStoredUserData = () => {
    try {
        const data = getCookie('userData')
        return data ? JSON.parse(decodeURIComponent(data)) : null
    } catch { return null }
}

export const setAuthCookie = (token, userData) => {
    setCookie('token', token)
    setCookie('userData', encodeURIComponent(JSON.stringify(userData)))
}

export const clearAuthCookies = () => {
    clearCookie('token')
    clearCookie('userData')
}

// 🏢 User info helpers
export const getSelectedApiUrl = () => getStoredUserData()?.selectedApiUrl
export const getUser = () => getStoredUserData()?.user

// 🚪 Logout function
export const logout = () => {
    if (typeof window === 'undefined') return
    clearAuthCookies()
    window.location.href = '/login'
}

// 🔍 Check authentication
export const isAuthenticated = () => {
    try {
        const token = getAuthToken()
        const userData = getStoredUserData()
        
        if (!token || !userData?.selectedApiUrl || !userData?.loginTime) return false
        
        // ตรวจสอบว่า login เกิน 24 ชั่วโมงหรือไม่
        const hoursDiff = (new Date() - new Date(userData.loginTime)) / 3600000
        if (hoursDiff > 24) {
            logout()
            return false
        }
        
        return true
    } catch {
        logout()
        return false
    }
}

// 🌐 API call with auth (ใช้สำหรับ fetch API)
export const apiCall = async (endpoint, options = {}) => {
    if (!isAuthenticated()) throw new Error('ການເຂົ້າສູ່ລະບົບໝົດອາຍຸ ກະລຸນາເຂົ້າສູ່ລະບົບອີກຄັ້ງ')
    
    const userData = getStoredUserData()
    const token = getAuthToken()
    
    const response = await fetch(`${userData.selectedApiUrl}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    })
    
    if ([401, 403].includes(response.status)) {
        logout()
        throw new Error('ການເຂົ້າສູ່ລະບົບໝົດອາຍຸ ກະລຸນາເຂົ້າສູ່ລະບົບອີກຄັ້ງ')
    }
    
    return response
}

// 📡 Axios instance with auth (ใช้สำหรับ axios)
export const createApiInstance = () => {
    if (!isAuthenticated()) {
        logout()
        throw new Error('ການເຂົ້າສູ່ລະບົບໝົດອາຍຸ ກະລຸນາເຂົ້າສູ່ລະບົບອີກຄັ້ງ')
    }
    
    const axios = require('axios')
    const userData = getStoredUserData()
    const token = getAuthToken()
    
    const instance = axios.create({
        baseURL: userData.selectedApiUrl,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        timeout: 30000
    })
    
    // Auto logout เมื่อ 401/403
    instance.interceptors.response.use(
        response => response,
        error => {
            if ([401, 403].includes(error.response?.status)) {
                logout()
                return Promise.reject(new Error('ການເຂົ້າສູ່ລະບົບໝົດອາຍຸ ກະລຸນາເຂົ້າສູ່ລະບົບອີກຄັ້ງ'))
            }
            return Promise.reject(error)
        }
    )
    
    return instance
}
