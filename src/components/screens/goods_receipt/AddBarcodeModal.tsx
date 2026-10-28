'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useAddBarcodeToProduct } from '@/hooks/product-hook/useAddBarcodeToProduct';

interface AddBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    code: string;
    name: string;
    unitcode?: string;
    stockunit?: string;
    barcode?: string;
  } | null;
  onSave?: (data: { code: string; barcode: string; name: string; unitcode?: string }) => void;
}

export function AddBarcodeModal({ isOpen, onClose, product, onSave }: AddBarcodeModalProps) {
  const [barcode, setBarcode] = useState('');
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [unit, setUnit] = useState('Box1');
  const [validationError, setValidationError] = useState('');

  const { loading, error: apiError, addBarcodeToProduct } = useAddBarcodeToProduct();

  useEffect(() => {
    if (product) {
      setProductCode(product.code || '');
      setProductName(product.name || '');
      setUnit(product.unitcode || product.stockunit || 'Box1');
      setBarcode(product.barcode || '');
    } else {
      setBarcode('');
      setProductCode('');
      setProductName('');
      setUnit('Box1');
    }
    setValidationError('');
  }, [product, isOpen]);

  const handleSave = async () => {
    setValidationError('');

    const trimmedCode = productCode.trim();
    const trimmedBarcode = barcode.trim();
    const trimmedName = productName.trim();

    if (!trimmedCode) {
      setValidationError('ກະລຸນາລະບຸລະຫັດສິນຄ້າ');
      return;
    }
    if (!trimmedBarcode) {
      setValidationError('ກະລຸນາລະບຸລະຫັດບາໂຄດ');
      return;
    }

    const payload = {
      productcode: trimmedCode,
      unitcode: unit || 'Box1',
      barcode: trimmedBarcode,
      barcodetext: trimmedName || trimmedBarcode,
    };

    const res = await addBarcodeToProduct(payload);

    if (res.success) {
      if (onSave) {
        onSave({
          code: trimmedCode,
          barcode: trimmedBarcode,
          name: trimmedName,
          unitcode: unit,
        });
      }
      onClose();
    }
  };

  const displayError = validationError || apiError;

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
              disabled={loading}
              className="w-10 h-10 flex shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1e3a8a] hover:bg-blue-100 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[20px] font-black text-[#1e3a8a] tracking-tight">ເພີ່ມບາໂຄດ</h1>
          </div>

          <div className="px-8 pb-4">
            <div className="border-b border-gray-100 pb-4 mb-5">
              <h2 className="text-[18px] font-black text-[#1e3a8a]">ສ້າງລະຫັດ ບາໂຄດ</h2>
              <p className="text-[13px] font-medium text-gray-400 mt-1">
                ລະບຸຂໍ້ມູນບາໂຄດ ແລະ ຕັ້ງຄ່າການນຳໃຊ້ສຳລັບສິນຄ້າ
              </p>
            </div>

            {/* Error Message Alert */}
            {displayError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{displayError}</span>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* 1. Product Code input (productcode) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-700">ລະຫັດສິນຄ້າ</label>
                <Input
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="PVC-400-S8"
                  disabled={loading}
                  className="h-11 border-gray-200 rounded-xl bg-gray-50/70 text-[14px] text-gray-900 font-bold focus-visible:ring-blue-500 shadow-sm font-mono"
                />
              </div>

              {/* 2. Unit select (unitcode) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-700">ຫົວໜ່ວຍ</label>
                <Select value={unit} onValueChange={setUnit} disabled={loading}>
                  <SelectTrigger className="h-11 border-gray-200 rounded-xl bg-white text-[14px] font-medium focus:ring-blue-500 shadow-sm">
                    <SelectValue placeholder="ເລືອກຫົວໜ່ວຍ" />
                  </SelectTrigger>
                  <SelectContent className="z-[120]">
                    <SelectItem value="Box1">ກ່ອງ (Box1)</SelectItem>
                    <SelectItem value="Box">ກ່ອງ (Box)</SelectItem>
                    <SelectItem value="pcs">ແຜ່ນ / ອັນ (Pcs)</SelectItem>
                    <SelectItem value="kg">ກິໂລ (Kg)</SelectItem>
                    <SelectItem value="Pack">ແພັກ (Pack)</SelectItem>
                    <SelectItem value="Bag">ຖົງ (Bag)</SelectItem>
                    <SelectItem value="Roll">ມ້ວນ (Roll)</SelectItem>
                    <SelectItem value="Set">ຊຸດ (Set)</SelectItem>
                    {unit &&
                      !['Box1', 'Box', 'pcs', 'kg', 'Pack', 'Bag', 'Roll', 'Set'].includes(unit) && (
                        <SelectItem value={unit}>{unit}</SelectItem>
                      )}
                  </SelectContent>
                </Select>
              </div>

              {/* 3. Barcode input (barcode) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-700">ລະຫັດບາໂຄດ</label>
                <Input
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="8851234567890"
                  disabled={loading}
                  className="h-11 border-gray-200 rounded-xl bg-white text-[14px] text-gray-800 font-mono font-medium focus-visible:ring-blue-500 shadow-sm"
                />
              </div>

              {/* 4. Product Name for barcode (barcodetext) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-700">ຊື່ສິນຄ້າສຳລັບພິມບາໂຄດ</label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="ຊື່ສິນຄ້າ ຫຼື ລາຍລະອຽດ"
                  disabled={loading}
                  className="h-11 border-gray-200 rounded-xl bg-white text-[14px] text-gray-900 font-medium focus-visible:ring-blue-500 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-100 bg-white">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-xl h-12 shadow-sm text-[15px] flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>ກຳລັງບັນທຶກ...</span>
                </>
              ) : (
                <span>ບັນທຶກຂໍ້ມູນ</span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
