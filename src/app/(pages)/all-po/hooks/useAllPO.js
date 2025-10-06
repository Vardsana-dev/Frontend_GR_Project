import { useState, useEffect, useMemo, useCallback } from 'react'
import { getAllPO } from '../api/allPoApi'
import { useAuth } from '@/hooks/useAuth'

export const useAllPO = () => {
    const [allPO, setAllPO] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(100)
    const [searchTerm, setSearchTerm] = useState('')
    const [level, setLevel] = useState(0)
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
                levels: params.level || level,
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
    }, [limit, level, searchTerm])

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
                // ข้อมูลพื้นฐาน
                po.DOCNO,
                po.APCODE,
                po.APNAME,
                po.DOCDATE,
                po.DEPT,
                po.REMARK,
                po.REMARK2,
                po.CREATEUSER,
                po.UPDATEUSER,
                po.SYSCREATE,
                po.SYSUPDATE,
                po.CLOSEFLAG,
                po.TRFLAG,
                po.CASHFORECAST,
                po.CREDITCODE,
                po.DELIVERYDATE,
                po.SHIPDATE,
                po.PAYMENTDATE,
                po.PURCHASECODE,
                po.DOCGROUP,
                po.CONTACTCODE,
                po.DOCTYPE,
                po.TAXTYPE,
                po.SHIPCODE,
                po.SENDCODE,
                po.SUMWEIGHT,
                po.DEPARTMENT,
                po.PROJECT,
                po.ALLOCATECODE,
                po.SITECODE,
                po.REFDOCNO1,
                po.REFDOCNO2,
                po.SIGNCODE,
                po.DEPOSAMOUNT,
                po.BILLREMARK1,
                po.BILLREMARK2,
                po.BILLREMARK3,
                po.BILLREMARK4,
                po.BILLREMARK5,
                // ข้อมูลเงิน
                po.AMOUNT,
                po.AMOUNTLAK,
                po.AMOUNTBAHT,
                po.TOTALAMOUNTBAHT1,
                po.TOTALAMOUNTBAHT2,
                po.DISCOUNTAMOUNTBAHT1,
                po.DISCOUNTAMOUNTBAHT2,
                po.TAXAMOUNTBAHT,
                po.TOTALAMOUNTBAHT,
                po.SUMAMOUNT1,
                po.SUMAMOUNT2,
                po.SUMAMOUNT2B,
                po.DISCWORD2,
                po.DISCAMOUNT2,
                po.DISCWORD,
                po.DISCAMOUNT,
                po.SUMAMOUNT1VE,
                po.DISCAMOUNTVE,
                po.AFTERDISC,
                po.TAXRATE,
                po.TAXAMOUNT,
                po.TOTALAMOUNT,
                po.DEBTAMOUNT,
                po.MEDIACLEARING,
                po.BANKAMOUNT,
                po.BOOKNO,
                po.BANKEXPEND,
                po.BOOKDESC,
                po.PETTYCASHCODE,
                po.PETTYCASH,
                po.ADVANCEPAYBAL,
                po.ADVANCEPAY,
                po.CASHAMOUNT,
                po.CHEQUEAMOUNT,
                po.DEPOSITAMOUNT,
                po.INCOMEAMOUNT,
                po.EXPENDAMOUNT,
                // ข้อมูลระบบ
                po.SYSDOCFLAG,
                po.SYSDOCREMARK,
                po.CLOSEREASON,
                po.OWNERCODE,
                po.CONFIRMAUTO,
                po.CANPRINT,
                po.EXCHANGERATE,
                po.CURRENCYCODE,
                po.BATHDEBTAMOUNT,
                po.BATHSUMAMOUNT1,
                po.BATHSUMAMOUNT2,
                po.BATHDISCAMOUNT1,
                po.BATHDISCAMOUNT2,
                po.BATHTAXAMOUNT,
                po.BATHTOTALAMOUNT,
                // ข้อมูลเอกสาร
                po.DOCNOCO,
                po.CODOCNO,
                po.STARTCREATE,
                po.FINISHCREATE,
                po.STARTDATE,
                po.ENDDATE,
                po.CANCELDATE,
                po.CANCELUSER,
                // ข้อมูลแผนก
                po.DEPTCODE,
                po.DEPTID,
                po.ISMN,
                po.ACTION,
                po.OPERATION,
                po.LEVEL,
                po.DATEAPPROVE,
                po.APPROVEDATE,
                // ข้อมูล PS
                po.REMAINPS,
                po.QTYPS,
                po.PSREMAINQTY,
                po.PSQUANTITY
            ]
            
            // เพิ่มการค้นหาวันที่ในรูปแบบต่างๆ
            const dateFields = [
                po.DOCDATE,
                po.DELIVERYDATE,
                po.SHIPDATE,
                po.PAYMENTDATE,
                po.SYSCREATE,
                po.SYSUPDATE,
                po.STARTCREATE,
                po.FINISHCREATE,
                po.STARTDATE,
                po.ENDDATE,
                po.CANCELDATE,
                po.DATEAPPROVE,
                po.APPROVEDATE
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
    const handleLevelChange = (newLevel) => setLevel(parseInt(newLevel))
    const handleSearch = (term) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }
    const handleApplyFilter = async () => {
        setCurrentPage(1)
        await fetchPO({ limit, level, search: searchTerm })
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
        level,
        totalPages,
        totalItems: filteredPO.length,
        isClient,
        refetch: fetchPO,
        handlePageChange,
        handleLimitChange,
        handleLevelChange,
        handleSearch,
        handleApplyFilter,
        currentOffice: user?.selectedOffice,
        apiUrl: user?.selectedApiUrl
    }
}
