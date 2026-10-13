// @ts-nocheck
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserItem } from "./mockData";
import { Button } from "@/components/ui/button";
import { StandardPagination } from "@/components/customs/StandardPagination";

export function UserTable({ data }: { data: UserItem[] }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const totalPages = Math.ceil(data.length / limit) || 1;
  const paginatedData = data.slice((page - 1) * limit, page * limit);
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-[#2a45a8] hover:bg-[#2a45a8]">
              <TableHead className="text-white font-medium py-4 text-center w-[80px]">ລຳດັບ</TableHead>
              <TableHead className="text-white font-medium w-[250px]">ຊື່</TableHead>
              <TableHead className="text-white font-medium w-[200px]">ບົດບາດ</TableHead>
              <TableHead className="text-white font-medium w-[150px]">ພະແນກ</TableHead>
              <TableHead className="text-white font-medium w-[150px]">ສະຖານະ</TableHead>
              <TableHead className="text-white font-medium w-[150px]">ຈັດການ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((user, idx) => (
              <TableRow key={user.id} className="hover:bg-gray-50 border-b border-gray-100">
                <TableCell className="text-center text-gray-500 py-4">{(page - 1) * limit + idx + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${user.avatarBgColor}`}>
                      {user.avatarInitials}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{user.fullName}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">{user.role}</TableCell>
                <TableCell className="font-semibold text-gray-900">{user.department}</TableCell>
                <TableCell>
                  {user.isActive ? (
                    <div className="flex items-center gap-1.5 text-green-600 font-medium text-sm">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      ໃຊ້ງານ
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-gray-500 font-medium text-sm">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      ປິດໃຊ້ງານ
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 px-4 border-[#3b82f6] text-[#3b82f6] hover:bg-blue-50 bg-white">
                      ແກ້ໄຂ
                    </Button>
                    <Button className="h-8 px-4 bg-red-500 hover:bg-red-600 text-white border-transparent">
                      ລຶບ
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
      />
    </div>
  );
}
