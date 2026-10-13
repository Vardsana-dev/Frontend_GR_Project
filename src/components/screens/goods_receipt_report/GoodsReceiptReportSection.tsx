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
import { useFetchAllGrReport } from "@/hooks/gr-report-hook/useFetchAllGrReport";
import { PrintableGrReport } from "./PrintableGrReport";
import { useSupplierList } from "@/hooks/dashboard-hook/useSupplierList";

export default function GoodsReceiptReportSection() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: "",
    endDate: "",
    apcode: "all",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // State for print layout
  const [printData, setPrintData] = useState<any>(null);

  const { data, loading, error, fetchGrReport } = useGetGrReport();
  const { exportGrReport, loading: exportLoading, error: exportError } = useExportGrReport();
  const { fetchAllGrReport, loading: printLoading, error: printError } = useFetchAllGrReport();
  const { data: supplierData, fetchSupplierList } = useSupplierList();

  useEffect(() => {
    fetchSupplierList({ limit: 100 });
  }, [fetchSupplierList]);

  const suppliers = Array.isArray(supplierData) ? supplierData : (supplierData?.items || supplierData?.data || []);

  const handleSearch = () => {
    setPage(1);
    fetchReport(1, limit);
  };

  const fetchReport = (currentPage = page, currentLimit = limit) => {
    fetchGrReport({
      search,
      startDate: filters.startDate,
      endDate: filters.endDate,
      apcode: filters.apcode,
      page: currentPage,
      limit: currentLimit,
    });
  };

  const handleExport = async () => {
    await exportGrReport({
      search,
      startDate: filters.startDate,
      endDate: filters.endDate,
      apcode: filters.apcode,
    });
  };

  const handlePrint = async () => {
    const result = await fetchAllGrReport({
      search,
      startDate: filters.startDate,
      endDate: filters.endDate,
      apcode: filters.apcode,
    });

    if (result.success && result.data) {
      setPrintData(result.data.items || []);
      // Give DOM time to render the printable tables before calling print
      setTimeout(() => {
        window.print();
        // Clear print data after printing dialogue opens/closes
        setTimeout(() => setPrintData(null), 1000);
      }, 500);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchReport(newPage, limit);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    fetchReport(1, newLimit);
  };

  // Format today's date for printing
  const getTodayDate = () => {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  };

  return (
    <>
      <div className="flex flex-col gap-6 pb-8 print:hidden">
        {/* Header section with title, search, and export */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          {/* Right side actions (this can be placed here or in the top navigation depending on your layout structure) */}
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

        {(error || exportError || printError) && (
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
          />
        </div>
      </div>

      {/* Hidden printable section */}
      {printData && (
        <PrintableGrReport data={printData} printDate={filters.startDate || getTodayDate()} />
      )}
    </>
  );
}
