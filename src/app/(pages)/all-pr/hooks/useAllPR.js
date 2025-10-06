import { useState, useEffect, useMemo, useCallback } from 'react'
import { getAllPO } from '../api/allPrApi'
import { useAuth } from '@/hooks/useAuth'

export const useAllPO = () => {
    const [allPO, setAllPO] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(100)
    const [searchTerm, setSearchTerm] = useState('')
    const [isClient, setIsClient] = useState(false)
    const { user } = useAuth()

    useEffect(() => setIsClient(true), [])

    const fetchPO = useCallback(async (params = {}) => {
        setLoading(true)
        setError(null)

        try {
            const result = await getAllPO({
                page: 1,
                limit: params.limit || limit,
                search: params.search || searchTerm
            })

            if (result.success) {
                setAllPO(result.data)
            } else {
                setError(result.error)
                setAllPO([])
            }
        } catch (err) {
            setError(err.message)
            setAllPO([])
        } finally {
            setLoading(false)
        }
    }, [limit, searchTerm])

    const filteredPO = useMemo(() => {
        if (!isClient || !searchTerm.trim()) return allPO

        const searchLower = searchTerm.toLowerCase()

        // ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบที่ค้นหาได้
        const formatDateForSearch = (dateString) => {
            if (!dateString) return ""
            try {
                const date = new Date(dateString)
                if (isNaN(date.getTime())) return ""

                // แปลงเป็นรูปแบบต่างๆ ที่อาจใช้ค้นหา
                const formats = [
                    date.toLocaleDateString("lo-LA", { year: "numeric", month: "2-digit", day: "2-digit" }), // dd/mm/yyyy
                    date.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" }), // mm/dd/yyyy
                    date.toISOString().split('T')[0], // yyyy-mm-dd
                    date.toLocaleDateString("lo-LA", { year: "numeric", month: "numeric", day: "numeric" }), // d/m/yyyy
                    date.toLocaleDateString("lo-LA", { year: "numeric", month: "2-digit", day: "numeric" }), // d/mm/yyyy
                    date.toLocaleDateString("lo-LA", { year: "numeric", month: "numeric", day: "2-digit" }), // dd/m/yyyy
                ]
                return formats.join(" ")
            } catch (error) {
                return ""
            }
        }

        return allPO.filter(po => {
            const searchableFields = [
                // ข้อมูลพื้นฐาน PR
                po.DOCNO,
                po.WAREHOUSE,
                po.DOCDATE,
                po.WANTDATE,
            ]

            // เพิ่มการค้นหาวันที่ในรูปแบบต่างๆ
            const dateFields = [
                po.DOCDATE,
                po.WANTDATE
            ]

            const formattedDates = dateFields.map(date => formatDateForSearch(date)).join(" ")

            return searchableFields.some(field =>
                field?.toString().toLowerCase().includes(searchLower)
            ) || formattedDates.toLowerCase().includes(searchLower)
        })
    }, [allPO, searchTerm, isClient])

    const paginatedPO = useMemo(() => {
        if (!isClient) return []
        const startIndex = (currentPage - 1) * 10
        return filteredPO.slice(startIndex, startIndex + 10)
    }, [filteredPO, currentPage, isClient])

    const totalPages = useMemo(() => {
        if (!isClient) return 1
        return Math.ceil(filteredPO.length / 10)
    }, [filteredPO.length, isClient])

    useEffect(() => {
        if (user && isClient) {
            fetchPO()
        }
    }, [user, isClient, fetchPO])

    const handlePageChange = (page) => setCurrentPage(page)
    const handleLimitChange = (newLimit) => setLimit(parseInt(newLimit))
    const handleSearch = (term) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }
    const handleApplyFilter = async () => {
        setCurrentPage(1)
        await fetchPO({ limit, search: searchTerm })
    }

    return {
        po: paginatedPO,
        allPO,
        filteredPO,
        loading,
        error,
        currentPage,
        limit,
        searchTerm,
        totalPages,
        totalItems: filteredPO.length,
        isClient,
        refetch: fetchPO,
        handlePageChange,
        handleLimitChange,
        handleSearch,
        handleApplyFilter,
        currentOffice: user?.selectedOffice,
        apiUrl: user?.selectedApiUrl
    }
}
