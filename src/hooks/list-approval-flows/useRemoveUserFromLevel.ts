import { useState, useCallback } from "react"
import { getAuthToken } from "@/lib/auth"
import { ERROR_MESSAGES } from "@/constants"

export interface RemoveUserFromLevelPayload {
    stepId: number;
    usercode: string;
}

export const useRemoveUserFromLevel = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const removeUserFromLevel = useCallback(async (payload: RemoveUserFromLevelPayload) => {
        setLoading(true)
        setError("")

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API || ""
            const envEndpoint = process.env.NEXT_PUBLIC_REMOVE_USERS_FROM_CURRENT_LEVEL || ""
            const apiEndpoint = `${apiUrl}${envEndpoint}`

            const token = getAuthToken()

            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 10000)

            const response = await fetch(apiEndpoint, {
                method: "DELETE", // Changed back to DELETE based on Postman screenshot
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            }).finally(() => clearTimeout(timeout))

            if (!response.ok) {
                const errorText = await response.text().catch(() => "");
                let errorData: any = {};
                try {
                    if (errorText) errorData = JSON.parse(errorText);
                } catch (e) {}
                throw new Error(errorData.message || "REMOVE_ERROR");
            }

            const text = await response.text();
            let result: any = {};
            try {
                if (text) result = JSON.parse(text);
            } catch (e) {}
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

    return { loading, error, removeUserFromLevel }
}
