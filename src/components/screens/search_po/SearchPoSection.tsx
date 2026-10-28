// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronDown, Search, X, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { usePoList } from '@/hooks/po-hook/usePoList';
import { useSupplierList } from '@/hooks/dashboard-hook/useSupplierList';
import { StandardPagination } from '@/components/customs/StandardPagination';

export function SearchPoSection() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [supplier, setSupplier] = useState("ALL");
  const [status, setStatus] = useState("NOT_RECEIVED");

  const { data, loading, error, fetchPoList } = usePoList();
  const { data: supplierData, fetchSupplierList } = useSupplierList();

  const isInitialMount = useRef(true);

  // Central search execution function
  const executeSearch = useCallback((
    targetPage: number = 1,
    targetLimit: number = limit,
    overrideSearch?: string,
    overrideStatus?: string,
    overrideSupplier?: string
  ) => {
    const pageNum = typeof targetPage === 'number' && !isNaN(targetPage) && targetPage > 0 ? targetPage : 1;
    const limitNum = typeof targetLimit === 'number' && !isNaN(targetLimit) && targetLimit > 0 ? targetLimit : limit;
    const searchTerm = overrideSearch !== undefined ? overrideSearch : search;
    const currentStatus = overrideStatus !== undefined ? overrideStatus : status;
    const currentSupplier = overrideSupplier !== undefined ? overrideSupplier : supplier;

    setPage(pageNum);
    fetchPoList({
      page: pageNum,
      limit: limitNum,
      search: searchTerm.trim(),
      startDate,
      endDate,
      supplier: currentSupplier,
      status: currentStatus
    });
  }, [fetchPoList, limit, search, startDate, endDate, supplier, status]);

  // Initial load
  useEffect(() => {
    executeSearch(1, limit);
    fetchSupplierList({ limit: 100 });
  }, []);

  // Debounced auto-search when typing
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      executeSearch(1, limit, search);
    }, 450);

    return () => clearTimeout(timer);
  }, [search]);



  // Extract list properly whether it's wrapped in { items: [] }, { data: [] }, or direct array
  const rawList = Array.isArray(data) ? data : (data?.items || data?.data || data?.rows || []);
  const apiTotal = data?.total ?? data?.totalItems ?? data?.count ?? data?.pagination?.total ?? null;
  const isServerPaginated = apiTotal != null || data?.totalPages != null || data?.pagination?.totalPages != null;

  const totalItems = apiTotal != null ? Number(apiTotal) : rawList.length;
  const parsedLimit = Math.max(1, Number(limit) || 10);
  const totalPages = Math.max(1, data?.totalPages ?? data?.pagination?.totalPages ?? Math.ceil(totalItems / parsedLimit));

  const poDataList = isServerPaginated ? rawList : rawList.slice((page - 1) * parsedLimit, page * parsedLimit);

  const supplierList = Array.isArray(supplierData) ? supplierData : (supplierData?.items || supplierData?.data || []);

  const getStatusColor = (statusText: string) => {
    if (!statusText) return 'bg-yellow-100 text-yellow-700';
    const s = String(statusText).toUpperCase();
    if (s.includes('ບໍ່ຢືນຢັນ') || s.includes('ຍົກເລີກ') || s === 'CANCELLED') return 'bg-red-100 text-red-700';
    if (s.includes('ບາງສ່ວນ') || s.includes('PARTIAL') || s === 'IN_REVIEW') return 'bg-pink-100 text-pink-700';
    if (s.includes('ຮັບເຂົ້າແລ້ວ') || s.includes('ຮັບແລ້ວ') || s === 'RECEIVED' || s === 'COMPLETED') return 'bg-green-100 text-green-700';
    if (s.includes('ຍັງບໍ່ທັນ') || s.includes('ລໍຖ້າ') || s === 'PENDING' || s === 'UNRECEIVED' || s.includes('NOT_RECEIVED')) return 'bg-yellow-100 text-yellow-700';
    if (s === 'DRAFT' || s === 'ຮ່າງ') return 'bg-orange-100 text-orange-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const formatStatus = (statusText: string) => {
    if (!statusText) return 'ຍັງບໍ່ທັນຮັບເຂົ້າ';
    const s = String(statusText).toUpperCase();
    if (s.includes('ບາງສ່ວນ') || s.includes('PARTIAL') || s === 'IN_REVIEW') return 'ຮັບເຂົ້າບາງສ່ວນ';
    if (s.includes('ຮັບເຂົ້າແລ້ວ') || s.includes('ຮັບແລ້ວ') || s === 'RECEIVED' || s === 'COMPLETED') return 'ຮັບແລ້ວ';
    if (s.includes('ຍັງບໍ່ທັນ') || s.includes('ລໍຖ້າ') || s === 'PENDING' || s === 'UNRECEIVED' || s.includes('NOT_RECEIVED')) return 'ຍັງບໍ່ທັນຮັບເຂົ້າ';
    if (s.includes('ຍົກເລີກ') || s.includes('ບໍ່ຢືນຢັນ') || s === 'CANCELLED') return 'ຍົກເລີກ';
    if (s.includes('ຮ່າງ') || s === 'DRAFT') return 'ຮ່າງ';
    if (s.includes('ອະນຸມັດ') || s === 'APPROVED' || s === 'ຍືນຍັນແລ້ວ') return 'ຍັງບໍ່ທັນຮັບເຂົ້າ';
    return statusText;
  };

  const getSupplierName = (supplier: any) => {
    if (!supplier) return '';
    if (typeof supplier === 'string') return supplier;
    if (typeof supplier === 'object') {
      return supplier.apname || supplier.name || supplier.apcode || JSON.stringify(supplier);
    }
    return String(supplier);
  };

  const getSupplierCode = (supplier: any) => {
    if (!supplier) return '-';
    if (typeof supplier === 'object') return supplier.apcode || '-';
    return '-'; // Fallback if it's just a string, though usually backend provides code separately or object
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search Bar */}
      <div className="relative w-full md:w-1/2">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          className="pl-10 pr-10 h-12 bg-gray-100/80 border-transparent rounded-full focus-visible:ring-1 focus-visible:ring-gray-300"
          placeholder="ຄົ້ນຫາ PO..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              executeSearch(1, limit);
            }
          }}
        />
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              executeSearch(1, limit, "");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            title="ລຶບຄຳຄົ້ນຫາ"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => executeSearch(page, limit)} className="text-red-700 hover:bg-red-100">
            ລອງໃໝ່
          </Button>
        </div>
      )}

      {/* Filter Card */}
      <Card className="shadow-sm border-gray-200/60 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-end gap-4">
            <div className="w-full lg:flex-1">
              <label className="text-sm font-semibold text-gray-500 mb-1.5 block">ວັນທີເລີ່ມ</label>
              <div className="relative">
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg block w-full" />
              </div>
            </div>

            <div className="w-full lg:flex-1">
              <label className="text-sm font-semibold text-gray-500 mb-1.5 block">ວັນທີສິ້ນສຸດ</label>
              <div className="relative">
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg block w-full" />
              </div>
            </div>

            <div className="w-full lg:flex-1">
              <label className="text-sm font-semibold text-gray-500 mb-1.5 block">Supplier</label>
              <div className="relative">
                <select
                  value={supplier}
                  onChange={(e) => {
                    const newSupplier = e.target.value;
                    setSupplier(newSupplier);
                    executeSearch(1, limit, undefined, undefined, newSupplier);
                  }}
                  className="appearance-none w-full bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg px-3 outline-none focus-visible:ring-1 focus-visible:ring-gray-300"
                >
                  <option value="ALL">ທັງໝົດ</option>
                  {supplierList.map((sup: any, idx: number) => (
                    <option key={idx} value={sup.apcode || sup.code || sup.id || sup.apname || sup.name}>
                      {sup.apname || sup.name || `Supplier ${idx + 1}`}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1f3a8a] pointer-events-none" />
              </div>
            </div>

            <div className="w-full lg:flex-1">
              <label className="text-sm font-semibold text-gray-500 mb-1.5 block">ສະຖານະ</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setStatus(newStatus);
                    executeSearch(1, limit, undefined, newStatus);
                  }}
                  className="appearance-none w-full bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg px-3 outline-none focus-visible:ring-1 focus-visible:ring-gray-300"
                >
                  <option value="ALL">ທັງໝົດ</option>
                  <option value="NOT_RECEIVED">ຍັງບໍ່ທັນຮັບເຂົ້າ</option>
                  <option value="PARTIALLY_RECEIVED">ຮັບບາງສ່ວນ</option>
                  <option value="RECEIVED">ຮັບເຂົ້າແລ້ວ</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1f3a8a] pointer-events-none" />
              </div>
            </div>

            <Button
              type="button"
              onClick={() => executeSearch(1, limit)}
              className="h-11 px-8 bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
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
                <TableHead className="text-white bg-transparent h-12 text-center w-[60px]">ລຳດັບ</TableHead>
                <TableHead className="text-white bg-transparent">ລະຫັດ PO</TableHead>
                <TableHead className="text-white bg-transparent">ວັນທີ</TableHead>
                <TableHead className="text-white bg-transparent">ລະຫັດເຈົ້າໜີ້</TableHead>
                <TableHead className="text-white bg-transparent">ຊື່ເຈົ້າໜີ້</TableHead>

                <TableHead className="text-white bg-transparent text-center">ກຳນົດສົ່ງມອບ</TableHead>
                <TableHead className="text-white bg-transparent text-center">ຈຳນວນສິນຄ້າ</TableHead>
                <TableHead className="text-white bg-transparent text-center">ສະຖານະ</TableHead>
                <TableHead className="text-white bg-transparent text-center w-[80px]">ຈັດການ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">ກຳລັງໂຫຼດຂໍ້ມູນ... (Loading...)</TableCell>
                </TableRow>
              ) : poDataList.length > 0 ? (
                poDataList.map((row: any, idx: number) => {
                  const poNum = row.poNumber || row.docno || row.grcode;
                  const displayStatus = formatStatus(row.grStatus || row.status || row.poStatus || row.approvalStatus);
                  return (
                    <TableRow key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <TableCell className="text-center text-gray-500">{row.no || (page - 1) * limit + idx + 1}</TableCell>
                      <TableCell className="font-semibold text-gray-900">{poNum}</TableCell>
                      <TableCell className="text-gray-500">{row.date || row.docdate || row.documentDate}</TableCell>
                      <TableCell className="text-gray-500">{row.creditorCode || row.apcode || getSupplierCode(row.supplier)}</TableCell>
                      <TableCell className="text-gray-500">{getSupplierName(row.supplier) || row.apname || row.creditorName}</TableCell>

                      <TableCell className="text-center text-gray-500">{row.shipdate || row.deliveryDate || row.dueDate || '-'}</TableCell>
                      <TableCell className="text-center text-gray-500">{row.qty || row.itemCount || '-'}</TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold ${row.statusColor || getStatusColor(displayStatus)}`}>
                          {displayStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Link href={`/search_po/${poNum}?status=${encodeURIComponent(displayStatus)}`}>
                          <Button variant="outline" size="sm" className="h-8 border-gray-200">ເບິ່ງ</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">ບໍ່ມີຂໍ້ມູນ (No data)</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Footer */}
          <StandardPagination
            page={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={(newPage) => executeSearch(newPage, limit)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              executeSearch(1, newLimit);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
