"use client"

import { useState } from "react"
import { setAuthCookie } from "@/lib/auth"
import { translateError } from "@/constants"

export const useLogin = () => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const login = async ({ office, username, password, apiEndpoints }) => {
        setLoading(true)
        setError("")

        try {
            // Validate
            if (!office || !username || !password) {
                throw new Error("REQUIRED_FIELD")
            }

            const apiUrl = apiEndpoints[office]
            if (!apiUrl) throw new Error("OFFICE_REQUIRED")

            const apiEndpoint = `${apiUrl}${process.env.NEXT_PUBLIC_LOGIN_ENDPOINT}`

            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            })

            // Error from HTTP status
            if (!response.ok) {
                const result = await response.json().catch(() => ({}))
                throw new Error(result.message || String(response.status))
            }

            const data = await response.json()
            const token = data.data_id?.token

            setAuthCookie(token, {
                token,
                user: data.data_id,
                selectedOffice: office,
                selectedApiUrl: apiUrl,
                loginTime: new Date().toISOString()
            })

            return { success: true }

        } catch (err) {
            const translated = translateError(err.message)
            setError(translated)
            return { success: false }

        } finally {
            setLoading(false)
        }
    }

    return { login, loading, error, setError }
}
