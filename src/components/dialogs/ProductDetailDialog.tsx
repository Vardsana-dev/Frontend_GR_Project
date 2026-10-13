'use client';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { useGetEachProductDetail } from '@/hooks/product-hook/useGetEachProductDetail';
import Image from 'next/image';
import { Package, Download, ArrowLeft } from 'lucide-react';

interface ProductDetailDialogProps {
  productCode: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailDialog({ productCode, isOpen, onClose }: ProductDetailDialogProps) {
  const { data, loading, error, fetchProductDetail } = useGetEachProductDetail();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    if (isOpen && productCode) {
      fetchProductDetail(productCode);
      setSelectedImageIdx(0);
    }
  }, [isOpen, productCode, fetchProductDetail]);

  const allImages = React.useMemo(() => {
    if (!data) return [];
    const imgs = [];
    if (data.imageUrl) imgs.push(data.imageUrl);
    if (data.images && data.images.length > 0) {
      imgs.push(...data.images);
    }
    // ensure uniqueness
    return Array.from(new Set(imgs));
  }, [data]);

  const displayImages = allImages.length > 0 ? allImages : [];
  const currentImage = displayImages[selectedImageIdx];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* 
        Override DialogContent defaults to make it a FULL PAGE OVERLAY 
        matching Screenshot 2 exactly, without breaking routing.
        Hidden default close button via [&>button]:hidden
      */}
      <DialogContent className="max-w-none w-screen h-screen m-0 p-0 rounded-none bg-[#f4f7fc] border-none shadow-none flex flex-col overflow-hidden [&>button]:hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-blue-200/60 bg-transparent shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose} 
              className="w-10 h-10 bg-[#2b4c9b] rounded-full flex items-center justify-center hover:bg-[#1e3a8a] transition-colors shrink-0 shadow-md"
            >
              <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
            <h1 className="text-[26px] font-bold text-[#2b4c9b] tracking-wide">ຮູບພາບສິນຄ້າ</h1>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            ໂໝດສະແດງຕົວຢ່າງ
          </div>
        </div>

        {/* LOADING / ERROR STATES */}
        {loading && <div className="flex-1 flex items-center justify-center text-[#2b4c9b] font-medium text-lg">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>}
        {error && <div className="flex-1 flex items-center justify-center text-red-500 font-medium text-lg">{error}</div>}

        {/* MAIN CONTENT - TWO COLUMN LAYOUT */}
        {!loading && !error && data && (
          <div className="flex flex-col md:flex-row p-6 md:p-8 gap-6 md:gap-8 flex-1 overflow-hidden">
            
            {/* LEFT COLUMN: PRODUCT IMAGE GALLERY (~65%) */}
            <div className="flex-[6.5] bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col p-4 overflow-hidden h-full">
              
              {/* Large Image Area */}
              <div className="flex-1 bg-[#f8f9fc] rounded-2xl relative overflow-hidden flex items-center justify-center border border-gray-50">
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
              <div className="flex justify-between items-center px-2 pt-4 pb-1 shrink-0">
                <span className="text-sm font-semibold text-gray-600">
                  ຮູບທີ {displayImages.length > 0 ? selectedImageIdx + 1 : 0} ຈາກ {displayImages.length}
                </span>
                <div className="flex gap-1.5 items-center">
                  {displayImages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === selectedImageIdx ? 'w-2 bg-[#2b4c9b]' : 'w-2 bg-gray-300'
                      }`} 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PRODUCT INFORMATION CARD (~35%) */}
            <div className="flex-[3.5] bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-8 flex flex-col overflow-y-auto h-full">
              
              {/* Product Code */}
              <h3 className="text-xl font-bold text-[#1e3a8a] mb-5 tracking-wide">
                ລະຫັດສິນຄ້າ : {data.code}
              </h3>
              
              {/* Barcode List */}
              <div className="flex flex-col gap-1.5 mb-6">
                {data.units?.length > 0 ? (
                  data.units.map((unit, idx) => (
                    <div key={idx} className="bg-[#f3f4f6] text-gray-600 px-4 py-2.5 rounded-lg text-[15px]">
                      Barcode {unit.barcode}
                    </div>
                  ))
                ) : (
                  <div className="bg-[#f3f4f6] text-gray-500 px-4 py-2.5 rounded-lg text-[15px]">
                    ບໍ່ມີບາໂຄດ
                  </div>
                )}
              </div>
              
              {/* Unit */}
              <div className="text-[15px] text-gray-500 mb-5">
                ຫົວໜ່ວຍ ({data.stockunit || '-'})
              </div>
              
              {/* Divider */}
              <hr className="border-t-2 border-gray-50 mb-5" />
              
              {/* Product Name */}
              <h4 className="text-lg font-bold text-[#1e3a8a] mb-8 leading-snug">
                {data.nameth}
                {data.nameen && (
                  <>
                    <br />
                    {data.nameen}
                  </>
                )}
              </h4>
              
              {/* Thumbnails Label */}
              <div className="text-[13px] text-gray-400 mb-3">ຮູບພາບທັງໝົດ</div>
              
              {/* Thumbnail Gallery */}
              <div className="flex flex-wrap gap-3 mb-8">
                {displayImages.length > 0 ? (
                  displayImages.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center p-1 overflow-hidden transition-colors ${
                        idx === selectedImageIdx ? 'border-[#2b4c9b]' : 'border-gray-100 hover:border-gray-300'
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
                <button className="w-full bg-[#2b4c9b] hover:bg-[#1e3a8a] text-white py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-[15px] transition-colors shadow-sm">
                  <Download className="w-[18px] h-[18px]" strokeWidth={2} /> ດາວໂຫຼດ
                </button>
              </div>

            </div>

          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
