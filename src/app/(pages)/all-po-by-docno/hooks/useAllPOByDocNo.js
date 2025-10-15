import { useState, useEffect, useMemo, useCallback } from 'react'
import { getAllPOByDocNo } from '../api/allPoByDocNoApi'
import { useAuth } from '@/hooks/useAuth'
import * as XLSX from 'xlsx'

export const useAllPOByDocNo = (docNo) => {
    const [allPOByDocNo, setAllPOByDocNo] = useState([])
    const [loading, setLoading] = useState(false)
    const [hasLoaded, setHasLoaded] = useState(false)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(100)
    const [searchTerm, setSearchTerm] = useState('')
    const [isClient, setIsClient] = useState(false)
    const { user } = useAuth()

    useEffect(() => setIsClient(true), [])

    const fetchPOByDocNo = useCallback(async (params = {}) => {
        if (!docNo) return;
        
        setLoading(true)
        setError(null)
        setAllPOByDocNo([]) // Clear previous data when starting new fetch
        
        try {
            const result = await getAllPOByDocNo({
                page: 1,
                limit: params.limit || limit,
                docNo: docNo,
                search: params.search || searchTerm
            })
            
            if (result.success) {
                setAllPOByDocNo(result.data)
            } else {
                setError(result.error)
                setAllPOByDocNo([])
            }
        } catch (err) {
            setError(err.message)
            setAllPOByDocNo([])
        } finally {
            setLoading(false)
            setHasLoaded(true)
        }
    }, [docNo, limit, searchTerm])

    const filteredPOByDocNo = useMemo(() => {
        if (!isClient || !searchTerm.trim()) return allPOByDocNo
        
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
        
        return allPOByDocNo.filter(po => {
            const searchableFields = [
                // ข้อมูลสินค้า (ใช้ทั้งตัวใหญ่และตัวเล็ก)
                po.PRODUCTCODE || po.productcode,
                po.PRODUCTNAME || po.productname,
                po.PRODUCTNAMELA || po.productnamela,
                po.UNITCODE || po.unitcode,
                po.UNITCODELA || po.unitcodela,
                po.PRODUCTCODELA || po.productcodela,
                // ข้อมูลจำนวนและราคา (ใช้ทั้งตัวใหญ่และตัวเล็ก)
                po.QUANTITY || po.quantity,
                po.UNITPRICE || po.unitprice,
                po.REMAINQTY || po.remainqty,
                po.REFQTY || po.refqty,
                po.MINSTOCK || po.minstock,
                po.QTY1 || po.qty1,
                po.QTY2 || po.qty2,
                // ข้อมูลสั่งซื้อ 12 ครั้ง (ใช้ทั้งตัวใหญ่และตัวเล็ก)
                po.QTYTOP1 || po.qtytop1,
                po.PRICETOP1 || po.pricetop1,
                po.DATETOP1 || po.datetop1,
                po.QTYTOP2 || po.qtytop2,
                po.PRICETOP2 || po.pricetop2,
                po.DATETOP2 || po.datetop2,
                po.QTYTOP3 || po.qtytop3,
                po.PRICETOP3 || po.pricetop3,
                po.DATETOP3 || po.datetop3,
                po.QTYTOP4 || po.qtytop4,
                po.PRICETOP4 || po.pricetop4,
                po.DATETOP4 || po.datetop4,
                po.QTYTOP5 || po.qtytop5,
                po.PRICETOP5 || po.pricetop5,
                po.DATETOP5 || po.datetop5,
                po.QTYTOP6 || po.qtytop6,
                po.PRICETOP6 || po.pricetop6,
                po.DATETOP6 || po.datetop6,
                po.QTYTOP7 || po.qtytop7,
                po.PRICETOP7 || po.pricetop7,
                po.DATETOP7 || po.datetop7,
                po.QTYTOP8 || po.qtytop8,
                po.PRICETOP8 || po.pricetop8,
                po.DATETOP8 || po.datetop8,
                po.QTYTOP9 || po.qtytop9,
                po.PRICETOP9 || po.pricetop9,
                po.DATETOP9 || po.datetop9,
                po.QTYTOP10 || po.qtytop10,
                po.PRICETOP10 || po.pricetop10,
                po.DATETOP10 || po.datetop10,
                po.QTYTOP11 || po.qtytop11,
                po.PRICETOP11 || po.pricetop11,
                po.DATETOP11 || po.datetop11,
                po.QTYTOP12 || po.qtytop12,
                po.PRICETOP12 || po.pricetop12,
                po.DATETOP12 || po.datetop12
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
    }, [allPOByDocNo, searchTerm, isClient])

    const paginatedPOByDocNo = useMemo(() => {
        if (!isClient) return []
        const startIndex = (currentPage - 1) * 12
        return filteredPOByDocNo.slice(startIndex, startIndex + 12)
    }, [filteredPOByDocNo, currentPage, isClient])

    const totalPages = useMemo(() => {
        if (!isClient) return 1
        return Math.ceil(filteredPOByDocNo.length / 12)
    }, [filteredPOByDocNo.length, isClient])

    useEffect(() => {
        if (user && isClient && docNo) {
            fetchPOByDocNo()
        }
    }, [user, isClient, docNo, fetchPOByDocNo])

    const handlePageChange = (page) => setCurrentPage(page)
    const handleLimitChange = (newLimit) => setLimit(parseInt(newLimit))
    const handleSearch = (term) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }
    const handleApplyFilter = async () => {
        setCurrentPage(1)
        setLoading(true) // Set loading immediately when filter is applied
        await fetchPOByDocNo({ limit, search: searchTerm })
    }

    const exportToExcel = () => {
        if (!allPOByDocNo || allPOByDocNo.length === 0) {
            alert('ບໍ່ມີຂໍ້ມູນໃຫ້ສົ່ງອອກ')
            return
        }

        // สร้าง headers สำหรับ Excel
        const headers = [
            'ລຳດັບ',
            'ລະຫັດສິນຄ້າ',
            'ຊື່ສິນຄ້າ (ໄທ)',
            'ຫົວໜ່ວຍ (ໄທ)',
            'ຈຳນວນ',
            'ລາຄາຕໍ່ຫົວໜ່ວຍ',
            'ຈຳນວນຄົງເຫຼືອ',
            'ຈຳນວນອ້າງອີງ',
            'ລະຫັດສິນຄ້າ (ລາວ)',
            'ຊື່ສິນຄ້າ (ລາວ)',
            'ຫົວໜ່ວຍ (ລາວ)',
            'ສະຕ໋ອກຕໍ່າສຸດ',
            'ຈຳນວນ',
            'ຈຳນວນ 1',
            'ຈຳນວນ 2',
            'ຈຳນວນສັ່ງຊື້ 1',
            'ລາຄາສັ່ງຊື້ 1',
            'ວັນທີສັ່ງຊື້ 1',
            'ຈຳນວນສັ່ງຊື້ 2',
            'ລາຄາສັ່ງຊື້ 2',
            'ວັນທີສັ່ງຊື້ 2',
            'ຈຳນວນສັ່ງຊື້ 3',
            'ລາຄາສັ່ງຊື້ 3',
            'ວັນທີສັ່ງຊື້ 3',
            'ຈຳນວນສັ່ງຊື້ 4',
            'ລາຄາສັ່ງຊື້ 4',
            'ວັນທີສັ່ງຊື້ 4',
            'ຈຳນວນສັ່ງຊື້ 5',
            'ລາຄາສັ່ງຊື້ 5',
            'ວັນທີສັ່ງຊື້ 5',
            'ຈຳນວນສັ່ງຊື້ 6',
            'ລາຄາສັ່ງຊື້ 6',
            'ວັນທີສັ່ງຊື້ 6',
            'ຈຳນວນສັ່ງຊື້ 7',
            'ລາຄາສັ່ງຊື້ 7',
            'ວັນທີສັ່ງຊື້ 7',
            'ຈຳນວນສັ່ງຊື້ 8',
            'ລາຄາສັ່ງຊື້ 8',
            'ວັນທີສັ່ງຊື້ 8',
            'ຈຳນວນສັ່ງຊື້ 9',
            'ລາຄາສັ່ງຊື້ 9',
            'ວັນທີສັ່ງຊື້ 9',
            'ຈຳນວນສັ່ງຊື້ 10',
            'ລາຄາສັ່ງຊື້ 10',
            'ວັນທີສັ່ງຊື້ 10',
            'ຈຳນວນສັ່ງຊື້ 11',
            'ລາຄາສັ່ງຊື້ 11',
            'ວັນທີສັ່ງຊື້ 11',
            'ຈຳນວນສັ່ງຊື້ 12',
            'ລາຄາສັ່ງຊື້ 12',
            'ວັນທີສັ່ງຊື້ 12'
        ]

        // สร้างข้อมูลสำหรับ Excel
        const excelData = allPOByDocNo.map((item, index) => [
            index + 1,
            item.PRODUCTCODE || '-',
            item.PRODUCTNAME || '-',
            item.UNITCODE || '-',
            item.QUANTITY || '-',
            item.UNITPRICE || '-',
            item.REMAINQTY || '-',
            item.REFQTY || '-',
            item.PRODUCTCODELA || '-',
            item.PRODUCTNAMELA || '-',
            item.UNITCODELA || '-',
            item.MINSTOCK || '-',
            item.QTY || '-',
            item.QTY1 || '-',
            item.QTY2 || '-',
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
        const fileName = `ລາຍການສັ່ງຊື້ຈາກລະຫັດ_${docNo}_${new Date().toISOString().split('T')[0]}.xlsx`

        // Export ไฟล์
        XLSX.writeFile(wb, fileName)
    }

    return {
        poByDocNo: paginatedPOByDocNo,
        allPOByDocNo,
        filteredPOByDocNo,
        loading,
        error,
        currentPage,
        limit,
        searchTerm,
        totalPages,
        totalItems: filteredPOByDocNo.length,
        isClient,
        hasLoaded,
        refetch: fetchPOByDocNo,
        handlePageChange,
        handleLimitChange,
        handleSearch,
        handleApplyFilter,
        exportToExcel,
        currentOffice: user?.selectedOffice,
        apiUrl: user?.selectedApiUrl
    }
}
