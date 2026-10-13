'use client';
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Check, Printer, Download, Barcode, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PrintBarcodeModal } from './PrintBarcodeModal';
import { useGetGrDetail } from '@/hooks/gr-hook/useGetGrDetail';
import { useGetListDamageEvidencePhoto } from '@/hooks/gr-damage-photo-hook/useGetListDamageEvidencePhoto';
import { useGetDamageEvidencePhoto } from '@/hooks/gr-damage-photo-hook/useGetDamageEvidencePhoto';
import { useGetPrintGrDocumentPdf } from '@/hooks/gr-hook/useGetPrintGrDocumentPdf';

const DamagePhotoThumbnail = ({ attachmentId }: { attachmentId: string }) => {
  const { fetchPhoto } = useGetDamageEvidencePhoto();
  const [url, setUrl] = React.useState<string>('');

  React.useEffect(() => {
    fetchPhoto(attachmentId).then(res => {
      if (res.success && res.url) setUrl(res.url);
    });
  }, [attachmentId, fetchPhoto]);

  return (
    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl overflow-hidden relative shadow-sm border border-gray-100 flex items-center justify-center">
      {url ? (
        <img src={url} alt="Damage" className="object-cover w-full h-full" />
      ) : (
        <span className="text-gray-400 text-xs font-bold">ກຳລັງໂຫຼດ...</span>
      )}
    </div>
  );
};

const ItemDamagePhotos = ({ grid, grdid }: { grid: string, grdid: string }) => {
  const { data, fetchList } = useGetListDamageEvidencePhoto();
  
  React.useEffect(() => {
    if (grid && grdid) fetchList(grid, grdid, "IMAGE");
  }, [grid, grdid, fetchList]);

  if (!data || data.length === 0) return null;

  let photoList = [];
  if (Array.isArray(data)) {
    photoList = data;
  } else if (data?.data?.attachments) {
    photoList = data.data.attachments;
  } else if (data?.files) {
    photoList = data.files;
  } else if (Array.isArray(data?.data)) {
    photoList = data.data;
  }

  photoList = photoList.filter((a: any) => a.type === "IMAGE" || !a.type);

  if (!photoList || photoList.length === 0) return null;

  return (
    <>
      {photoList.map((photo: any) => (
        <DamagePhotoThumbnail key={photo.attachmentId || photo.id || photo.uid} attachmentId={photo.attachmentId || photo.id || photo.uid} />
      ))}
    </>
  );
};

interface GoodsReceiptDetailSectionProps {
  grId: string;
}


