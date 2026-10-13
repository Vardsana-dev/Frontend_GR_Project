import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GrReportItem, PaginationInfo } from "@/hooks/gr-report-hook/useGetGrReport";
import { StandardPagination } from "@/components/customs/StandardPagination";

interface ReportTableProps {
  data: GrReportItem[];
  pagination: PaginationInfo | null;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function ReportTable({ data, pagination, onPageChange, onLimitChange }: ReportTableProps) {
  const formatAmount = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "—";
    return new Intl.NumberFormat("lo-LA", {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate totals
  const totals = data.reduce(
    (acc, row) => ({
      poValue: acc.poValue + (row.purchaseOrder?.amount || 0),
      invoiceValue: acc.invoiceValue + (row.invoiceAmount || 0),
      damagedValue: acc.damagedValue + (row.damagedAmount || 0),
      incompleteValue: acc.incompleteValue + (row.shortAmount || 0),
      otherValue: acc.otherValue + (row.otherAmount || 0),
      receivedValue: acc.receivedValue + (row.receivedAmount || 0),
    }),
    {
      poValue: 0,
      invoiceValue: 0,
      damagedValue: 0,
      incompleteValue: 0,
      otherValue: 0,
      receivedValue: 0,
    }
  );

  return (
    <Card className="shadow-sm border-gray-200/60 rounded-2xl overflow-hidden mt-6">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#1f2937]">ລາຍລະອຽດການກວດຮັບສິນຄ້າ</h2>
        <div className="text-sm">
          <span className="text-gray-500">ສະແດງສະເພາະ: </span>
          <span className="bg-blue-50 text-[#1e40af] px-3 py-1 rounded-md font-medium">ທັງໝົດ ({pagination?.total || data.length})</span>
        </div>
      </div>
      
      <CardContent className="p-0 overflow-x-auto">
        <Table className="min-w-[1200px]">
          <TableHeader>
            {/* Top grouped headers */}
            <TableRow className="bg-[#1e3a8a] hover:bg-[#1e3a8a]">
              <TableHead colSpan={5} className="text-white bg-transparent h-12 text-center text-base border-r border-[#2d4b9e]">
                ໃບສັ່ງຊື້ PO
              </TableHead>
              <TableHead colSpan={6} className="text-white bg-transparent h-12 text-center text-base">
                ການກວດຮັບເຄື່ອງ
              </TableHead>
            </TableRow>
            {/* Sub headers */}
            <TableRow className="bg-[#1e3a8a] hover:bg-[#1e3a8a] border-t border-[#2d4b9e]">
              <TableHead className="text-center font-semibold text-white py-3 w-[60px]">ລຳດັບ</TableHead>
              <TableHead className="font-semibold text-white w-[120px]">ລະຫັດເຈົ້າໜີ້</TableHead>
              <TableHead className="font-semibold text-white w-[140px]">ເລກທີ PO</TableHead>
              <TableHead className="font-semibold text-white">ຜູ້ສະໜອງ</TableHead>
              <TableHead className="text-right font-semibold text-white w-[120px] border-r border-[#2d4b9e]">ມູນຄ່າ</TableHead>
              
              <TableHead className="text-right font-semibold text-white w-[120px]">ມູນຄ່າ Invoice</TableHead>
              <TableHead className="text-right font-semibold text-white w-[120px]">ມູນຄ່າຊຳລຸດ</TableHead>
              <TableHead className="text-right font-semibold text-white w-[120px]">ມາບໍ່ຄົບ</TableHead>
              <TableHead className="text-right font-semibold text-white w-[100px]">ອື່ນໆ</TableHead>
              <TableHead className="text-right font-semibold text-white w-[120px]">ຮັບເຂົ້າສາງ</TableHead>
              <TableHead className="font-semibold text-white pl-6">ໝາຍເຫດ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                  ບໍ່ມີຂໍ້ມູນ
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={row.grid} className="hover:bg-gray-50 border-b border-gray-100">
                  <TableCell className="text-center text-gray-700">{(pagination?.page ? (pagination.page - 1) * pagination.limit : 0) + idx + 1}</TableCell>
                  <TableCell className="font-semibold text-gray-900">{row.supplier?.apcode}</TableCell>
                  <TableCell className="font-semibold text-[#1e40af]">{row.purchaseOrder?.docno}</TableCell>
                  <TableCell className="text-gray-600 max-w-[200px] truncate" title={row.supplier?.apname}>
                    {row.supplier?.apname}
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-700 border-r border-gray-200">
                    {formatAmount(row.purchaseOrder?.amount)}
                  </TableCell>

                  <TableCell className="text-right text-gray-700">{formatAmount(row.invoiceAmount)}</TableCell>
                  <TableCell className="text-right text-gray-700">{formatAmount(row.damagedAmount)}</TableCell>
                  <TableCell className="text-right text-gray-700">{formatAmount(row.shortAmount)}</TableCell>
                  <TableCell className="text-right text-gray-700">{formatAmount(row.otherAmount)}</TableCell>
                  <TableCell className="text-right font-bold text-[#1e40af]">{formatAmount(row.receivedAmount)}</TableCell>
                  <TableCell className="text-gray-500 pl-6 text-xs max-w-[200px] truncate" title={row.remark || row.damageNotes || ""}>
                    {row.remark || row.damageNotes || ""}
                  </TableCell>
                </TableRow>
              ))
            )}
            
            {/* Totals Row */}
            {data.length > 0 && (
              <TableRow className="bg-blue-50/50 hover:bg-blue-50/50">
                <TableCell colSpan={4} className="text-center font-bold text-[#1e40af]">
                  ລວມ
                </TableCell>
                <TableCell className="text-right font-bold text-[#1e40af] border-r border-gray-200">
                  {formatAmount(totals.poValue)}
                </TableCell>
                <TableCell className="text-right font-bold text-[#1e40af]">{formatAmount(totals.invoiceValue)}</TableCell>
                <TableCell className="text-right font-bold text-[#1e40af]">{formatAmount(totals.damagedValue)}</TableCell>
                <TableCell className="text-right font-bold text-[#1e40af]">{formatAmount(totals.incompleteValue)}</TableCell>
                <TableCell className="text-right font-bold text-[#1e40af]">{formatAmount(totals.otherValue)}</TableCell>
                <TableCell className="text-right font-bold text-[#1e40af]">{formatAmount(totals.receivedValue)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 0 && (
          <StandardPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            limit={pagination.limit}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
          />
        )}
      </CardContent>
    </Card>
  );
}
