'use client';

import React, { useState, useEffect } from "react";
import { FilterSection } from "./FilterSection";
import { HistoryTable } from "./HistoryTable";
import { useGetAllGr } from "@/hooks/gr-hook/useGetAllGr";
import { useSupplierList } from "@/hooks/dashboard-hook/useSupplierList";
import { usePrintGrReport } from "@/hooks/gr-report-hook/usePrintGrReport";

export default function GoodsReceiptHistorySection() {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [apcode, setApcode] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const { loading, error, data, fetchAllGr } = useGetAllGr();
  const { data: supplierData, fetchSupplierList } = useSupplierList();
  const { printGrReport, loading: isPdfDownloading } = usePrintGrReport();

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
      status: status === 'all' ? undefined : status,
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
      status: status === 'all' ? undefined : status,
      apcode,
      page: 1,
      limit,
    });
  };

  const handleDownloadPdf = async () => {
    setDownloadError(null);
    try {
      const res = await printGrReport({
        search,
        startDate,
        endDate,
        dateFrom: startDate,
        dateTo: endDate,
        status: status !== "all" && status !== "ທັງໝົດ" ? status : undefined,
        apcode: apcode !== "all" && apcode !== "ທັງໝົດ" ? apcode : undefined,
      });

      if (res.success && res.url) {
        const today = new Date().toISOString().slice(0, 10);
        const filename = res.filename || `PO_GR_History_${today}.pdf`;
        const a = document.createElement("a");
        a.href = res.url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => {
          if (res.url) {
            window.URL.revokeObjectURL(res.url);
          }
        }, 2000);
      } else {
        const errorMsg =
          (typeof res.error === "string" ? res.error : res.error?.message) ||
          "ບໍ່ສາມາດດາວໂຫຼດ PDF ໄດ້";
        setDownloadError(errorMsg);
      }
    } catch (err: any) {
      console.error("Download error:", err);
      const errMsg = err?.message || "ເກີດຂໍ້ຜິດພາດໃນການດາວໂຫຼດ PDF";
      setDownloadError(errMsg);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Error alert for download */}
      {downloadError && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 flex items-center justify-between text-sm shadow-xs">
          <span>{downloadError}</span>
          <button
            type="button"
            onClick={() => setDownloadError(null)}
            className="text-red-500 hover:text-red-700 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

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
        onDownload={handleDownloadPdf}
        downloadLoading={isPdfDownloading}
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
