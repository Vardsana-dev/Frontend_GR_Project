'use client'

import { Title, SubTitle } from '@/components'
import AllPoTable from './components/table/all-po-table'
import AllPoFilter from './components/filter/all-po-filter'
import { useAllPO } from './hooks/useAllPO'

export default function AllPOPage() {
    const {
        po,
        loading,
        error,
        currentPage,
        limit,
        searchTerm,
        level,
        totalPages,
        totalItems,
        isClient,
        hasLoaded,
        handlePageChange,
        handleLimitChange,
        handleLevelChange,
        handleSearch,
        handleApplyFilter
    } = useAllPO()

    return (
        <div className="w-full max-w-full overflow-hidden">
            <Title>ສັ່ງຊື້ທັງໝົດ (All PO)</Title>
            <div className="grid md:grid-cols-2 mb-4">
                <SubTitle>ສະແດງລາຍການຂໍ້ມູນສັ່ງຊື້ທັງໝົດໃນຕາລາງ</SubTitle>
            </div>

            <hr className="hidden md:block my-4" />

            <div className="w-full max-w-full">
                <AllPoFilter 
                    limit={limit}
                    searchTerm={searchTerm}
                    level={level}
                    onLimitChange={handleLimitChange}
                    onSearchChange={handleSearch}
                    onLevelChange={handleLevelChange}
                    onApplyFilter={handleApplyFilter}
                />
            </div>

            <div className="w-full max-w-full mt-4">
                <AllPoTable 
                    po={loading ? [] : po} // Show empty data while loading
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