'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Calendar as CalendarIcon, User, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCreateGr } from '@/hooks/gr-hook/useCreateGr';
import { useGetPoDropdown, PoDropdownItem } from '@/hooks/po-hook/useGetPoDropdown';
import { usePoDetail } from '@/hooks/po-hook/usePoDetail';

interface CreateGoodsReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  poNumber: string;
  poData?: any;
  hidePoSearch?: boolean;
}

export function CreateGoodsReceiptModal({ isOpen, onClose, poNumber, poData, hidePoSearch }: CreateGoodsReceiptModalProps) {
  const router = useRouter();
  const { createGr, loading, error } = useCreateGr();
  const { fetchPoDetail } = usePoDetail();

  const [apname, setApname] = useState("");
  const [docgroup, setDocgroup] = useState("");
  const [apcode, setApcode] = useState("");

  const [creditcode, setCreditcode] = useState("");
  const [createdate, setCreatedate] = useState(new Date().toISOString().split('T')[0]);
  const [taxtype, setTaxtype] = useState("");

  const [shipcode, setShipcode] = useState("");
  const [vehicleRegistration, setVehicleRegistration] = useState("");
  const [driverName, setDriverName] = useState("");
  const [remark, setRemark] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isPoDropdownOpen, setIsPoDropdownOpen] = useState(false);
  
  const [localPoData, setLocalPoData] = useState<any>(null);

  // PO Search state
  const [poSearchText, setPoSearchText] = useState(poNumber || "");
  const [selectedPoNumber, setSelectedPoNumber] = useState(poNumber || "");
  
  const { fetchPoDropdown, data: poList, loading: poLoading } = useGetPoDropdown();

  // Fetch PO Dropdown data on mount and when searching
  useEffect(() => {
    if (!hidePoSearch) {
      const delayDebounceFn = setTimeout(() => {
        fetchPoDropdown({ search: poSearchText, limit: 50 });
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [poSearchText, hidePoSearch, fetchPoDropdown]);

  useEffect(() => {
    if (isOpen) {
      if (poData) {
        setLocalPoData(poData);
        if (poData?.supplier?.apname) setApname(poData.supplier.apname);
        if (poData?.supplier?.apcode) setApcode(poData.supplier.apcode);
        if (poData?.grDefaults?.creditcode || poData?.creditTerm?.code) setCreditcode(poData?.grDefaults?.creditcode || poData?.creditTerm?.code);
        if (poData?.grDefaults?.docgroup) setDocgroup(String(poData.grDefaults.docgroup));
        if (poData?.grDefaults?.taxtype !== undefined) setTaxtype(String(poData.grDefaults.taxtype));
        if (poData?.grDefaults?.shipcode) setShipcode(String(poData.grDefaults.shipcode));
      }
      
      // Reset state if this is the search PO variant and no poData was passed
      if (!hidePoSearch && !poData) {
        setLocalPoData(null);
        setPoSearchText(poNumber || "");
        setSelectedPoNumber(poNumber || "");
        setApname("");
        setApcode("");
        setDocgroup("");
        setCreditcode("");
        setShipcode("");
      }
    }
  }, [isOpen, poData, hidePoSearch, poNumber]);

  const handleSubmit = async () => {
    const payload = {
      pocode: hidePoSearch ? poNumber : selectedPoNumber,
      createdate,
      apcode,
      apname,
      creditcode,
      docgroup,
      taxtype: Number(taxtype),
      shipcode,
      vehicleRegistration,
      driverName,
      remark
    };

    const result = await createGr(payload);

    // Proceed to next page with grid in query params
    if (result.success) {
      const grid = result.data?.document?.grid || result.data?.grid;
      const finalPoNumber = hidePoSearch ? poNumber : selectedPoNumber;
      router.push(`/search_po/${finalPoNumber}/create?grid=${grid}`);
    } else {
      setErrorMessage(result.error?.message || "ບໍ່ສາມາດສ້າງໄດ້");
      setIsErrorOpen(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        {/* We use a custom overlay to make sure it covers the whole screen and has the blurred effect */}
        <DialogOverlay className="bg-white/70 backdrop-blur-sm z-[100]" />

        {/* 
        We override some default DialogContent styles to make it look like a full page/large modal
        with a white card in the center. We hide the default close button using showCloseButton={false} 
        since our modified dialog supports it, or just use custom styling to hide it.
      */}
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-4xl w-[95vw] p-0 border border-gray-200/50 shadow-2xl rounded-2xl z-[101] bg-white gap-0 overflow-hidden outline-none"
        >
          <DialogTitle className="sr-only">ສ້າງໃບຮັບສິນຄ້າ</DialogTitle>
          <DialogDescription className="sr-only">ແບບຟອມສຳລັບສ້າງໃບຮັບສິນຄ້າໃໝ່</DialogDescription>

          {/* Modal Header */}
          <div className="flex items-center gap-4 px-8 pt-6 pb-2">
            <button
              onClick={onClose}
              className="w-10 h-10 flex shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1e3a8a] hover:bg-blue-100 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-[#1e3a8a]">ສ້າງໃບຮັບສິນຄ້າ</h1>
          </div>

          {/* Modal Body */}
          <div className="px-8 pb-6 pt-2 flex flex-col gap-6 relative z-10">

            {/* Section 1: Supplier Info */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-black text-[#1e3a8a] tracking-wide">
                ຂໍ້ມູນຜູ້ສະໜອງ
              </h3>
              
              {hidePoSearch ? (
                // Layout for "ຄົ້ນຫາ PO" page (without PO search)
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">ຊື່ເຈົ້າໜີ້</label>
                    <Input
                      value={apname}
                      onChange={(e) => setApname(e.target.value)}
                      className="h-11 bg-gray-50/50 border-gray-200 text-gray-500 font-medium rounded-xl shadow-sm"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">ກຸ່ມຂໍ້ມູນ</label>
                    <Select value={docgroup} onValueChange={setDocgroup}>
                      <SelectTrigger className="h-11 bg-gray-50/50 border-gray-200 text-gray-900 font-bold rounded-xl shadow-sm">
                        <SelectValue placeholder="ເລືອກ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gr">ຮັບສິນຄ້າ GR</SelectItem>
                        {localPoData?.grDefaults?.docgroup && localPoData.grDefaults.docgroup !== "gr" && (
                          <SelectItem value={String(localPoData.grDefaults.docgroup)}>ຮັບສິນຄ້າ GR ({localPoData.grDefaults.docgroup})</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2 col-span-2">
                    <label className="text-sm font-bold text-gray-700">ລະຫັດເຈົ້າໜີ້</label>
                    <div className="relative">
                      <Input
                        value={apcode}
                        onChange={(e) => setApcode(e.target.value)}
                        className="h-11 bg-gray-50/50 border-gray-200 text-gray-900 font-bold pr-10 rounded-xl shadow-sm"
                      />
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3b82f6]" />
                    </div>
                  </div>
                </div>
              ) : (
                // Layout for "ຮັບສິນຄ້າ" page (with PO search)
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <div className="flex flex-col gap-2 relative">
                    <label className="text-sm font-bold text-gray-700">ລະຫັດ PO</label>
                    <div className="relative">
                      <Input 
                        placeholder="ຄົ້ນຫາ PO..."
                        value={poSearchText}
                        onChange={(e) => {
                          setPoSearchText(e.target.value);
                          setIsPoDropdownOpen(true);
                        }}
                        onFocus={() => setIsPoDropdownOpen(true)}
                        onBlur={() => {
                          // Delay closing to allow onClick on dropdown items to fire first
                          setTimeout(() => setIsPoDropdownOpen(false), 200);
                        }}
                        className="h-11 bg-white border-blue-200 text-gray-900 pr-10 rounded-xl shadow-sm focus-visible:ring-blue-500" 
                      />
                      <button 
                        type="button"
                        onClick={() => setIsPoDropdownOpen(!isPoDropdownOpen)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <Search className="w-5 h-5 text-[#2563eb]" />
                      </button>
                    </div>
                    
                    {/* Dropdown for PO Search */}
                    {isPoDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-50 flex flex-col overflow-hidden max-h-60 overflow-y-auto">
                        {poLoading ? (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">ກຳລັງໂຫຼດ...</div>
                        ) : poList.length > 0 ? (
                          poList.map((po: PoDropdownItem) => (
                            <div 
                              key={po.docno} 
                              className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 flex flex-col gap-1"
                              onClick={async () => {
                                setPoSearchText(po.docno);
                                setSelectedPoNumber(po.docno);
                                setApname(po.apname || "");
                                setIsPoDropdownOpen(false);

                                const result = await fetchPoDetail({ docno: po.docno });
                                if (result.success && result.data?.header) {
                                  const fetchedPoData = result.data.header;
                                  setLocalPoData(fetchedPoData);
                                  if (fetchedPoData?.supplier?.apname) setApname(fetchedPoData.supplier.apname);
                                  if (fetchedPoData?.supplier?.apcode) setApcode(fetchedPoData.supplier.apcode);
                                  if (fetchedPoData?.grDefaults?.creditcode || fetchedPoData?.creditTerm?.code) setCreditcode(fetchedPoData?.grDefaults?.creditcode || fetchedPoData?.creditTerm?.code);
                                  if (fetchedPoData?.grDefaults?.docgroup) setDocgroup(String(fetchedPoData.grDefaults.docgroup));
                                  if (fetchedPoData?.grDefaults?.taxtype !== undefined) setTaxtype(String(fetchedPoData.grDefaults.taxtype));
                                  if (fetchedPoData?.grDefaults?.shipcode) setShipcode(String(fetchedPoData.grDefaults.shipcode));
                                }
                              }}
                            >
                              <span className="font-bold text-[#1e3a8a]">{po.docno}</span>
                              <span className="text-xs text-gray-500">{po.apname}</span>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">ບໍ່ພົບຂໍ້ມູນ</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">ລະຫັດເຈົ້າໜີ້</label>
                    <div className="relative">
                      <Input
                        value={apcode}
                        onChange={(e) => setApcode(e.target.value)}
                        className="h-11 bg-gray-50/50 border-gray-200 text-gray-900 font-bold pr-10 rounded-xl shadow-sm"
                      />
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3b82f6]" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">ຊື່ເຈົ້າໜີ້</label>
                    <Input
                      value={apname}
                      onChange={(e) => setApname(e.target.value)}
                      className="h-11 bg-gray-50/50 border-gray-200 text-gray-500 font-medium rounded-xl shadow-sm"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">ກຸ່ມຂໍ້ມູນ</label>
                    <Select value={docgroup} onValueChange={setDocgroup}>
                      <SelectTrigger className="h-11 bg-gray-50/50 border-gray-200 text-gray-900 font-bold rounded-xl shadow-sm">
                        <SelectValue placeholder="ເລືອກ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gr">ຮັບສິນຄ້າ GR</SelectItem>
                        {localPoData?.grDefaults?.docgroup && localPoData.grDefaults.docgroup !== "gr" && (
                          <SelectItem value={String(localPoData.grDefaults.docgroup)}>ຮັບສິນຄ້າ GR ({localPoData.grDefaults.docgroup})</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-100 w-full my-2" />

            {/* Section 2: Conditions */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-black text-[#1e3a8a] tracking-wide">
                ເງື່ອນໄຂ
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">ເຄດິດ</label>
                  <Select value={creditcode} onValueChange={setCreditcode}>
                    <SelectTrigger className="h-11 bg-gray-50/50 border-gray-200 text-gray-900 font-bold rounded-xl shadow-sm">
                      <SelectValue placeholder="ເລືອກ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">ເຄດິດ 7 ວັນ</SelectItem>
                      {localPoData?.creditTerm?.code && localPoData.creditTerm.code !== "7days" && (
                        <SelectItem value={localPoData.creditTerm.code}>{localPoData.creditTerm.shortName || localPoData.creditTerm.nameTh || localPoData.creditTerm.code}</SelectItem>
                      )}
                      {localPoData?.grDefaults?.creditcode && localPoData.grDefaults.creditcode !== localPoData?.creditTerm?.code && localPoData.grDefaults.creditcode !== "7days" && (
                        <SelectItem value={localPoData.grDefaults.creditcode}>{localPoData.grDefaults.creditcode}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">ວັນທີຮັບ</label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={createdate}
                      onChange={(e) => setCreatedate(e.target.value)}
                      className="h-11 bg-gray-50/50 border-gray-200 text-gray-900 font-bold pr-10 rounded-xl shadow-sm [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer relative z-10"
                    />
                    <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3b82f6] pointer-events-none z-0" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">ປະເພດລາຄາ</label>
                  <Select value={taxtype} onValueChange={setTaxtype}>
                    <SelectTrigger className="h-11 bg-gray-50/50 border-gray-200 text-gray-900 font-bold rounded-xl shadow-sm">
                      <SelectValue placeholder="ເລືອກ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">ພາສີສູນ</SelectItem>
                      <SelectItem value="1">ພາສີມູນຄ່າເພີ່ມ 7%</SelectItem>
                      <SelectItem value="2">ພາສີມູນຄ່າເພີ່ມ 10%</SelectItem>
                      {localPoData?.grDefaults?.taxtype !== undefined && !["0", "1", "2"].includes(String(localPoData.grDefaults.taxtype)) && (
                        <SelectItem value={String(localPoData.grDefaults.taxtype)}>ປະເພດ {localPoData.grDefaults.taxtype}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full my-2" />

            {/* Section 3: Delivery Info */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-black text-[#1e3a8a] tracking-wide">
                ຂໍ້ມູນການຈັດສົ່ງ
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">ການສົ່ງມອບ</label>
                  <Select value={shipcode} onValueChange={setShipcode}>
                    <SelectTrigger className="h-11 bg-white border-gray-200 text-gray-600 font-medium rounded-xl shadow-sm">
                      <SelectValue placeholder="ເລືອກ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">ຮັບເອງ</SelectItem>
                      {localPoData?.grDefaults?.shipcode && localPoData.grDefaults.shipcode !== "self" && (
                        <SelectItem value={String(localPoData.grDefaults.shipcode)}>{localPoData.grDefaults.shipcode}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">ເລກທະບຽນລົດ</label>
                  <Input
                    value={vehicleRegistration}
                    onChange={(e) => setVehicleRegistration(e.target.value)}
                    placeholder="ເພີ່ມເລກທະບຽນລົດ..."
                    className="h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">ພະນັກງານຮັບ</label>
                  <Input
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="ເພີ່ມພະນັກງານຮັບ..."
                    className="h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">ໝາຍເຫດ</label>
                  <Input
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="ເພີ່ມໝາຍເຫດ"
                    className="h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 pt-4 mt-auto">
              <Button variant="outline" onClick={onClose} className="h-10 px-8 rounded-[10px] border-[#2563eb] text-[#2563eb] hover:bg-blue-50 font-bold shadow-sm">
                ຍົກເລີກ
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="h-10 px-10 rounded-[10px] bg-[#244195] hover:bg-[#1e3a8a] text-white font-bold shadow-sm"
              >
                {loading ? "ກຳລັງບັນທຶກ..." : "ຕໍ່ໄປ"}
              </Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isErrorOpen} onOpenChange={setIsErrorOpen}>
        <AlertDialogContent className="z-[200]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">ເກີດຂໍ້ຜິດພາດ</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-700 font-medium">
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsErrorOpen(false)} className="bg-[#244195] hover:bg-[#1e3a8a] text-white">
              ປິດ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
