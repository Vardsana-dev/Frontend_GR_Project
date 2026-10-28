'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Check, Printer, Download, Barcode, Loader2, AlertCircle, Package, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PrintBarcodeModal } from './PrintBarcodeModal';
import { useGetGrDetail } from '@/hooks/gr-hook/useGetGrDetail';
import { useGetListDamageEvidencePhoto } from '@/hooks/gr-damage-photo-hook/useGetListDamageEvidencePhoto';
import { useGetDamageEvidencePhoto } from '@/hooks/gr-damage-photo-hook/useGetDamageEvidencePhoto';
import { useGetPrintGrDocumentPdf } from '@/hooks/gr-hook/useGetPrintGrDocumentPdf';
import { useCancelDraftGr } from '@/hooks/gr-hook/useCancelDraftGr';
import { getAuthToken, getSelectedApiUrl } from '@/lib/auth';
import { normalizeCurrency } from '@/lib/currency';
import { normalizeProductImageUrl } from '@/lib/imageUtils';

const resolveDamagePhotoUrl = (raw: string) => {
  if (!raw) return '';
  return normalizeProductImageUrl(raw);
};

interface DamagePhotoThumbnailProps {
  photo: any;
  onPreview?: (url: string) => void;
}

const DamagePhotoThumbnail = ({ photo, onPreview }: DamagePhotoThumbnailProps) => {
  const { fetchPhoto } = useGetDamageEvidencePhoto();
  const [url, setUrl] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<boolean>(false);

  React.useEffect(() => {
    let isMounted = true;

    const directUrl =
      photo?.url ||
      photo?.fileUrl ||
      photo?.imageUrl ||
      photo?.path ||
      photo?.filePath ||
      (typeof photo === 'string' && (photo.includes('/') || photo.startsWith('http')) ? photo : '');

    const attachmentId =
      photo?.attachmentId ??
      photo?.id ??
      photo?.uid ??
      (!directUrl && (typeof photo === 'number' || (typeof photo === 'string' && !photo.includes('/'))) ? photo : null);

    const loadImage = async () => {
      setLoading(true);
      setError(false);

      // Strategy 1: If there is a direct URL provided by the backend API
      if (directUrl) {
        const resolved = resolveDamagePhotoUrl(directUrl);
        if (isMounted) {
          setUrl(resolved);
          setLoading(false);
        }
        return;
      }

      // Strategy 2: If we have an attachmentId, use fetchPhoto
      if (attachmentId !== null && attachmentId !== undefined && String(attachmentId).trim() !== '') {
        try {
          const res = await fetchPhoto(String(attachmentId));
          if (!isMounted) return;
          if (res?.success && res.url) {
            setUrl(res.url);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Failed to fetch photo by attachmentId:', e);
        }
      }

      if (isMounted) {
        setLoading(false);
        setError(true);
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [photo, fetchPhoto]);

  const handleImageError = () => {
    // If direct image URL failed to load in <img> tag, try fetching via fetchPhoto with auth token as fallback
    const attachmentId = photo?.attachmentId ?? photo?.id ?? photo?.uid;
    const directUrl = photo?.url || photo?.fileUrl || photo?.imageUrl || photo?.path || photo?.filePath;

    if (!url.startsWith('blob:')) {
      const fallbackTarget = attachmentId ? String(attachmentId) : directUrl;
      if (fallbackTarget) {
        fetchPhoto(fallbackTarget).then(res => {
          if (res?.success && res.url) {
            setUrl(res.url);
          } else {
            setError(true);
          }
        }).catch(() => {
          setError(true);
        });
        return;
      }
    }
    setError(true);
  };

  return (
    <div
      onClick={() => {
        if (url && !error) {
          if (onPreview) onPreview(url);
          else window.open(url, '_blank');
        }
      }}
      className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-xl overflow-hidden relative shadow-sm border border-gray-200 flex items-center justify-center group cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
      title="ກົດເພື່ອເບິ່ງຮູບຂະໜາດໃຫຍ່"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-1.5 p-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-gray-400 text-[11px] font-medium">ກຳລັງໂຫຼດ...</span>
        </div>
      ) : error || !url ? (
        <div className="flex flex-col items-center justify-center gap-1 text-center p-2">
          <AlertCircle className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400 text-[10px] font-medium leading-tight">ບໍ່ສາມາດໂຫຼດຮູບໄດ້</span>
        </div>
      ) : (
        <>
          <img
            src={url}
            alt={photo?.fileName || photo?.name || "Damage photo"}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs font-bold px-2 py-1 bg-black/60 rounded-md backdrop-blur-xs">ເບິ່ງຮູບ</span>
          </div>
        </>
      )}
    </div>
  );
};

const ItemDamagePhotos = ({
  grid,
  grdid,
  onPreview
}: {
  grid: string;
  grdid: string;
  onPreview?: (url: string) => void;
}) => {
  const { data, fetchList } = useGetListDamageEvidencePhoto();

  React.useEffect(() => {
    if (grid && grdid && String(grid) !== 'undefined' && String(grdid) !== 'undefined') {
      fetchList(String(grid), String(grdid), "IMAGE");
    }
  }, [grid, grdid, fetchList]);

  if (!data) return null;

  let photoList: any[] = [];
  if (Array.isArray(data)) {
    photoList = data;
  } else if (data?.data?.attachments) {
    photoList = data.data.attachments;
  } else if (data?.files) {
    photoList = data.files;
  } else if (Array.isArray(data?.data)) {
    photoList = data.data;
  } else if (data?.attachments) {
    photoList = data.attachments;
  }

  photoList = photoList.filter((a: any) => a.type === "IMAGE" || !a.type);

  if (!photoList || photoList.length === 0) return null;

  return (
    <>
      {photoList.map((photo: any, idx: number) => (
        <DamagePhotoThumbnail
          key={photo.attachmentId || photo.id || photo.uid || `photo-${idx}`}
          photo={photo}
          onPreview={onPreview}
        />
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
  const [previewImageUrl, setPreviewImageUrl] = React.useState<string | null>(null);
  const [productImagesMap, setProductImagesMap] = useState<Record<string, string>>({});
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = React.useState(false);

  const { cancelDraftGr, loading: isCancelling } = useCancelDraftGr();
  const { loading: printing, fetchPdf } = useGetPrintGrDocumentPdf();

  const handleConfirmCancelGr = async () => {
    const headerData = apiData?.header || apiData || {};
    const documentInfo = headerData.document || headerData || {};
    const targetGrid = documentInfo.grid || grId;

    const res = await cancelDraftGr(targetGrid);
    if (res.success) {
      setIsConfirmCancelOpen(false);
      fetchGrDetail(grId);
    } else {
      setIsConfirmCancelOpen(false);
      setErrorMessage(res.error || "ເກີດຂໍ້ຜິດພາດໃນການຍົກເລີກ");
      setIsErrorModalOpen(true);
    }
  };

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

  const grItems = apiData?.items || [];

  // Fetch product images for items that are missing
  useEffect(() => {
    if (!grItems || grItems.length === 0) return;

    let isMounted = true;

    const loadImages = async () => {
      const newImagesMap: Record<string, string> = {};
      const missingCodes: string[] = [];

      grItems.forEach((row: any) => {
        const code = row.product?.code || row.itemcode || row.code;
        if (!code) return;

        const directImg =
          row.imageUrl ||
          row.product?.imageUrl ||
          row.image ||
          row.product?.image ||
          (Array.isArray(row.product?.images) && row.product.images[0]?.url ? row.product.images[0].url : row.product?.images?.[0]) ||
          (Array.isArray(row.images) && row.images[0]?.url ? row.images[0].url : row.images?.[0]);

        if (directImg && typeof directImg === 'string') {
          newImagesMap[code] = directImg;
        } else if (!productImagesMap[code]) {
          missingCodes.push(code);
        }
      });

      if (Object.keys(newImagesMap).length > 0) {
        setProductImagesMap((prev) => ({ ...prev, ...newImagesMap }));
      }

      const uniqueMissing = Array.from(new Set(missingCodes));
      if (uniqueMissing.length === 0) return;

      const apiUrl = process.env.NEXT_PUBLIC_API || getSelectedApiUrl() || "";
      const envEndpoint = process.env.NEXT_PUBLIC_GET_EACH_PRODUCT_DETAIL || "/api/product";
      const token = getAuthToken();

      const fetchedMap: Record<string, string> = {};

      await Promise.all(
        uniqueMissing.map(async (code) => {
          try {
            let apiEndpoint = "";
            if (envEndpoint.includes("{{productId}}")) {
              apiEndpoint = `${apiUrl}${envEndpoint.replace("{{productId}}", encodeURIComponent(code))}`;
            } else if (envEndpoint.endsWith("?")) {
              apiEndpoint = `${apiUrl}${envEndpoint}productId=${encodeURIComponent(code)}`;
            } else {
              apiEndpoint = `${apiUrl}${envEndpoint}/${encodeURIComponent(code)}`;
            }

            const res = await fetch(apiEndpoint, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            });

            if (res.ok) {
              const data = await res.json();
              const img = data.imageUrl || (Array.isArray(data.images) && data.images.length > 0 ? (data.images[0]?.url || data.images[0]) : null);
              if (img && typeof img === 'string') {
                fetchedMap[code] = img;
              }
            }
          } catch (e) {
            // Ignore single fetch error
          }
        })
      );

      if (isMounted && Object.keys(fetchedMap).length > 0) {
        setProductImagesMap((prev) => ({ ...prev, ...fetchedMap }));
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [grItems]);

  const renderStatus = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
      case 'CONFIRMED':
      case 'COMPLETE':
      case 'RECEIVED':
      case 'ຮັບແລ້ວ':
        return <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full"><Check className="w-3 h-3" /> ຮັບແລ້ວ</span>;
      case 'IN_REVIEW':
      case 'WAITING':
      case 'ລໍຖ້າຢືນຢັນ':
        return <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full"><Check className="w-3 h-3" /> ລໍຖ້າຢືນຢັນ</span>;
      case 'CANCELLED':
      case 'UNCONFIRMED':
      case 'ບໍ່ຢືນຢັນ':
      case 'ບໍ່ຍືນຢັນ':
      case 'ຍົກເລີກ':
        return <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full"><Check className="w-3 h-3" /> ຍົກເລີກ</span>;
      case 'DRAFT':
      case 'ຮ່າງ':
        return <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full"><Check className="w-3 h-3" /> ຮ່າງ</span>;
      case 'PARTIAL':
      case 'ຮັບບາງສ່ວນ':
        return <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full"><Check className="w-3 h-3" /> ຮັບບາງສ່ວນ</span>;
      case 'PENDING':
      case 'ລໍຖ້າ':
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
  const amounts = headerData.amounts || documentInfo.amounts || apiData.amounts || {};
  const supplier = headerData.supplier || documentInfo.supplier || {};
  const po = headerData.purchaseOrder || documentInfo || {};
  const additionalInfo = headerData.receipt || documentInfo || {};

  const rawCurrency = amounts.currencyCode || headerData.currencyCode || documentInfo.currencyCode || apiData.currencyCode || po.currencyCode;
  const ccy = normalizeCurrency(rawCurrency);

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
  const poAmounts = headerData.purchaseOrderAmounts || apiData.purchaseOrderAmounts || {};
  const displayExchangeRate = amounts.exchangeRate ?? poAmounts.exchangeRate ?? headerData.exchangeRate ?? documentInfo.exchangeRate ?? apiData.exchangeRate ?? 0;

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
          {renderStatus(documentInfo.status || apiData.status || documentInfo.approvalStatus || apiData.approvalStatus || documentInfo.receiptStatus || apiData.receiptStatus)}
        </div>

        <div className="flex items-center gap-2">
          {(() => {
            const statusStr = (documentInfo.status || apiData.status || documentInfo.approvalStatus || apiData.approvalStatus || documentInfo.receiptStatus || apiData.receiptStatus || '').toUpperCase();
            const isDraft = statusStr === 'DRAFT' || statusStr === 'ຮ່າງ';
            const poCode = po.docno || po.ponumber || documentInfo.pocode || documentInfo.poNumber || documentInfo.docno || 'PO';
            const targetGrid = documentInfo.grid || grId;

            if (!isDraft) return null;

            return (
              <>
                <Link href={`/search_po/${encodeURIComponent(poCode)}/create?grid=${targetGrid}`}>
                  <Button
                    className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-xl h-10 px-4 text-sm shadow-sm"
                  >
                    ແກ້ໄຂ
                  </Button>
                </Link>
                <Button
                  onClick={() => setIsConfirmCancelOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl h-10 px-4 text-sm shadow-sm"
                >
                  ຍົກເລີກ
                </Button>
              </>
            );
          })()}
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
                <TableHead className="text-white font-bold text-center h-12">ມາບໍ່ຄົບ</TableHead>
                <TableHead className="text-white font-bold text-right h-12 pr-6">ຈຳນວນເງິນ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item: any, idx: number) => {
                const productCode = item.product?.code || item.itemcode || item.code || '';
                const productName = item.product?.name || item.itemname || item.desc || '';
                const productImage =
                  item.imageUrl ||
                  item.product?.imageUrl ||
                  item.image ||
                  item.product?.image ||
                  (Array.isArray(item.product?.images) && item.product.images[0]?.url ? item.product.images[0].url : item.product?.images?.[0]) ||
                  (Array.isArray(item.images) && item.images[0]?.url ? item.images[0].url : item.images?.[0]) ||
                  (productCode ? productImagesMap[productCode] : null);

                return (
                  <TableRow key={item.grdid || idx} className="hover:bg-gray-50 border-b border-gray-100">
                    <TableCell className="text-center font-bold text-gray-900">
                      {String(item.sequence || idx + 1).padStart(2, '0')}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="w-12 h-12 bg-white rounded-lg mx-auto flex items-center justify-center overflow-hidden border border-gray-200 relative p-0.5">
                        {productImage ? (
                          <Image
                            src={normalizeProductImageUrl(productImage)}
                            unoptimized
                            alt={productName || "product"}
                            width={48}
                            height={48}
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-gray-900">{productCode || '-'}</TableCell>
                    <TableCell className="text-gray-500 text-xs font-medium leading-relaxed max-w-[250px] whitespace-normal">
                      {productName || '-'}
                    </TableCell>
                    <TableCell className="text-center font-bold text-gray-900">{item.quantities?.ordered || 0}</TableCell>
                    <TableCell className="text-center font-medium text-gray-900">{item.quantities?.unitCode || '-'}</TableCell>
                    <TableCell className="text-center font-bold text-gray-900">{item.pricing?.unitPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}</TableCell>
                    <TableCell className="text-center font-bold text-gray-900">{item.pricing?.discount || 0}</TableCell>
                    <TableCell className="text-center font-bold text-gray-900">{item.quantities?.grReceivedQty ?? item.quantities?.received ?? 0}</TableCell>
                    <TableCell className="text-center font-bold text-gray-900">{item.quantities?.remaining || 0}</TableCell>
                    <TableCell className="text-right font-bold text-[#2563eb] pr-6">{item.pricing?.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Summary Box */}
      <div className="bg-[#244195] rounded-2xl p-6 shadow-sm flex flex-col gap-3">
        <h2 className="text-lg font-black text-white mb-2">ສະຫຼຸບລາຍການ</h2>

        <div className="flex justify-between items-center text-white/90 text-sm">
          <span className="font-medium">ອັດຕາແລກປ່ຽນ</span>
          <span className="font-bold">{displayExchangeRate ? Number(displayExchangeRate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 }) : '0'}</span>
        </div>
        <div className="flex justify-between items-center text-white/90 text-sm">
          <span className="font-medium">ລວມເງິນ</span>
          <span className="font-bold">{displaySubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} {ccy}</span>
        </div>
        <div className="flex justify-between items-center text-white/90 text-sm">
          <span className="font-medium">ສ່ວນຫຼຸດ</span>
          <span className="font-bold">{displayDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {ccy}</span>
        </div>
        <div className="flex justify-between items-center text-white/90 text-sm">
          <span className="font-medium">ອາກອນເພີ່ມ {displayTaxRate}%</span>
          <span className="font-bold">{displayTax.toLocaleString(undefined, { minimumFractionDigits: 2 })} {ccy}</span>
        </div>
        <div className="flex justify-between items-center text-white/90 text-sm">
          <span className="font-medium">ລາຄາສິນຄ້າ / ບໍລິການ</span>
          <span className="font-bold">{(displaySubtotal - displayDiscount).toLocaleString(undefined, { minimumFractionDigits: 2 })} {ccy}</span>
        </div>
        <div className="flex justify-between items-center text-white/90 text-sm pb-3 border-b border-white/20">
          <span className="font-medium">ມູນຄ່າຍົກເວັ້ນ</span>
          <span className="font-bold">0.00 {ccy}</span>
        </div>
        <div className="flex justify-between items-center text-white text-base pt-1">
          <span className="font-black">ລວມເງິນທັງໝົດ</span>
          <span className="font-black">{displayTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} {ccy}</span>
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
          {items.map((item: any, idx: number) => (
            <ItemDamagePhotos
              key={item.grdid || item.podid || item.id || `damage-photo-${idx}`}
              grid={documentInfo.grid || headerData.grid || apiData.grid || grId}
              grdid={item.grdid || item.id || item.podid}
              onPreview={(url) => setPreviewImageUrl(url)}
            />
          ))}
          {/* Fallback empty state if no images are loaded */}
          {items.length === 0 && (
            <div className="text-sm text-gray-500">ບໍ່ມີຮູບພາບ</div>
          )}
        </div>
      </div>

      {/* Damage Photo Preview Modal */}
      <Dialog open={!!previewImageUrl} onOpenChange={(open) => !open && setPreviewImageUrl(null)}>
        <DialogContent className="max-w-3xl p-4 bg-white border border-gray-200 shadow-2xl rounded-2xl flex flex-col items-center justify-center overflow-hidden gap-3">
          <DialogTitle className="sr-only">ຮູບພາບສິນຄ້າ</DialogTitle>
          {previewImageUrl && (
            <div className="relative w-full max-h-[80vh] flex flex-col items-center justify-center p-1 gap-4">
              <img
                src={previewImageUrl}
                alt="Damage Preview"
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-xs"
              />
              <div className="flex items-center gap-3 w-full justify-end pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(previewImageUrl, '_blank')}
                  className="rounded-xl flex items-center gap-1.5 font-bold text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  ເປີດໃນແທັບໃໝ່
                </Button>
                <Button
                  size="sm"
                  onClick={() => setPreviewImageUrl(null)}
                  className="bg-[#244195] hover:bg-blue-900 text-white rounded-xl font-bold text-xs px-5"
                >
                  ປິດ
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

      {/* Confirm Cancel Draft GR Dialog */}
      <AlertDialog open={isConfirmCancelOpen} onOpenChange={setIsConfirmCancelOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-red-50 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3 shadow-inner">
              <AlertCircle className="w-7 h-7" />
            </div>
            <AlertDialogHeader className="w-full text-center flex flex-col items-center">
              <AlertDialogTitle className="text-xl font-bold text-gray-900 text-center">
                ຢືນຢັນການຍົກເລີກໃບຮັບສິນຄ້າ
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm font-medium text-gray-600 text-center mt-2">
                ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການຍົກເລີກໃບຮັບສິນຄ້າຮ່າງນີ້?
                <br />
                <span className="font-bold text-red-600 inline-block mt-1">
                  ເລກທີ: {documentInfo.docno || documentInfo.grcode || grId}
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="p-4 bg-gray-50 flex items-center justify-center gap-3 sm:justify-center">
            <Button
              variant="outline"
              disabled={isCancelling}
              onClick={() => setIsConfirmCancelOpen(false)}
              className="w-full max-w-[140px] h-11 border-gray-300 font-bold rounded-xl text-gray-700 hover:bg-gray-100"
            >
              ກັບຄືນ
            </Button>
            <Button
              disabled={isCancelling}
              onClick={handleConfirmCancelGr}
              className="w-full max-w-[140px] h-11 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>ກຳລັງຍົກເລີກ...</span>
                </>
              ) : (
                "ຢືນຢັນຍົກເລີກ"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


