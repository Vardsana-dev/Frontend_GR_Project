// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGrList } from '@/hooks/dashboard-hook/useGrList';
import { useSupplierList } from '@/hooks/dashboard-hook/useSupplierList';
import { StandardPagination } from '@/components/customs/StandardPagination';
import { formatCurrency } from '@/lib/currency';

export function GrListSection() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [supplier, setSupplier] = useState("ທັງໝົດ");
  const [status, setStatus] = useState("ທັງໝົດ");

  const [limitInput, setLimitInput] = useState<string>("10");

  const { data, loading, fetchGrList } = useGrList();
  const { data: supplierData, fetchSupplierList } = useSupplierList();

  const handleSearch = (
    targetPage: number = 1,
    targetLimit: number = limit,
    overrideSearch?: string,
    overrideStatus?: string,
    overrideSupplier?: string
  ) => {
    const safePage = typeof targetPage === 'number' && !isNaN(targetPage) && targetPage > 0 ? targetPage : 1;
    const safeLimit = typeof targetLimit === 'number' && !isNaN(targetLimit) && targetLimit > 0 ? targetLimit : limit;
    const currentSearch = overrideSearch !== undefined ? overrideSearch : search;
    const currentStatus = overrideStatus !== undefined ? overrideStatus : status;
    const currentSupplier = overrideSupplier !== undefined ? overrideSupplier : supplier;

    setPage(safePage);
    fetchGrList({
      page: safePage,
      limit: safeLimit,
      search: (currentSearch || "").trim(),
      startDate,
      endDate,
      supplier: currentSupplier,
      status: currentStatus
    });
  };

  useEffect(() => {
    handleSearch(page, limit);
  }, [page, limit]);

  useEffect(() => {
    fetchSupplierList({ limit: 100 }); // fetch initial list of suppliers for dropdown
  }, [fetchSupplierList]);

  // Handle potential paginated response { items: [], total: ... } or direct array []
  const rawList = Array.isArray(data)
    ? data
    : (data?.items || data?.data || data?.rows || data?.list || []);

  // Check if API already provides pagination metadata
  const apiTotal = data?.total ?? data?.totalItems ?? data?.count ?? data?.pagination?.total ?? null;
  const isServerPaginated = apiTotal != null || data?.totalPages != null || data?.pagination?.totalPages != null;

  const totalItems = apiTotal != null ? Number(apiTotal) : rawList.length;
  const parsedLimit = Math.max(1, Number(limit) || 10);
  const totalPages = Math.max(1, data?.totalPages ?? data?.pagination?.totalPages ?? Math.ceil(totalItems / parsedLimit));

  // If server didn't paginate (it sent all records at once), slice on the client
  const grDataList = isServerPaginated
    ? rawList
    : rawList.slice((page - 1) * parsedLimit, page * parsedLimit);

  const supplierList = Array.isArray(supplierData) ? supplierData : (supplierData?.items || supplierData?.data || []);

  const getStatusColor = (statusText: string) => {
    const s = statusText?.toUpperCase() || '';
    if (s.includes('ບໍ່ຢືນຢັນ') || s.includes('ຍົກເລີກ') || s === 'CANCELLED') return 'bg-red-100 text-red-700';
    if (s.includes('ລໍຖ້າ') || s === 'PENDING') return 'bg-yellow-100 text-yellow-700';
    if (s === 'DRAFT' || s === 'ຮ່າງ') return 'bg-orange-100 text-orange-700';
    if (s.includes('ບາງສ່ວນ') || s === 'IN_REVIEW') return 'bg-pink-100 text-pink-700';
    return 'bg-green-100 text-green-700';
  };

  const formatStatus = (statusText: string) => {
    switch (statusText?.toUpperCase()) {
      case 'RECEIVED':
      case 'ຮັບແລ້ວ':
        return 'ຮັບແລ້ວ';
      case 'DRAFT':
      case 'ຮ່າງ':
        return 'ຮ່າງ';
      case 'CANCELLED':
      case 'ຍົກເລີກ':
      case 'ບໍ່ຢືນຢັນ':
      case 'ບໍ່ຍືນຢັນ':
        return 'ຍົກເລີກ';
      case 'APPROVED':
      case 'ຍືນຍັນແລ້ວ':
        return 'ຍືນຍັນແລ້ວ';
      case 'PENDING':
      case 'ລໍຖ້າ':
        return 'ລໍຖ້າ';
      default:
        return statusText || 'Unknown';
    }
  };

  const formatAmount = (amount: any, currency?: string) => {
    return formatCurrency(amount, currency);
  };

  const getSupplierName = (supplier: any) => {
    if (!supplier) return '';
    if (typeof supplier === 'string') return supplier;
    if (typeof supplier === 'object') {
      return supplier.apname || supplier.name || supplier.apcode || JSON.stringify(supplier);
    }
    return String(supplier);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search Bar */}
      <div className="relative w-full md:w-1/2">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          className="pl-10 h-12 bg-gray-100/80 border-transparent rounded-full focus-visible:ring-1 focus-visible:ring-gray-300"
          placeholder="ຄົ້ນຫາ"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      {/* Filter Card */}
      <Card className="shadow-sm border-gray-200/60 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="w-full md:flex-1">
              <label className="text-sm font-semibold text-gray-500 mb-1.5 block">ວັນທີເລີ່ມ</label>
              <div className="relative">
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg block w-full" />
              </div>
            </div>

            <div className="w-full md:flex-1">
              <label className="text-sm font-semibold text-gray-500 mb-1.5 block">ວັນທີສິ້ນສຸດ</label>
              <div className="relative">
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg block w-full" />
              </div>
            </div>

            <div className="w-full md:flex-1">
              <label className="text-sm font-semibold text-gray-500 mb-1.5 block">Supplier</label>
              <div className="relative">
                <select
                  value={supplier}
                  onChange={(e) => {
                    const newSupplier = e.target.value;
                    setSupplier(newSupplier);
                    handleSearch(1, limit, undefined, undefined, newSupplier);
                  }}
                  className="appearance-none w-full bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg px-3 outline-none focus-visible:ring-1 focus-visible:ring-gray-300"
                >
                  <option value="ທັງໝົດ">ທັງໝົດ</option>
                  {supplierList.map((sup: any, idx: number) => (
                    <option key={idx} value={sup.apcode || sup.apname || sup.id}>
                      {sup.apname || sup.name || `Supplier ${idx + 1}`}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1f3a8a] pointer-events-none" />
              </div>
            </div>

            <div className="w-full md:flex-1">
              <label className="text-sm font-semibold text-gray-500 mb-1.5 block">ສະຖານະ</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setStatus(newStatus);
                    handleSearch(1, limit, undefined, newStatus);
                  }}
                  className="appearance-none w-full bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg px-3 outline-none focus-visible:ring-1 focus-visible:ring-gray-300"
                >
                  <option value="ທັງໝົດ">ທັງໝົດ</option>
                  <option value="RECEIVED">ຮັບແລ້ວ</option>
                  <option value="DRAFT">ຮ່າງ</option>
                  <option value="CANCELLED">ຍົກເລີກ</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1f3a8a] pointer-events-none" />
              </div>
            </div>

            <Button onClick={() => handleSearch(1, limit)} className="h-11 px-8 bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-lg">
              ຄົ້ນຫາ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="shadow-sm border-gray-200/60 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#1e3a8a] hover:bg-[#1e3a8a]">
                <TableHead className="text-white bg-transparent h-12 text-center w-[80px]">ລຳດັບ</TableHead>
                <TableHead className="text-white bg-transparent">ເລກທີ GR</TableHead>
                <TableHead className="text-white bg-transparent">Supplier</TableHead>
                <TableHead className="text-white bg-transparent text-center">ວັນທີຮັບ</TableHead>
                <TableHead className="text-white bg-transparent text-right">ມູນຄ່າ</TableHead>
                <TableHead className="text-white bg-transparent text-center">ສະຖານະ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">ກຳລັງໂຫຼດຂໍ້ມູນ... (Loading...)</TableCell>
                </TableRow>
              ) : grDataList.length > 0 ? (
                grDataList.map((row: any, idx: number) => (
                  <TableRow key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <TableCell className="text-center text-gray-500">{row.no || (page - 1) * limit + idx + 1}</TableCell>
                    <TableCell className="font-semibold text-gray-900">{row.grcode || row.grNumber || row.docno || '-'}</TableCell>
                    <TableCell className="text-gray-500">{getSupplierName(row.supplier) || row.apname || '-'}</TableCell>
                    <TableCell className="text-center text-gray-500">{row.documentDate || row.date || row.docdate || '-'}</TableCell>
                    <TableCell className="text-right font-bold text-gray-900">
                      {formatAmount(row.totalAmount ?? row.netAmount ?? row.amount, row.currencyCode)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${row.statusColor || getStatusColor(row.status || row.receiptStatus || row.grStatus)}`}>
                        {formatStatus(row.status || row.receiptStatus || row.grStatus)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">ບໍ່ມີຂໍ້ມູນ (No data)</TableCell>
                </TableRow>
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
    </div>
  );
}
