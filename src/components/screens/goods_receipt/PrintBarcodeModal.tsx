'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, Check } from 'lucide-react';
import { AddBarcodeModal } from './AddBarcodeModal';
import { StandardPagination } from '@/components/customs/StandardPagination';

interface PrintBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  grId: string;
  items?: any[];
}

export function PrintBarcodeModal({ isOpen, onClose, grId, items = [] }: PrintBarcodeModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddBarcodeOpen, setIsAddBarcodeOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{code: string, name: string} | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const barcodeItems = items?.map((item: any, idx: number) => ({
    id: String(item.sequence || idx + 1).padStart(2, '0'),
    code: item.product?.code || '-',
    name: item.product?.name || '-',
    qty: item.quantities?.received || 0,
    status: item.product?.barcode ? 'NOT_PRINTED' : 'NO_BARCODE'
  })) || [];

  const totalPages = Math.ceil(barcodeItems.length / limit) || 1;
  const paginatedItems = barcodeItems.slice((page - 1) * limit, page * limit);
  
  const toggleSelectAll = () => {
    if (selectedIds.length === barcodeItems.length && barcodeItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(barcodeItems.map(item => item.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const renderBadge = (status: string) => {
    switch (status) {
      case 'NO_BARCODE':
        return <span className="px-3 py-1.5 bg-amber-50 text-amber-600 text-[11px] font-bold rounded-md">ຍັງບໍ່ມີບາໂຄດ</span>;
      case 'SUCCESS':
        return <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-md">ສຳເລັດ</span>;
      case 'NOT_PRINTED':
        return <span className="px-3 py-1.5 bg-rose-50 text-rose-500 text-[11px] font-bold rounded-md">ຍັງບໍ່ທັນພິມ</span>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="bg-black/20 z-[100]" />
      
      <DialogContent
        showCloseButton={false}
        className="max-w-[95vw] sm:max-w-5xl lg:max-w-6xl w-full p-0 border border-gray-100 shadow-2xl rounded-2xl z-[101] bg-white gap-0 outline-none overflow-hidden"
      >
        <DialogTitle className="sr-only">ພິມບາໂຄດ</DialogTitle>
        <DialogDescription className="sr-only">Print barcode for goods receipt items</DialogDescription>

        <div className="flex flex-col h-full max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="w-10 h-10 flex shrink-0 items-center justify-center rounded-full bg-[#244195] text-white hover:bg-blue-800 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-[22px] font-black text-[#1e3a8a] tracking-tight">ປິນບາໂຄດ</h1>
            </div>
            
            <Button className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-lg h-10 px-6 shadow-sm">
              ພິມທັງໝົດ
            </Button>
          </div>

          {/* Filters */}
          <div className="px-8 py-5 flex items-center justify-between bg-white">
            <div className="relative w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="ຄົ້ນຫາ" 
                className="pl-12 h-11 bg-gray-50 border-gray-100 rounded-full text-[13px] font-medium focus-visible:ring-blue-500 w-full text-gray-700 placeholder:text-gray-400 shadow-sm"
              />
            </div>
            
            <div className="flex flex-col gap-1.5 w-[220px]">
              <label className="text-[13px] font-bold text-gray-500">ສະຖານະການພິມ</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-11 bg-blue-50/50 border-blue-100 text-[#1e3a8a] font-bold rounded-xl focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="ທັງໝົດ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ທັງໝົດ</SelectItem>
                  <SelectItem value="printed">ສຳເລັດ</SelectItem>
                  <SelectItem value="not_printed">ຍັງບໍ່ທັນພິມ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table Container */}
          <div className="px-8 flex-1 overflow-auto pb-6">
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 bg-white">
                <h2 className="text-[15px] font-black text-gray-900">ລາຍການຮັບສິນຄ້າ</h2>
              </div>
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-100 h-12">
                    <TableHead className="w-[80px] bg-transparent text-gray-500">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={toggleSelectAll}
                          className={`w-[18px] h-[18px] rounded flex items-center justify-center cursor-pointer border-[1.5px] transition-colors ${selectedIds.length === barcodeItems.length && barcodeItems.length > 0 ? 'bg-[#2563eb] border-[#2563eb]' : 'border-blue-200 bg-white hover:border-blue-400'}`}
                        >
                          {selectedIds.length === barcodeItems.length && barcodeItems.length > 0 && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        </div>
                        <span className="text-gray-500 font-bold text-[13px]">ລຳດັບ</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[160px] bg-transparent text-gray-500 font-bold text-[13px]">ລະຫັດສິນຄ້າ</TableHead>
                    <TableHead className="w-auto bg-transparent text-gray-500 font-bold text-[13px]">ຊື່ລາຍການສິນຄ້າ</TableHead>
                    <TableHead className="w-[120px] bg-transparent text-gray-500 font-bold text-[13px] text-center">ຈຳນວນທີ່ຮັບ</TableHead>
                    <TableHead className="w-[130px] bg-transparent text-gray-500 font-bold text-[13px] text-center">ສະຖານະການພິມ</TableHead>
                    <TableHead className="w-[90px] bg-transparent text-gray-500 font-bold text-[13px] text-center pr-6">ຈັດການ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50/40 border-b border-gray-100 h-14">
                      <TableCell className="font-bold text-gray-900">
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={() => toggleSelect(item.id)}
                            className={`w-[18px] h-[18px] rounded flex items-center justify-center cursor-pointer border-[1.5px] transition-colors ${selectedIds.includes(item.id) ? 'bg-[#2563eb] border-[#2563eb]' : 'border-blue-200 bg-white hover:border-blue-400'}`}
                          >
                            {selectedIds.includes(item.id) && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                          </div>
                          <span className="text-[13px]">{item.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-500 text-[13px]">{item.code}</TableCell>
                      <TableCell className="font-semibold text-gray-900 text-[13px] whitespace-normal leading-relaxed pr-4">{item.name}</TableCell>
                      <TableCell className="font-bold text-gray-900 text-[13px] text-center">{item.qty}</TableCell>
                      <TableCell className="text-center">
                        {renderBadge(item.status)}
                      </TableCell>
                      <TableCell className="text-center pr-6">
                        {item.status === 'NO_BARCODE' ? (
                          <Button 
                            onClick={() => {
                              setSelectedProduct({ code: item.code, name: item.name });
                              setIsAddBarcodeOpen(true);
                            }}
                            className="h-8 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-lg text-[12px] shadow-sm"
                          >
                            ເພີ່ມ
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination Footer */}
          <StandardPagination
            page={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            className="rounded-b-2xl mt-auto"
          />

        </div>
      </DialogContent>

      <AddBarcodeModal 
        isOpen={isAddBarcodeOpen}
        onClose={() => setIsAddBarcodeOpen(false)}
        product={selectedProduct}
      />
    </Dialog>
  );
}
