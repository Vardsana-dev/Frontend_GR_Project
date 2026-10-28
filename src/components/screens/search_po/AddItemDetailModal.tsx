import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Camera, Minus, Plus, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useSetGrQuantity } from '@/hooks/gr-hook/useSetGrQuantity';
import { useUploadDamageEvidencePhoto } from '@/hooks/gr-damage-photo-hook/useUploadDamageEvidencePhoto';
import { useGetEachProductDetail } from '@/hooks/product-hook';
import { UploadDamageImageModal } from './UploadDamageImageModal';
import { normalizeProductImageUrl } from '@/lib/imageUtils';

interface AddItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sku?: string;
  grid?: string;
  item?: any;
  onSaved?: () => void;
}

export function AddItemDetailModal({ isOpen, onClose, sku = "SKU-PVC-400-S8", grid, item, onSaved }: AddItemDetailModalProps) {
  // Quantities calculation
  const orderedQty = Number(item?.quantities?.ordered ?? item?.qty ?? item?.orderedQuantity ?? 0);
  const prevReceivedQty = Number(item?.quantities?.received ?? item?.quantities?.grReceivedQty ?? item?.grReceivedQty ?? 0);

  const getRemainingQty = (targetItem: any) => {
    const rem =
      targetItem?.quantities?.remaining ??
      targetItem?.remainingQuantity ??
      targetItem?.remainingQty;

    if (rem !== undefined && rem !== null) {
      return Number(rem);
    }
    const ord = Number(targetItem?.quantities?.ordered ?? targetItem?.qty ?? targetItem?.orderedQuantity ?? 0);
    const rec = Number(targetItem?.quantities?.received ?? targetItem?.quantities?.grReceivedQty ?? targetItem?.grReceivedQty ?? 0);
    return Math.max(0, ord - rec);
  };

  const poRemainingQty = getRemainingQty(item);

  // Maximum quantity that can be set for this item in this GR (since API is PUT):
  // Up to (already received in this GR + remaining in PO), capped by ordered quantity
  const maxAllowedQty = poRemainingQty !== undefined && poRemainingQty !== null
    ? Math.min(orderedQty || Infinity, prevReceivedQty + poRemainingQty)
    : (orderedQty || Infinity);

  const getInitialReceiveQty = (targetItem: any) => {
    const rec = Number(
      targetItem?.quantities?.received ??
      targetItem?.quantities?.grReceivedQty ??
      targetItem?.grReceivedQty ??
      0
    );
    // If the product has already been submitted / received in this GR, show what was received so user can edit it
    if (rec > 0) {
      return rec;
    }
    const rem = getRemainingQty(targetItem);
    return rem > 0 ? rem : Number(targetItem?.quantities?.ordered ?? targetItem?.qty ?? targetItem?.orderedQuantity ?? 0);
  };

  const [receiveQty, setReceiveQty] = useState(getInitialReceiveQty(item));
  const [status, setStatus] = useState<'defective' | 'incomplete' | null>('incomplete');
  const [defectiveQty, setDefectiveQty] = useState('0');
  const [remark, setRemark] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isUploadDamageModalOpen, setIsUploadDamageModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const { updateQuantity, loading: isSavingQty, error: qtyError } = useSetGrQuantity();
  const { uploadPhoto, loading: isUploading } = useUploadDamageEvidencePhoto();
  const { data: productDetail, loading: isProductLoading, fetchProductDetail } = useGetEachProductDetail();

  const productCode = item?.product?.code || item?.itemcode || item?.code || (sku && sku !== "SKU-PVC-400-S8" ? sku : "") || "";

  React.useEffect(() => {
    if (isOpen && productCode) {
      fetchProductDetail(productCode);
    }
  }, [isOpen, productCode, fetchProductDetail]);

  const productUnit =
    item?.quantities?.unitCode ||
    item?.unitcode ||
    item?.unit ||
    productDetail?.stockunit ||
    productDetail?.units?.[0]?.unitcode ||
    "ແຜ່ນ";

  const barcodes = React.useMemo(() => {
    const list: string[] = [];

    // 1. From item.units or item.product.units
    const itemUnits = item?.units || item?.product?.units;
    if (Array.isArray(itemUnits)) {
      itemUnits.forEach((u: any) => {
        if (u?.barcode && typeof u.barcode === 'string' && u.barcode.trim()) {
          list.push(u.barcode.trim());
        }
      });
    }

    // 2. From item.barcodes or item.product.barcodes
    const itemBarcodes = item?.barcodes || item?.product?.barcodes;
    if (Array.isArray(itemBarcodes)) {
      itemBarcodes.forEach((b: any) => {
        const val = typeof b === 'string' ? b : b?.barcode;
        if (val && typeof val === 'string' && val.trim()) {
          list.push(val.trim());
        }
      });
    }

    // 3. Single barcode fields on item / product
    [item?.barcode, item?.product?.barcode, item?.product?.primaryBarcode].forEach((b) => {
      if (b && typeof b === 'string' && b.trim() && b !== '-') {
        list.push(b.trim());
      }
    });

    // 4. From productDetail fetched via API
    if (Array.isArray(productDetail?.units)) {
      productDetail.units.forEach((u: any) => {
        if (u?.barcode && typeof u.barcode === 'string' && u.barcode.trim()) {
          list.push(u.barcode.trim());
        }
      });
    }

    return Array.from(new Set(list));
  }, [item, productDetail]);

  // Reset state when item changes
  React.useEffect(() => {
    if (item) {
      setReceiveQty(getInitialReceiveQty(item));
      setDefectiveQty('0');
      setRemark(item?.condition?.damageNote || '');
      setFiles([]);
    }
  }, [item]);

  const finalReceiveQty = Number(receiveQty) || 0;

  const handleSave = async () => {
    if (!grid || !item?.podid) return;

    const finalQty = Number(receiveQty);
    if (finalQty <= 0) {
      setAlertMessage("ຈຳນວນທີ່ຮັບຕ້ອງຫຼາຍກວ່າ 0");
      return;
    }
    if (finalQty > maxAllowedQty) {
      setAlertMessage(`ຈຳນວນຮັບ (${finalQty}) ເກີນຈຳນວນທີ່ຍັງເຫຼືອໃນ PO (${maxAllowedQty})`);
      return;
    }

    const damagedQtyNum = Number(defectiveQty) || 0;
    if (damagedQtyNum > 0 && !remark.trim()) {
      setAlertMessage("ກະລຸນາປ້ອນໝາຍເຫດ (Damage note is required when damaged quantity is greater than zero)");
      return;
    }

    // 1. Save Quantity
    const qtyRes = await updateQuantity(grid, item.podid, {
      quantity: finalQty,
      damagedQuantity: damagedQtyNum,
      damageNote: remark
    });

    if (!qtyRes.success) {
      setAlertMessage(qtyRes.error?.message || qtyError || "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຈຳນວນ");
      return;
    }

    // 2. Upload photos if any and status is defective
    if (status === 'defective' && files.length > 0) {
      const uploadRes = await uploadPhoto(grid, item.grdid, files);
      if (!uploadRes.success) {
        setAlertMessage(uploadRes.error?.message || "ເກີດຂໍ້ຜິດພາດໃນການອັບໂຫຼດຮູບພາບ");
        return;
      }
    }

    if (onSaved) onSaved();
    onClose();
  };

  // Handle Product Images
  const rawProductImages: any[] =
    item?.images ||
    item?.product?.images ||
    (item?.imageUrl ? [item.imageUrl] : null) ||
    (item?.product?.imageUrl ? [item.product.imageUrl] : null) ||
    (productDetail?.images && productDetail.images.length > 0 ? productDetail.images : null) ||
    (productDetail?.imageUrl ? [productDetail.imageUrl] : null) ||
    [];
  const productImages = rawProductImages
    .map((img: any) => {
      const src = typeof img === 'string' ? img : img?.url || img?.imageUrl || '';
      return normalizeProductImageUrl(src);
    })
    .filter(Boolean);

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
            <span className="text-sm font-medium text-gray-700">{productCode || sku}</span>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] p-4 sm:p-5 gap-4 max-h-[90vh] overflow-y-auto overflow-x-hidden">

            {/* Left Column: Product Info & Images */}
            <div className="flex flex-col gap-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-sm rounded-md">{productCode || "-"}</span>
                <span className="text-gray-400 text-sm">ຫົວໜ່ວຍ ({productUnit})</span>
              </div>

              {/* Main Image */}
              <div className="relative w-full h-[250px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-50 flex items-center justify-center">
                <Image src={displayImages[activeImageIndex]} alt="Main Product" layout="fill" objectFit="contain" unoptimized />
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
                {item?.product?.name || item?.itemname || item?.desc || productDetail?.nameth || productDetail?.nameen || "ທໍ່ພີວີຊີແຂງສຳລັບໃຊ້ເປັນທໍ່ນ້ຳດື່ມ ຊະນິດບານຫົວ 4 ນິ້ວ ຊັ້ນ 8.5 (4.0 ແມັດ)"}
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
                        <Image src={img} alt={`Thumb ${idx}`} layout="fill" objectFit="cover" unoptimized />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4">
                <div className="bg-[#d2e0fb]/50 rounded-xl p-2 sm:p-4 flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
                  <span className="text-xs sm:text-sm font-bold text-[#3b82f6]">ສັ່ງຊື້</span>
                  <span className="text-xl sm:text-2xl font-black text-[#1e3a8a]">{orderedQty}</span>
                </div>
                <div className="bg-[#d2e0fb]/50 rounded-xl p-2 sm:p-4 flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
                  <span className="text-xs sm:text-sm font-bold text-[#3b82f6]">ໄດ້ຮັບ</span>
                  <span className="text-xl sm:text-2xl font-black text-[#1e3a8a]">{receiveQty}</span>
                </div>
                <div className="bg-[#d2e0fb]/50 rounded-xl p-2 sm:p-4 flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
                  <span className="text-xs sm:text-sm font-bold text-[#3b82f6]">ຍັງເຫຼືອ</span>
                  <span className="text-xl sm:text-2xl font-black text-[#1e3a8a]">{Math.max(0, maxAllowedQty - receiveQty)}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Data Entry */}
            <div className="flex flex-col gap-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">

              {/* Section 1: Barcodes */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-[#1e3a8a] text-lg">ລະຫັດສິນຄ້າ : {productCode || "-"}</h3>
                <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto">
                  {isProductLoading && barcodes.length === 0 ? (
                    <Input
                      value="ກຳລັງໂຫຼດບາໂຄດ..."
                      readOnly
                      className="bg-gray-50 border-transparent text-gray-400 font-medium h-8 text-sm animate-pulse"
                    />
                  ) : barcodes.length > 0 ? (
                    barcodes.map((barcode, idx) => (
                      <Input
                        key={`${barcode}-${idx}`}
                        value={`Barcode ${barcode}`}
                        readOnly
                        className="bg-gray-50 border-transparent text-gray-600 font-medium h-8 text-sm"
                      />
                    ))
                  ) : (
                    <Input
                      value="ບໍ່ມີບາໂຄດ"
                      readOnly
                      className="bg-gray-50 border-transparent text-gray-400 font-medium h-8 text-sm"
                    />
                  )}
                </div>
                <span className="text-gray-400 text-sm font-medium mt-1">ຫົວໜ່ວຍ ({productUnit})</span>
              </div>

              {/* Section 2: Receive Quantity */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-[#1e3a8a] text-sm">ປະລິມານທີ່ໄດ້ຮັບ</h3>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setReceiveQty(Math.max(0, receiveQty - 1))}
                    className="w-10 h-10 rounded-xl border border-gray-100 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 shadow-sm cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={receiveQty}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setReceiveQty(Math.max(0, Math.min(val, maxAllowedQty)));
                    }}
                    max={maxAllowedQty}
                    className="flex-1 text-center font-bold text-2xl text-[#1e3a8a] bg-transparent border-none focus:outline-none w-full"
                    min="0"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setReceiveQty(Math.min(maxAllowedQty, receiveQty + 1));
                    }}
                    className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2563eb] hover:bg-blue-100 shadow-sm cursor-pointer"
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

      {/* Validation / Alert Popup */}
      <Dialog open={!!alertMessage} onOpenChange={(open) => !open && setAlertMessage(null)}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="z-[150] bg-black/60 backdrop-blur-xs"
          className="z-[151] max-w-sm sm:max-w-md p-0 overflow-hidden rounded-3xl border-0 shadow-2xl bg-white gap-0 outline-none"
        >
          <div className="bg-amber-50/80 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3 shadow-xs">
              <AlertCircle className="w-7 h-7" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900 mb-2">ແຈ້ງເຕືອນ</DialogTitle>
            <DialogDescription className="text-sm font-medium text-gray-600 leading-relaxed max-w-xs text-center">
              {alertMessage}
            </DialogDescription>
          </div>

          <div className="p-4 bg-gray-50 flex items-center justify-center border-t border-gray-100">
            <Button
              type="button"
              onClick={() => setAlertMessage(null)}
              className="w-full max-w-[200px] h-11 bg-[#1A368F] hover:bg-[#152a70] text-white font-bold rounded-xl shadow-sm text-sm cursor-pointer transition-all"
            >
              ຕົກລົງ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
