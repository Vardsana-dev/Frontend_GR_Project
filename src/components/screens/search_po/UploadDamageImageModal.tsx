import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CloudUpload, Camera, X } from 'lucide-react';
import Image from 'next/image';

interface UploadDamageImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export function UploadDamageImageModal({ isOpen, onClose, files, setFiles }: UploadDamageImageModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
    // reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        showCloseButton={false}
        className="sm:max-w-[700px] w-[95vw] p-0 border border-gray-200/50 shadow-2xl rounded-2xl z-[105] bg-white gap-0 overflow-hidden outline-none"
      >
        <DialogTitle className="sr-only">ອັບໂຫຼດຮູບພາບ</DialogTitle>
        <DialogDescription className="sr-only">ເລືອກຮູບພາບສຳລັບສິນຄ້າຊຳລຸດ</DialogDescription>

        {/* Header (Outer - if it was designed as a full screen or separate, but we use Dialog) */}
        {/* Wait, the design has a header outside the white box? No, the white box is the modal itself.
            But the header in the screenshot: "ອັບໂຫຼດຮູບພາບ" with back button is outside the dashed box. */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/0">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="w-10 h-10 flex shrink-0 items-center justify-center rounded-full bg-[#244195] text-white hover:bg-[#1e3a8a] transition-colors shadow-md"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-[#1e3a8a]">ອັບໂຫຼດຮູບພາບ</h1>
          </div>
          <span className="text-xs text-gray-400 font-medium hidden sm:inline-block">
            ແຕະເພື່ອເລືອກໄຟລ໌ ຫຼື ກົດປຸ່ມກ້ອງດ້ານລຸ່ມ
          </span>
        </div>

        {/* Body */}
        <div className="p-6 pt-2 flex flex-col gap-6">
          
          {/* Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center py-12 rounded-2xl border-2 border-dashed border-blue-200 bg-[#f8fbff] hover:bg-blue-50/50 transition-colors cursor-pointer"
          >
            <div className="w-14 h-14 bg-blue-100 text-[#3b82f6] rounded-full flex items-center justify-center mb-4">
              <CloudUpload className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mb-2">ແຕະເພື່ອເລືອກໄຟລ໌</h2>
            <p className="text-sm font-medium text-gray-500">ຮອງຮັບ JPG, PNG • ເລືອກໄດ້ຫຼາຍຮູບ</p>
            <input 
              type="file" 
              multiple 
              accept="image/png, image/jpeg" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {/* Image Previews */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-gray-800">ຮູບພາບຂອງທ່ານ ({files.length})</h3>
            <div className="flex gap-3 overflow-x-auto pb-4 items-center min-h-[90px]">
              
              {/* Add New Button in the list (Optional but good UX) */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 w-20 h-20 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-400 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Camera className="w-6 h-6" />
              </div>

              {files.map((file, idx) => (
                <div key={idx} className="shrink-0 relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                  <Image 
                    src={URL.createObjectURL(file)} 
                    alt={`Preview ${idx}`} 
                    layout="fill" 
                    objectFit="cover" 
                    unoptimized 
                  />
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                    className="absolute top-1 right-1 bg-white/80 text-gray-600 rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <Button 
              onClick={onClose}
              className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold h-11 px-10 rounded-xl shadow-sm text-sm"
            >
              ບັນທຶກ
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
