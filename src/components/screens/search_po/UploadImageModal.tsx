import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CloudUpload, Camera, X } from 'lucide-react';
import { useUploadDamageEvidencePhoto } from '@/hooks/gr-damage-photo-hook/useUploadDamageEvidencePhoto';

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  grid: string;
  grdid?: string;
  onSuccess?: () => void;
  existingPhotos?: any[];
  onDeleteExisting?: (attachmentId: string) => void;
}

export function UploadImageModal({ isOpen, onClose, grid, grdid = "", onSuccess, existingPhotos = [], onDeleteExisting }: UploadImageModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPhoto, loading } = useUploadDamageEvidencePhoto();

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFiles([]);
      setPreviews([]);
    }
  }, [isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      
      setFiles((prev) => [...prev, ...selectedFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]); // Cleanup
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    // Call the upload hook
    const result = await uploadPhoto(grid, grdid, files);
    
    if (result.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      alert("ອັບໂຫຼດຮູບພາບບໍ່ສຳເລັດ"); // Basic error handling, can be improved
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-3xl p-0 border border-gray-200/50 shadow-2xl rounded-2xl z-[101] bg-white gap-0 overflow-hidden outline-none"
      >
        <DialogTitle className="sr-only">ອັບໂຫຼດຮູບພາບ</DialogTitle>
        <DialogDescription className="sr-only">ອັບໂຫຼດຮູບພາບສຳລັບໃບຮັບສິນຄ້າ</DialogDescription>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-8 h-8 flex shrink-0 items-center justify-center rounded-full bg-[#244195] text-white hover:bg-[#1e3a8a] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-bold text-[#1e3a8a]">ອັບໂຫຼດຮູບພາບ</h1>
          </div>
          <p className="text-sm text-gray-500">
            ແຕະເພື່ອເລືອກໄຟລ໌ ຫຼື ກົດປຸ່ມກ້ອງດ້ານລຸ່ມ
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-8 pb-6 flex flex-col gap-6">

          {/* Upload Area */}
          <div 
            className="w-full rounded-2xl border-2 border-dashed border-blue-200 bg-white py-14 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-blue-50/30 transition-colors relative"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              multiple 
              accept="image/jpeg, image/png, image/jpg" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 pointer-events-none">
              <CloudUpload className="w-7 h-7" />
            </div>
            <div className="text-center pointer-events-none">
              <h3 className="text-2xl font-bold text-[#244195] mb-2">ແຕະເພື່ອເລືອກໄຟລ໌</h3>
              <p className="text-sm text-[#244195]/70">ຮອງຮັບ JPG, PNG • ເລືອກໄດ້ຫຼາຍຮູບ</p>
            </div>
          </div>

          {/* Your Images Section */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-gray-900">ຮູບພາບຂອງທ່ານ ({files.length + existingPhotos.length})</h4>

            <div className="flex flex-wrap gap-3">
              {/* Existing Uploaded Photos */}
              {existingPhotos.map((photo) => (
                <div
                  key={photo.attachmentId}
                  className="relative w-20 h-20 rounded-xl border-2 border-transparent flex items-center justify-center overflow-hidden"
                >
                  <img src={photo.url} alt={photo.fileName || "Existing"} className="object-cover w-full h-full" />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteExisting) onDeleteExisting(photo.attachmentId);
                    }}
                    className="absolute top-1 right-1 bg-white/70 backdrop-blur text-gray-700 rounded-full p-0.5 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Newly Selected Photos */}
              {previews.map((previewUrl, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 rounded-xl border-2 border-transparent flex items-center justify-center overflow-hidden"
                >
                  <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
                  <button 
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-white/70 backdrop-blur text-gray-700 rounded-full p-0.5 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleUpload}
              disabled={loading || files.length === 0}
              className="h-10 px-12 rounded-[10px] bg-[#2563eb] hover:bg-blue-700 text-white font-bold shadow-sm disabled:opacity-50"
            >
              {loading ? "ກຳລັງອັບໂຫຼດ..." : "ບັນທຶກ"}
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

