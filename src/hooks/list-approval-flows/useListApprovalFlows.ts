import { useState, useCallback } from "react"
import { getAuthToken } from "@/lib/auth"
import { ERROR_MESSAGES } from "@/constants"

export interface ApprovalFlowLevel {
    stepId: number;
    approvalLevel: number;
    stepName: string;
    approvalMode: string;
    isActive: boolean;
    userCount: number;
}

export interface ApprovalFlow {
    flowId: number;
    flowName: string;
    isActive: boolean;
    levels: ApprovalFlowLevel[];
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ApprovalFlowsResponse {
    items: ApprovalFlow[];
    pagination: Pagination;
}

export const useListApprovalFlows = () => {
    const [data, setData] = useState<ApprovalFlowsResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const fetchApprovalFlows = useCallback(async (params?: Record<string, string>) => {
        setLoading(true)
        setError("")

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API || ""
            const envEndpoint = process.env.NEXT_PUBLIC_GET_LIST_APPROVAL_FLOWS || ""
            let apiEndpoint = `${apiUrl}${envEndpoint}`
            
            if (params && Object.keys(params).length > 0) {
                const separator = apiEndpoint.includes('?') ? '&' : '?'
                const searchParams = new URLSearchParams(params)
                apiEndpoint += `${separator}${searchParams.toString()}`
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
                await response.json().catch(() => ({}))
                throw new Error("FETCH_ERROR")
            }

            const result: ApprovalFlowsResponse = await response.json()
            setData(result)
            return { success: true, data: result }

        } catch (err: any) {
            if (err.name === "AbortError") {
                setError(ERROR_MESSAGES?.TIMEOUT_ERROR || "Request timed out")
            } else {
                setError(ERROR_MESSAGES?.[err.message] || ERROR_MESSAGES?.UNKNOWN_ERROR || "An error occurred")
            }
            return { success: false, error: err }
        } finally {
            setLoading(false)
        }
    }, [])

    return { data, loading, error, fetchApprovalFlows }
}
