import React, { useEffect, useState } from 'react';
import { useGetEachProductDetail, ProductUnit } from '@/hooks/product-hook/useGetEachProductDetail';
import { useGetDamageEvidencePhoto } from '@/hooks/gr-damage-photo-hook/useGetDamageEvidencePhoto';
import { getSelectedApiUrl } from '@/lib/auth';
import Image from 'next/image';
import { Package, Download, ArrowLeft, Edit3, Loader2 } from 'lucide-react';
import { EditProductBarcodeModal } from '@/components/dialogs/EditProductBarcodeModal';
import { normalizeProductImageUrl } from '@/lib/imageUtils';

interface ProductDetailViewProps {
  productCode: string;
  onBack: () => void;
}

const resolveImageUrl = (url: string) => {
  return normalizeProductImageUrl(url);
};

export function ProductDetailView({ productCode, onBack }: ProductDetailViewProps) {
  const { data, loading, error, fetchProductDetail } = useGetEachProductDetail();
  const { downloadPhoto, loading: isDownloading } = useGetDamageEvidencePhoto();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isEditBarcodeOpen, setIsEditBarcodeOpen] = useState(false);
  const [selectedUnitToEdit, setSelectedUnitToEdit] = useState<ProductUnit | null>(null);

  useEffect(() => {
    if (productCode) {
      fetchProductDetail(productCode);
      setSelectedImageIdx(0);
    }
  }, [productCode, fetchProductDetail]);

  const allImages = React.useMemo(() => {
    if (!data) return [];
    const imgs: string[] = [];
    const addImg = (raw: any) => {
      if (!raw || typeof raw !== 'string') return;
      const trimmed = raw.trim();
      if (!trimmed) return;
      imgs.push(resolveImageUrl(trimmed));
    };

    addImg(data.imageUrl);
    addImg((data as any).image);
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      data.images.forEach((img: any) => {
        if (typeof img === 'string') addImg(img);
        else if (img?.url && typeof img.url === 'string') addImg(img.url);
        else if (img?.imageUrl && typeof img.imageUrl === 'string') addImg(img.imageUrl);
      });
    }
    if (Array.isArray((data as any).attachments)) {
      (data as any).attachments.forEach((att: any) => {
        if (att?.url && typeof att.url === 'string') addImg(att.url);
        else if (att?.attachmentId) imgs.push(String(att.attachmentId));
      });
    }
    return Array.from(new Set(imgs));
  }, [data]);

  const displayImages = allImages.length > 0 ? allImages : [];
  const currentImage = displayImages[selectedImageIdx];

  const handleDownload = async () => {
    if (!currentImage) {
      alert("ບໍ່ມີຮູບພາບສິນຄ້າເພື່ອດາວໂຫຼດ");
      return;
    }
    const fileName = `${data?.code || 'product'}_image_${selectedImageIdx + 1}`;
    await downloadPhoto(currentImage, fileName);
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-120px)] animate-in fade-in duration-300">

      {/* HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-blue-200/60 mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-[#2b4c9b] rounded-full flex items-center justify-center hover:bg-[#1e3a8a] transition-colors shrink-0 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
          <h1 className="text-2xl font-bold text-[#2b4c9b] tracking-wide">ຮູບພາບສິນຄ້າ</h1>
        </div>
      </div>

      {/* LOADING / ERROR STATES */}
      {loading && <div className="flex-1 flex items-center justify-center text-[#2b4c9b] font-medium text-lg">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>}
      {error && <div className="flex-1 flex items-center justify-center text-red-500 font-medium text-lg">{error}</div>}

      {/* MAIN CONTENT - TWO COLUMN LAYOUT */}
      {!loading && !error && data && (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1">

          {/* LEFT COLUMN: PRODUCT IMAGE GALLERY (~65%) */}
          <div className="w-full lg:w-[65%] bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col p-4">

            {/* Large Image Area */}
            <div className="flex-1 bg-[#f8f9fc] rounded-2xl relative overflow-hidden flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={data.nameen || data.nameth || 'Product'}
                  layout="fill"
                  objectFit="contain"
                  className="p-4"
                  unoptimized
                />
              ) : (
                <Package className="w-32 h-32 text-gray-300" strokeWidth={1} />
              )}
            </div>

            {/* Image Counter & Pagination */}
            <div className="flex justify-between items-center px-4 pt-4 pb-2 shrink-0">
              <span className="text-[15px] font-semibold text-gray-600">
                ຮູບທີ {displayImages.length > 0 ? selectedImageIdx + 1 : 0} ຈາກ {displayImages.length}
              </span>
              <div className="flex gap-2 items-center">
                {displayImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2.5 rounded-full transition-all duration-300 ${idx === selectedImageIdx ? 'w-2.5 bg-[#2b4c9b]' : 'w-2.5 bg-gray-300'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PRODUCT INFORMATION CARD (~35%) */}
          <div className="w-full lg:w-[35%] bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8 flex flex-col">

            {/* Product Code & Edit Button */}
            <div className="flex items-center justify-between mb-5 gap-3">
              <h3 className="text-xl font-bold text-[#1e3a8a] tracking-wide">
                ລະຫັດສິນຄ້າ : {data.code}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedUnitToEdit(data.units && data.units.length > 0 ? data.units[0] : null);
                  setIsEditBarcodeOpen(true);
                }}
                className="h-9 px-3.5 bg-blue-50 hover:bg-blue-100 text-[#1e3a8a] border border-blue-200 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#1e3a8a]" />
                <span>ແກ້ໄຂບາໂຄດ</span>
              </button>
            </div>

            {/* Barcode List */}
            <div className="flex flex-col gap-2 mb-6">
              {data.units?.length > 0 ? (
                data.units.map((unit, idx) => (
                  <div
                    key={idx}
                    className="bg-[#f3f4f6] text-gray-700 px-4 py-2.5 rounded-lg text-[15px] font-medium border border-transparent flex items-center justify-between group hover:border-blue-200 hover:bg-blue-50/40 transition-colors"
                  >
                    <span>Barcode {unit.barcode}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUnitToEdit(unit);
                        setIsEditBarcodeOpen(true);
                      }}
                      title="ແກ້ໄຂບາໂຄດນີ້"
                      className="text-gray-400 hover:text-blue-600 p-1 rounded-md transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-[#f3f4f6] text-gray-500 px-4 py-2.5 rounded-lg text-[15px]">
                  ບໍ່ມີບາໂຄດ
                </div>
              )}
            </div>

            {/* Unit */}
            <div className="text-[15px] text-gray-500 mb-5 font-medium">
              ຫົວໜ່ວຍ ({data.stockunit || '-'})
            </div>

            {/* Divider */}
            <hr className="border-t border-gray-100 mb-5" />

            {/* Product Name */}
            <h4 className="text-[17px] font-bold text-[#1e3a8a] mb-8 leading-snug">
              {data.nameth}
              {data.nameen && (
                <>
                  <br />
                  {data.nameen}
                </>
              )}
            </h4>

            {/* Thumbnails Label */}
            <div className="text-[13px] font-semibold text-gray-400 mb-3">ຮູບພາບທັງໝົດ</div>

            {/* Thumbnail Gallery */}
            <div className="flex flex-wrap gap-3 mb-8">
              {displayImages.length > 0 ? (
                displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-14 h-14 rounded-xl border-[2.5px] flex items-center justify-center p-1 overflow-hidden transition-colors ${idx === selectedImageIdx ? 'border-[#2b4c9b]' : 'border-gray-100 hover:border-gray-300'
                      }`}
                  >
                    <div className="relative w-full h-full">
                      <Image src={img} alt={`thumb-${idx}`} layout="fill" objectFit="contain" unoptimized />
                    </div>
                  </button>
                ))
              ) : (
                <div className="w-14 h-14 rounded-xl border-2 border-gray-100 flex items-center justify-center bg-gray-50">
                  <Package className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
                </div>
              )}
            </div>

            {/* Download Button (Fixed at Bottom of Right Card) */}
            <div className="mt-auto pt-4 shrink-0">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading || !currentImage}
                className="w-full bg-[#2b4c9b] hover:bg-[#1e3a8a] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-[16px] transition-colors shadow-md shadow-blue-900/10 cursor-pointer"
              >
                {isDownloading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" strokeWidth={2.5} />
                )}
                <span>{isDownloading ? "ກຳລັງດາວໂຫຼດ..." : "ດາວໂຫຼດ"}</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Edit Product Barcode Modal */}
      <EditProductBarcodeModal
        isOpen={isEditBarcodeOpen}
        onClose={() => setIsEditBarcodeOpen(false)}
        product={data}
        selectedUnit={selectedUnitToEdit}
        onSuccess={() => {
          if (productCode) {
            fetchProductDetail(productCode);
          }
        }}
      />
    </div>
  );
}
