'use client'

import { Title, SubTitle } from '@/components'
import AllProductTable from './components/table/all-product-table'
import AllProductFilter from './components/filter/all-product-filter'
import { useProducts } from './hooks/useProducts'

export default function AllProductsPage() {
    const {
        products,
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
    } = useProducts()

    return (
        <div className="w-full max-w-full overflow-hidden">
            <Title>ສິນຄ້າ (Products)</Title>
            <div className="grid md:grid-cols-2 mb-4">
                <SubTitle>ສະແດງລາຍການຂໍ້ມູນສິນຄ້າໃນຕາລາງ</SubTitle>
            </div>

            <hr className="hidden md:block my-4" />

            <div className="w-full max-w-full">
                <AllProductFilter 
                    limit={limit}
                    searchTerm={searchTerm}
                    onLimitChange={handleLimitChange}
                    onSearchChange={handleSearch}
                    onApplyFilter={handleApplyFilter}
                />
            </div>

            <div className="w-full max-w-full mt-4">
                <AllProductTable 
                    products={products}
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