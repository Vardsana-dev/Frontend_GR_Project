// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronDown, Search } from 'lucide-react';
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
  const [supplier, setSupplier] = useState("ທັງໝົດ");
  const [status, setStatus] = useState("ທັງໝົດ");

  const { data, loading, fetchPoList } = usePoList();
  const { data: supplierData, fetchSupplierList } = useSupplierList();

  const handleSearch = (targetPage = page, targetLimit = limit) => {
    fetchPoList({
      page: targetPage,
      limit: targetLimit,
      search,
      startDate,
      endDate,
      supplier,
      status
    });
  };

  useEffect(() => {
    handleSearch(page, limit);
  }, [page, limit]);

  useEffect(() => {
    fetchSupplierList({ limit: 100 });
  }, [fetchSupplierList]);

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
    if (!statusText) return 'bg-gray-100 text-gray-700';
    if (statusText?.includes('ບໍ່ຢືນຢັນ') || statusText === 'CANCELLED') return 'bg-red-100 text-red-700';
    if (statusText?.includes('ຍັງບໍ່ທັນຮັບເຂົ້າ')) return 'bg-yellow-100 text-yellow-700';
    if (statusText?.includes('ລໍຖ້າ') || statusText === 'DRAFT' || statusText === 'PENDING') return 'bg-yellow-100 text-yellow-700';
    if (statusText?.includes('ບາງສ່ວນ') || statusText === 'IN_REVIEW') return 'bg-pink-100 text-pink-700';
    if (statusText?.includes('ຮັບເຂົ້າແລ້ວ') || statusText === 'APPROVED') return 'bg-green-100 text-green-700';
    return 'bg-green-100 text-green-700'; // Default green
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
          className="pl-10 h-12 bg-gray-100/80 border-transparent rounded-full focus-visible:ring-1 focus-visible:ring-gray-300" 
          placeholder="ຄົ້ນຫາ PO..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

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
                  onChange={(e) => setSupplier(e.target.value)} 
                  className="appearance-none w-full bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg px-3 outline-none focus-visible:ring-1 focus-visible:ring-gray-300"
                >
                  <option value="ທັງໝົດ">ທັງໝົດ</option>
                  {supplierList.map((sup: any, idx: number) => (
                    <option key={idx} value={sup.apcode || sup.code || sup.id || sup.apname || sup.name}>
                      {sup.apname || sup.name || `Supplier ${idx+1}`}
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
                  onChange={(e) => setStatus(e.target.value)} 
                  className="appearance-none w-full bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg px-3 outline-none focus-visible:ring-1 focus-visible:ring-gray-300"
                >
                  <option value="ທັງໝົດ">ທັງໝົດ</option>
                  <option value="GR ຍັງບໍ່ທັນຮັບເຂົ້າ">ຍັງບໍ່ທັນຮັບເຂົ້າ</option>
                  <option value="GR ຮັບເຂົ້າບາງສ່ວນ">ຮັບບາງສ່ວນ</option>
                  <option value="GR ຮັບເຂົ້າແລ້ວ">ຮັບເຂົ້າແລ້ວ</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1f3a8a] pointer-events-none" />
              </div>
            </div>

            <Button onClick={handleSearch} className="h-11 px-8 bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-lg">
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
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold ${row.statusColor || getStatusColor(row.grStatus || row.status || row.poStatus || row.approvalStatus)}`}>
                          {row.grStatus || row.status || row.poStatus || row.approvalStatus || 'Unknown'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Link href={`/search_po/${poNum}?status=${encodeURIComponent(row.grStatus || row.status || row.poStatus || row.approvalStatus || 'Unknown')}`}>
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
