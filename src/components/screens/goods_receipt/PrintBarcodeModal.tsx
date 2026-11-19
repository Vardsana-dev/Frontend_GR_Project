'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, Check, Printer, Layers, SlidersHorizontal } from 'lucide-react';
import { AddBarcodeModal } from './AddBarcodeModal';
import { StandardPagination } from '@/components/customs/StandardPagination';
import { A4BarcodeSheet, BarcodePrintItem } from './A4BarcodeSheet';
import { useReactToPrint } from 'react-to-print';

interface PrintBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  grId: string;
  items?: any[];
}

export function PrintBarcodeModal({ isOpen, onClose, grId, items = [] }: PrintBarcodeModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddBarcodeOpen, setIsAddBarcodeOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ code: string; name: string; unitcode?: string } | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Track printed items across session for this GR
  const [printedIds, setPrintedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined' && grId) {
      try {
        const stored = sessionStorage.getItem(`printed_barcodes_${grId}`);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Track dynamically added barcodes from AddBarcodeModal
  const [addedBarcodes, setAddedBarcodes] = useState<Record<string, string>>({});

  // Track custom barcode quantities to print per item
  const [customQuantities, setCustomQuantities] = useState<Record<string, number | ''>>({});

  // Print Configuration Settings
  const [paperType, setPaperType] = useState<'roll' | 'a4'>('roll');
  const [columns, setColumns] = useState<2 | 3 | 4>(3);
  const [repeatByQuantity, setRepeatByQuantity] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Active items being sent to the print preview
  const [activePrintItems, setActivePrintItems] = useState<BarcodePrintItem[]>([]);

  // Ref for the hidden printable component
  const printSheetRef = useRef<HTMLDivElement>(null);

  // Handle custom quantity change for an item
  const handleQuantityChange = (id: string, value: string) => {
    if (value === '') {
      setCustomQuantities((prev) => ({
        ...prev,
        [id]: '',
      }));
      return;
    }
    // Remove leading zeros (e.g. '05' -> '5')
    const cleanVal = value.replace(/^0+(?=\d)/, '');
    const num = parseInt(cleanVal, 10);
    setCustomQuantities((prev) => ({
      ...prev,
      [id]: isNaN(num) ? '' : Math.max(0, num),
    }));
  };

  // Toggle repeat by received quantity shortcut
  const handleToggleRepeatByQuantity = () => {
    const next = !repeatByQuantity;
    setRepeatByQuantity(next);

    const updatedQuantities: Record<string, number | ''> = {};
    items.forEach((item: any, idx: number) => {
      const id = String(item.sequence || idx + 1).padStart(2, '0');
      const receivedQty = Number(item.quantities?.grReceivedQty ?? item.quantities?.received ?? item.qty ?? 0);
      updatedQuantities[id] = next ? (receivedQty > 0 ? receivedQty : '') : '';
    });
    setCustomQuantities(updatedQuantities);
  };

  // Save printed items to sessionStorage when updated
  useEffect(() => {
    if (typeof window !== 'undefined' && grId) {
      try {
        sessionStorage.setItem(`printed_barcodes_${grId}`, JSON.stringify(printedIds));
      } catch {
        // Ignore storage errors
      }
    }
  }, [printedIds, grId]);

  // Dynamic Page Style based on Paper Type:
  // - 'roll': 100mm x 25mm label roll (3 stickers/row of 31x24mm) with 0 margin
  // - 'a4': Standard A4 portrait sheet
  const pageStyle = useMemo(() => {
    if (paperType === 'roll') {
      return `
        @page {
          size: 100mm 25mm;
          margin: 0mm !important;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100mm !important;
            height: auto !important;
            background: #ffffff !important;
            color: #000000 !important;
            overflow: visible !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box !important;
          }
          .roll-strip {
            width: 100mm !important;
            height: 25mm !important;
            max-height: 25mm !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          .roll-strip:last-child,
          .roll-strip-last {
            page-break-after: avoid !important;
            break-after: avoid !important;
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .roll-label-card {
            width: 32mm !important;
            height: 25mm !important;
            max-height: 25mm !important;
            padding: 2.0mm 0.8mm 0.8mm 0.8mm !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          .roll-label-card-first {
            position: relative !important;
            left: -1.2mm !important;
          }
        }
      `;
    }
    return `
      @page {
        size: A4 portrait;
        margin: 0mm;
      }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          color: #000000 !important;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
  }, [paperType]);

  // Initialize react-to-print hook
  const reactToPrintFn = useReactToPrint({
    contentRef: printSheetRef,
    documentTitle: `Barcode-${paperType === 'roll' ? 'Roll-100x25' : 'A4'}-${grId || 'CSC'}`,
    pageStyle,
    onBeforePrint: async () => {
      setIsPrinting(true);
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
    onPrintError: (errorLocation, error) => {
      console.error('Print Error:', errorLocation, error);
      setIsPrinting(false);
    },
  });

  // Transform incoming items into structured barcode items
  const barcodeItems: (BarcodePrintItem & { status: 'NO_BARCODE' | 'NOT_PRINTED' | 'SUCCESS'; hasBarcode: boolean })[] = useMemo(() => {
    return (
      items?.map((item: any, idx: number) => {
        const code = item.product?.code || item.itemcode || item.code || '-';
        const name = item.product?.name || item.name || '-';
        const id = String(item.sequence || idx + 1).padStart(2, '0');

        // Check if barcode exists from backend or was newly added via AddBarcodeModal
        const dynamicallyAdded = addedBarcodes[code];
        const existingBarcode =
          item.product?.barcode ||
          item.barcode ||
          item.product?.primaryBarcode ||
          dynamicallyAdded;

        const hasBarcode = Boolean(existingBarcode && existingBarcode !== '-');
        const barcodeVal = existingBarcode || (code !== '-' ? code : '');

        const receivedQty = Number(item.quantities?.grReceivedQty ?? item.quantities?.received ?? item.qty ?? 1);
        const price = Number(item.pricing?.unitPrice ?? item.price ?? 0);
        const unit = item.quantities?.unitCode || item.unit || '';

        // If user entered a custom barcode quantity, use it; otherwise default to 0
        const customQty = customQuantities[id];
        const qty = customQty !== undefined
          ? (customQty === '' ? 0 : Number(customQty))
          : 0;

        // Determine Status:
        // 1. If it was already printed -> SUCCESS ('ສຳເລັດ')
        // 2. If it has barcode but not printed -> NOT_PRINTED ('ຍັງບໍ່ທັນພິມ')
        // 3. If it has no barcode -> NO_BARCODE ('ຍັງບໍ່ມີບາໂຄດ')
        let status: 'NO_BARCODE' | 'NOT_PRINTED' | 'SUCCESS' = 'NO_BARCODE';
        if (printedIds.includes(id) || item.status === 'PRINTED' || item.isPrinted) {
          status = 'SUCCESS';
        } else if (hasBarcode) {
          status = 'NOT_PRINTED';
        } else {
          status = 'NO_BARCODE';
        }

        return {
          id,
          code,
          name,
          barcode: barcodeVal || code,
          qty,
          receivedQty,
          price,
          unit,
          hasBarcode,
          status,
        };
      }) || []
    );
  }, [items, addedBarcodes, printedIds, customQuantities]);

  // Filter items based on search input and status dropdown
  const filteredItems = useMemo(() => {
    return barcodeItems.filter((item) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        item.code.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term) ||
        item.barcode.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'printed' && item.status === 'SUCCESS') ||
        (statusFilter === 'not_printed' && item.status === 'NOT_PRINTED') ||
        (statusFilter === 'no_barcode' && item.status === 'NO_BARCODE');

      return matchesSearch && matchesStatus;
    });
  }, [barcodeItems, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / limit) || 1;
  const paginatedItems = filteredItems.slice((page - 1) * limit, page * limit);

  // Toggle selection for all filtered items
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length && filteredItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id));
    }
  };

  // Toggle selection for a single item
  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Trigger printing: updates the printed status to SUCCESS ('ສຳເລັດ')
  const handlePrint = () => {
    let targets: BarcodePrintItem[] = [];

    if (selectedIds.length > 0) {
      targets = barcodeItems.filter((item) => selectedIds.includes(item.id));
    } else {
      targets = filteredItems.length > 0 ? filteredItems : barcodeItems;
    }

    // Filter to targets that have qty > 0
    const printableTargets = targets.filter((item) => (Number(item.qty) || 0) > 0);

    if (printableTargets.length === 0) {
      return;
    }

    // Mark the printed items as printed -> transitions their status to 'ສຳເລັດ'
    const newlyPrintedIds = printableTargets.map((t) => t.id);
    setPrintedIds((prev) => Array.from(new Set([...prev, ...newlyPrintedIds])));

    setActivePrintItems(printableTargets);

    // Give DOM a brief moment to render SVGs in hidden container before opening print preview
    setTimeout(() => {
      reactToPrintFn();
    }, 250);
  };

  // Render status badge matching the design in user image
  const renderBadge = (status: string) => {
    switch (status) {
      case 'NO_BARCODE':
        return (
          <span className="px-3 py-1.5 bg-[#fffaeb] text-[#b54708] text-[11px] font-bold rounded-md">
            ຍັງບໍ່ມີບາໂຄດ
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="px-3 py-1.5 bg-[#ecfdf3] text-[#027a48] text-[11px] font-bold rounded-md">
            ສຳເລັດ
          </span>
        );
      case 'NOT_PRINTED':
        return (
          <span className="px-3 py-1.5 bg-[#fef3f2] text-[#d92d20] text-[11px] font-bold rounded-md">
            ຍັງບໍ່ທັນພິມ
          </span>
        );
      default:
        return null;
    }
  };

  const printableItemsForSheet = activePrintItems.length > 0 ? activePrintItems : barcodeItems;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="bg-black/20 z-[100]" />

      <DialogContent
        showCloseButton={false}
        className="max-w-[95vw] sm:max-w-5xl lg:max-w-6xl w-full p-0 border border-gray-100 shadow-2xl rounded-2xl z-[101] bg-white gap-0 outline-none overflow-hidden"
      >
        <DialogTitle className="sr-only">ພິມບາໂຄດ</DialogTitle>
        <DialogDescription className="sr-only">Print barcode for goods receipt items</DialogDescription>

        <div className="flex flex-col h-full max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="w-10 h-10 flex shrink-0 items-center justify-center rounded-full bg-[#244195] text-white hover:bg-blue-800 transition-colors shadow-sm cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-[22px] font-black text-[#1e3a8a] tracking-tight">ປິນບາໂຄດ</h1>
                {grId && <p className="text-xs font-semibold text-gray-400 mt-0.5">ເລກທີ GR: {grId}</p>}
              </div>
            </div>

            {/* Header Right: Print Options & Print Button */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Paper Type Selector */}
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs font-bold text-gray-600">ເຈ້ຍ:</span>
                <select
                  value={paperType}
                  onChange={(e) => setPaperType(e.target.value as 'roll' | 'a4')}
                  className="bg-transparent text-xs font-bold text-[#1e3a8a] outline-none cursor-pointer"
                >
                  <option value="roll">ມ້ວນ 100x25mm (TSC)</option>
                  <option value="a4">ເຈ້ຍ A4 (Sticker Sheet)</option>
                </select>
              </div>

              {/* Columns Selector (Only shown for A4) */}
              {paperType === 'a4' && (
                <div className="hidden sm:flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                  <span className="text-xs font-bold text-gray-600">ຖັນ A4:</span>
                  <select
                    value={columns}
                    onChange={(e) => setColumns(Number(e.target.value) as 2 | 3 | 4)}
                    className="bg-transparent text-xs font-bold text-[#1e3a8a] outline-none cursor-pointer"
                  >
                    <option value={3}>3 ຖັນ (24 ປ້າຍ/A4)</option>
                    <option value={2}>2 ຖັນ (12 ປ້າຍ/A4)</option>
                    <option value={4}>4 ຖັນ (40 ປ້າຍ/A4)</option>
                  </select>
                </div>
              )}

              {/* Repeat by Received Qty Toggle */}
              <button
                type="button"
                onClick={handleToggleRepeatByQuantity}
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${repeatByQuantity
                  ? 'bg-blue-50 border-blue-300 text-[#1e3a8a]'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>ພິມຕາມຈຳນວນຮັບ</span>
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${repeatByQuantity ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'
                    }`}
                >
                  {repeatByQuantity && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                </div>
              </button>

              {/* Main Print Button */}
              <Button
                onClick={handlePrint}
                disabled={isPrinting || barcodeItems.length === 0}
                className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-lg h-10 px-6 shadow-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4" />
                {selectedIds.length > 0
                  ? `ພິມທີ່ເລືອກ (${selectedIds.length})`
                  : `ພິມທັງໝົດ (${filteredItems.length})`}
              </Button>
            </div>
          </div>

          {/* Filters: Matches exact layout from Image */}
          <div className="px-8 py-5 flex items-center justify-between bg-white">
            {/* Left: Search input */}
            <div className="relative w-[380px] sm:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="ຄົ້ນຫາ"
                className="pl-12 h-11 bg-gray-50 border-gray-100 rounded-full text-[13px] font-medium focus-visible:ring-blue-500 w-full text-gray-700 placeholder:text-gray-400 shadow-sm"
              />
            </div>

            {/* Right: Print Status Filter Dropdown */}
            <div className="flex flex-col gap-1.5 w-[220px]">
              <label className="text-[13px] font-bold text-gray-500">ສະຖານະການພິມ</label>
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 bg-blue-50/50 border-blue-100 text-[#1e3a8a] font-bold rounded-xl focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="ທັງໝົດ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ທັງໝົດ</SelectItem>
                  <SelectItem value="printed">ສຳເລັດ</SelectItem>
                  <SelectItem value="not_printed">ຍັງບໍ່ທັນພິມ</SelectItem>
                  <SelectItem value="no_barcode">ຍັງບໍ່ມີບາໂຄດ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table Container */}
          <div className="px-8 flex-1 overflow-auto pb-6">
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
                <h2 className="text-[15px] font-black text-gray-900">
                  ລາຍການຮັບສິນຄ້າ ({filteredItems.length})
                </h2>
                {selectedIds.length > 0 && (
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    ເລືອກແລ້ວ {selectedIds.length} ລາຍການ
                  </span>
                )}
              </div>

              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-100 h-12">
                    <TableHead className="w-[80px] bg-transparent text-gray-500">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={toggleSelectAll}
                          className={`w-[18px] h-[18px] rounded flex items-center justify-center cursor-pointer border-[1.5px] transition-colors ${selectedIds.length === filteredItems.length && filteredItems.length > 0
                            ? 'bg-[#2563eb] border-[#2563eb]'
                            : 'border-blue-200 bg-white hover:border-blue-400'
                            }`}
                        >
                          {selectedIds.length === filteredItems.length && filteredItems.length > 0 && (
                            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                          )}
                        </div>
                        <span className="text-gray-500 font-bold text-[13px]">ລຳດັບ</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[160px] bg-transparent text-gray-500 font-bold text-[13px]">
                      ລະຫັດສິນຄ້າ
                    </TableHead>
                    <TableHead className="w-auto bg-transparent text-gray-500 font-bold text-[13px]">
                      ຊື່ລາຍການສິນຄ້າ
                    </TableHead>
                    <TableHead className="w-[120px] bg-transparent text-gray-500 font-bold text-[13px] text-center">
                      ຈຳນວນທີ່ຮັບ
                    </TableHead>
                    <TableHead className="w-[130px] bg-transparent text-gray-500 font-bold text-[13px] text-center">
                      ສະຖານະການພິມ
                    </TableHead>
                    <TableHead className="w-[180px] bg-transparent text-gray-500 font-bold text-[13px] text-center pr-6">
                      ປ້ອນຈຳນວນບາໂຄດ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                        ບໍ່ພົບລາຍການສິນຄ້າ
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50/40 border-b border-gray-100 h-14">
                        <TableCell className="font-bold text-gray-900">
                          <div className="flex items-center gap-3">
                            <div
                              onClick={() => toggleSelect(item.id)}
                              className={`w-[18px] h-[18px] rounded flex items-center justify-center cursor-pointer border-[1.5px] transition-colors ${selectedIds.includes(item.id)
                                ? 'bg-[#2563eb] border-[#2563eb]'
                                : 'border-blue-200 bg-white hover:border-blue-400'
                                }`}
                            >
                              {selectedIds.includes(item.id) && (
                                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                              )}
                            </div>
                            <span className="text-[13px]">{item.id}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-gray-500 text-[13px] font-mono">
                          {item.code}
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900 text-[13px] whitespace-normal leading-relaxed pr-4">
                          {item.name}
                        </TableCell>
                        <TableCell className="font-bold text-gray-900 text-[13px] text-center">
                          {item.receivedQty} {item.unit && <span className="text-gray-400 font-normal text-xs">{item.unit}</span>}
                        </TableCell>
                        <TableCell className="text-center">
                          {renderBadge(item.status)}
                        </TableCell>
                        <TableCell className="text-center pr-6">
                          <div className="flex items-center justify-center gap-1.5">
                            <Input
                              type="number"
                              min={0}
                              value={customQuantities[item.id] !== undefined ? customQuantities[item.id] : ''}
                              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                              onFocus={(e) => e.target.select()}
                              className="w-16 h-9 text-center font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 text-[13px] shadow-sm placeholder:text-gray-400 placeholder:font-normal"
                              placeholder="0"
                            />
                            <span className="text-[12px] font-semibold text-gray-500 select-none">
                              ປ້າຍ
                            </span>

                            {item.status === 'NO_BARCODE' && (
                              <Button
                                onClick={() => {
                                  setSelectedProduct({ code: item.code, name: item.name, unitcode: item.unit });
                                  setIsAddBarcodeOpen(true);
                                }}
                                className="h-8 px-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] shadow-sm cursor-pointer shrink-0 ml-1"
                                title="ເພີ່ມບາໂຄດ"
                              >
                                ເພີ່ມ
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination Footer */}
          <StandardPagination
            page={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            className="rounded-b-2xl mt-auto"
          />
        </div>
      </DialogContent>

      {/* Hidden Print Container: Dedicated for react-to-print */}
      <div
        style={{
          position: 'fixed',
          left: '-99999px',
          top: 0,
          width: paperType === 'roll' ? '100mm' : '210mm',
          opacity: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <A4BarcodeSheet
          ref={printSheetRef}
          items={printableItemsForSheet}
          paperType={paperType}
          columns={columns}
          repeatByQuantity={repeatByQuantity}
          showPrice={false}
          title={grId ? `GR: ${grId}` : ''}
        />
      </div>

      <AddBarcodeModal
        isOpen={isAddBarcodeOpen}
        onClose={() => setIsAddBarcodeOpen(false)}
        product={selectedProduct}
        onSave={(data) => {
          if (data?.code && data?.barcode) {
            setAddedBarcodes((prev) => ({
              ...prev,
              [data.code]: data.barcode,
            }));
          }
        }}
      />
    </Dialog>
  );
}
