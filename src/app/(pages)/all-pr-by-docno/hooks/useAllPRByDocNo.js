import { useState, useEffect, useMemo, useCallback } from 'react'
import { getAllPrByDocNo } from '../api/allPrByDocNoApi'
import { useAuth } from '@/hooks/useAuth'
import * as XLSX from 'xlsx'

export const useAllPrByDocNo = (docNo) => {
    const [allPrByDocNo, setAllPrByDocNo] = useState([])
    const [loading, setLoading] = useState(false)
    const [hasLoaded, setHasLoaded] = useState(false)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(100)
    const [searchTerm, setSearchTerm] = useState('')
    const [isClient, setIsClient] = useState(false)
    const { user } = useAuth()

    useEffect(() => setIsClient(true), [])

    const fetchPrByDocNo = useCallback(async (params = {}) => {
        if (!docNo) return;
        
        setLoading(true)
        setError(null)
        setAllPrByDocNo([]) // Clear previous data when starting new fetch
        
        try {
            const result = await getAllPrByDocNo({
                page: 1,
                limit: params.limit || limit,
                docNo: docNo,
                search: params.search || searchTerm
            })
            
            if (result.success) {
                setAllPrByDocNo(result.data)
            } else {
                setError(result.error)
                setAllPrByDocNo([])
            }
        } catch (err) {
            setError(err.message)
            setAllPrByDocNo([])
        } finally {
            setLoading(false)
            setHasLoaded(true)
        }
    }, [docNo, limit, searchTerm])

    const filteredPrByDocNo = useMemo(() => {
        if (!isClient || !searchTerm.trim()) return allPrByDocNo

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
        
        return allPrByDocNo.filter(po => {
            const searchableFields = [
                // ข้อมูลสินค้า
                po.PRODUCTCODE || po.productcode,
                po.PRODUCTNAME || po.productname,
                po.UNITCODE || po.unitcode,
                // ข้อมูลจำนวนและราคา
                po.QUANTITY || po.quantity,
                po.UNITPRICE || po.unitprice,
                po.REMAINQTY || po.remainqty,
                // ข้อมูลสั่งซื้อ 12 ครั้ง
                po.qtytop1,
                po.pricetop1,
                po.datetop1,
                po.qtytop2,
                po.pricetop2,
                po.datetop2,
                po.qtytop3,
                po.pricetop3,
                po.datetop3,
                po.qtytop4,
                po.pricetop4,
                po.datetop4,
                po.qtytop5,
                po.pricetop5,
                po.datetop5,
                po.qtytop6,
                po.pricetop6,
                po.datetop6,
                po.qtytop7,
                po.pricetop7,
                po.datetop7,
                po.qtytop8,
                po.pricetop8,
                po.datetop8,
                po.qtytop9,
                po.pricetop9,
                po.datetop9,
                po.qtytop10,
                po.pricetop10,
                po.datetop10,
                po.qtytop11,
                po.pricetop11,
                po.datetop11,
                po.qtytop12,
                po.pricetop12,
                po.datetop12
            ]
            
            // เพิ่มการค้นหาวันที่ในรูปแบบต่างๆ (ใช้ทั้งตัวใหญ่และตัวเล็ก)
            const dateFields = [
                po.DATETOP1 || po.datetop1,
                po.DATETOP2 || po.datetop2,
                po.DATETOP3 || po.datetop3,
                po.DATETOP4 || po.datetop4,
                po.DATETOP5 || po.datetop5,
                po.DATETOP6 || po.datetop6,
                po.DATETOP7 || po.datetop7,
                po.DATETOP8 || po.datetop8,
                po.DATETOP9 || po.datetop9,
                po.DATETOP10 || po.datetop10,
                po.DATETOP11 || po.datetop11,
                po.DATETOP12 || po.datetop12
            ]
            
            const formattedDates = dateFields.map(date => formatDateForSearch(date)).join(" ")
            
            return searchableFields.some(field => 
                field?.toString().toLowerCase().includes(searchLower)
            ) || formattedDates.toLowerCase().includes(searchLower)
        })
    }, [allPrByDocNo, searchTerm, isClient])

    const paginatedPrByDocNo = useMemo(() => {
        if (!isClient) return []
        const startIndex = (currentPage - 1) * 12
        return filteredPrByDocNo.slice(startIndex, startIndex + 12)
    }, [filteredPrByDocNo, currentPage, isClient])

    const totalPages = useMemo(() => {
        if (!isClient) return 1
        return Math.ceil(filteredPrByDocNo.length / 12)
    }, [filteredPrByDocNo.length, isClient])

    useEffect(() => {
        if (user && isClient && docNo) {
            fetchPrByDocNo()
        }
    }, [user, isClient, docNo, fetchPrByDocNo])

    const handlePageChange = (page) => setCurrentPage(page)
    const handleLimitChange = (newLimit) => setLimit(parseInt(newLimit))
    const handleSearch = (term) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }
    const handleApplyFilter = async () => {
        setCurrentPage(1)
        setLoading(true) // Set loading immediately when filter is applied
        await fetchPrByDocNo({ limit, search: searchTerm })
    }

    const exportToExcel = () => {
        if (!allPrByDocNo || allPrByDocNo.length === 0) {
            alert('ບໍ່ມີຂໍ້ມູນໃຫ້ສົ່ງອອກ')
            return
        }

        // สร้าง headers สำหรับ Excel
        const headers = [
            'ລຳດັບ',
            'ລະຫັດສິນຄ້າ',
            'ຊື່ສິນຄ້າ',
            'ຫົວໜ່ວຍ',
            'ຈຳນວນ',
            'ລາຄາຕໍ່ຫົວໜ່ວຍ',
            'ຈຳນວນຄົງເຫຼືອ',
            'ຈຳນວນສັ່ງຊື້ 1',
            'ລາຄາສັ່ງຊື້ 1',
            'ວັນທີສັ່ງຊື້ 1',
            'ຈຳນວນສັ່ງຊື້ 2',
            'ລາຄາສັ່ງຊື້ 2',
            'ວັນທີສັ່ງຊື້ 2',
            'ຈ຾ນວນສັ່ງຊື້ 3',
            'ລາຄາສັ່ງຊື້ 3',
            'ວັນທີສັ່ງຊື້ 3',
            'ຈ຾ນວນສັ່ງຊື້ 4',
            'ລາຄາສັ່ງຊື້ 4',
            'ວັນທີສັ່ງຊື້ 4',
            'ຈ຾ນວນສັ່ງຊື້ 5',
            'ລາຄາສັ່ງຊື້ 5',
            'ວັນທີສັ່ງຊື້ 5',
            'ຈ຾ນວນສັ່ງຊື້ 6',
            'ລາຄາສັ່ງຊື້ 6',
            'ວັນທີສັ່ງຊື້ 6',
            'ຈ຾ນວນສັ່ງຊື້ 7',
            'ລາຄາສັ່ງຊື້ 7',
            'ວັນທີສັ່ງຊື້ 7',
            'ຈ຾ນວນສັ່ງຊື້ 8',
            'ລາຄາສັ່ງຊື້ 8',
            'ວັນທີສັ່ງຊື້ 8',
            'ຈ຾ນວນສັ່ງຊື້ 9',
            'ລາຄາສັ່ງຊື້ 9',
            'ວັນທີສັ່ງຊື້ 9',
            'ຈ຾ນວນສັ່ງຊື້ 10',
            'ລາຄາສັ່ງຊື້ 10',
            'ວັນທີສັ່ງຊື້ 10',
            'ຈ຾ນວນສັ່ງຊື້ 11',
            'ລາຄາສັ່ງຊື້ 11',
            'ວັນທີສັ່ງຊື້ 11',
            'ຈ຾ນວນສັ່ງຊື້ 12',
            'ລາຄາສັ່ງຊື້ 12',
            'ວັນທີສັ່ງຊື້ 12'
        ]        // สร้างข้อมูลสำหรับ Excel
        const excelData = allPrByDocNo.map((item, index) => [
            index + 1,
            item.PRODUCTCODE || '-',
            item.PRODUCTNAME || '-',
            item.UNITCODE || '-',
            item.QUANTITY || '-',
            item.UNITPRICE || '-',
            item.REMAINQTY || '-',
            item.qtytop1 || '-',
            item.pricetop1 || '-',
            item.datetop1 ? new Date(item.datetop1).toLocaleDateString('lo-LA') : '-',
            item.qtytop2 || '-',
            item.pricetop2 || '-',
            item.datetop2 ? new Date(item.datetop2).toLocaleDateString('lo-LA') : '-',
            item.qtytop3 || '-',
            item.pricetop3 || '-',
            item.datetop3 ? new Date(item.datetop3).toLocaleDateString('lo-LA') : '-',
            item.qtytop4 || '-',
            item.pricetop4 || '-',
            item.datetop4 ? new Date(item.datetop4).toLocaleDateString('lo-LA') : '-',
            item.qtytop5 || '-',
            item.pricetop5 || '-',
            item.datetop5 ? new Date(item.datetop5).toLocaleDateString('lo-LA') : '-',
            item.qtytop6 || '-',
            item.pricetop6 || '-',
            item.datetop6 ? new Date(item.datetop6).toLocaleDateString('lo-LA') : '-',
            item.qtytop7 || '-',
            item.pricetop7 || '-',
            item.datetop7 ? new Date(item.datetop7).toLocaleDateString('lo-LA') : '-',
            item.qtytop8 || '-',
            item.pricetop8 || '-',
            item.datetop8 ? new Date(item.datetop8).toLocaleDateString('lo-LA') : '-',
            item.qtytop9 || '-',
            item.pricetop9 || '-',
            item.datetop9 ? new Date(item.datetop9).toLocaleDateString('lo-LA') : '-',
            item.qtytop10 || '-',
            item.pricetop10 || '-',
            item.datetop10 ? new Date(item.datetop10).toLocaleDateString('lo-LA') : '-',
            item.qtytop11 || '-',
            item.pricetop11 || '-',
            item.datetop11 ? new Date(item.datetop11).toLocaleDateString('lo-LA') : '-',
            item.qtytop12 || '-',
            item.pricetop12 || '-',
            item.datetop12 ? new Date(item.datetop12).toLocaleDateString('lo-LA') : '-'
        ])

        // สร้าง workbook และ worksheet
        const ws = XLSX.utils.aoa_to_sheet([headers, ...excelData])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'ສິນຄ້າສັ່ງຊື້')

        // สร้างชื่อไฟล์
        const fileName = `${docNo}_${new Date().toISOString().split('T')[0]}.xlsx`

        // Export ไฟล์
        XLSX.writeFile(wb, fileName)
    }

    return {
        poByDocNo: paginatedPrByDocNo,
        allPrByDocNo,
        filteredPrByDocNo,
        loading,
        error,
        currentPage,
        limit,
        searchTerm,
        totalPages,
        totalItems: filteredPrByDocNo.length,
        isClient,
        hasLoaded,
        refetch: fetchPrByDocNo,
        handlePageChange,
        handleLimitChange,
        handleSearch,
        handleApplyFilter,
        exportToExcel,
        currentOffice: user?.selectedOffice,
        apiUrl: user?.selectedApiUrl
    }
}
