import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, ChevronDown, Loader2 } from "lucide-react";
import { SupplierDropdownItem } from "@/hooks/po-hook/useGetSuppliersDropdown";

interface FilterSectionProps {
  search: string;
  setSearch: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  apcode: string;
  setApcode: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  suppliers?: SupplierDropdownItem[];
  onSearch?: () => void;
  onDownload?: () => void;
  downloadLoading?: boolean;
}

export function FilterSection({
  search, setSearch,
  startDate, setStartDate,
  endDate, setEndDate,
  apcode, setApcode,
  status, setStatus,
  suppliers = [],
  onSearch,
  onDownload,
  downloadLoading = false,
}: FilterSectionProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Search and Download Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            placeholder="ຄົ້ນຫາ GR..." 
            className="pl-10 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && onSearch) {
                onSearch();
              }
            }}
          />
        </div>
        <Button 
          type="button"
          onClick={onDownload}
          disabled={downloadLoading}
          className="w-full sm:w-auto bg-[#1A368F] hover:bg-[#152a70] text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          {downloadLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{downloadLoading ? "ກຳລັງດາວໂຫຼດ..." : "ດາວໂຫຼດ"}</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">ວັນທີເລີ່ມ</label>
          <div className="relative">
            <Input type="date" className="w-full" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">ວັນທີສິ້ນສຸດ</label>
          <div className="relative">
            <Input type="date" className="w-full" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>


        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Supplier</label>
          <div className="relative">
            <select 
              value={apcode} 
              onChange={(e) => setApcode(e.target.value)} 
              className="flex h-9 w-full min-w-0 appearance-none rounded-sm border border-input bg-white px-3 py-1 text-sm shadow-xs transition-colors outline-none focus:border-sky-700 focus:ring-3 focus:ring-sky-500/50"
            >
              <option value="all">ທັງໝົດ</option>
              {suppliers.map((supplier: any, idx: number) => {
                const val = supplier.apcode || supplier.code || supplier.id || `unknown-${idx}`;
                const label = supplier.apname || supplier.name || val;
                return (
                  <option key={`${val}-${idx}`} value={val}>
                    {label}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none opacity-50" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">ສະຖານະ</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="ທັງໝົດ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ທັງໝົດ</SelectItem>
              <SelectItem value="RECEIVED">ຮັບແລ້ວ</SelectItem>
              <SelectItem value="CANCELLED">ຍົກເລີກ</SelectItem>
              <SelectItem value="DRAFT">ຮ່າງ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button 
            type="button" 
            onClick={onSearch}
            className="w-full bg-[#1A368F] hover:bg-[#152a70] text-white"
          >
            ຄົ້ນຫາ
          </Button>
        </div>
      </div>
    </div>
  );
}
