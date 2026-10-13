import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Camera, Minus, Plus, ChevronRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useSetGrQuantity } from '@/hooks/gr-hook/useSetGrQuantity';
import { useUploadDamageEvidencePhoto } from '@/hooks/gr-damage-photo-hook/useUploadDamageEvidencePhoto';
import { UploadDamageImageModal } from './UploadDamageImageModal';

interface AddItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sku?: string;
  grid?: string;
  item?: any;
  onSaved?: () => void;
}

export function AddItemDetailModal({ isOpen, onClose, sku = "SKU-PVC-400-S8", grid, item, onSaved }: AddItemDetailModalProps) {
  const [receiveQty, setReceiveQty] = useState(Number(item?.quantities?.remaining ?? item?.quantities?.ordered ?? item?.qty ?? 0));
  const [status, setStatus] = useState<'defective' | 'incomplete' | null>('incomplete');
  const [defectiveQty, setDefectiveQty] = useState('0');
  const [remark, setRemark] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isUploadDamageModalOpen, setIsUploadDamageModalOpen] = useState(false);

  const { updateQuantity, loading: isSavingQty, error: qtyError } = useSetGrQuantity();
  const { uploadPhoto, loading: isUploading } = useUploadDamageEvidencePhoto();

  // Reset state when item changes
  React.useEffect(() => {
    if (item) {
      setReceiveQty(Number(item?.quantities?.remaining ?? item?.quantities?.ordered ?? item?.qty ?? 0));
      setDefectiveQty('0');
      setRemark('');
      setFiles([]);
    }
  }, [item]);

  const handleSave = async () => {
    if (!grid || !item?.podid) return;

    const finalQty = Number(receiveQty);
    const maxQty = Number(item?.quantities?.remaining ?? item?.quantities?.ordered ?? item?.qty ?? Infinity);
    if (finalQty <= 0) {
      alert("ຈຳນວນທີ່ຮັບຕ້ອງຫຼາຍກວ່າ 0 (Too small: expected number to be >0)");
      return;
    }
    if (finalQty > maxQty) {
      alert(`ຈຳນວນຮັບ (${finalQty}) ເກີນຈຳນວນທີ່ຍັງເຫຼືອໃນ PO (${maxQty})`);
      return;
    }

    const damagedQtyNum = Number(defectiveQty) || 0;
    if (damagedQtyNum > 0 && !remark.trim()) {
      alert("ກະລຸນາປ້ອນໝາຍເຫດ (Damage note is required when damaged quantity is greater than zero)");
      return;
    }

    // 1. Save Quantity
    const qtyRes = await updateQuantity(grid, item.podid, {
      quantity: finalQty,
      damagedQuantity: damagedQtyNum,
      damageNote: remark
    });

    if (!qtyRes.success) return;

    // 2. Upload photos if any and status is defective
    if (status === 'defective' && files.length > 0) {
      const uploadRes = await uploadPhoto(grid, item.grdid, files);
      if (!uploadRes.success) return;
    }

    if (onSaved) onSaved();
    onClose();
  };

  // Handle Product Images
  const productImages = item?.images || item?.product?.images || (item?.imageUrl ? [item.imageUrl] : null) || (item?.product?.imageUrl ? [item.product.imageUrl] : null) || [];
  const displayImages = productImages.length > 0 ? productImages : Array.from({ length: 5 }).map((_, i) => `https://placehold.co/800x800?text=IMG${i + 1}`);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset active image on item change
  React.useEffect(() => {
    setActiveImageIndex(0);
  }, [item]);

  // Auto-slide effect
  React.useEffect(() => {
    if (!isOpen || displayImages.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % displayImages.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [isOpen, displayImages.length, activeImageIndex]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-[1000px] lg:max-w-[1100px] w-[95vw] p-0 border border-gray-200/50 shadow-2xl rounded-2xl z-[101] bg-[#f8fafc] gap-0 overflow-hidden outline-none"
        >
          <DialogTitle className="sr-only">ລາຍລະອຽດການຮັບສິນຄ້າ</DialogTitle>
          <DialogDescription className="sr-only">ເບິ່ງລາຍລະອຽດແລະກຳນົດສະຖານະການຮັບສິນຄ້າ</DialogDescription>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="w-8 h-8 flex shrink-0 items-center justify-center rounded-full bg-[#244195] text-white hover:bg-[#1e3a8a] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-lg font-bold text-[#1e3a8a]">ລາຍລະອຽດການຮັບສິນຄ້າ</h1>
            </div>
            <span className="text-sm font-medium text-gray-700">{item?.itemcode || sku}</span>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] p-4 sm:p-5 gap-4 max-h-[90vh] overflow-y-auto overflow-x-hidden">

            {/* Left Column: Product Info & Images */}
            <div className="flex flex-col gap-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-sm rounded-md">{item?.product?.code || item?.itemcode || sku}</span>
                <span className="text-gray-400 text-sm">ຫົວໜ່ວຍ ({item?.quantities?.unitCode || item?.unitcode || "ແຜ່ນ"})</span>
              </div>

              {/* Main Image */}
              <div className="relative w-full h-[250px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-50 flex items-center justify-center">
                <Image src={displayImages[activeImageIndex]?.url || displayImages[activeImageIndex]} alt="Main Product" layout="fill" objectFit="contain" unoptimized />
              </div>

              {/* Image Indicator */}
              <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                <span>ຮູບທີ {activeImageIndex + 1} ຈາກ {displayImages.length}</span>
                <div className="flex gap-1.5">
                  {displayImages.map((_, idx) => (
                    <div key={idx} className={`w-2 h-2 rounded-full ${idx === activeImageIndex ? 'bg-[#2563eb]' : 'bg-gray-200'}`}></div>
                  ))}
                </div>
              </div>

              {/* Product Title */}
              <h2 className="text-lg font-bold text-[#1e3a8a] leading-snug line-clamp-2">
                {item?.product?.name || item?.itemname || item?.desc || "ທໍ່ພີວີຊີແຂງສຳລັບໃຊ້ເປັນທໍ່ນ້ຳດື່ມ ຊະນິດບານຫົວ 4 ນິ້ວ ຊັ້ນ 8.5 (4.0 ແມັດ)"}
              </h2>

              {/* Thumbnails */}
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-sm font-bold text-gray-400">ຮູບພາບທັງໝົດ</span>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {displayImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${idx === activeImageIndex ? 'border-blue-500 shadow-sm' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                    >
                      <div className="w-full h-full relative">
                        <Image src={img?.url || img} alt={`Thumb ${idx}`} layout="fill" objectFit="cover" unoptimized />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4">
                <div className="bg-[#d2e0fb]/50 rounded-xl p-2 sm:p-4 flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
                  <span className="text-xs sm:text-sm font-bold text-[#3b82f6]">ສັ່ງຊື້</span>
                  <span className="text-xl sm:text-2xl font-black text-[#1e3a8a]">{item?.quantities?.ordered ?? item?.qty ?? 0}</span>
                </div>
                <div className="bg-[#d2e0fb]/50 rounded-xl p-2 sm:p-4 flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
                  <span className="text-xs sm:text-sm font-bold text-[#3b82f6]">ໄດ້ຮັບ</span>
                  <span className="text-xl sm:text-2xl font-black text-[#1e3a8a]">{receiveQty}</span>
                </div>
                <div className="bg-[#d2e0fb]/50 rounded-xl p-2 sm:p-4 flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
                  <span className="text-xs sm:text-sm font-bold text-[#3b82f6]">ຍັງເຫຼືອ</span>
                  <span className="text-xl sm:text-2xl font-black text-[#1e3a8a]">{Math.max(0, (item?.quantities?.remaining ?? item?.quantities?.ordered ?? item?.qty ?? 0) - receiveQty)}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Data Entry */}
            <div className="flex flex-col gap-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">

              {/* Section 1: Barcodes */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-[#1e3a8a] text-lg">ລະຫັດສິນຄ້າ : {item?.itemcode || "SKU-001"}</h3>
                <div className="flex flex-col gap-1.5">
                  <Input value="Barcode 8993301121015" readOnly className="bg-gray-50 border-transparent text-gray-600 font-medium h-8 text-sm" />
                  <Input value="Barcode 8993301121016" readOnly className="bg-gray-50 border-transparent text-gray-600 font-medium h-8 text-sm" />
                  <Input value="Barcode 8993301121018" readOnly className="bg-gray-50 border-transparent text-gray-600 font-medium h-8 text-sm" />
                  <Input value="Barcode 8993301121019" readOnly className="bg-gray-50 border-transparent text-gray-600 font-medium h-8 text-sm" />
                </div>
                <span className="text-gray-400 text-sm font-medium mt-1">ຫົວໜ່ວຍ ({item?.unitcode || "ແຜ່ນ"})</span>
              </div>

              {/* Section 2: Receive Quantity */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-[#1e3a8a] text-sm">ປະລິມານທີ່ໄດ້ຮັບ</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setReceiveQty(Math.max(0, receiveQty - 1))}
                    className="w-10 h-10 rounded-xl border border-gray-100 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 shadow-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={receiveQty}
                    onChange={(e) => setReceiveQty(Number(e.target.value))}
                    className="flex-1 text-center font-bold text-2xl text-[#1e3a8a] bg-transparent border-none focus:outline-none w-full"
                    min="0"
                  />
                  <button
                    onClick={() => setReceiveQty(receiveQty + 1)}
                    className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2563eb] hover:bg-blue-100 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Section 3: Status */}
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-[#1e3a8a] text-sm">ສະຖານະ:</h3>
                <div className="flex justify-center">
                  {/* <Button 
                  variant={status === 'defective' ? 'default' : 'outline'}
                  onClick={() => setStatus('defective')}
                  className={`h-9 font-bold rounded-xl text-sm ${status === 'defective' ? 'bg-[#d2e0fb] text-[#1e3a8a] border-transparent hover:bg-blue-200' : 'border-[#1e3a8a] text-[#1e3a8a] hover:bg-blue-50'}`}
                >
                  ຊຳລຸດ
                </Button> */}
                  <Button
                    variant={status === 'incomplete' ? 'default' : 'outline'}
                    onClick={() => setStatus('incomplete')}
                    className={`h-9 w-1/2 font-bold rounded-xl text-sm border-2 ${status === 'incomplete' ? 'bg-[#d2e0fb] text-[#1e3a8a] border-blue-300 hover:bg-blue-200' : 'border-[#1e3a8a] text-[#1e3a8a] hover:bg-blue-50'}`}
                  >
                    ມາບໍ່ຄົບ
                  </Button>
                </div>
              </div>

              {/* Section 4: Defective/Incomplete Amount */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-900 text-xs">ຈຳນວນ</label>
                <Input
                  value={defectiveQty}
                  onChange={(e) => setDefectiveQty(e.target.value)}
                  className="h-9 border-gray-200 rounded-xl text-red-600 font-bold focus-visible:ring-blue-500"
                />
              </div>

              {/* Section 5: Attach Images */}
              {status === 'defective' && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-900 text-xs">ແນບຮູບ</label>
                  <div
                    onClick={() => setIsUploadDamageModalOpen(true)}
                    className="flex items-center justify-between border border-gray-200 rounded-xl p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">ແນບຮູບ</span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {files.length > 0 ? `ແນບ ${files.length} ຮູບ` : 'ຍັງບໍ່ມີຮູບ'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Section 6: Remarks */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-900 text-xs">ໝາຍເຫດ</label>
                <Textarea
                  placeholder="ເພີ່ມໝາຍເຫດ..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="resize-none h-16 border-gray-200 rounded-xl text-gray-700 text-sm focus-visible:ring-blue-500 p-3"
                />
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={isSavingQty || isUploading}
                className="w-full h-10 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm shadow-sm mt-1 flex items-center justify-center gap-2"
              >
                {(isSavingQty || isUploading) && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSavingQty ? "ກຳລັງບັນທຶກ..." : isUploading ? "ກຳລັງອັບໂຫຼດ..." : "ບັນທຶກ"}
              </Button>

            </div>

          </div>
        </DialogContent>
      </Dialog>
      <UploadDamageImageModal
        isOpen={isUploadDamageModalOpen}
        onClose={() => setIsUploadDamageModalOpen(false)}
        files={files}
        setFiles={setFiles}
      />
    </>
  );
}
