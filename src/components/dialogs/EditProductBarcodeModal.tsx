'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useUpdateProductBarcode } from '@/hooks/product-hook/useUpdateProductBarcode';
import { ProductUnit } from '@/hooks/product-hook/useGetEachProductDetail';

export interface EditProductBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    code: string;
    nameth?: string;
    nameen?: string;
    stockunit?: string;
    units?: ProductUnit[];
  } | null;
  selectedUnit?: ProductUnit | null;
  onSuccess?: () => void;
}

export function EditProductBarcodeModal({
  isOpen,
  onClose,
  product,
  selectedUnit,
  onSuccess,
}: EditProductBarcodeModalProps) {
  const [productCode, setProductCode] = useState('');
  const [roworder, setRoworder] = useState<number>(1);
  const [unitCode, setUnitCode] = useState('Box1');
  const [barcode, setBarcode] = useState('');
  const [barcodeText, setBarcodeText] = useState('');
  const [validationError, setValidationError] = useState('');

  const { loading, error: apiError, updateProductBarcode } = useUpdateProductBarcode();

  // Populate form based on product and selectedUnit
  useEffect(() => {
    if (!product) return;

    setProductCode(product.code || '');

    // Identify which unit to edit: selectedUnit or first unit or defaults
    const targetUnit =
      selectedUnit ||
      (product.units && product.units.length > 0 ? product.units[0] : null);

    if (targetUnit) {
      setRoworder(targetUnit.roworder !== undefined ? targetUnit.roworder : 1);
      setUnitCode(targetUnit.unitcode || product.stockunit || 'Box1');
      setBarcode(targetUnit.barcode || '');
      setBarcodeText(targetUnit.barcodetext || product.nameth || product.nameen || '');
    } else {
      setRoworder(1);
      setUnitCode(product.stockunit || 'Box1');
      setBarcode('');
      setBarcodeText(product.nameth || product.nameen || '');
    }

    setValidationError('');
  }, [product, selectedUnit, isOpen]);

  // Handle switching which barcode/unit to edit if multiple exist
  const handleUnitSelect = (selectedBarcode: string) => {
    const found = product?.units?.find((u) => u.barcode === selectedBarcode);
    if (found) {
      setRoworder(found.roworder !== undefined ? found.roworder : 1);
      setUnitCode(found.unitcode || product?.stockunit || 'Box1');
      setBarcode(found.barcode || '');
      setBarcodeText(found.barcodetext || product?.nameth || product?.nameen || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const trimmedCode = productCode.trim();
    const trimmedBarcode = barcode.trim();
    const trimmedText = barcodeText.trim();
    const trimmedUnit = unitCode.trim();

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
      roworder: Number(roworder) || 1,
      unitcode: trimmedUnit || 'Box1',
      barcode: trimmedBarcode,
      barcodetext: trimmedText || trimmedBarcode,
    };

    const res = await updateProductBarcode(payload);

    if (res.success) {
      if (onSuccess) {
        onSuccess();
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
        <DialogTitle className="sr-only">ແກ້ໄຂບາໂຄດ</DialogTitle>
        <DialogDescription className="sr-only">Edit barcode for product</DialogDescription>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-10 h-10 flex shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1e3a8a] hover:bg-blue-100 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-[20px] font-black text-[#1e3a8a] tracking-tight">ແກ້ໄຂບາໂຄດ</h1>
              <p className="text-xs font-semibold text-gray-400 mt-0.5">
                ລະຫັດສິນຄ້າ: {product?.code || '-'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-5 flex flex-col gap-4">
            <div className="border-b border-gray-100 pb-3 mb-1">
              <h2 className="text-[17px] font-black text-[#1e3a8a]">ປັບປຸງຂໍ້ມູນ ບາໂຄດ</h2>
              <p className="text-[13px] font-medium text-gray-400 mt-0.5">
                ລະບຸຂໍ້ມູນບາໂຄດ ແລະ ບັນທຶກການປ່ຽນແປງ
              </p>
            </div>

            {/* Error Message Alert */}
            {displayError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{displayError}</span>
              </div>
            )}

            {/* Field 1: Product Code (productcode) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-gray-700">
                ລະຫັດສິນຄ້າ <span className="text-gray-400 font-normal font-mono">(productcode)</span>
              </label>
              <Input
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                placeholder="MN011851"
                disabled={loading}
                className="h-11 border-gray-200 rounded-xl bg-gray-50/70 text-[14px] text-gray-900 font-bold focus-visible:ring-blue-500 shadow-sm font-mono"
              />
            </div>

            {/* Selector if product has multiple barcode units */}
            {product?.units && product.units.length > 1 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#1e3a8a]">
                  ເລືອກບາໂຄດທີ່ຕ້ອງການແກ້ໄຂ
                </label>
                <Select value={barcode} onValueChange={handleUnitSelect} disabled={loading}>
                  <SelectTrigger className="h-11 border-blue-200 bg-blue-50/50 rounded-xl text-[13px] font-bold text-[#1e3a8a] focus:ring-blue-500 shadow-sm">
                    <SelectValue placeholder="ເລືອກບາໂຄດ" />
                  </SelectTrigger>
                  <SelectContent className="z-[120]">
                    {product.units.map((u, idx) => (
                      <SelectItem key={idx} value={u.barcode}>
                        Barcode: {u.barcode} (ແຖວ: {u.roworder ?? idx + 1}, {u.unitcode || 'Pcs'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Field 2: Row Order (roworder) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-gray-700">
                ລຳດັບແຖວ <span className="text-gray-400 font-normal font-mono">(roworder)</span>
              </label>
              <Input
                type="number"
                value={roworder}
                onChange={(e) => setRoworder(Number(e.target.value) || 0)}
                placeholder="7"
                disabled={loading}
                className="h-11 border-gray-200 rounded-xl bg-white text-[14px] text-gray-900 font-mono font-medium focus-visible:ring-blue-500 shadow-sm"
              />
            </div>

            {/* Field 3: Unit (unitcode) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-gray-700">
                ຫົວໜ່ວຍ <span className="text-gray-400 font-normal font-mono">(unitcode)</span>
              </label>
              <Select value={unitCode} onValueChange={setUnitCode} disabled={loading}>
                <SelectTrigger className="h-11 border-gray-200 rounded-xl bg-white text-[14px] font-medium focus:ring-blue-500 shadow-sm">
                  <SelectValue placeholder="ເລືອກຫົວໜ່ວຍ" />
                </SelectTrigger>
                <SelectContent className="z-[120]">
                  <SelectItem value="Box1">Box1 (ກ່ອງ)</SelectItem>
                  <SelectItem value="Box">Box (ກ່ອງ)</SelectItem>
                  <SelectItem value="pcs">pcs (ແຜ່ນ / ອັນ)</SelectItem>
                  <SelectItem value="kg">kg (ກິໂລ)</SelectItem>
                  <SelectItem value="Pack">Pack (ແພັກ)</SelectItem>
                  <SelectItem value="Bag">Bag (ຖົງ)</SelectItem>
                  <SelectItem value="Roll">Roll (ມ້ວນ)</SelectItem>
                  <SelectItem value="Set">Set (ຊຸດ)</SelectItem>
                  {unitCode &&
                    !['Box1', 'Box', 'pcs', 'kg', 'Pack', 'Bag', 'Roll', 'Set'].includes(unitCode) && (
                      <SelectItem value={unitCode}>{unitCode}</SelectItem>
                    )}
                </SelectContent>
              </Select>
            </div>

            {/* Field 4: Barcode (barcode) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-gray-700">
                ລະຫັດບາໂຄດ <span className="text-gray-400 font-normal font-mono">(barcode)</span>
              </label>
              <Input
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="8851234567890VARDSANATEST"
                disabled={loading}
                className="h-11 border-gray-200 rounded-xl bg-white text-[14px] text-gray-800 font-mono font-medium focus-visible:ring-blue-500 shadow-sm"
              />
            </div>

            {/* Field 5: Barcode Text (barcodetext) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-gray-700">
                ຊື່ສິນຄ້າສຳລັບພິມບາໂຄດ <span className="text-gray-400 font-normal font-mono">(barcodetext)</span>
              </label>
              <Input
                value={barcodeText}
                onChange={(e) => setBarcodeText(e.target.value)}
                placeholder="Factory barcode (corrected)"
                disabled={loading}
                className="h-11 border-gray-200 rounded-xl bg-white text-[14px] text-gray-900 font-medium focus-visible:ring-blue-500 shadow-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-gray-100 mt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-xl h-12 shadow-sm text-[15px] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>ກຳລັງບັນທຶກການແກ້ໄຂ...</span>
                  </>
                ) : (
                  <span>ບັນທຶກການແກ້ໄຂ</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
