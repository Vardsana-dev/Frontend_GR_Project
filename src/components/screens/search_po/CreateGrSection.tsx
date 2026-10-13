'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, CloudUpload } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { UploadImageModal } from './UploadImageModal';
import { AddItemDetailModal } from './AddItemDetailModal';
import { ConfirmSaveGrModal } from './ConfirmSaveGrModal';
import { useSearchParams } from 'next/navigation';
import { useGetGrDetail } from '@/hooks/gr-hook/useGetGrDetail';
import { useGetPrintGrDocumentPdf } from '@/hooks/gr-hook/useGetPrintGrDocumentPdf';
import { useGetListDamageEvidencePhoto } from '@/hooks/gr-damage-photo-hook/useGetListDamageEvidencePhoto';
import { useDeleteDamageEvidencePhoto } from '@/hooks/gr-damage-photo-hook/useDeleteDamageEvidencePhoto';

const itemsData = [
  { no: '01', code: 'PVE-000-88', desc: 'ທໍ່ພີວີຊີແຂງສຳລັບໃຊ້ເປັນທໍ່ນ້ຳດື່ມ ຊະນິດບານຫົວ 4 ນິ້ວ ຊັ້ນ 8.5 (4.0 ແມັດ)', qty: '9,500.000', unit: 'ແຜ່ນ', price: '47.80', discount: '0', actualReceive: '0', amount: '458,880.00' },
  { no: '02', code: 'PVE-000-88', desc: 'ທໍ່ພີວີຊີແຂງສຳລັບໃຊ້ເປັນທໍ່ນ້ຳດື່ມ ຊະນິດບານຫົວ 4 ນິ້ວ ຊັ້ນ 8.5 (4.0 ແມັດ)', qty: '9,500.000', unit: 'ແຜ່ນ', price: '47.80', discount: '0', actualReceive: '0', amount: '458,880.00' },
];

