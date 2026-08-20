"use client"

import { useState } from "react"
import { setAuthCookie } from "@/lib/auth"
import { ERROR_MESSAGES } from "@/constants"

export const useLogin = () => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const login = async ({ username, password }) => {
        setLoading(true)
        setError("")

        try {
            // Validate
            if (!username || !password) {
                throw new Error("REQUIRED_FIELD")
            }

            const apiUrl = process.env.NEXT_PUBLIC_API
            const apiEndpoint = `${apiUrl}${process.env.NEXT_PUBLIC_LOGIN}`

            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 10000)

            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usercode: username, pwds: password }),
                signal: controller.signal
            }).finally(() => clearTimeout(timeout))

            // Error from HTTP status
            if (!response.ok) {
                await response.json().catch(() => ({}))
                throw new Error("AUTH_INVALID")
            }

            const data = await response.json()
            const { token, pwds, ...userInfo } = data.data_id

            setAuthCookie(token, {
                token,
                user: userInfo,
                selectedApiUrl: apiUrl,
                loginTime: new Date().toISOString()
            })

            return { success: true }

        } catch (err) {
            if (err.message === "REQUIRED_FIELD") {
                setError(ERROR_MESSAGES.REQUIRED_FIELD)
            } else if (err.name === "AbortError") {
                setError(ERROR_MESSAGES.TIMEOUT_ERROR)
            } else {
                setError(ERROR_MESSAGES[err.message] || ERROR_MESSAGES.UNKNOWN_ERROR)
            }
            return { success: false }

        } finally {
            setLoading(false)
        }
    }

    return { login, loading, error, setError }
}
