// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSummaryResponse } from '@/hooks/dashboard-hook/useDashboardSummary';
import { formatCurrency } from '@/lib/currency';

export function TopSuppliers({ suppliers = [] }: { suppliers?: DashboardSummaryResponse['topSuppliers'] }) {
  // Calculate max amount to use as 100% for the progress bars
  const maxAmount = Math.max(...suppliers.map(s => Number(s.totalAmount) || 0), 1);

  const formatAmount = (amount: any, currencyCode?: string) => {
    return formatCurrency(amount, currencyCode, { maximumFractionDigits: 0 });
  };

  return (
    <Card className="shadow-sm border-gray-200/60 rounded-2xl h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-[#1f2937]">
          Top {suppliers.length > 0 ? suppliers.length : ''} Suppliers ປະຈຳເດືອນ
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-5">
        {suppliers.slice(0, 8).map((supplier, index) => {
          const amountNum = Number(supplier.totalAmount) || 0;
          const percentage = (amountNum / maxAmount) * 100;
          const formattedAmount = formatAmount(amountNum, supplier.currencyCode);

          return (
            <div key={supplier.apcode || index} className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm font-semibold text-[#1f3a8a]">
                <span className="truncate pr-4">{supplier.apname}</span>
                <span className="whitespace-nowrap">{formattedAmount}</span>
              </div>
              <div className="w-full h-1.5 bg-[#e0eaff] rounded-full overflow-hidden flex-shrink-0">
                <div 
                  className="h-full bg-[#1e40af] rounded-full" 
                  style={{ width: `${Math.min(Math.max(percentage, 2), 100)}%` }}
                />
              </div>
            </div>
          );
        })}
        {suppliers.length === 0 && (
          <div className="text-center text-gray-500 py-4">ບໍ່ມີຂໍ້ມູນ (No data)</div>
        )}
      </CardContent>
    </Card>
  );
}
