// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronDown, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StandardPagination } from '@/components/customs/StandardPagination';

const searchData = [
  { no: 1, poNumber: 'PO-2026-00310', date: '09-06-2026', creditorCode: 'SP00313', creditorName: 'ບໍລິສັດ ຈະເລີນໄຊ ການຄ້າ ຈຳກັດ', credit: 'ເງິນສົດ', deliveryDate: '30-06-2026', qty: 12, status: 'ລໍຖ້າດຳເນີນການ', statusColor: 'bg-blue-100 text-blue-700' },
  { no: 3, poNumber: 'PO-2026-00310', date: '09-06-2026', creditorCode: 'SP00313', creditorName: 'Siam Cement Group (SCG) Lao', credit: 'ເງິນສົດ', deliveryDate: '14/07/2026', qty: 12, status: 'ຮັບບາງສ່ວນ', statusColor: 'bg-pink-100 text-pink-700' },
  { no: 4, poNumber: 'PO-2026-00310', date: '09-06-2026', creditorCode: 'SP00313', creditorName: 'ບໍລິສັດ ວຽງຈັນ ຂົນສົ່ງ ຈຳກັດ', credit: 'ເງິນສົດ', deliveryDate: '13/07/2026', qty: 12, status: 'ລໍຖ້າດຳເນີນການ', statusColor: 'bg-blue-100 text-blue-700' },
];

export function SearchPoSection() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const totalPages = Math.ceil(searchData.length / limit) || 1;
  return (
    <div className="flex flex-col gap-6">
      {/* Search Bar */}
      <div className="relative w-full md:w-1/2">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input 
          className="pl-10 h-12 bg-gray-100/80 border-transparent rounded-full focus-visible:ring-1 focus-visible:ring-gray-300" 
          placeholder="ຄົ້ນຫາ PO..." 
        />
      </div>

      {/* Filter Card */}
      <Card className="shadow-sm border-gray-200/60 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-end gap-4">
            <div className="w-full lg:flex-1">
              <label className="text-sm font-semibold text-gray-500 mb-1.5 block">ວັນທີເລີ່ມ</label>
              <div className="relative">
                <Input type="text" value="01/07/2026" readOnly className="bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg" />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1f3a8a]" />
              </div>
            </div>
            
            <div className="w-full lg:flex-1">
              <label className="text-sm font-semibold text-gray-500 mb-1.5 block">ວັນທີສິ້ນສຸດ</label>
              <div className="relative">
                <Input type="text" value="31/07/2026" readOnly className="bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg" />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1f3a8a]" />
              </div>
            </div>

            <div className="w-full lg:flex-1">
              <label className="text-sm font-semibold text-gray-500 mb-1.5 block">Supplier</label>
              <div className="relative">
                <Input type="text" value="ທັງໝົດ" readOnly className="bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg cursor-pointer" />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1f3a8a]" />
              </div>
            </div>

            <div className="w-full lg:flex-1">
              <label className="text-sm font-semibold text-gray-500 mb-1.5 block">ສະຖານະ</label>
              <div className="relative">
                <Input type="text" value="ທັງໝົດ" readOnly className="bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg cursor-pointer" />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1f3a8a]" />
              </div>
            </div>

            <Button className="h-11 px-8 bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-lg">
              ຄົ້ນຫາ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="shadow-sm border-gray-200/60 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#1e3a8a] hover:bg-[#1e3a8a]">
                <TableHead className="text-white bg-transparent h-12 text-center w-[60px]">ລຳດັບ</TableHead>
                <TableHead className="text-white bg-transparent">ລະຫັດ PO</TableHead>
                <TableHead className="text-white bg-transparent">ວັນທີ</TableHead>
                <TableHead className="text-white bg-transparent">ລະຫັດເຈົ້າໜີ້</TableHead>
                <TableHead className="text-white bg-transparent">ຊື່ເຈົ້າໜີ້</TableHead>
                <TableHead className="text-white bg-transparent text-center">ເຄຣດິດ</TableHead>
                <TableHead className="text-white bg-transparent text-center">ກຳນົດສົ່ງມອບ</TableHead>
                <TableHead className="text-white bg-transparent text-center">ຈຳນວນສິນຄ້າ</TableHead>
                <TableHead className="text-white bg-transparent text-center">ສະຖານະ</TableHead>
                <TableHead className="text-white bg-transparent text-center w-[80px]">ຈັດການ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchData.map((row, idx) => (
                <TableRow key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <TableCell className="text-center text-gray-500">{row.no}</TableCell>
                  <TableCell className="font-semibold text-gray-900">{row.poNumber}</TableCell>
                  <TableCell className="text-gray-500">{row.date}</TableCell>
                  <TableCell className="text-gray-500">{row.creditorCode}</TableCell>
                  <TableCell className="text-gray-500">{row.creditorName}</TableCell>
                  <TableCell className="text-center text-gray-500">{row.credit}</TableCell>
                  <TableCell className="text-center text-gray-500">{row.deliveryDate}</TableCell>
                  <TableCell className="text-center text-gray-500">{row.qty}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm" className="h-8 border-gray-200">ເບິ່ງ</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
          />
        </CardContent>
      </Card>
    </div>
  );
}
