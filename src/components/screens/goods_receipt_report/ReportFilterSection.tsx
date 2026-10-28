import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export interface ReportFilters {
  startDate: string;
  endDate: string;
  apcode: string;
  status?: string;
}

interface ReportFilterSectionProps {
  filters: ReportFilters;
  setFilters: React.Dispatch<React.SetStateAction<ReportFilters>>;
  onSearch: () => void;
  loading?: boolean;
  suppliers?: any[];
}

export function ReportFilterSection({ filters, setFilters, onSearch, loading, suppliers = [] }: ReportFilterSectionProps) {
  return (
    <Card className="shadow-sm border-gray-200/60 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="w-full md:flex-1">
            <label className="text-sm font-semibold text-gray-500 mb-1.5 block">ວັນທີເລີ່ມ</label>
            <Input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg block w-full" 
            />
          </div>
          
          <div className="w-full md:flex-1">
            <label className="text-sm font-semibold text-gray-500 mb-1.5 block">ວັນທີສິ້ນສຸດ</label>
            <Input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg block w-full" 
            />
          </div>

          <div className="w-full md:flex-1">
            <label className="text-sm font-semibold text-gray-500 mb-1.5 block">ຊື່ບໍລິສັດ</label>
            <div className="relative">
              <select 
                className="appearance-none w-full bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg px-3 outline-none focus-visible:ring-1 focus-visible:ring-gray-300"
                value={filters.apcode}
                onChange={(e) => setFilters(prev => ({ ...prev, apcode: e.target.value }))}
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
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1f3a8a] pointer-events-none" />
            </div>
          </div>

          <Button 
            onClick={onSearch}
            disabled={loading}
            className="h-11 px-8 bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-lg disabled:opacity-50"
          >
            ຄົ້ນຫາ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
