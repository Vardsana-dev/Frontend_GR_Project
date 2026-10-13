'use client';
import React, { useState, useEffect } from 'react';
import { useGetAllGr } from '@/hooks/gr-hook/useGetAllGr';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { CreateGoodsReceiptModal } from '../search_po/CreateGoodsReceiptModal';
import { StandardPagination } from '@/components/customs/StandardPagination';

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

  useEffect(() => {
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
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">RECEIVED</span>;
      case 'DRAFT':
        return <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">DRAFT</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">CANCELLED</span>;
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
      <Card className="shadow-sm border-gray-100 rounded-2xl bg-white overflow-hidden">
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
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-11 bg-blue-50/50 border-gray-200 text-[#1e3a8a] font-bold rounded-xl">
                  <SelectValue placeholder="ທັງໝົດ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ທັງໝົດ</SelectItem>
                  <SelectItem value="RECEIVED">RECEIVED</SelectItem>
                  <SelectItem value="DRAFT">DRAFT</SelectItem>
                  <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <Button className="h-11 px-8 bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm text-sm shrink-0">
              ຄົ້ນຫາ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="shadow-sm border-gray-100 rounded-2xl bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#244195] hover:bg-[#244195] border-b-0">
              <TableHead className="text-white font-bold text-center h-12 w-[80px]">ລຳດັບ</TableHead>
              <TableHead className="text-white font-bold h-12">ເລກທີເອກະສານ</TableHead>
              <TableHead className="text-white font-bold h-12">ຊື່ບໍລິສັດ</TableHead>
              <TableHead className="text-white font-bold text-center h-12">ວັນທີຮັບ</TableHead>
              <TableHead className="text-white font-bold text-center h-12">ຈຳນວນ</TableHead>
              <TableHead className="text-white font-bold text-center h-12">ມູນຄ່າ</TableHead>
              <TableHead className="text-white font-bold text-center h-12">ສະຖານະ</TableHead>
              <TableHead className="text-white font-bold text-center h-12">ຈັດການ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 font-bold text-gray-500">ກຳລັງໂຫລດຂໍ້ມູນ...</TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 font-bold text-gray-500">ບໍ່ພົບຂໍ້ມູນ</TableCell>
              </TableRow>
            ) : (
              items.map((gr: any, idx: number) => (
                <TableRow key={gr.grid || idx} className="hover:bg-gray-50 border-b border-gray-100">
                  <TableCell className="text-center font-medium text-gray-400">{(page - 1) * limit + idx + 1}</TableCell>
                  <TableCell className="font-bold text-gray-900">{gr.grcode || '-'}</TableCell>
                  <TableCell className="text-gray-500 font-medium">{gr.supplier?.apname || '-'}</TableCell>
                  <TableCell className="text-center font-medium text-gray-500">{gr.documentDate || '-'}</TableCell>
                  <TableCell className="text-center font-medium text-gray-500">{gr.totalQuantity ?? gr.itemCount ?? gr.items?.length ?? '-'}</TableCell>
                  <TableCell className="text-center font-black text-gray-900">
                    {gr.totalAmount !== undefined || gr.netAmount !== undefined 
                      ? `${gr.currencyCode === 'THB' ? '฿' : '₭'} ${Number(gr.totalAmount ?? gr.netAmount ?? 0).toLocaleString()}` 
                      : '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {renderStatus(gr.approvalStatus || gr.status)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/goods_receipt/${gr.grid || gr.grcode}`}>
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

      </Card>

      <CreateGoodsReceiptModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        poNumber=""
      />
    </div>
  );
}
