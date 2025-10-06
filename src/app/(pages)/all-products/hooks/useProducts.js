import { useState, useEffect, useMemo, useCallback } from 'react'
import { getAllProducts } from '../api/productsApi'
import { useAuth } from '@/hooks/useAuth'

export const useProducts = () => {
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(100)
    const [searchTerm, setSearchTerm] = useState('')
    const [isClient, setIsClient] = useState(false)
    const { user } = useAuth()

    useEffect(() => setIsClient(true), [])

    const fetchProducts = useCallback(async (params = {}) => {
        setLoading(true)
        setError(null)
        
        try {
            const result = await getAllProducts({
                page: 1,
                limit: params.limit || limit,
                search: params.search || searchTerm
            })
            
            if (result.success) {
                setAllProducts(result.data)
            } else {
                setError(result.error)
                setAllProducts([])
            }
        } catch (err) {
            setError(err.message)
            setAllProducts([])
        } finally {
            setLoading(false)
        }
    }, [limit, searchTerm])

    const filteredProducts = useMemo(() => {
        if (!isClient) return allProducts
        if (!searchTerm.trim()) return allProducts
        
        const searchLower = searchTerm.toLowerCase()
        return allProducts.filter(product => {
            const searchableFields = [
                product.CODE,
                product.OLDCODE,
                product.NAMETH,
                product.NAMEEN,
                product.STOCKUNIT,
                product.SALEUNIT,
                product.POUNIT,
                product.GRWAREHOUSE,
                product.GRLOCATION,
                product.MINSTOCK,
                product.SAFETYSTOCK,
                product.CLOSEFLAG,
                product.csproduct?.MAINGROUP,
                product.csproduct?.SUBGROUP,
                product.csproduct?.BRAND,
                product.csproduct?.MODEL,
                product.csproduct?.SPEC,
                product.csproduct?.COLOR,
                product.csproduct?.SIZE,
                product.csproduct?.WEIGHT,
                product.csproduct?.VOLUME,
                product.csproduct?.DIMENSION,
                product.csproduct?.MATERIAL,
                product.csproduct?.ORIGIN,
                product.csproduct?.SUPPLIER,
                product.csproduct?.MANUFACTURER,
                product.csproduct?.WARRANTY,
                product.csproduct?.EXPIRY,
                product.csproduct?.BATCH,
                product.csproduct?.SERIAL,
                product.csproduct?.BARCODE,
                product.csproduct?.QRCODE,
                product.csproduct?.TAG,
                product.csproduct?.NOTE,
                product.csproduct?.DESCRIPTION,
                product.csproduct?.REMARK
            ]
            return searchableFields.some(field => 
                field?.toString().toLowerCase().includes(searchLower)
            )
        })
    }, [allProducts, searchTerm, isClient])

    const paginatedProducts = useMemo(() => {
        if (!isClient) return []
        const startIndex = (currentPage - 1) * 10
        return filteredProducts.slice(startIndex, startIndex + 10)
    }, [filteredProducts, currentPage, isClient])

    const totalPages = useMemo(() => {
        if (!isClient) return 1
        return Math.ceil(filteredProducts.length / 10)
    }, [filteredProducts.length, isClient])

    useEffect(() => {
        if (user && isClient) {
            fetchProducts()
        }
    }, [user, isClient, fetchProducts])

    const handlePageChange = (page) => setCurrentPage(page)
    const handleLimitChange = (newLimit) => setLimit(parseInt(newLimit))
    const handleSearch = (term) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }
    const handleApplyFilter = async () => {
        setCurrentPage(1)
        await fetchProducts({ limit, search: searchTerm })
    }

    return {
        products: paginatedProducts,
        allProducts,
        filteredProducts,
        loading,
        error,
        currentPage,
        limit,
        searchTerm,
        totalPages,
        totalItems: filteredProducts.length,
        isClient,
        refetch: fetchProducts,
        handlePageChange,
        handleLimitChange,
        handleSearch,
        handleApplyFilter,
        currentOffice: user?.selectedOffice,
        apiUrl: user?.selectedApiUrl
    }
}