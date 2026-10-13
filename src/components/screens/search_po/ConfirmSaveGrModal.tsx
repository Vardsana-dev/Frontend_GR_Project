import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { useReceiveGr } from '@/hooks/gr-hook/useReceiveGr';

interface ConfirmSaveGrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  totalAmount?: string;
  grid?: string;
  currencyCode?: string;
  initialExchangeRate?: number | string;
}

export function ConfirmSaveGrModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  totalAmount = "769", 
  grid,
  currencyCode = "THB",
  initialExchangeRate = 1
}: ConfirmSaveGrModalProps) {
  const [exchangeRate, setExchangeRate] = useState<string>(String(initialExchangeRate || 1));
  const [isManualInput, setIsManualInput] = useState<boolean>(false);
  const { receiveGr, loading } = useReceiveGr();

  React.useEffect(() => {
    if (isOpen) {
      setExchangeRate(String(initialExchangeRate || 1));
      setIsManualInput(false);
    }
  }, [isOpen, initialExchangeRate]);

  const getCurrencySymbol = (code: string) => {
    switch (code?.toUpperCase()) {
      case 'THB': return '฿';
      case 'USD': return '$';
      case 'LAK':
      case 'KIP': return '₭';
      default: return code ? `${code} ` : '$ ';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* 
        Using a custom overlay style if needed, or rely on Shadcn default. 
        We use z-[105] to ensure it sits on top of everything.
      */}
      <DialogContent 
        showCloseButton={false}
        className="sm:max-w-[420px] p-6 border-0 shadow-2xl rounded-[24px] z-[105] bg-white gap-6 outline-none"
      >
        <DialogTitle className="sr-only">ກະລຸນາປ້ອນເຣດເງິນ</DialogTitle>
        <DialogDescription className="sr-only">ປ້ອນເຣດເງິນເພື່ອບັນທຶກການຮັບສິນຄ້າ</DialogDescription>

        {/* Header */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="w-8 h-8 flex shrink-0 items-center justify-center rounded-xl bg-[#244195] text-white hover:bg-[#1e3a8a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-bold text-[#0f172a]">ກະລຸນາປ້ອນເຣດເງິນ</h2>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 mt-2">
          
          {/* Main Exchange Rate Input */}
          <div className="flex flex-col gap-2">
            <Input 
              type="number"
              step="any"
              value={exchangeRate}
              disabled={!isManualInput}
              onChange={(e) => setExchangeRate(e.target.value)}
              className={`h-20 text-4xl font-bold rounded-2xl border-gray-200 px-5 transition-all shadow-sm ${
                isManualInput 
                  ? "bg-white text-gray-800 focus-visible:ring-blue-500 focus-visible:border-blue-500" 
                  : "bg-gray-100/80 text-gray-400 cursor-not-allowed select-none border-gray-200"
              }`}
            />

            {/* Checkbox: ປ້ອນເອງ */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="manual-rate-checkbox"
                checked={isManualInput}
                onChange={(e) => setIsManualInput(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#244195] focus:ring-[#244195] cursor-pointer accent-[#244195]"
              />
              <label 
                htmlFor="manual-rate-checkbox" 
                className="text-sm font-semibold text-gray-600 cursor-pointer select-none"
              >
                ປ້ອນເອງ
              </label>
            </div>
          </div>

          {/* Total Summary */}
          <div className="flex items-center justify-between bg-[#f8f9fa] rounded-xl px-5 py-4 mt-2">
            <span className="text-gray-500 font-medium text-sm">ຍອດລວມ</span>
            <span className="text-gray-900 font-black text-xl">
              {getCurrencySymbol(currencyCode)} {totalAmount}
            </span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 mt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 h-12 rounded-xl border-[#244195] text-[#244195] font-bold text-sm hover:bg-blue-50"
          >
            ຍົກເລີກ
          </Button>
          <Button 
            onClick={async () => {
              if (grid) {
                const numericRate = parseFloat(exchangeRate) || 1;
                const res = await receiveGr({ grid, exchangeRate: numericRate });
                if (res.success) {
                  if(onConfirm) onConfirm();
                  onClose();
                } else {
                  // Error handled by hook
                }
              }
            }}
            disabled={loading}
            className="flex-1 h-12 rounded-xl bg-[#244195] text-white font-bold text-sm hover:bg-[#1e3a8a] shadow-sm"
          >
            {loading ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
