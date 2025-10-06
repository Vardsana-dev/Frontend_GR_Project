'use client'

import { Title, SubTitle } from '@/components'
import AllPrTable from './components/table/all-pr-table'
import AllPoFilter from './components/filter/all-pr-filter'
import { useAllPO } from './hooks/useAllPR'

export default function AllPOPage() {
    const {
        po,
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
        handleApplyFilter
    } = useAllPO()

    return (
        <div className="w-full max-w-full overflow-hidden">
            <Title>ສັ່ງຊື້ (Product request)</Title>
            <div className="grid md:grid-cols-2 mb-4">
                <SubTitle>ສະແດງລາຍການຂໍ້ມູນຄຳຂໍສັ່ງຊື້ໃນຕາລາງ</SubTitle>
            </div>

            <hr className="hidden md:block my-4" />

            <div className="w-full max-w-full">
                <AllPoFilter 
                    limit={limit}
                    searchTerm={searchTerm}
                    onLimitChange={handleLimitChange}
                    onSearchChange={handleSearch}
                    onApplyFilter={handleApplyFilter}
                />
            </div>

            <div className="w-full max-w-full mt-4">
                <AllPrTable 
                    po={po}
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