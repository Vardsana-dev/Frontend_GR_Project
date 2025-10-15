import { useState, useEffect, useMemo, useCallback } from 'react'
import { getAllPR } from '../api/allPrApi'
import { useAuth } from '@/hooks/useAuth'

export const useAllPR = () => {
    const [allPR, setAllPR] = useState([])
    const [loading, setLoading] = useState(false)
    const [hasLoaded, setHasLoaded] = useState(false)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(100)
    const [searchTerm, setSearchTerm] = useState('')
    const [department, setDepartment] = useState('') // เพิ่ม state สำหรับ department
    const [isClient, setIsClient] = useState(false)
    const { user } = useAuth()

    useEffect(() => setIsClient(true), [])

    const fetchPR = useCallback(async (params = {}) => {
        setLoading(true)
        setError(null)
        setAllPR([]) // Clear previous data when starting new fetch

        try {
            const result = await getAllPR({
                page: 1,
                limit: params.limit || limit,
                search: params.search || searchTerm,
                departments: params.department || department // แก้ไขเป็น departments
            })

            if (result.success) {
                setAllPR(result.data)
            } else {
                setError(result.error)
                setAllPR([])
            }
        } catch (err) {
            setError(err.message)
            setAllPR([])
        } finally {
            setLoading(false)
            setHasLoaded(true)
        }
    }, [limit, searchTerm, department]) // เพิ่ม department ใน dependency

    const filteredPR = useMemo(() => {
        if (!isClient || !searchTerm.trim()) return allPR

        const searchLower = searchTerm.toLowerCase()

        const formatDateForSearch = (dateString) => {
            if (!dateString) return ""
            try {
                const date = new Date(dateString)
                if (isNaN(date.getTime())) return ""

                const formats = [
                    date.toLocaleDateString("lo-LA", { year: "numeric", month: "2-digit", day: "2-digit" }),
                    date.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" }),
                    date.toISOString().split('T')[0],
                    date.toLocaleDateString("lo-LA", { year: "numeric", month: "numeric", day: "numeric" }),
                    date.toLocaleDateString("lo-LA", { year: "numeric", month: "2-digit", day: "numeric" }),
                    date.toLocaleDateString("lo-LA", { year: "numeric", month: "numeric", day: "2-digit" }),
                ]
                return formats.join(" ")
            } catch (error) {
                return ""
            }
        }

        return allPR.filter(pr => {
            const searchableFields = [
                pr.DOCNO,
                pr.WAREHOUSE,
                pr.DOCDATE,
                pr.WANTDATE,
            ]

            const dateFields = [
                pr.DOCDATE,
                pr.WANTDATE
            ]

            const formattedDates = dateFields.map(date => formatDateForSearch(date)).join(" ")

            return searchableFields.some(field =>
                field?.toString().toLowerCase().includes(searchLower)
            ) || formattedDates.toLowerCase().includes(searchLower)
        })
    }, [allPR, searchTerm, isClient])

    const paginatedPR = useMemo(() => {
        if (!isClient) return []
        const startIndex = (currentPage - 1) * 10
        return filteredPR.slice(startIndex, startIndex + 10)
    }, [filteredPR, currentPage, isClient])

    const totalPages = useMemo(() => {
        if (!isClient) return 1
        return Math.ceil(filteredPR.length / 10)
    }, [filteredPR.length, isClient])

    useEffect(() => {
        if (user && isClient) {
            fetchPR()
        }
    }, [user, isClient, fetchPR])

    const handlePageChange = (page) => setCurrentPage(page)
    const handleLimitChange = (newLimit) => setLimit(parseInt(newLimit))
    const handleSearch = (term) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }
    const handleDepartmentChange = (dept) => { // เพิ่มฟังก์ชันสำหรับเปลี่ยน department
        setDepartment(dept)
        setCurrentPage(1)
    }
    const handleApplyFilter = async () => {
        setCurrentPage(1);
        setLoading(true); // Set loading immediately when filter is applied
        try {
            await fetchPR({ limit, search: searchTerm, department });
        } finally {
            setLoading(false); // Ensure loading is false only after fetch completes
        }
    }

    return {
        pr: paginatedPR,
        allPR,
        filteredPR,
        loading,
        error,
        currentPage,
        limit,
        searchTerm,
        department, // เพิ่ม department ใน return
        totalPages,
        totalItems: filteredPR.length,
        isClient,
        hasLoaded,
        refetch: fetchPR,
        handlePageChange,
        handleLimitChange,
        handleSearch,
        handleDepartmentChange, // เพิ่มฟังก์ชันใน return
        handleApplyFilter,
        currentOffice: user?.selectedOffice,
        apiUrl: user?.selectedApiUrl
    }
}
