'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

interface AddBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    code: string;
    name: string;
  } | null;
}

export function AddBarcodeModal({ isOpen, onClose, product }: AddBarcodeModalProps) {
  const [barcode, setBarcode] = useState("24385214872617");
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [unit, setUnit] = useState("pcs");

  useEffect(() => {
    if (product) {
      setProductCode(product.code);
      setProductName(product.name);
    }
  }, [product]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="bg-black/20 z-[110]" />
      <DialogContent 
        showCloseButton={false}
        className="max-w-[480px] w-[95vw] p-0 border border-gray-100 shadow-2xl rounded-2xl z-[111] bg-white gap-0 outline-none overflow-hidden"
      >
        <DialogTitle className="sr-only">ເພີ່ມບາໂຄດ</DialogTitle>
        <DialogDescription className="sr-only">Add new barcode details</DialogDescription>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-5">
            <button
              onClick={onClose}
              className="w-10 h-10 flex shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1e3a8a] hover:bg-blue-100 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[20px] font-black text-[#1e3a8a] tracking-tight">ເພີ່ມບາໂຄດ</h1>
          </div>

          <div className="px-8 pb-4">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h2 className="text-[18px] font-black text-[#1e3a8a]">ສ້າງລະຫັດ ບາໂຄດ</h2>
              <p className="text-[13px] font-medium text-gray-400 mt-1">ລະບຸຂໍ້ມູນບາໂຄດ ແລະ ຕັ້ງຄ່າການໃຊ້ງານສຳລັບສິນຄ້າ</p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-700">ລະຫັດບາໂຄດ</label>
                <Input 
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="h-11 border-gray-200 rounded-xl bg-white text-[14px] text-gray-600 font-medium focus-visible:ring-blue-500 shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-700">ລະຫັດສິນຄ້າ</label>
                <Input 
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  className="h-11 border-gray-200 rounded-xl bg-white text-[14px] text-gray-900 font-bold focus-visible:ring-blue-500 shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-700">ຊື່ສິນຄ້າສຳລັບພິມບາໂຄດ</label>
                <Input 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="h-11 border-gray-200 rounded-xl bg-white text-[14px] text-gray-900 font-bold focus-visible:ring-blue-500 shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-700">ຫົວໜ່ວຍ</label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="h-11 border-gray-200 rounded-xl bg-white text-[14px] font-medium focus:ring-blue-500 shadow-sm">
                    <SelectValue placeholder="ເລືອກຫົວໜ່ວຍ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">ແຜ່ນ (Pcs)</SelectItem>
                    <SelectItem value="box">ກ່ອງ (Box)</SelectItem>
                    <SelectItem value="kg">ກິໂລ (Kg)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-100 bg-white">
            <Button className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-xl h-12 shadow-sm text-[15px]">
              ບັນທຶກຂໍ້ມູນ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
