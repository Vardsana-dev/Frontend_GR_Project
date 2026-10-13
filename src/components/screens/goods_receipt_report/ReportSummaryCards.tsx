import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PackageOpen, FileText, Banknote, ClipboardList } from "lucide-react";
import { GrReportSummary } from "@/hooks/gr-report-hook/useGetGrReport";

export function ReportSummaryCards({ data }: { data: GrReportSummary | null }) {
  const formatAmount = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "0₭";
    return new Intl.NumberFormat("lo-LA", {
      maximumFractionDigits: 0,
    }).format(amount) + "₭";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1 */}
      <Card className="shadow-sm border-gray-200/60 rounded-2xl">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center flex-shrink-0">
            <PackageOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">ລວມມູນຄ່າ PO</p>
            <h3 className="text-2xl font-bold text-[#1e3a8a]">{formatAmount(data?.totalPoAmount)}</h3>
          </div>
        </CardContent>
      </Card>

      {/* Card 2 */}
      <Card className="shadow-sm border-gray-200/60 rounded-2xl">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">ລວມມູນຄ່າ Invoice</p>
            <h3 className="text-2xl font-bold text-[#1e3a8a]">{formatAmount(data?.totalInvoiceAmount)}</h3>
          </div>
        </CardContent>
      </Card>

      {/* Card 3 */}
      <Card className="shadow-sm border-gray-200/60 rounded-2xl">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center flex-shrink-0">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">ມູນຄ່າສິນຄ້າຮັບເຂົ້າສາງ</p>
            <h3 className="text-2xl font-bold text-[#1e3a8a]">{formatAmount(data?.totalReceivedAmount)}</h3>
          </div>
        </CardContent>
      </Card>

      {/* Card 4 */}
      <Card className="shadow-sm border-gray-200/60 rounded-2xl">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center flex-shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">ຈຳນວນ PO</p>
            <h3 className="text-2xl font-bold text-[#1e3a8a]">{formatAmount(data?.poCount)}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
