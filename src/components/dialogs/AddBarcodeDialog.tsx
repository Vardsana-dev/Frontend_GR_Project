'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';

interface AddBarcodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBarcodeDialog({ isOpen, onClose }: AddBarcodeDialogProps) {
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
            className="w-12 h-12 bg-[#eef2fc] text-[#2b4c9b] rounded-2xl flex items-center justify-center hover:bg-[#dbe4f9] transition-colors"
          >
            <ArrowLeft className="w-6 h-6" strokeWidth={2} />
          </button>
          <h1 className="text-3xl font-bold text-[#1e3a8a] tracking-wide">
            ເພີ່ມບາໂຄດ
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] w-full max-w-[500px] p-8 animate-in zoom-in-95 duration-200">
          
          <div className="mb-6">
            <DialogTitle className="text-[22px] font-bold text-[#1e3a8a] mb-1">ສ້າງລະຫັດ ບາໂຄດ</DialogTitle>
            <DialogDescription className="text-[15px] text-gray-500">ລະບຸຂໍ້ມູນບາໂຄດ ແລະ ຕັ້ງຄ່າການນຳໃຊ້ສຳລັບສິນຄ້າ</DialogDescription>
          </div>

          <hr className="border-t border-blue-200/60 mb-6" />

          <div className="flex flex-col gap-5">
            {/* Field 1 */}
            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-bold text-[#1e3a8a]">ລະຫັດບາໂຄດ</label>
              <input 
                type="text" 
                placeholder="24385214872617" 
                className="h-[52px] px-4 rounded-xl border border-gray-200 bg-[#f9fafb] text-[15px] outline-none focus:border-[#2b4c9b] focus:ring-1 focus:ring-[#2b4c9b] transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Field 2 */}
            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-bold text-[#1e3a8a]">ລະຫັດສິນຄ້າ</label>
              <input 
                type="text" 
                placeholder="PVC-400-S8" 
                className="h-[52px] px-4 rounded-xl border border-gray-200 bg-[#f9fafb] text-[15px] outline-none focus:border-[#2b4c9b] focus:ring-1 focus:ring-[#2b4c9b] transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Field 3 */}
            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-bold text-[#1e3a8a]">ຊື່ສິນຄ້າສຳລັບພິມບາໂຄດ</label>
              <input 
                type="text" 
                placeholder="ທໍ່ພີວີຊີແຂງສຳລັບໃຊ້ເປັນທໍ່ນ້ຳດື່ມ ຊະນິດບານຫົວ 4 ນິ້ວ (4.0 ແມັດ)" 
                className="h-[52px] px-4 rounded-xl border border-gray-200 bg-[#f9fafb] text-[15px] outline-none focus:border-[#2b4c9b] focus:ring-1 focus:ring-[#2b4c9b] transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Field 4 */}
            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-bold text-[#1e3a8a]">ຫົວໜ່ວຍ</label>
              <div className="relative">
                <select className="h-[52px] w-full px-4 rounded-xl border border-gray-200 bg-[#f9fafb] text-[15px] outline-none focus:border-[#2b4c9b] focus:ring-1 focus:ring-[#2b4c9b] transition-all appearance-none cursor-pointer text-gray-700">
                  <option value="">ແຜ່ນ (Pcs)</option>
                  <option value="1">ອັນ (Pieces)</option>
                  <option value="2">ກ່ອງ (Boxes)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2b4c9b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-200 mt-8 mb-6" />

          <button className="w-full h-[54px] bg-[#2b4c9b] hover:bg-[#1e3a8a] text-white rounded-xl font-bold text-[16px] transition-colors shadow-md shadow-blue-900/10">
            ບັນທຶກຂໍ້ມູນ
          </button>

        </div>
      </DialogContent>
    </Dialog>
  );
}