export function GoodsReceiptDetailSection({ grId }: GoodsReceiptDetailSectionProps) {
  const router = useRouter();
  const { data: apiData, loading, fetchGrDetail } = useGetGrDetail();
  const [isPrintModalOpen, setIsPrintModalOpen] = React.useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  
  const { loading: printing, fetchPdf } = useGetPrintGrDocumentPdf();

  const handlePrint = async () => {
    if (!grId) return;
    const res = await fetchPdf(grId);
    if (res?.success && res?.url) {
      window.open(res.url, '_blank');
    } else {
      setErrorMessage("ບໍ່ສາມາດດຶງໄຟລ໌ PDF ໄດ້");
      setIsErrorModalOpen(true);
    }
  };

  useEffect(() => {
    if (grId) {
      fetchGrDetail(grId);
    }
  }, [grId, fetchGrDetail]);

  const renderStatus = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
      case 'CONFIRMED':
      case 'COMPLETE':
        return <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full"><Check className="w-3 h-3" /> ຮັບແລ້ວ</span>;
      case 'IN_REVIEW':
      case 'WAITING':
        return <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full"><Check className="w-3 h-3" /> ລໍຖ້າຢືນຢັນ</span>;
      case 'CANCELLED':
      case 'UNCONFIRMED':
        return <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full"><Check className="w-3 h-3" /> ບໍ່ຢືນຢັນ</span>;
      case 'DRAFT':
        return <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full"><Check className="w-3 h-3" /> ຮ່າງ</span>;
      case 'PARTIAL':
        return <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full"><Check className="w-3 h-3" /> ຮັບບາງສ່ວນ</span>;
      case 'PENDING':
        return <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full"><Check className="w-3 h-3" /> ລໍຖ້າ</span>;
      default:
        return <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full"><Check className="w-3 h-3" /> {status || 'ຮ່າງ'}</span>;
    }
  };

  if (loading || !apiData) {
    return (
      <div className="flex items-center justify-center w-full h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const headerData = apiData.header || apiData || {};
  const documentInfo = headerData.document || headerData || {};
  const items = apiData.items || [];
  const amounts = headerData.amounts || documentInfo.amounts || {};
  const supplier = headerData.supplier || documentInfo.supplier || {};
  const po = headerData.purchaseOrder || documentInfo || {}; 
  const additionalInfo = headerData.receipt || documentInfo || {};

  const calculatedSubtotal = items.reduce((acc: number, item: any) => acc + (item.pricing?.totalAmount || 0), 0);
  const calculatedDiscount = items.reduce((acc: number, item: any) => acc + (item.pricing?.discount || 0), 0);
  const calculatedTaxRate = amounts.taxRate || 0;
  const calculatedTax = ((calculatedSubtotal - calculatedDiscount) * calculatedTaxRate) / 100;
  const calculatedTotal = calculatedSubtotal - calculatedDiscount + calculatedTax;

  const displaySubtotal = amounts.subtotal || calculatedSubtotal;
  const displayDiscount = amounts.discount || calculatedDiscount;
  const displayTaxRate = amounts.taxRate || calculatedTaxRate;
  const displayTax = amounts.tax || calculatedTax;
  const displayTotal = amounts.total || calculatedTotal;

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
      {/* Header Toolbar */}
      <div className="flex items-center justify-between w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-[#2563eb] font-bold hover:text-blue-700 hover:bg-blue-50 px-2"
          >
            <ArrowLeft className="w-5 h-5 mr-1" /> ກັບ
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black text-[#1e3a8a]">{documentInfo.docno || documentInfo.grcode || '-'}</h1>
          {renderStatus(documentInfo.approvalStatus || apiData.approvalStatus || documentInfo.status || apiData.status || documentInfo.receiptStatus || apiData.receiptStatus)}
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsPrintModalOpen(true)}
            className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-xl h-10 px-4 text-sm shadow-sm"
          >
            <Barcode className="w-4 h-4 mr-2" /> ພິມບາໂຄດ
          </Button>
          <Button 
            className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-xl h-10 px-4 text-sm shadow-sm"
            onClick={handlePrint}
            disabled={printing}
          >
            {printing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Printer className="w-4 h-4 mr-2" />} ພິມ
          </Button>
          <Button className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-xl h-10 px-4 text-sm shadow-sm">
            <Download className="w-4 h-4 mr-2" /> ດາວໂຫຼດ
          </Button>
        </div>
      </div>

      {/* Supplier Information Card */}
      <Card className="shadow-sm border-gray-100 rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-6">
          <h2 className="text-lg font-black text-gray-800 mb-6">ຂໍ້ມູນຜູ້ສະໜອງ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-400">ລະຫັດເຈົ້າໜີ້</span>
              <span className="text-sm font-bold text-gray-900">{supplier.apcode || '-'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-400">ເລກທີ PO</span>
              <span className="text-sm font-bold text-gray-900">{po.docno || '-'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-400">ເບີໂທ</span>
              <span className="text-sm font-bold text-gray-900">{supplier.telephone || supplier.tel || '-'}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-400">ຊື່ເຈົ້າໜີ້</span>
              <span className="text-sm font-bold text-gray-900">{supplier.apname || '-'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-400">ເຄດິດ</span>
              <span className="text-sm font-bold text-gray-900">{headerData.creditTerm?.shortName || headerData.creditTerm?.nameTh || headerData.creditTerm?.code || documentInfo.creditcode || '-'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-400">ວັນທີ</span>
              <span className="text-sm font-bold text-gray-900">{documentInfo.documentDate || documentInfo.createdate || '-'}</span>
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <span className="text-xs font-bold text-gray-400">ທີ່ຢູ່</span>
              <span className="text-sm font-bold text-gray-900">{supplier.addressTh || supplier.address || '-'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-400">ກຳນົດສົ່ງມອບ</span>
              <span className="text-sm font-bold text-gray-900">{po.shipDate || '-'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items List */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-gray-800">ລາຍການ ({items.length})</h2>
        <Card className="shadow-sm border-gray-100 rounded-2xl bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#244195] hover:bg-[#244195] border-b-0">
                <TableHead className="text-white font-bold text-center h-12 w-[60px]">ລຳດັບ</TableHead>
                <TableHead className="text-white font-bold h-12 text-center w-[80px]">ຮູບສິນຄ້າ</TableHead>
                <TableHead className="text-white font-bold h-12 min-w-[120px]">ລະຫັດສິນຄ້າ</TableHead>
                <TableHead className="text-white font-bold h-12 min-w-[250px]">ລາຍລະອຽດ</TableHead>
                <TableHead className="text-white font-bold text-center h-12">ຈຳນວນ</TableHead>
                <TableHead className="text-white font-bold text-center h-12">ຫົວໜ່ວຍ</TableHead>
                <TableHead className="text-white font-bold text-center h-12">ລາຄາຊື້ / ໜ່ວຍ</TableHead>
                <TableHead className="text-white font-bold text-center h-12">ສ່ວນຫຼຸດ</TableHead>
                <TableHead className="text-white font-bold text-center h-12">ຮັບຈິງ</TableHead>
                <TableHead className="text-white font-bold text-center h-12">ຊຳລຸດ</TableHead>
                <TableHead className="text-white font-bold text-center h-12">ມາບໍ່ຄົບ</TableHead>
                <TableHead className="text-white font-bold text-right h-12 pr-6">ຈຳນວນເງິນ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item: any, idx: number) => (
                <TableRow key={item.grdid || idx} className="hover:bg-gray-50 border-b border-gray-100">
                  <TableCell className="text-center font-bold text-gray-900">
                    {String(item.sequence || idx + 1).padStart(2, '0')}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto flex items-center justify-center overflow-hidden border border-gray-200">
                      <span className="text-[10px] text-gray-400">Image</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-gray-900">{item.product?.code || '-'}</TableCell>
                  <TableCell className="text-gray-500 text-xs font-medium leading-relaxed max-w-[250px] whitespace-normal">
                    {item.product?.name || '-'}
                  </TableCell>
                  <TableCell className="text-center font-bold text-gray-900">{item.quantities?.ordered || 0}</TableCell>
                  <TableCell className="text-center font-medium text-gray-900">{item.quantities?.unitCode || '-'}</TableCell>
                  <TableCell className="text-center font-bold text-gray-900">{item.pricing?.unitPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}</TableCell>
                  <TableCell className="text-center font-bold text-gray-900">{item.pricing?.discount || 0}</TableCell>
                  <TableCell className="text-center font-bold text-gray-900">{item.quantities?.received || 0}</TableCell>
                  <TableCell className="text-center font-bold text-gray-900">{item.condition?.damagedQuantity || 0}</TableCell>
                  <TableCell className="text-center font-bold text-gray-900">{item.quantities?.remaining || 0}</TableCell>
                  <TableCell className="text-right font-bold text-[#2563eb] pr-6">{item.pricing?.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Summary Box */}
      <div className="bg-[#244195] rounded-2xl p-6 shadow-sm flex flex-col gap-3">
        <h2 className="text-lg font-black text-white mb-2">ສະຫຼຸບລາຍການ</h2>
        
        <div className="flex justify-between items-center text-white/90 text-sm">
          <span className="font-medium">ເງິນສົດ</span>
          <span className="font-bold">0</span>
        </div>
        <div className="flex justify-between items-center text-white/90 text-sm">
          <span className="font-medium">ລວມເງິນ</span>
          <span className="font-bold">{displaySubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</span>
        </div>
        <div className="flex justify-between items-center text-white/90 text-sm">
          <span className="font-medium">ສ່ວນຫຼຸດ</span>
          <span className="font-bold">{displayDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</span>
        </div>
        <div className="flex justify-between items-center text-white/90 text-sm">
          <span className="font-medium">ອາກອນເພີ່ມ {displayTaxRate}%</span>
          <span className="font-bold">{displayTax.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</span>
        </div>
        <div className="flex justify-between items-center text-white/90 text-sm">
          <span className="font-medium">ລາຄາສິນຄ້າ / ບໍລິການ</span>
          <span className="font-bold">{(displaySubtotal - displayDiscount).toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</span>
        </div>
        <div className="flex justify-between items-center text-white/90 text-sm pb-3 border-b border-white/20">
          <span className="font-medium">ມູນຄ່າຍົກເວັ້ນ</span>
          <span className="font-bold">0.00 ฿</span>
        </div>
        <div className="flex justify-between items-center text-white text-base pt-1">
          <span className="font-black">ລວມເງິນທັງໝົດ</span>
          <span className="font-black">{displayTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿</span>
        </div>
      </div>

      {/* Additional Info Box */}
      <div className="bg-[#e0e7ff] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-[#1e3a8a] text-sm font-bold">ໝາຍເລກທະບຽນລົດ</span>
          <span className="text-[#1e3a8a] text-sm font-bold">{additionalInfo.vehicleRegistration || '-'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#1e3a8a] text-sm font-bold">ພະນັກງານຮັບ</span>
          <span className="text-[#1e3a8a] text-sm font-bold">{additionalInfo.driverName || '-'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#1e3a8a] text-sm font-bold">ໝາຍເຫດ</span>
          <span className="text-[#1e3a8a] text-sm font-bold">{headerData.remark || documentInfo.remark || '-'}</span>
        </div>
      </div>

      {/* Images Gallery */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-gray-800">ຮູບສິນຄ້າ</h2>
        <div className="flex flex-wrap gap-4">
          {items.map((item: any) => (
            <ItemDamagePhotos key={item.grdid} grid={documentInfo.grid} grdid={item.grdid} />
          ))}
          {/* Fallback empty state if no images are loaded */}
          {items.length === 0 && (
            <div className="text-sm text-gray-500">ບໍ່ມີຮູບພາບ</div>
          )}
        </div>
      </div>

      <PrintBarcodeModal 
        isOpen={isPrintModalOpen} 
        onClose={() => setIsPrintModalOpen(false)} 
        grId={documentInfo.docno || documentInfo.grcode || ''}
        items={items}
      />

      <AlertDialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-lg">
          <div className="bg-red-50 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <AlertDialogHeader className="w-full mb-2 text-center flex flex-col items-center">
              <AlertDialogTitle className="text-xl font-bold text-gray-900 text-center">ແຈ້ງເຕືອນ</AlertDialogTitle>
              <AlertDialogDescription className="text-base font-medium text-gray-600 text-center mt-2">
                {errorMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="p-4 bg-gray-50 flex items-center justify-center sm:justify-center">
            <AlertDialogAction 
              onClick={() => setIsErrorModalOpen(false)}
              className="w-full max-w-[200px] h-11 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
            >
              ຕົກລົງ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
