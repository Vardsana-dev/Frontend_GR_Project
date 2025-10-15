'use client'

import dynamic from 'next/dynamic'
import { Title, SubTitle } from '@/components'
import AllPrFilter from './components/filter/all-pr-filter'
import { useAllPR } from './hooks/useAllPR'
import { usePRDepartment } from '../pr-department/hooks/usePRDepartment'

const AllPrTable = dynamic(() => import('./components/table/all-pr-table'), { ssr: false })

export default function AllPRPage() {
    const {
        pr,
        allPR,
        loading,
        error,
        currentPage,
        limit,
        searchTerm,
        department,
        totalPages,
        totalItems,
        isClient,
        hasLoaded,
        handlePageChange,
        handleLimitChange,
        handleSearch,
        handleDepartmentChange,
        handleApplyFilter
    } = useAllPR()

    return (
        <div className="w-full max-w-full overflow-hidden">
            <Title>ສັ່ງຊື້ (Product request)</Title>
            <div className="grid md:grid-cols-2 mb-4">
                <SubTitle>ສະແດງລາຍການຂໍ້ມູນຄຳຂໍສັ່ງຊື້ໃນຕາລາງ</SubTitle>
            </div>

            <hr className="hidden md:block my-4" />

            <div className="w-full max-w-full">
                <AllPrFilter
                    limit={limit}
                    searchTerm={searchTerm}
                    department={department}
                    onLimitChange={handleLimitChange}
                    onSearchChange={handleSearch}
                    onDepartmentChange={handleDepartmentChange}
                    onApplyFilter={handleApplyFilter}
                    usePRDepartment={usePRDepartment}
                />
            </div>

            <div className="w-full max-w-full mt-4">
                <AllPrTable 
                    pr={loading ? [] : pr} // Show empty data while loading
                    allPR={loading ? [] : allPR} // Clear table data while loading
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