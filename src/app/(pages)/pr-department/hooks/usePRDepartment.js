import { useState, useEffect, useCallback } from 'react'
import { getPRDepartments } from '../api/PRDepartment'
import { useAuth } from '@/hooks/useAuth'

export const usePRDepartment = () => {
    const [departments, setDepartments] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isClient, setIsClient] = useState(false)
    const { user } = useAuth()

    useEffect(() => setIsClient(true), [])

    const fetchDepartments = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const result = await getPRDepartments()

            if (result.success) {
                setDepartments(result.data)
            } else {
                setError(result.error)
                setDepartments([])
            }
        } catch (err) {
            setError(err.message)
            setDepartments([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (user && isClient) {
            fetchDepartments()
        }
    }, [user, isClient, fetchDepartments])

    return {
        departments,
        loading,
        error,
        isClient,
        refetch: fetchDepartments
    }
}