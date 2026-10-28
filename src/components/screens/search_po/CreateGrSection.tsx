'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, CloudUpload, Package, Maximize2, ExternalLink, X, Trash2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
import { usePoDetail } from '@/hooks/po-hook/usePoDetail';
import { getAuthToken, getSelectedApiUrl } from '@/lib/auth';
import { normalizeCurrency } from '@/lib/currency';
import { normalizeProductImageUrl } from '@/lib/imageUtils';

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
  const { data: poDetailData, fetchPoDetail } = usePoDetail();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isConfirmSaveModalOpen, setIsConfirmSaveModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [productImagesMap, setProductImagesMap] = useState<Record<string, string>>({});
  const [previewFullScreenUrl, setPreviewFullScreenUrl] = useState<string | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<{ id: string; url: string } | null>(null);
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);

  const itemsList = grData?.items || [];
  const firstItemGrdid = itemsList[0]?.grdid?.toString() || itemsList[0]?.id?.toString() || "";

  useEffect(() => {
    if (grid) {
      fetchGrDetail(grid);
    } else if (poNumber) {
      fetchGrDetail(poNumber);
    }
  }, [grid, poNumber, fetchGrDetail]);

  const documentInfo = grData?.header?.document || grData?.document || grData?.header || grData || {};
  const supplierInfo = grData?.header?.supplier || grData?.supplier || {};
  const poInfo = grData?.header?.purchaseOrder || grData?.purchaseOrder || {};
  const effectiveGrid = String(documentInfo.grid || grData?.header?.document?.grid || grData?.grid || grid || '');

  const effectivePoDocno = poInfo.docno || poInfo.pocode || poInfo.poNumber || poNumber || '';

  useEffect(() => {
    if (effectivePoDocno) {
      fetchPoDetail({ docno: effectivePoDocno });
    }
  }, [effectivePoDocno, fetchPoDetail]);

  // Populate images from PO Detail if available
  useEffect(() => {
    if (poDetailData?.items && Array.isArray(poDetailData.items)) {
      const poImages: Record<string, string> = {};
      poDetailData.items.forEach((pItem: any) => {
        if (pItem.productcode && pItem.imageUrl) {
          poImages[pItem.productcode] = pItem.imageUrl;
        }
      });
      if (Object.keys(poImages).length > 0) {
        setProductImagesMap((prev) => ({ ...poImages, ...prev }));
      }
    }
  }, [poDetailData]);

  // Fetch product images for items in itemsList that are missing
  useEffect(() => {
    if (!itemsList || itemsList.length === 0) return;

    let isMounted = true;

    const loadImages = async () => {
      const newImagesMap: Record<string, string> = {};
      const missingCodes: string[] = [];

      itemsList.forEach((row: any) => {
        const code = row.product?.code || row.itemcode || row.code;
        if (!code) return;

        // Check if row itself already has the image
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
  }, [itemsList]);

  useEffect(() => {
    if (effectiveGrid && firstItemGrdid) {
      fetchPhotos(effectiveGrid, firstItemGrdid, "IMAGE");
    }
  }, [effectiveGrid, firstItemGrdid, fetchPhotos]);

  const handleUploadSuccess = () => {
    fetchGrDetail(effectiveGrid || grid);
    if (effectiveGrid && firstItemGrdid) {
      fetchPhotos(effectiveGrid, firstItemGrdid, "IMAGE");
    }
  };

  const handleDeletePhoto = async (attachmentId: string) => {
    if (effectiveGrid && firstItemGrdid && attachmentId) {
      const res = await deletePhoto(attachmentId);
      if (res.success) {
        fetchPhotos(effectiveGrid, firstItemGrdid, "IMAGE");
      } else {
        alert("ບໍ່ສາມາດລຶບຮູບພາບໄດ້");
      }
    }
  };

  const amounts = grData?.header?.amounts || grData?.amounts || documentInfo?.amounts || {};
  const rawCurrency = amounts?.currencyCode || grData?.header?.currencyCode || grData?.currencyCode || poInfo?.currencyCode || poDetailData?.header?.amounts?.currencyCode;
  const ccy = normalizeCurrency(rawCurrency);

  const computedSubtotal = itemsList.reduce((sum: number, item: any) => sum + Number(item.pricing?.totalAmount ?? item.amount ?? 0), 0);
  const displaySubtotal = Number(amounts?.subtotal ?? computedSubtotal);

  const computedDiscount = itemsList.reduce((sum: number, item: any) => sum + Number(item.pricing?.discount ?? item.discountamount ?? 0), 0);
  const displayDiscount = Number(amounts?.discount ?? computedDiscount);

  const displayTax = Number(amounts?.tax ?? 0);
  const displayTotalAmount = Number(amounts?.total ?? (displaySubtotal - displayDiscount + displayTax));
  const poAmounts = grData?.header?.purchaseOrderAmounts || poDetailData?.header?.amounts || {};
  const displayExchangeRate = amounts?.exchangeRate ?? poAmounts?.exchangeRate ?? grData?.header?.exchangeRate ?? 0;

  const grNumber = documentInfo.docno || documentInfo.grcode || (isFetching ? "ກຳລັງໂຫຼດ..." : "-");

  const handlePrint = async () => {
    if (effectiveGrid) {
      const res = await fetchPdf(effectiveGrid);
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
            disabled={!effectiveGrid}
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
          {/* <div className="text-gray-300 hover:text-gray-500 cursor-pointer text-sm flex items-center gap-1 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> ເພີ່ມລາຍການ
          </div> */}
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
                  <TableHead className="text-white bg-transparent text-center font-semibold border-r border-white/20">ຍັງຄົງເຫຼືອ</TableHead>
                  <TableHead className="text-white bg-transparent text-center font-semibold border-r border-white/20">ຈຳນວນເງິນ</TableHead>
                  <TableHead className="text-white bg-transparent text-center font-semibold">ຈັດການ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemsList.map((row: any, idx: number) => {
                  const productCode = row.product?.code || row.itemcode || row.code || '';
                  const productName = row.product?.name || row.itemname || row.desc || '';
                  const productImage =
                    row.imageUrl ||
                    row.product?.imageUrl ||
                    row.image ||
                    row.product?.image ||
                    (Array.isArray(row.product?.images) && row.product.images[0]?.url ? row.product.images[0].url : row.product?.images?.[0]) ||
                    (Array.isArray(row.images) && row.images[0]?.url ? row.images[0].url : row.images?.[0]) ||
                    (productCode ? productImagesMap[productCode] : null);

                  return (
                    <TableRow key={row.podid || idx} className="bg-white border-b-gray-100 last:border-b-0">
                      <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{idx + 1}</TableCell>
                      <TableCell className="text-center border-r border-gray-100">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 bg-white rounded-lg border border-gray-100 flex items-center justify-center p-1 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden relative">
                            {productImage ? (
                              <Image
                                src={normalizeProductImageUrl(productImage)}
                                unoptimized
                                alt={productName || "product"}
                                width={64}
                                height={64}
                                className="object-contain w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-50 flex items-center justify-center rounded">
                                <Package className="w-6 h-6 text-gray-300" />
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="border-r border-gray-100 text-center">
                        <span className="font-bold text-gray-900">{productCode || '-'}</span>
                      </TableCell>
                      <TableCell className="border-r border-gray-100">
                        <span className="text-gray-500 text-sm leading-snug">{productName || '-'}</span>
                      </TableCell>
                      <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{row.quantities?.ordered ?? row.qty ?? 0}</TableCell>
                      <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{row.quantities?.unitCode ?? row.unitcode ?? row.unit ?? '-'}</TableCell>
                      <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{row.pricing?.unitPrice ?? row.price ?? 0}</TableCell>
                      <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{row.pricing?.discount ?? row.discountamount ?? 0}</TableCell>
                      <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">{row.quantities?.grReceivedQty ?? row.quantities?.received ?? row.receivedQty ?? 0}</TableCell>
                      <TableCell className="text-center font-bold text-gray-900 border-r border-gray-100">
                        {row.quantities?.remaining ?? row.remainingQuantity ?? row.remainingQty ?? (
                          row.quantities?.ordered !== undefined
                            ? Math.max(0, Number(row.quantities.ordered) - Number(row.quantities?.grReceivedQty ?? row.quantities?.received ?? 0))
                            : 0
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold text-[#3b82f6] border-r border-gray-100">{row.pricing?.totalAmount ?? row.amount ?? 0}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedItem({
                              ...row,
                              imageUrl: productImage || row.imageUrl,
                            });
                            setIsAddItemModalOpen(true);
                          }}
                          className="h-8 border-[#3b82f6] text-[#3b82f6] hover:bg-blue-50 font-semibold px-4 rounded-md"
                        >
                          ຮັບສິນຄ້າ
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
            {displayExchangeRate ? (
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-blue-100/90 font-medium tracking-wide">ອັດຕາແລກປ່ຽນ</span>
                <span className="font-bold tracking-wider">{Number(displayExchangeRate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}</span>
              </div>
            ) : null}
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-blue-100/90 font-medium tracking-wide">ລວມເງິນ</span>
              <span className="font-bold tracking-wider">{displaySubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {ccy}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-blue-100/90 font-medium tracking-wide">ສ່ວນຫຼຸດ</span>
              <span className="font-bold tracking-wider">{displayDiscount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {ccy}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-blue-100/90 font-medium tracking-wide">ອາກອນເພີ່ມ</span>
              <span className="font-bold tracking-wider">{displayTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {ccy}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-blue-100/90 font-medium tracking-wide">ລາຄາສິນຄ້າ / ບໍລິການ</span>
              <span className="font-bold tracking-wider">{displayTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {ccy}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-blue-100/90 font-medium tracking-wide">ມູນຄ່າຍົກເວັ້ນ</span>
              <span className="font-bold tracking-wider">0.00 {ccy}</span>
            </div>
            <div className="flex justify-between items-center py-4 bg-[#1e3a8a]/40 -mx-6 px-6 -mb-2">
              <span className="text-white font-bold tracking-wide">ລວມເງິນທັງໝົດ</span>
              <span className="font-bold text-[15px] tracking-wider">{displayTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {ccy}</span>
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

          {!photosLoading && photosData?.data?.attachments?.filter((a: any) => a.type === "IMAGE").map((attachment: any, idx: number) => (
            <div
              key={attachment.attachmentId || attachment.id || `attachment-${idx}`}
              onClick={() => setPreviewFullScreenUrl(attachment.url)}
              className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group cursor-pointer hover:shadow-md hover:border-blue-400 transition-all duration-200"
              title="ກົດເພື່ອເບິ່ງຮູບເຕັມຈໍ"
            >
              <Image
                src={attachment.url || `https://placehold.co/200x200?text=IMG`}
                unoptimized
                alt={attachment.fileName || "Attached image"}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-105 transition-transform duration-200"
              />
              {/* Fullscreen hover overlay icon */}
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <Maximize2 className="w-5 h-5 text-white drop-shadow" />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPhotoToDelete({ id: attachment.attachmentId, url: attachment.url });
                }}
                className="absolute top-1 right-1 bg-white/80 backdrop-blur text-gray-700 rounded-full p-1 z-10 hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                title="ລຶບຮູບ"
              >
                <X className="w-3.5 h-3.5" />
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
        grid={effectiveGrid}
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
        grid={effectiveGrid}
        item={selectedItem}
        sku={selectedItem?.product?.code || selectedItem?.itemcode || selectedItem?.code}
        onSaved={() => fetchGrDetail(effectiveGrid || grid)}
      />

      <ConfirmSaveGrModal
        isOpen={isConfirmSaveModalOpen}
        onClose={() => setIsConfirmSaveModalOpen(false)}
        grid={effectiveGrid}
        onConfirm={() => router.push('/search_po')}
        totalAmount={displayTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        currencyCode={rawCurrency || "LAK"}
        initialExchangeRate={grData?.header?.amounts?.exchangeRate ?? grData?.amounts?.exchangeRate ?? (normalizeCurrency(rawCurrency) === "LAK" ? 0 : 1)}
      />

      {/* Confirm Delete Photo Dialog */}
      <Dialog open={!!photoToDelete} onOpenChange={(open) => !open && !isDeletingPhoto && setPhotoToDelete(null)}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="z-[110] bg-black/60"
          className="max-w-md p-0 overflow-hidden border-0 shadow-2xl rounded-2xl z-[115] bg-white outline-none"
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

            {photoToDelete && (
              <div className="mt-4 w-20 h-20 rounded-xl overflow-hidden border-2 border-red-200 shadow-sm relative">
                <img src={photoToDelete.url} alt="To delete" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 flex items-center justify-center gap-3">
            {/* Option: Cancel */}
            <Button
              type="button"
              variant="outline"
              disabled={isDeletingPhoto}
              onClick={() => setPhotoToDelete(null)}
              className="w-full max-w-[140px] h-11 border-gray-300 font-bold rounded-xl text-gray-700 hover:bg-gray-100"
            >
              ຍົກເລີກ
            </Button>

            {/* Option: Confirm (Yes) */}
            <Button
              type="button"
              disabled={isDeletingPhoto}
              onClick={async () => {
                if (photoToDelete) {
                  setIsDeletingPhoto(true);
                  try {
                    await handleDeletePhoto(photoToDelete.id);
                  } finally {
                    setIsDeletingPhoto(false);
                    setPhotoToDelete(null);
                  }
                }
              }}
              className="w-full max-w-[140px] h-11 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2"
            >
              {isDeletingPhoto ? (
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
          className="max-w-4xl p-0 bg-transparent border-none shadow-2xl rounded-2xl flex flex-col items-center justify-center overflow-hidden z-[105]"
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
    </div>
  );
}
