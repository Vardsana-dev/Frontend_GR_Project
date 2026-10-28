"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Printer } from "lucide-react";
import { ReportSummaryCards } from "./ReportSummaryCards";
import { ReportFilterSection, ReportFilters } from "./ReportFilterSection";
import { ReportTable } from "./ReportTable";
import { useGetGrReport } from "@/hooks/gr-report-hook/useGetGrReport";
import { useExportGrReport } from "@/hooks/gr-report-hook/useExportGrReport";
import { usePrintGrReport } from "@/hooks/gr-report-hook/usePrintGrReport";
import { useSupplierList } from "@/hooks/dashboard-hook/useSupplierList";
import { PrintGrReportModal } from "./PrintGrReportModal";

export default function GoodsReceiptReportSection() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: "",
    endDate: "",
    apcode: "all",
    status: "all",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // State for PDF Print Modal Popup
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const { data, loading, error, fetchGrReport } = useGetGrReport();
  const { exportGrReport, loading: exportLoading, error: exportError } = useExportGrReport();
  const { printGrReport, loading: printLoading, error: printError } = usePrintGrReport();
  const { data: supplierData, fetchSupplierList } = useSupplierList();

  useEffect(() => {
    fetchSupplierList({ limit: 100 });
  }, [fetchSupplierList]);

  const suppliers = Array.isArray(supplierData) ? supplierData : (supplierData?.items || supplierData?.data || []);

  const handleSearch = () => {
    setPage(1);
    fetchReport(1, limit, filters.status);
  };

  const fetchReport = (currentPage = page, currentLimit = limit, currentStatus = filters.status) => {
    fetchGrReport({
      search,
      startDate: filters.startDate,
      endDate: filters.endDate,
      dateFrom: filters.startDate,
      dateTo: filters.endDate,
      status: currentStatus && currentStatus !== "all" && currentStatus !== "ທັງໝົດ" ? currentStatus : undefined,
      apcode: filters.apcode,
      page: currentPage,
      limit: currentLimit,
    });
  };

  const handleStatusChange = (newStatus: string) => {
    setFilters(prev => ({ ...prev, status: newStatus }));
    setPage(1);
    fetchReport(1, limit, newStatus);
  };

  const handleExport = async () => {
    await exportGrReport({
      search,
      startDate: filters.startDate,
      endDate: filters.endDate,
      dateFrom: filters.startDate,
      dateTo: filters.endDate,
      status: filters.status && filters.status !== "all" && filters.status !== "ທັງໝົດ" ? filters.status : undefined,
      apcode: filters.apcode,
    });
  };

  const handlePrint = async () => {
    setIsPrintModalOpen(true);
    setPdfUrl(null);
    const result = await printGrReport({
      search,
      dateFrom: filters.startDate,
      dateTo: filters.endDate,
      status: filters.status && filters.status !== "all" && filters.status !== "ທັງໝົດ" ? filters.status : undefined,
      apcode: filters.apcode && filters.apcode !== "all" && filters.apcode !== "ທັງໝົດ" ? filters.apcode : undefined,
    });
    if (result.success && result.url) {
      setPdfUrl(result.url);
      try {
        const win = window.open(result.url, "_blank");
        if (win && !win.closed) {
          setIsPrintModalOpen(false);
          return;
        }
      } catch (err) {
        console.warn("Auto open full screen tab blocked:", err);
      }
    }
  };

  const getFilterSubtitle = () => {
    const parts: string[] = [];
    if (filters.startDate || filters.endDate) {
      parts.push(`ວັນທີ: ${filters.startDate || "ເລີ່ມຕົ້ນ"} ຫາ ${filters.endDate || "ປະຈຸບັນ"}`);
    }
    if (filters.status && filters.status !== "all" && filters.status !== "ທັງໝົດ") {
      parts.push(`ສະຖານະ: ${filters.status}`);
    }
    if (search.trim()) {
      parts.push(`ຄົ້ນຫາ: "${search.trim()}"`);
    }
    return parts.length > 0 ? parts.join(" | ") : undefined;
  };

  // Initial fetch
  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchReport(newPage, limit, filters.status);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    fetchReport(1, newLimit, filters.status);
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header section with title, search, and export */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        {/* Right side actions */}
      </div>

      {/* Search and Export Bar */}
      <div className="flex justify-between items-center gap-4 w-full">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            className="pl-10 h-10 bg-gray-100/80 border-transparent rounded-full focus-visible:ring-1 focus-visible:ring-gray-300 w-full"
            placeholder="ຄົ້ນຫາ GR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleExport}
            disabled={exportLoading}
            className="h-10 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-md flex items-center gap-2 px-6 disabled:opacity-50"
          >
            {exportLoading ? (
               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
               <Download className="w-4 h-4" />
            )}
            Export
          </Button>
          <Button 
            onClick={handlePrint}
            disabled={printLoading}
            className="h-10 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-md flex items-center gap-2 px-6 disabled:opacity-50"
          >
            {printLoading ? (
               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
               <Printer className="w-4 h-4" />
            )}
            Print
          </Button>
        </div>
      </div>

      {(error || exportError || (!isPrintModalOpen && printError)) && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          <p className="font-semibold">Error loading report:</p>
          <p>{error || exportError || printError}</p>
        </div>
      )}

      <ReportSummaryCards data={data?.summary || null} />

      <ReportFilterSection 
        filters={filters} 
        setFilters={setFilters} 
        onSearch={handleSearch}
        loading={loading}
        suppliers={suppliers}
      />

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-2xl mt-6">
            <div className="w-8 h-8 border-4 border-[#1e40af] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <ReportTable 
          data={data?.items || []} 
          pagination={data?.pagination || null}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          status={filters.status}
          onStatusChange={handleStatusChange}
        />
      </div>

      <PrintGrReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        pdfUrl={pdfUrl}
        loading={printLoading}
        error={printError}
        onRetry={handlePrint}
        subtitle={getFilterSubtitle()}
      />
    </div>
  );
}
