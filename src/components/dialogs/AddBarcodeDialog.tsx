'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useAddBarcodeToProduct } from '@/hooks/product-hook/useAddBarcodeToProduct';

interface AddBarcodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    code?: string;
    name?: string;
    unitcode?: string;
    barcode?: string;
  } | null;
  onSuccess?: (data: { code: string; barcode: string }) => void;
}

export function AddBarcodeDialog({ isOpen, onClose, product, onSuccess }: AddBarcodeDialogProps) {
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
      setUnit(product.unitcode || 'Box1');
      setBarcode(product.barcode || '');
    } else {
      setBarcode('');
      setProductCode('');
      setProductName('');
      setUnit('Box1');
    }
    setValidationError('');
  }, [product, isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const trimmedCode = productCode.trim();
    const trimmedBarcode = barcode.trim();
    const trimmedName = productName.trim();

    if (!trimmedBarcode) {
      setValidationError('ກະລຸນາລະບຸລະຫັດບາໂຄດ');
      return;
    }
    if (!trimmedCode) {
      setValidationError('ກະລຸນາລະບຸລະຫັດສິນຄ້າ');
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
      if (onSuccess) {
        onSuccess({ code: trimmedCode, barcode: trimmedBarcode });
      }
      onClose();
    }
  };

  const displayError = validationError || apiError;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-none w-screen h-screen m-0 p-0 rounded-none bg-transparent border-none shadow-none flex flex-col items-center justify-center [&>button]:hidden"
        overlayClassName="bg-white/40 backdrop-blur-md"
      >
        {/* Floating Header */}
        <div className="absolute top-6 left-8 flex items-center gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-12 h-12 bg-[#eef2fc] text-[#2b4c9b] rounded-2xl flex items-center justify-center hover:bg-[#dbe4f9] transition-colors cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft className="w-6 h-6" strokeWidth={2} />
          </button>
          <h1 className="text-3xl font-bold text-[#1e3a8a] tracking-wide">ເພີ່ມບາໂຄດ</h1>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] w-full max-w-[500px] p-8 animate-in zoom-in-95 duration-200"
        >
          <div className="mb-6">
            <DialogTitle className="text-[22px] font-bold text-[#1e3a8a] mb-1">ສ້າງລະຫັດ ບາໂຄດ</DialogTitle>
            <DialogDescription className="text-[15px] text-gray-500">
              ລະບຸຂໍ້ມູນບາໂຄດ ແລະ ຕັ້ງຄ່າການນຳໃຊ້ສຳລັບສິນຄ້າ
            </DialogDescription>
          </div>

          <hr className="border-t border-blue-200/60 mb-6" />

          {/* Error Banner */}
          {displayError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{displayError}</span>
            </div>
          )}

          <div className="flex flex-col gap-5">
            {/* Field 1: Product Code (productcode) */}
            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-bold text-[#1e3a8a]">ລະຫັດສິນຄ້າ</label>
              <input
                type="text"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                placeholder="PVC-400-S8"
                disabled={loading}
                className="h-[52px] px-4 rounded-xl border border-gray-200 bg-[#f9fafb] text-[15px] font-mono font-bold outline-none focus:border-[#2b4c9b] focus:ring-1 focus:ring-[#2b4c9b] transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Field 2: Unit (unitcode) */}
            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-bold text-[#1e3a8a]">ຫົວໜ່ວຍ</label>
              <div className="relative">
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  disabled={loading}
                  className="h-[52px] w-full px-4 rounded-xl border border-gray-200 bg-[#f9fafb] text-[15px] outline-none focus:border-[#2b4c9b] focus:ring-1 focus:ring-[#2b4c9b] transition-all appearance-none cursor-pointer text-gray-700"
                >
                  <option value="Box1">ກ່ອງ (Box1)</option>
                  <option value="Box">ກ່ອງ (Box)</option>
                  <option value="pcs">ແຜ່ນ / ອັນ (Pcs)</option>
                  <option value="kg">ກິໂລ (Kg)</option>
                  <option value="Pack">ແພັກ (Pack)</option>
                  <option value="Bag">ຖົງ (Bag)</option>
                  <option value="Roll">ມ້ວນ (Roll)</option>
                  <option value="Set">ຊຸດ (Set)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2b4c9b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            {/* Field 3: Barcode (barcode) */}
            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-bold text-[#1e3a8a]">ລະຫັດບາໂຄດ</label>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="8851234567890"
                disabled={loading}
                className="h-[52px] px-4 rounded-xl border border-gray-200 bg-[#f9fafb] text-[15px] font-mono outline-none focus:border-[#2b4c9b] focus:ring-1 focus:ring-[#2b4c9b] transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Field 4: Product Name (barcodetext) */}
            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-bold text-[#1e3a8a]">ຊື່ສິນຄ້າສຳລັບພິມບາໂຄດ</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="ຊື່ສິນຄ້າ ຫຼື ລາຍລະອຽດ"
                disabled={loading}
                className="h-[52px] px-4 rounded-xl border border-gray-200 bg-[#f9fafb] text-[15px] outline-none focus:border-[#2b4c9b] focus:ring-1 focus:ring-[#2b4c9b] transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <hr className="border-t border-gray-200 mt-8 mb-6" />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[54px] bg-[#2b4c9b] hover:bg-[#1e3a8a] text-white rounded-xl font-bold text-[16px] transition-colors shadow-md shadow-blue-900/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>ກຳລັງບັນທຶກ...</span>
              </>
            ) : (
              <span>ບັນທຶກຂໍ້ມູນ</span>
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
