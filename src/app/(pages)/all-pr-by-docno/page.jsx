'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Title, SubTitle, LoadingSpinner } from '@/components'
import AllPrByDocNoTable from './components/table/all-pr-by-docno-table'
import AllPrByDocNoFilter from './components/filter/all-pr-by-docno-filter'
import { useAllPrByDocNo } from './hooks/useAllPRByDocNo'

function AllPrByDocNoContent() {
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
        hasLoaded,
        handlePageChange,
        handleLimitChange,
        handleSearch,
        handleApplyFilter,
        exportToExcel
    } = useAllPrByDocNo(docNo)

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
            <Title>ສັ່ງຊື້ຕາມເລກທີ່ເອກະສານ (Product request by document number)</Title>
            <div className="grid md:grid-cols-2 mb-4">
                <SubTitle>
                    ສະແດງລາຍການຂໍ້ມູນຄຳຂໍສັ່ງຊື້ໃນເອກະສານເລກທີ່: <span className="font-medium text-sky-400">{docNo}</span>
                </SubTitle>
            </div>

            <hr className="hidden md:block my-4" />

            <div className="w-full max-w-full">
                <AllPrByDocNoFilter 
                    limit={limit}
                    searchTerm={searchTerm}
                    onLimitChange={handleLimitChange}
                    onSearchChange={handleSearch}
                    onApplyFilter={handleApplyFilter}
                    onExportExcel={exportToExcel}
                />
            </div>

            <div className="w-full max-w-full mt-4">
                <AllPrByDocNoTable 
                    poByDocNo={poByDocNo}
                    loading={loading}
                    error={error}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    isClient={isClient}
                    hasLoaded={hasLoaded}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    )
}

export default function AllPrByDocNoPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <AllPrByDocNoContent />
        </Suspense>
    )
}
