'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Title, SubTitle, LoadingSpinner } from '@/components'
import AllPoByDocNoTable from './components/table/all-po-by-docno-table'
import AllPoByDocNoFilter from './components/filter/all-po-by-docno-filter'
import { useAllPOByDocNo } from './hooks/useAllPOByDocNo'

function AllPoByDocNoContent() {
    const searchParams = useSearchParams()
    const [docNo, setDocNo] = useState('')
    const [isInitialized, setIsInitialized] = useState(false)

    const {
        poByDocNo,
        loading,
        error,
        currentPage,
        limit,
        searchTerm,
        totalPages,
        totalItems,
        isClient,
        handlePageChange,
        handleLimitChange,
        handleSearch,
        handleApplyFilter,
        exportToExcel
    } = useAllPOByDocNo(docNo)
    
    useEffect(() => {
        if (!isInitialized) {
            const docNoFromUrl = searchParams.get('docNo');
            if (docNoFromUrl) {
                setDocNo(docNoFromUrl);
                setIsInitialized(true);
            }
        }
    }, [searchParams, isInitialized]);

    return (
        <div className="w-full max-w-full overflow-hidden">
            <Title>ສັ່ງຊື້ຕາມເລກທີ່ເອກະສານ (All PO by DocNo)</Title>
            <div className="grid md:grid-cols-2 mb-4">
                <SubTitle>
                    ສະແດງລາຍການຂໍ້ມູນທັງໝົດໃນເອກະສານເລກທີ່: <span className="font-medium text-sky-400">{docNo}</span>
                </SubTitle>
            </div>

            <hr className="hidden md:block my-4" />

            <div className="w-full max-w-full">
                <AllPoByDocNoFilter 
                    limit={limit}
                    searchTerm={searchTerm}
                    onLimitChange={handleLimitChange}
                    onSearchChange={handleSearch}
                    onApplyFilter={handleApplyFilter}
                    onExportExcel={exportToExcel}
                />
            </div>

            <div className="w-full max-w-full mt-4">
                <AllPoByDocNoTable 
                    poByDocNo={poByDocNo}
                    loading={loading}
                    error={error}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    isClient={isClient}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    )
}

export default function AllPoByDocNoPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <AllPoByDocNoContent />
        </Suspense>
    )
}
