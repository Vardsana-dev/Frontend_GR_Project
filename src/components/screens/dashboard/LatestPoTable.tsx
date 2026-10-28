// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DashboardSummaryResponse } from '@/hooks/dashboard-hook/useDashboardSummary';
import { formatCurrency } from '@/lib/currency';

export function LatestPoTable({ latestPos = [] }: { latestPos?: DashboardSummaryResponse['latestPurchaseOrders'] }) {
  const formatAmount = (amount: any, currencyCode?: string) => {
    return formatCurrency(amount, currencyCode);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "GR ຮັບເຂົ້າແລ້ວ":
      case "RECEIVED": return "bg-green-100 text-green-700";
      case "GR ຍັງບໍ່ທັນຮັບເຂົ້າ":
      case "NOT_RECEIVED":
      case "ລໍຖ້າຮັບເຂົ້າ": return "bg-blue-100 text-blue-700"; // Based on image
      case "GR ຮັບເຂົ້າບາງສ່ວນ":
      case "PARTIALLY_RECEIVED":
      case "PARTIAL":
      case "ຮັບບາງສ່ວນ": return "bg-pink-100 text-pink-700"; // Based on image
      default: return "bg-blue-100 text-blue-700"; // Defaulting to blue for unmatched pending-like states
    }
  }

  return (
    <Card className="shadow-sm border-gray-200/60 rounded-2xl h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-bold text-[#1f2937]">ໃບສັ່ງຊື້ລ່າສຸດ</CardTitle>
        {/* <a href="#" className="text-sm font-medium text-blue-600 hover:underline">ເບິ່ງທັງໝົດ</a> */}
      </CardHeader>
      <CardContent className="flex-1 p-0 px-6 pb-6">
        <div className="rounded-xl overflow-hidden border border-gray-100">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#1e3a8a] hover:bg-[#1e3a8a]">
                <TableHead className="text-white bg-transparent h-12">ເລກທີ PO</TableHead>
                <TableHead className="text-white bg-transparent">ຊື່ບໍລິສັດ</TableHead>
                <TableHead className="text-white bg-transparent">ວັນທີ</TableHead>
                <TableHead className="text-white bg-transparent text-center">ລາຍການ</TableHead>
                <TableHead className="text-white bg-transparent text-right">ມູນຄ່າ</TableHead>
                <TableHead className="text-white bg-transparent text-center">ສະຖານະ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestPos.map((po, idx) => (
                <TableRow key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <TableCell className="font-semibold text-gray-900">{po.docno}</TableCell>
                  <TableCell className="text-gray-500">{po.apname}</TableCell>
                  <TableCell className="text-gray-500">{po.docdate}</TableCell>
                  <TableCell className="text-center text-gray-500">{po.itemCount}</TableCell>
                  <TableCell className="text-right font-bold text-gray-900">{formatAmount(po.totalAmount ?? po.amount, po.currencyCode)}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusColor(po.grStatus)}`}>
                      {po.grStatus}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {latestPos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">ບໍ່ມີຂໍ້ມູນ (No data)</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
