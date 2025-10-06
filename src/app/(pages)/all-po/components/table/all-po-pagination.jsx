import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationLink,
    PaginationEllipsis,
    PaginationNext
} from '@/components'

const AllPoPagination = ({
    currentPage,
    totalPages,
    totalItems,
    isClient,
    onPageChange
}) => {
    // ไม่แสดง pagination ใน server-side
    if (!isClient) {
        return null
    }

    // สร้าง array ของหมายเลขหน้า (แสดงแค่ 3 หมายเลข)
    const getPageNumbers = () => {
        const pages = []
        
        if (totalPages <= 3) {
            // ถ้าจำนวนหน้าน้อยกว่าหรือเท่ากับ 3 หน้า แสดงทั้งหมด
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // แสดงแค่ 3 หมายเลข: หน้าแรก, หน้าปัจจุบัน, หน้าสุดท้าย
            pages.push(1) // หน้าแรก
            
            if (currentPage > 2) {
                pages.push('ellipsis') // ellipsis ถ้าหน้าปัจจุบันไม่ใช่หน้า 2
            }
            
            if (currentPage !== 1 && currentPage !== totalPages) {
                pages.push(currentPage) // หน้าปัจจุบัน (ถ้าไม่ใช่หน้าแรกหรือหน้าสุดท้าย)
            }
            
            if (currentPage < totalPages - 1) {
                pages.push('ellipsis') // ellipsis ถ้าหน้าปัจจุบันไม่ใช่หน้าสุดท้าย-1
            }
            
            pages.push(totalPages) // หน้าสุดท้าย
        }
        
        return pages
    }

    const pageNumbers = getPageNumbers()

    if (totalPages <= 1) {
        return null // ไม่แสดง pagination ถ้ามีแค่ 1 หน้า
    }

    return (
        <div>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>

                    {pageNumbers.map((page, index) => (
                        <PaginationItem key={index}>
                            {page === 'ellipsis' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    onClick={() => onPageChange(page)}
                                    isActive={currentPage === page}
                                    className="cursor-pointer"
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default AllPoPagination
