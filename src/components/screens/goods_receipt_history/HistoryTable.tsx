import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StandardPagination } from "@/components/customs/StandardPagination";

const StatusBadge = ({ status }: { status: string }) => {
  switch (status?.toUpperCase()) {
    case 'APPROVED':
    case 'CONFIRMED':
    case 'SUCCESS':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">ຍືນຍັນແລ້ວ</span>;
    case 'RECEIVED':
    case 'ຮັບແລ້ວ':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">ຮັບແລ້ວ</span>;
    case 'IN_REVIEW':
    case 'WAITING':
    case 'ລໍຖ້າຢືນຢັນ':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">ລໍຖ້າຢືນຢັນ</span>;
    case 'CANCELLED':
    case 'UNCONFIRMED':
    case 'REJECTED':
    case 'ບໍ່ຍືນຢັນ':
    case 'ບໍ່ຢືນຢັນ':
    case 'ຍົກເລີກ':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">ຍົກເລີກ</span>;
    case 'DRAFT':
    case 'ຮ່າງ':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">ຮ່າງ</span>;
    case 'PARTIAL':
    case 'ຮັບບາງສ່ວນ':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">ຮັບບາງສ່ວນ</span>;
    default:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status || 'N/A'}</span>;
  }
};

interface HistoryTableProps {
  data: any;
  loading: boolean;
  page: number;
  setPage: (val: number) => void;
  limit: number;
  setLimit: (val: number) => void;
}

export function HistoryTable({ data, loading, page, setPage, limit, setLimit }: HistoryTableProps) {
  // Extract list properly whether it's wrapped in { items: [] }, { data: [] }, { rows: [] }, or direct array
  const rawList = Array.isArray(data)
    ? data
    : (data?.items || data?.data || data?.rows || data?.list || []);

  // Extract pagination metadata from server response
  const apiTotal =
    data?.total ??
    data?.totalItems ??
    data?.count ??
    data?.pagination?.total ??
    data?.pagination?.totalItems ??
    data?.meta?.total ??
    null;

  const apiTotalPages =
    data?.totalPages ??
    data?.pagination?.totalPages ??
    data?.meta?.totalPages ??
    null;

  const isServerPaginated = apiTotal != null || apiTotalPages != null;
  const parsedLimit = Math.max(1, Number(limit) || 10);

  const totalItems = apiTotal != null ? Number(apiTotal) : rawList.length;
  const totalPages = Math.max(
    1,
    apiTotalPages != null ? Number(apiTotalPages) : Math.ceil(totalItems / parsedLimit)
  );

  // If server didn't paginate (or sent all records at once), slice on the client
  const items = isServerPaginated
    ? rawList
    : rawList.slice((page - 1) * parsedLimit, page * parsedLimit);

  return (
    <div className="bg-white rounded-lg border shadow-sm flex flex-col">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#1A368F] hover:bg-[#1A368F]">
              <TableHead className="text-white font-semibold text-center w-16">ລຳດັບ</TableHead>
              <TableHead className="text-white font-semibold">ເລກທີ PO</TableHead>
              <TableHead className="text-white font-semibold">Supplier</TableHead>
              <TableHead className="text-white font-semibold">ວັນທີຮັບ</TableHead>
              <TableHead className="text-white font-semibold">ຜູ້ຮັບສິນຄ້າ</TableHead>
              <TableHead className="text-white font-semibold text-center">ສະຖານະ</TableHead>
              <TableHead className="text-white font-semibold text-center w-24">ຈັດການ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 font-bold text-gray-500">ກຳລັງໂຫລດຂໍ້ມູນ...</TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 font-bold text-gray-500">ບໍ່ພົບຂໍ້ມູນ</TableCell>
              </TableRow>
            ) : (
              items.map((row: any, idx: number) => (
                <TableRow key={row.grid || `history-${idx}`}>
                  <TableCell className="text-center text-gray-500">{(page - 1) * parsedLimit + idx + 1}</TableCell>
                  <TableCell className="font-medium text-gray-900">{row.purchaseOrder?.docno || row.pocode || row.poNumber || '-'}</TableCell>
                  <TableCell className="text-gray-500">{row.supplier?.apname || row.companyName || '-'}</TableCell>
                  <TableCell className="text-gray-500">{row.documentDate || row.receivedDate || '-'}</TableCell>
                  <TableCell className="text-gray-900 font-medium">{row.driverName || row.creatorName || row.receiverName || '-'}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={row.status || row.approvalStatus} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/goods_receipt/${row.grid || row.grcode}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 min-w-[72px] border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-bold px-4 rounded-xl shadow-sm"
                      >
                        ເບິ່ງ
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <StandardPagination
        page={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />
    </div>
  );
}
