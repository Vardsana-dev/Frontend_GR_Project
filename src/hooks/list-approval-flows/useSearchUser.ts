import { useState, useCallback } from "react"
import { getAuthToken } from "@/lib/auth"
import { ERROR_MESSAGES } from "@/constants"

export const useSearchUser = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [data, setData] = useState<any>(null)

    const searchUser = useCallback(async (searchQuery: string, page = 1, limit = 20) => {
        setLoading(true)
        setError("")

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API || ""
            const envEndpoint = process.env.NEXT_PUBLIC_SEARCH_USER || ""
            
            let apiEndpoint = `${apiUrl}${envEndpoint}`
            
            // If the env variable includes the template placeholder, replace it
            if (apiEndpoint.includes("{{approval_user_search}}")) {
                apiEndpoint = apiEndpoint.replace("{{approval_user_search}}", encodeURIComponent(searchQuery))
            } else {
                // Otherwise safely append query parameters
                const params = new URLSearchParams({ search: searchQuery, page: String(page), limit: String(limit) })
                apiEndpoint = `${apiEndpoint}${apiEndpoint.includes('?') ? '&' : '?'}${params.toString()}`
            }

            const token = getAuthToken()

            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 10000)

            const response = await fetch(apiEndpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                signal: controller.signal
            }).finally(() => clearTimeout(timeout))

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "SEARCH_USER_ERROR")
            }

            const result = await response.json()
            setData(result)
            return { success: true, data: result }

        } catch (err: any) {
            if (err.name === "AbortError") {
                setError(ERROR_MESSAGES?.TIMEOUT_ERROR || "Request timed out")
            } else {
                setError(ERROR_MESSAGES?.[err.message] || err.message || ERROR_MESSAGES?.UNKNOWN_ERROR || "An error occurred")
            }
            return { success: false, error: err }
        } finally {
            setLoading(false)
        }
    }, [])

    return { loading, error, data, searchUser }
}
