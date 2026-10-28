// @ts-nocheck
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { CreateGoodsReceiptModal } from './CreateGoodsReceiptModal';
import { usePoDetail } from '@/hooks/po-hook/usePoDetail';
import { normalizeCurrency } from '@/lib/currency';

export function PoDetailSection({ poNumber }: { poNumber: string }) {
  const searchParams = useSearchParams();
  const rawStatusParam = searchParams.get('status') || '';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, loading, error, fetchPoDetail } = usePoDetail();

  useEffect(() => {
    if (poNumber) {
      fetchPoDetail({ docno: poNumber });
    }
  }, [poNumber, fetchPoDetail]);

  const formatCurrency = (val: number | undefined | null) => {
    if (val == null) return '0.00';
    return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-medium">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-medium">ເກີດຂໍ້ຜິດພາດ: {error}</div>;
  if (!data) return <div className="p-10 text-center text-gray-500 font-medium">ບໍ່ພົບຂໍ້ມູນ PO ນີ້</div>;

  const { header, items } = data;
  const ccy = normalizeCurrency(header?.amounts?.currencyCode);

  // Calculate receiving status: ຮັບແລ້ວ, ຮັບເຂົ້າບາງສ່ວນ, or ລໍຖ້າຮັບ
  const getReceivingStatus = () => {
    // 1. Check if backend explicit grStatus / receiptStatus exists on detail
    const explicitStatus = header?.grStatus || header?.document?.grStatus || data?.grStatus || header?.receiptStatus;
    if (explicitStatus) {
      const s = String(explicitStatus).toUpperCase();
      if (s.includes('ບາງສ່ວນ') || s.includes('PARTIAL')) return 'ຮັບເຂົ້າບາງສ່ວນ';
      if (s.includes('ຮັບເຂົ້າແລ້ວ') || s.includes('ຮັບແລ້ວ') || s === 'RECEIVED' || s === 'COMPLETED') return 'ຮັບແລ້ວ';
      if (s.includes('ຍັງບໍ່ທັນ') || s.includes('ລໍຖ້າ') || s === 'PENDING' || s === 'UNRECEIVED' || s.includes('NOT_RECEIVED')) return 'ຍັງບໍ່ທັນຮັບເຂົ້າ';
    }

    // 2. Check statusParam from URL query (passed from search PO list)
    if (rawStatusParam) {
      const s = rawStatusParam.toUpperCase();
      if (s.includes('ບາງສ່ວນ') || s.includes('PARTIAL')) return 'ຮັບເຂົ້າບາງສ່ວນ';
      if (s.includes('ຮັບເຂົ້າແລ້ວ') || s.includes('ຮັບແລ້ວ') || s === 'RECEIVED' || s === 'COMPLETED') return 'ຮັບແລ້ວ';
      if (s.includes('ຍັງບໍ່ທັນ') || s.includes('ລໍຖ້າ') || s === 'PENDING' || s === 'UNRECEIVED' || s.includes('NOT_RECEIVED')) return 'ຍັງບໍ່ທັນຮັບເຂົ້າ';
    }

    // 3. Check item receiving quantities if items exist and have receiving data
    if (items && items.length > 0) {
      let totalOrdered = 0;
      let totalReceived = 0;
      let hasReceivedData = false;

      for (const it of items) {
        const ordered = Number(it.orderedQuantity ?? it.quantity ?? 0);
        const received = Number(it.grReceivedQty ?? it.receivedQuantity ?? it.receivedQty ?? 0);
        totalOrdered += ordered;
        totalReceived += received;

        if (it.grReceivedQty !== undefined || it.receivedQuantity !== undefined || it.receivedQty !== undefined) {
          hasReceivedData = true;
        }
      }

      if (hasReceivedData && totalOrdered > 0) {
        if (totalReceived >= totalOrdered) return 'ຮັບແລ້ວ';
        if (totalReceived > 0) return 'ຮັບເຂົ້າບາງສ່ວນ';
        return 'ລໍຖ້າຮັບ';
      }
    }

    return 'ລໍຖ້າຮັບ';
  };

  const currentStatus = getReceivingStatus();

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'ຮັບແລ້ວ':
        return 'bg-green-100 text-green-700';
      case 'ຮັບເຂົ້າບາງສ່ວນ':
        return 'bg-pink-100 text-pink-700';
      case 'ລໍຖ້າຮັບ':
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/search_po" className="flex items-center gap-2 text-[#244195] hover:text-[#1e3a8a] font-bold text-lg">
          <ArrowLeft className="w-5 h-5" />
          ກັບ
        </Link>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[#244195]">{header?.document?.docno || poNumber}</h1>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getBadgeStyle(currentStatus)}`}>
            {currentStatus}
          </span>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 h-10 rounded-lg shadow-sm text-sm font-semibold"
        >
          ຮັບສິນຄ້າ
        </Button>
      </div>

      {/* Supplier Info Card */}
      <Card className="shadow-sm border-gray-200/60 rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">ຂໍ້ມູນຜູ້ສະໜອງ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-10">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">ລະຫັດເຈົ້າໜີ້</p>
                <p className="font-bold text-gray-800">{header?.supplier?.apcode || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">ຊື່ເຈົ້າໜີ້</p>
                <p className="font-bold text-gray-800">{header?.supplier?.apname || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">ທີ່ຢູ່</p>
                <p className="font-bold text-gray-800">{header?.supplier?.addressTh || '-'}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">ເບີໂທ</p>
                <p className="font-bold text-gray-800">{header?.supplier?.telephone || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">ເຄຣດິດ</p>
                <p className="font-bold text-gray-800">{header?.creditTerm?.shortName || header?.creditTerm?.nameTh || '-'}</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">ວັນທີ</p>
                <p className="font-bold text-gray-800">{header?.document?.docdate || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">ກຳນົດສົ່ງມອບ</p>
                <p className="font-bold text-gray-800">{header?.document?.shipdate || '-'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">ລາຍການ ({items?.length || 0})</h2>
        </div>

        <Card className="shadow-sm border-gray-200/60 rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#244195] hover:bg-[#244195]">
                  <TableHead className="text-white bg-transparent h-14 text-center w-[60px] font-semibold border-r border-white/20">ລຳດັບ</TableHead>
                  <TableHead className="text-white bg-transparent text-center w-[160px] font-semibold border-r border-white/20">ລະຫັດສິນຄ້າ</TableHead>
                  <TableHead className="text-white bg-transparent w-[300px] font-semibold border-r border-white/20">ລາຍລະອຽດ</TableHead>
                  <TableHead className="text-white bg-transparent text-center font-semibold border-r border-white/20">ຈຳນວນ</TableHead>
                  <TableHead className="text-white bg-transparent text-center font-semibold border-r border-white/20">ຫົວໜ່ວຍ</TableHead>
                  <TableHead className="text-white bg-transparent text-center font-semibold border-r border-white/20">ລາຄາຊື້ / ໜ່ວຍ</TableHead>
                  <TableHead className="text-white bg-transparent text-center font-semibold border-r border-white/20">ສ່ວນຫຼຸດ</TableHead>
                  <TableHead className="text-white bg-transparent text-center font-semibold border-r border-white/20">ຍັງຄົງເຫຼືອ</TableHead>
                  <TableHead className="text-white bg-transparent text-center font-semibold">ຈຳນວນເງິນ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((row, idx) => (
                  <TableRow key={idx} className="bg-white border-b-gray-100 last:border-b-0">
                    <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{String(idx + 1).padStart(2, '0')}</TableCell>
                    <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">
                      {row.productcode || '-'}
                    </TableCell>
                    <TableCell className="border-r border-gray-100">
                      <span className="text-gray-500 text-sm leading-snug">{row.productname || '-'}</span>
                    </TableCell>
                    <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{formatCurrency(row.quantity)}</TableCell>
                    <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{row.unitcode}</TableCell>
                    <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{formatCurrency(row.unitprice)}</TableCell>
                    <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{formatCurrency(row.discamount)}</TableCell>
                    <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">
                      {formatCurrency(
                        row.remainingQuantity ??
                        (row as any).quantities?.remaining ??
                        (row as any).remainingQty ??
                        (row.quantity !== undefined
                          ? Math.max(0, Number(row.orderedQuantity ?? row.quantity ?? 0) - Number(row.grReceivedQty ?? (row as any).receivedQuantity ?? 0))
                          : row.quantity)
                      )}
                    </TableCell>
                    <TableCell className="text-center font-bold text-[#3b82f6]">{formatCurrency(row.netamount)}</TableCell>
                  </TableRow>
                ))}
                {(!items || items.length === 0) && (
                   <TableRow>
                     <TableCell colSpan={9} className="text-center py-6 text-gray-500">ບໍ່ມີລາຍການສິນຄ້າ</TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <div className="flex flex-col gap-[2px] mt-4">
        {/* Dark Blue Summary */}
        <div className="bg-[#244195] rounded-t-xl text-white p-6 pb-2">
          <h3 className="font-bold text-lg mb-6 tracking-wide">ສະຫຼຸບລາຍການ</h3>
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-blue-100/90 font-medium tracking-wide">ລວມເງິນ</span>
              <span className="font-bold tracking-wider">{formatCurrency(header?.amounts?.subtotal)} {ccy}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-blue-100/90 font-medium tracking-wide">ສ່ວນຫຼຸດ</span>
              <span className="font-bold tracking-wider">{formatCurrency(header?.amounts?.discount)} {ccy}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-blue-100/90 font-medium tracking-wide">ອາກອນເພີ່ມ {header?.amounts?.taxRate || 0}%</span>
              <span className="font-bold tracking-wider">{formatCurrency(header?.amounts?.tax)} {ccy}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-blue-100/90 font-medium tracking-wide">ລາຄາສິນຄ້າ / ບໍລິການ</span>
              <span className="font-bold tracking-wider">{formatCurrency(header?.amounts?.subtotal)} {ccy}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-blue-100/90 font-medium tracking-wide">ມູນຄ່າຍົກເວັ້ນ</span>
              <span className="font-bold tracking-wider">0.00 {ccy}</span>
            </div>
            <div className="flex justify-between items-center py-4 bg-[#1e3a8a]/40 -mx-6 px-6 -mb-2">
              <span className="text-white font-bold tracking-wide">ລວມເງິນທັງໝົດ</span>
              <span className="font-bold text-[15px] tracking-wider">{formatCurrency(header?.amounts?.total)} {ccy}</span>
            </div>
          </div>
        </div>

        {/* Light Blue Footer */}
        <div className="bg-[#d2e0fb] rounded-b-xl text-sm text-[#244195] p-5 font-semibold shadow-sm">
           <div className="flex flex-col gap-3">
             <div className="flex justify-between">
                <span className="text-[#3b82f6] font-medium">ໝາຍເລກທະບຽນລົດ</span>
                <span>-</span>
             </div>
             <div className="flex justify-between">
                <span className="text-[#3b82f6] font-medium">ພະນັກງານຮັບ</span>
                <span>{header?.creator?.name || '-'}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-[#3b82f6] font-medium">ໝາຍເຫດ</span>
                <span>{header?.remark || '-'}</span>
             </div>
           </div>
        </div>
      </div>

      <CreateGoodsReceiptModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        poNumber={poNumber} 
        poData={header}
        hidePoSearch={true}
      />
    </div>
  );
}
