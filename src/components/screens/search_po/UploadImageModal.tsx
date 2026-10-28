import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CloudUpload, X, Trash2, Check, Maximize2, ExternalLink, Loader2 } from 'lucide-react';
import { useUploadDamageEvidencePhoto } from '@/hooks/gr-damage-photo-hook/useUploadDamageEvidencePhoto';

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  grid: string;
  grdid?: string;
  onSuccess?: () => void;
  existingPhotos?: any[];
  onDeleteExisting?: (attachmentId: string) => void | Promise<any>;
}

interface SelectedPhoto {
  type: 'existing' | 'new';
  id?: string;
  index?: number;
  url: string;
}

export function UploadImageModal({ isOpen, onClose, grid, grdid = "", onSuccess, existingPhotos = [], onDeleteExisting }: UploadImageModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<SelectedPhoto | null>(null);
  const [previewFullScreenUrl, setPreviewFullScreenUrl] = useState<string | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
      setSelectedPhoto(null);
      setPreviewFullScreenUrl(null);
      setIsConfirmDeleteOpen(false);
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
    if (selectedPhoto?.type === 'new' && selectedPhoto.index === index) {
      setSelectedPhoto(null);
    }
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]); // Cleanup
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleDeleteSelected = async () => {
    if (!selectedPhoto) return;

    if (selectedPhoto.type === 'existing' && selectedPhoto.id) {
      if (onDeleteExisting) {
        setIsDeleting(true);
        try {
          await onDeleteExisting(selectedPhoto.id);
        } catch (err) {
          console.error("Error deleting existing photo:", err);
        } finally {
          setIsDeleting(false);
          setSelectedPhoto(null);
        }
      }
    } else if (selectedPhoto.type === 'new' && typeof selectedPhoto.index === 'number') {
      removeFile(selectedPhoto.index);
      setSelectedPhoto(null);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    // Call the upload hook
    const result = await uploadPhoto(grid, grdid, files);
    
    if (result.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      alert("ອັບໂຫຼດຮູບພາບບໍ່ສຳເລັດ");
    }
  };

  return (
    <>
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
                type="button"
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
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900">
                  ຮູບພາບຂອງທ່ານ ({files.length + existingPhotos.length})
                </h4>
                {selectedPhoto && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    ເລືອກແລ້ວ 1 ຮູບ
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Existing Uploaded Photos */}
                {existingPhotos.map((photo, idx) => {
                  const photoId = photo.attachmentId || photo.id || `existing-${idx}`;
                  const isSelected = selectedPhoto?.type === 'existing' && selectedPhoto.id === (photo.attachmentId || photo.id);

                  return (
                    <div
                      key={photoId}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedPhoto(null);
                        } else {
                          setSelectedPhoto({
                            type: 'existing',
                            id: photo.attachmentId || photo.id,
                            url: photo.url,
                          });
                        }
                      }}
                      className={`relative w-20 h-20 rounded-xl border-2 flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-200 group ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-500 shadow-md scale-105'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      title={isSelected ? "ກົດເພື່ອຍົກເລີກການເລືອກ" : "ກົດເພື່ອເລືອກຮູບ"}
                    >
                      <img src={photo.url} alt={photo.fileName || "Existing"} className="object-cover w-full h-full" />
                      
                      {/* Check badge when selected */}
                      {isSelected && (
                        <div className="absolute top-1 left-1 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md z-10">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}

                      {/* Full Screen View button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewFullScreenUrl(photo.url);
                        }}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        title="ເບິ່ງເຕັມຈໍ"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}

                {/* Newly Selected Photos */}
                {previews.map((previewUrl, index) => {
                  const isSelected = selectedPhoto?.type === 'new' && selectedPhoto.index === index;

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedPhoto(null);
                        } else {
                          setSelectedPhoto({
                            type: 'new',
                            index,
                            url: previewUrl,
                          });
                        }
                      }}
                      className={`relative w-20 h-20 rounded-xl border-2 flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-200 group ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-500 shadow-md scale-105'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      title={isSelected ? "ກົດເພື່ອຍົກເລີກການເລືອກ" : "ກົດເພື່ອເລືອກຮູບ"}
                    >
                      <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
                      
                      {/* Check badge when selected */}
                      {isSelected && (
                        <div className="absolute top-1 left-1 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md z-10">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}

                      {/* Full Screen View button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewFullScreenUrl(previewUrl);
                        }}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        title="ເບິ່ງເຕັມຈໍ"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              {/* Fullscreen Button: appears when image is selected */}
              {selectedPhoto && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPreviewFullScreenUrl(selectedPhoto.url)}
                  className="h-10 px-4 rounded-[10px] border-blue-200 text-[#244195] hover:bg-blue-50 font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>ເບິ່ງເຕັມຈໍ</span>
                </Button>
              )}

              {/* Delete Button: appears ONLY when image is selected */}
              {selectedPhoto && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isDeleting || loading}
                  onClick={() => setIsConfirmDeleteOpen(true)}
                  className="h-10 px-6 rounded-[10px] border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold shadow-xs transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>ລຶບ</span>
                </Button>
              )}

              {/* Save Button */}
              <Button
                type="button"
                onClick={handleUpload}
                disabled={loading || files.length === 0}
                className="h-10 px-12 rounded-[10px] bg-[#2563eb] hover:bg-blue-700 text-white font-bold shadow-sm disabled:opacity-50 transition-colors"
              >
                {loading ? "ກຳລັງອັບໂຫຼດ..." : "ບັນທຶກ"}
              </Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Image Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={(open) => !open && !isDeleting && setIsConfirmDeleteOpen(false)}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="z-[120] bg-black/60"
          className="max-w-md p-0 overflow-hidden border-0 shadow-2xl rounded-2xl z-[125] bg-white outline-none"
        >
          <DialogTitle className="sr-only">ຢືນຢັນການລຶບຮູບພາບ</DialogTitle>
          <DialogDescription className="sr-only">ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຮູບພາບນີ້</DialogDescription>

          <div className="bg-red-50/70 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3 shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center">
              ຢືນຢັນການລຶບຮູບພາບ
            </h3>
            <p className="text-base font-semibold text-gray-700 text-center mt-2">
              ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຮູບພາບນີ້?
            </p>

            {selectedPhoto && (
              <div className="mt-4 w-20 h-20 rounded-xl overflow-hidden border-2 border-red-200 shadow-sm relative">
                <img src={selectedPhoto.url} alt="To delete" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 flex items-center justify-center gap-3">
            {/* Option: Cancel */}
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setIsConfirmDeleteOpen(false)}
              className="w-full max-w-[140px] h-11 border-gray-300 font-bold rounded-xl text-gray-700 hover:bg-gray-100"
            >
              ຍົກເລີກ
            </Button>

            {/* Option: Confirm (Yes) */}
            <Button
              type="button"
              disabled={isDeleting}
              onClick={async () => {
                await handleDeleteSelected();
                setIsConfirmDeleteOpen(false);
              }}
              className="w-full max-w-[140px] h-11 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>ກຳລັງລຶບ...</span>
                </>
              ) : (
                <span>ແມ່ນ</span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Screen Image Modal */}
      <Dialog open={!!previewFullScreenUrl} onOpenChange={(open) => !open && setPreviewFullScreenUrl(null)}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="z-[110] bg-black/60"
          className="max-w-4xl p-0 bg-transparent border-none shadow-2xl rounded-2xl flex flex-col items-center justify-center overflow-hidden z-[115]"
        >
          <DialogTitle className="sr-only">ຮູບພາບເຕັມຈໍ</DialogTitle>
          <DialogDescription className="sr-only">ເບິ່ງຮູບພາບຂະໜາດເຕັມ</DialogDescription>
          {previewFullScreenUrl && (
            <div className="relative w-full bg-black/90 rounded-2xl p-4 flex flex-col items-center justify-center gap-4 backdrop-blur-md">
              <div className="w-full flex items-center justify-between px-2 text-white">
                <span className="text-sm font-medium text-gray-300">ຮູບພາບສິນຄ້າ</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(previewFullScreenUrl, '_blank')}
                    className="text-gray-300 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    ເປີດໃນແທັບໃໝ່
                  </Button>
                  <button
                    type="button"
                    onClick={() => setPreviewFullScreenUrl(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-auto p-2">
                <img
                  src={previewFullScreenUrl}
                  alt="Full preview"
                  className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-2xl"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

