'use client';
import React, { useState, useEffect } from 'react';
import { useGetAllGr } from '@/hooks/gr-hook/useGetAllGr';
import { useCancelDraftGr } from '@/hooks/gr-hook/useCancelDraftGr';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Calendar as CalendarIcon, AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CreateGoodsReceiptModal } from '../search_po/CreateGoodsReceiptModal';
import { StandardPagination } from '@/components/customs/StandardPagination';
import { formatCurrency } from '@/lib/currency';

// We use dynamic data from the hook instead of mock data
export function GoodsReceiptSection() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [apcode, setApcode] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { loading, error, data, fetchAllGr } = useGetAllGr();
  const { cancelDraftGr, loading: isCancelling } = useCancelDraftGr();
  const [selectedGrToCancel, setSelectedGrToCancel] = useState<any | null>(null);
  const [cancelErrorMessage, setCancelErrorMessage] = useState<string>("");
  const [isCancelErrorOpen, setIsCancelErrorOpen] = useState<boolean>(false);

  const refreshList = React.useCallback(() => {
    fetchAllGr({
      search,
      startDate,
      endDate,
      status,
      apcode,
      page,
      limit,
    });
  }, [fetchAllGr, search, startDate, endDate, status, apcode, page, limit]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const handleConfirmCancel = async () => {
    if (!selectedGrToCancel) return;
    const targetGrid = selectedGrToCancel.grid ?? selectedGrToCancel.id ?? selectedGrToCancel.grcode;

    const res = await cancelDraftGr(targetGrid);
    if (res.success) {
      setSelectedGrToCancel(null);
      refreshList();
    } else {
      setSelectedGrToCancel(null);
      setCancelErrorMessage(res.error || "ເກີດຂໍ້ຜິດພາດໃນການຍົກເລີກ");
      setIsCancelErrorOpen(true);
    }
  };

  const rawList = Array.isArray(data) ? data : (data?.items || data?.data || data?.rows || []);
  const apiTotal = data?.total ?? data?.totalItems ?? data?.count ?? data?.pagination?.total ?? null;
  const isServerPaginated = apiTotal != null || data?.totalPages != null || data?.pagination?.totalPages != null;

  const totalItems = apiTotal != null ? Number(apiTotal) : rawList.length;
  const parsedLimit = Math.max(1, Number(limit) || 10);
  const totalPages = Math.max(1, data?.totalPages ?? data?.pagination?.totalPages ?? Math.ceil(totalItems / parsedLimit));

  const items = isServerPaginated ? rawList : rawList.slice((page - 1) * parsedLimit, page * parsedLimit);

  // Status rendering helper
  const renderStatus = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'RECEIVED':
      case 'ຮັບແລ້ວ':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">ຮັບແລ້ວ</span>;
      case 'DRAFT':
      case 'ຮ່າງ':
        return <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">ຮ່າງ</span>;
      case 'CANCELLED':
      case 'ຍົກເລີກ':
      case 'ບໍ່ຢືນຢັນ':
      case 'ບໍ່ຍືນຢັນ':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">ຍົກເລີກ</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">{status || 'N/A'}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* Top Search & Action */}
      <div className="flex items-center gap-4 justify-between">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="ຄົ້ນຫາ GR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setPage(1);
                fetchAllGr({
                  search,
                  startDate,
                  endDate,
                  status,
                  apcode,
                  page: 1,
                  limit,
                });
              }
            }}
            className="pl-12 h-12 bg-gray-100/80 border-transparent rounded-2xl text-base font-medium shadow-sm focus-visible:ring-blue-500 w-full"
          />
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-12 px-8 bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm text-base"
        >
          ຮັບສິນຄ້າ
        </Button>
      </div>

      {/* Filter Card */}
      <Card className="shadow-sm border-gray-200/60 rounded-2xl bg-white overflow-hidden py-0 gap-0">
        <CardContent className="p-6">
          <div className="flex flex-wrap md:flex-nowrap items-end gap-5">

            {/* Start Date */}
            <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
              <label className="text-sm font-bold text-gray-600">ວັນທີເລີ່ມ</label>
              <div className="relative">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-11 bg-blue-50/50 border-gray-200 text-[#1e3a8a] font-bold rounded-xl pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1e3a8a] pointer-events-none" />
              </div>
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
              <label className="text-sm font-bold text-gray-600">ວັນທີສິ້ນສຸດ</label>
              <div className="relative">
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-11 bg-blue-50/50 border-gray-200 text-[#1e3a8a] font-bold rounded-xl pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1e3a8a] pointer-events-none" />
              </div>
            </div>

            {/* Company Name */}
            {/* <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
              <label className="text-sm font-bold text-gray-600">ຊື່ບໍລິສັດ</label>
              <Select value={apcode} onValueChange={setApcode}>
                <SelectTrigger className="h-11 bg-blue-50/50 border-gray-200 text-[#1e3a8a] font-bold rounded-xl">
                  <SelectValue placeholder="ທັງໝົດ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ທັງໝົດ</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* Status */}
            <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
              <label className="text-sm font-bold text-gray-600">ສະຖານະ</label>
              <Select value={status} onValueChange={(val) => { setStatus(val); setPage(1); }}>
                <SelectTrigger className="h-11 bg-blue-50/50 border-gray-200 text-[#1e3a8a] font-bold rounded-xl">
                  <SelectValue placeholder="ທັງໝົດ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ທັງໝົດ</SelectItem>
                  <SelectItem value="RECEIVED">ຮັບແລ້ວ</SelectItem>
                  <SelectItem value="DRAFT">ຮ່າງ</SelectItem>
                  <SelectItem value="CANCELLED">ຍົກເລີກ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <Button
              onClick={() => {
                setPage(1);
                fetchAllGr({
                  search,
                  startDate,
                  endDate,
                  status,
                  apcode,
                  page: 1,
                  limit,
                });
              }}
              className="h-11 px-8 bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm text-sm shrink-0"
            >
              ຄົ້ນຫາ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="shadow-sm border-gray-200/60 rounded-2xl bg-white overflow-hidden py-0 gap-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#244195] hover:bg-[#244195] border-b-0">
                <TableHead className="text-white font-bold text-center h-12 w-[80px]">ລຳດັບ</TableHead>
                <TableHead className="text-white font-bold h-12">ເລກທີເອກະສານ</TableHead>
                <TableHead className="text-white font-bold h-12">ຊື່ບໍລິສັດ</TableHead>
                <TableHead className="text-white font-bold text-center h-12">ວັນທີຮັບ</TableHead>
                <TableHead className="text-white font-bold text-center h-12">ມູນຄ່າ</TableHead>
                <TableHead className="text-white font-bold text-center h-12">ສະຖານະ</TableHead>
                <TableHead className="text-white font-bold text-center h-12 min-w-[220px]">ຈັດການ</TableHead>
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
                items.map((gr: any, idx: number) => {
                  const statusStr = (gr.status || gr.approvalStatus || gr.receiptStatus || '').toUpperCase();
                  const isDraft = statusStr === 'DRAFT' || statusStr === 'ຮ່າງ';
                  const poCode = gr.purchaseOrder?.docno || gr.pocode || gr.poNumber || gr.purchaseOrder?.ponumber || gr.docno || gr.grcode || 'PO';
                  const grId = gr.grid || gr.grcode;

                  return (
                    <TableRow key={gr.grid || gr.grcode || `gr-${idx}`} className="hover:bg-gray-50 border-b border-gray-100">
                      <TableCell className="text-center font-medium text-gray-400">{(page - 1) * limit + idx + 1}</TableCell>
                      <TableCell className="font-bold text-gray-900">{gr.grcode || '-'}</TableCell>
                      <TableCell className="text-gray-500 font-medium">{gr.supplier?.apname || '-'}</TableCell>
                      <TableCell className="text-center font-medium text-gray-500">{gr.documentDate || '-'}</TableCell>
                      <TableCell className="text-center font-black text-gray-900">
                        {formatCurrency(gr.totalAmount ?? gr.netAmount, gr.currencyCode)}
                      </TableCell>
                      <TableCell className="text-center">
                        {renderStatus(gr.status || gr.approvalStatus)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/goods_receipt/${grId}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 min-w-[64px] border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-bold px-3 rounded-xl shadow-sm"
                            >
                              ເບິ່ງ
                            </Button>
                          </Link>

                          {isDraft && (
                            <>
                              <Link href={`/search_po/${encodeURIComponent(poCode)}/create?grid=${grId}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 min-w-[64px] border-[#2563eb] text-[#2563eb] hover:bg-blue-50 font-bold px-3 rounded-xl shadow-sm"
                                >
                                  ແກ້ໄຂ
                                </Button>
                              </Link>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedGrToCancel(gr)}
                                className="h-8 min-w-[64px] border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 font-bold px-3 rounded-xl shadow-sm transition-colors"
                              >
                                ຍົກເລີກ
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination Footer */}
          <StandardPagination
            page={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={(newPage) => setPage(newPage)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />

        </CardContent>
      </Card>

      <CreateGoodsReceiptModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        poNumber=""
      />

      {/* Confirm Cancel Draft GR Dialog */}
      <AlertDialog
        open={!!selectedGrToCancel}
        onOpenChange={(open) => {
          if (!open && !isCancelling) setSelectedGrToCancel(null);
        }}
      >
        <AlertDialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-red-50 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3 shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <AlertDialogHeader className="w-full text-center flex flex-col items-center">
              <AlertDialogTitle className="text-xl font-bold text-gray-900 text-center">
                ຢືນຢັນການຍົກເລີກໃບຮັບສິນຄ້າ
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm font-medium text-gray-600 text-center mt-2">
                ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຍົກເລີກໃບຮັບສິນຄ້າຮ່າງນີ້?
                <br />
                <span className="font-bold text-red-600 inline-block mt-1">
                  ເລກທີ: {selectedGrToCancel?.grcode || selectedGrToCancel?.docno || '-'}
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="p-4 bg-gray-50 flex items-center justify-center gap-3 sm:justify-center">
            <AlertDialogCancel
              disabled={isCancelling}
              onClick={() => setSelectedGrToCancel(null)}
              className="w-full max-w-[140px] h-11 border-gray-300 font-bold rounded-xl text-gray-700 hover:bg-gray-100"
            >
              ກັບຄືນ
            </AlertDialogCancel>
            <Button
              disabled={isCancelling}
              onClick={handleConfirmCancel}
              className="w-full max-w-[140px] h-11 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>ກຳລັງຍົກເລີກ...</span>
                </>
              ) : (
                "ຢືນຢັນຍົກເລີກ"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Error Alert Dialog */}
      <AlertDialog open={isCancelErrorOpen} onOpenChange={setIsCancelErrorOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-lg">
          <div className="bg-red-50 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <AlertDialogHeader className="w-full mb-2 text-center flex flex-col items-center">
              <AlertDialogTitle className="text-xl font-bold text-gray-900 text-center">ແຈ້ງເຕືອນ</AlertDialogTitle>
              <AlertDialogDescription className="text-base font-medium text-gray-600 text-center mt-2">
                {cancelErrorMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="p-4 bg-gray-50 flex items-center justify-center sm:justify-center">
            <AlertDialogAction 
              onClick={() => setIsCancelErrorOpen(false)}
              className="w-full max-w-[200px] h-11 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
            >
              ຕົກລົງ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
