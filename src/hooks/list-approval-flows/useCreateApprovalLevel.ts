import { useState, useCallback } from "react"
import { getAuthToken } from "@/lib/auth"
import { ERROR_MESSAGES } from "@/constants"

export interface CreateApprovalLevelPayload {
    flowId: number;
    approvalLevel: number;
    stepName: string;
    approvalMode: string;
    isActive: boolean;
}

export const useCreateApprovalLevel = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const createApprovalLevel = useCallback(async (payload: CreateApprovalLevelPayload | any) => {
        setLoading(true)
        setError("")

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API || ""
            const envEndpoint = process.env.NEXT_PUBLIC_CREATE_APPROVAL_LEVELS || ""
            const apiEndpoint = `${apiUrl}${envEndpoint}`

            const token = getAuthToken()

            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 10000)

            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            }).finally(() => clearTimeout(timeout))

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "CREATE_LEVEL_ERROR")
            }

            const result = await response.json()
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

    return { loading, error, createApprovalLevel }
}