export function CreateGrSection({ poNumber }: { poNumber: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const grid = searchParams.get('grid') || '';

  const { data: grData, fetchGrDetail, loading: isFetching } = useGetGrDetail();
  const { fetchPdf, loading: isPrinting } = useGetPrintGrDocumentPdf();
  const { fetchList: fetchPhotos, data: photosData, loading: photosLoading } = useGetListDamageEvidencePhoto();
  const { deletePhoto } = useDeleteDamageEvidencePhoto();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isConfirmSaveModalOpen, setIsConfirmSaveModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const itemsList = grData?.items || [];
  const firstItemGrdid = itemsList[0]?.grdid?.toString() || itemsList[0]?.id?.toString() || "";

  useEffect(() => {
    if (grid) {
      fetchGrDetail(grid);
    }
  }, [grid, fetchGrDetail]);

  useEffect(() => {
    if (grid && firstItemGrdid) {
      fetchPhotos(grid, firstItemGrdid, "IMAGE");
    }
  }, [grid, firstItemGrdid, fetchPhotos]);

  const handleUploadSuccess = () => {
    fetchGrDetail(grid);
    if (grid && firstItemGrdid) {
      fetchPhotos(grid, firstItemGrdid, "IMAGE");
    }
  };

  const handleDeletePhoto = async (attachmentId: string) => {
    if (grid && firstItemGrdid && attachmentId) {
      const res = await deletePhoto(attachmentId);
      if (res.success) {
        fetchPhotos(grid, firstItemGrdid, "IMAGE");
      } else {
        alert("ບໍ່ສາມາດລຶບຮູບພາບໄດ້");
      }
    }
  };

  const documentInfo = grData?.header?.document || grData?.document || grData?.header || grData || {};
  const supplierInfo = grData?.header?.supplier || grData?.supplier || {};
  const poInfo = grData?.header?.purchaseOrder || grData?.purchaseOrder || {};

  const computedSubtotal = itemsList.reduce((sum: number, item: any) => sum + Number(item.pricing?.totalAmount ?? item.amount ?? 0), 0);
  const displaySubtotal = Number(grData?.amounts?.subtotal || computedSubtotal);

  const computedDiscount = itemsList.reduce((sum: number, item: any) => sum + Number(item.pricing?.discount ?? item.discountamount ?? 0), 0);
  const displayDiscount = Number(grData?.amounts?.discount || computedDiscount);

  const displayTax = Number(grData?.amounts?.tax || 0);
  const displayTotalAmount = Number(grData?.amounts?.total || (displaySubtotal - displayDiscount + displayTax));

  const grNumber = documentInfo.docno || documentInfo.grcode || "ກຳລັງໂຫຼດ...";

  const handlePrint = async () => {
    if (grid) {
      const res = await fetchPdf(grid);
      if (res.success && res.url) {
        window.open(res.url, '_blank');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full relative">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100">
        <Link href={`/search_po/${poNumber}`} className="flex items-center gap-2 text-[#244195] hover:text-[#1e3a8a] font-bold text-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
          ກັບ
        </Link>
        <div className="flex flex-1 justify-center">
          <h1 className="text-2xl font-bold text-[#244195]">{grNumber}</h1>
        </div>
        <div className="flex items-center gap-3">

          <Button
            onClick={() => setIsConfirmSaveModalOpen(true)}
            disabled={!grid}
            className="bg-[#3b82f6] hover:bg-blue-600 text-white px-8 rounded-xl shadow-sm font-bold text-[15px]"
          >
            ບັນທຶກ
          </Button>
        </div>
      </div>

      {/* Supplier Info Card */}
      <Card className="shadow-sm border-gray-200/60 rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            ຂໍ້ມູນຜູ້ສະໜອງ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-10">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">ລະຫັດເຈົ້າໜີ້</p>
                <p className="font-bold text-gray-800 text-[15px]">{supplierInfo.apcode || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">ຊື່ເຈົ້າໜີ້</p>
                <p className="font-bold text-gray-800 text-[15px]">{supplierInfo.apname || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">ທີ່ຢູ່</p>
                <p className="font-bold text-gray-800 text-[15px] leading-relaxed">{supplierInfo.addressTh || supplierInfo.address || "-"}</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">ເລກທີ PO</p>
                <p className="font-bold text-gray-800 text-[15px]">{poInfo.docno || documentInfo.pocode || poNumber || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">ເຄຣດິດ</p>
                <p className="font-bold text-gray-800 text-[15px]">{grData?.header?.creditTerm?.shortName || grData?.header?.creditTerm?.nameTh || documentInfo.creditcode || "-"}</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">ເບີໂທ</p>
                <p className="font-bold text-gray-800 text-[15px]">{supplierInfo.telephone || supplierInfo.tel || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">ວັນທີ</p>
                <p className="font-bold text-gray-800 text-[15px]">{documentInfo.documentDate || documentInfo.createdate || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">ກຳນົດສົ່ງມອບ</p>
                <p className="font-bold text-gray-800 text-[15px]">{poInfo.shipDate || "-"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">ລາຍການ ({itemsList.length})</h2>
          <div className="text-gray-300 hover:text-gray-500 cursor-pointer text-sm flex items-center gap-1 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> ເພີ່ມລາຍການ
          </div>
        </div>

        <Card className="shadow-sm border-gray-200/60 rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#244195] hover:bg-[#244195]">
                  <TableHead className="text-white bg-transparent h-14 text-center w-[60px] font-semibold border-r border-white/20">ລຳດັບ</TableHead>
                  <TableHead className="text-white bg-transparent text-center w-[120px] font-semibold border-r border-white/20">ຮູບສິນຄ້າ</TableHead>
                  <TableHead className="text-white bg-transparent text-center w-[150px] font-semibold border-r border-white/20">ລະຫັດສິນຄ້າ</TableHead>
                  <TableHead className="text-white bg-transparent w-[300px] font-semibold border-r border-white/20">ລາຍລະອຽດ</TableHead>
                  <TableHead className="text-white bg-transparent text-center font-semibold border-r border-white/20">ຈຳນວນ</TableHead>
                  <TableHead className="text-white bg-transparent text-center font-semibold border-r border-white/20">ຫົວໜ່ວຍ</TableHead>
                  <TableHead className="text-white bg-transparent text-center font-semibold border-r border-white/20">ລາຄາຊື້ / ໜ່ວຍ</TableHead>
                  <TableHead className="text-white bg-transparent text-center font-semibold border-r border-white/20">ສ່ວນຫຼຸດ</TableHead>
                  <TableHead className="text-white bg-transparent text-center font-semibold border-r border-white/20">ຮັບຈິງ</TableHead>
                  <TableHead className="text-white bg-transparent text-center font-semibold border-r border-white/20">ຈຳນວນເງິນ</TableHead>
                  <TableHead className="text-white bg-transparent text-center font-semibold">ຈັດການ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemsList.map((row: any, idx: number) => (
                  <TableRow key={row.podid || idx} className="bg-white border-b-gray-100 last:border-b-0">
                    <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{idx + 1}</TableCell>
                    <TableCell className="text-center border-r border-gray-100">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-white rounded-lg border border-gray-100 flex items-center justify-center p-1 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                          <Image src="https://placehold.co/100x100?text=Product" unoptimized alt="product" width={64} height={64} className="object-contain" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-gray-100 text-center">
                      <span className="font-bold text-gray-900">{row.itemcode || row.code}</span>
                    </TableCell>
                    <TableCell className="border-r border-gray-100">
                      <span className="text-gray-500 text-sm leading-snug">{row.itemname || row.desc}</span>
                    </TableCell>
                    <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{row.quantities?.ordered ?? row.qty ?? 0}</TableCell>
                    <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{row.quantities?.unitCode ?? row.unitcode ?? row.unit ?? '-'}</TableCell>
                    <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{row.pricing?.unitPrice ?? row.price ?? 0}</TableCell>
                    <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{row.pricing?.discount ?? row.discountamount ?? 0}</TableCell>
                    <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{row.quantities?.received ?? row.receivedQty ?? 0}</TableCell>
                    <TableCell className="text-center font-bold text-[#3b82f6] border-r border-gray-100">{row.pricing?.totalAmount ?? row.amount ?? 0}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(row);
                          setIsAddItemModalOpen(true);
                        }}
                        className="h-8 border-[#3b82f6] text-[#3b82f6] hover:bg-blue-50 font-semibold px-4 rounded-md"
                      >
                        ຮັບສິນຄ້າ
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <div className="flex flex-col gap-[2px] mt-4">
        {/* Dark Blue Summary */}
        <div className="bg-[#244195] rounded-t-xl text-white p-6 pb-2 shadow-sm">
          <h3 className="font-bold text-lg mb-6 tracking-wide">ສະຫຼຸບລາຍການ</h3>
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-blue-100/90 font-medium tracking-wide">ລວມເງິນ</span>
              <span className="font-bold tracking-wider">{displaySubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-blue-100/90 font-medium tracking-wide">ສ່ວນຫຼຸດ</span>
              <span className="font-bold tracking-wider">{displayDiscount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-blue-100/90 font-medium tracking-wide">ອາກອນເພີ່ມ</span>
              <span className="font-bold tracking-wider">{displayTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-blue-100/90 font-medium tracking-wide">ລາຄາສິນຄ້າ / ບໍລິການ</span>
              <span className="font-bold tracking-wider">{displayTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-blue-100/90 font-medium tracking-wide">ມູນຄ່າຍົກເວັ້ນ</span>
              <span className="font-bold tracking-wider">0.00 ฿</span>
            </div>
            <div className="flex justify-between items-center py-4 bg-[#1e3a8a]/40 -mx-6 px-6 -mb-2">
              <span className="text-white font-bold tracking-wide">ລວມເງິນທັງໝົດ</span>
              <span className="font-bold text-[15px] tracking-wider">{displayTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿</span>
            </div>
          </div>
        </div>

        {/* Light Blue Footer */}
        <div className="bg-[#d2e0fb] rounded-b-xl text-sm text-[#244195] p-5 font-semibold shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-[#3b82f6] font-medium">ໝາຍເລກທະບຽນລົດ</span>
              <span>{grData?.header?.receipt?.vehicleRegistration || documentInfo.vehicleRegistration || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#3b82f6] font-medium">ພະນັກງານຂັບ</span>
              <span>{grData?.header?.receipt?.driverName || documentInfo.driverName || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#3b82f6] font-medium">ໝາຍເຫດ</span>
              <span>{grData?.header?.remark || documentInfo.remark || "-"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Images Section */}
      <div className="mt-6 flex flex-col gap-4">
        <h3 className="font-bold text-gray-800 text-lg">ແນບຮູບສິນຄ້າ</h3>
        <div className="flex gap-4 items-center flex-wrap">
          {photosLoading && <p className="text-gray-400 text-sm">ກຳລັງໂຫຼດຮູບພາບ...</p>}
          
          {!photosLoading && photosData?.data?.attachments?.filter((a: any) => a.type === "IMAGE").map((attachment: any) => (
            <div key={attachment.attachmentId} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
              <Image 
                src={attachment.url || `https://placehold.co/200x200?text=IMG`} 
                unoptimized 
                alt={attachment.fileName || "Attached image"} 
                layout="fill" 
                objectFit="cover" 
              />
              <button 
                onClick={() => handleDeletePhoto(attachment.attachmentId)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm z-10 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
              >
                &times;
              </button>
            </div>
          ))}
          {/* Upload Button */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-[#3b82f6]/50 flex flex-col items-center justify-center gap-1 text-[#3b82f6] hover:bg-blue-50 transition-colors cursor-pointer bg-white"
          >
            <CloudUpload className="w-6 h-6" />
            <span className="text-xs font-semibold">ເພີ່ມຮູບ</span>
          </button>
        </div>
      </div>

      <UploadImageModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        grid={grid}
        grdid={firstItemGrdid}
        onSuccess={handleUploadSuccess}
        existingPhotos={photosData?.data?.attachments?.filter((a: any) => a.type === "IMAGE") || []}
        onDeleteExisting={handleDeletePhoto}
      />

      <AddItemDetailModal
        isOpen={isAddItemModalOpen}
        onClose={() => {
          setIsAddItemModalOpen(false);
          setSelectedItem(null);
        }}
        grid={grid}
        item={selectedItem}
        onSaved={() => fetchGrDetail(grid)}
      />

      <ConfirmSaveGrModal
        isOpen={isConfirmSaveModalOpen}
        onClose={() => setIsConfirmSaveModalOpen(false)}
        grid={grid}
        onConfirm={() => router.push('/search_po')}
        totalAmount={displayTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        currencyCode={grData?.header?.amounts?.currencyCode || grData?.amounts?.currencyCode || "THB"}
        initialExchangeRate={grData?.header?.amounts?.exchangeRate || grData?.amounts?.exchangeRate || 1}
      />
    </div>
  );
}
