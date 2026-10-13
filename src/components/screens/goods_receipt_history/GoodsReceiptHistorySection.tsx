'use client';

import React, { useState, useEffect } from "react";
import { FilterSection } from "./FilterSection";
import { HistoryTable } from "./HistoryTable";
import { useGetAllGr } from "@/hooks/gr-hook/useGetAllGr";
import { useSupplierList } from "@/hooks/dashboard-hook/useSupplierList";

export default function GoodsReceiptHistorySection() {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [apcode, setApcode] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { loading, error, data, fetchAllGr } = useGetAllGr();
  const { data: supplierData, fetchSupplierList } = useSupplierList();

  useEffect(() => {
    fetchSupplierList({ limit: 100 });
  }, [fetchSupplierList]);

  // Extract suppliers array
  const suppliers = Array.isArray(supplierData) ? supplierData : (supplierData?.items || supplierData?.data || []);

  useEffect(() => {
    fetchAllGr({
      search,
      startDate,
      endDate,
      receiptStatus: status === 'all' ? 'PARTIAL,COMPLETE' : status,
      apcode,
      page,
      limit,
    });
  }, [fetchAllGr, search, startDate, endDate, status, apcode, page, limit]);

  const handleSearch = () => {
    setPage(1);
    fetchAllGr({
      search,
      startDate,
      endDate,
      receiptStatus: status === 'all' ? 'PARTIAL,COMPLETE' : status,
      apcode,
      page: 1,
      limit,
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Main Content */}
      <FilterSection
        search={search} 
        setSearch={(val) => { setSearch(val); setPage(1); }}
        startDate={startDate} 
        setStartDate={(val) => { setStartDate(val); setPage(1); }}
        endDate={endDate} 
        setEndDate={(val) => { setEndDate(val); setPage(1); }}
        apcode={apcode} 
        setApcode={(val) => { setApcode(val); setPage(1); }}
        status={status} 
        setStatus={(val) => { setStatus(val); setPage(1); }}
        suppliers={suppliers}
        onSearch={handleSearch}
      />
      
      <HistoryTable 
        data={data}
        loading={loading}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
    </div>
  );
}
