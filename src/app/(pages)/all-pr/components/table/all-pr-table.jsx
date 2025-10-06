import React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  LoadingSpinner,
  TableLoadingSpinner,
  Button,
} from "@/components";

import AllPrPagination from "./all-pr-pagination";

const AllPrTable = ({
  po,
  loading,
  error,
  currentPage,
  totalPages,
  totalItems,
  isClient,
  onPageChange,
}) => {
  const router = useRouter();

  const handleDocNoClick = (docNo) => {
    if (docNo && docNo !== "-") {
      router.push(`/all-pr-by-docno?docNo=${encodeURIComponent(docNo)}`);
    }
  };

  const tableHeaders = [
    { key: "ລຳດັບ" },
    { key: "ລະຫັດສິນຄ້າ" },
    { key: "ຄັງສິນຄ້າ" },
    { key: "ວັນທີເອກະສານ" },
    { key: "ວັນທີຕ້ອງການ" },
  ];

  // ฟังก์ชันสำหรับจัดรูปแบบวันที่
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("lo-LA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // ฟังก์ชันสำหรับจัดรูปแบบเงิน
  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("lo-LA", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const TableWrapper = ({ children }) => (
    <div className="w-full max-w-full overflow-hidden">
      <div className="w-full overflow-x-auto">
        <div className="min-w-max">
          <Table>
            <TableHeader>
              <TableRow>
                {tableHeaders.map((header, index) => (
                  <TableHead
                    key={index}
                    className={`font-semibold ${header.width} whitespace-nowrap`}
                  >
                    {header.key}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>{children}</TableBody>
          </Table>
        </div>
      </div>
    </div>
  );

  const LoadingState = () => (
    <TableWrapper>
      <TableLoadingSpinner colSpan={tableHeaders.length} />
    </TableWrapper>
  );

  const ErrorState = () => (
    <div className="w-full max-w-full overflow-hidden">
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <div className="text-lg text-red-500">ເກີດຂໍ້ຜິດພາດ: {error}</div>
        </div>
      </div>
    </div>
  );

  const ClientLoadingState = () => (
    <div className="w-full max-w-full overflow-hidden">
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner text="ກຳລັງໂຫຼດຂໍ້ມູນ..." size="xl" />
      </div>
    </div>
  );

  const NoDataState = () => (
    <TableRow>
      <TableCell colSpan={tableHeaders.length} className="text-center py-8">
        ບໍ່ພົບຂໍ້ມູນຂໍສິນຄ້າ
      </TableCell>
    </TableRow>
  );

  const PRRow = ({ prItem, index }) => {
    const sequenceNumber = (currentPage - 1) * 12 + index + 1;

    // ฟังก์ชันสำหรับจัดรูปแบบข้อมูล
    const formatValue = (key, value) => {
      if (value === null || value === undefined) return "-";
      if (value === "") return "-";

      // จัดรูปแบบวันที่
      if (
        key.includes("DATE") ||
        key.includes("CREATE") ||
        key.includes("UPDATE")
      ) {
        return formatDate(value);
      }

      // จัดรูปแบบเงิน
      if (
        key.includes("AMOUNT") ||
        key.includes("PRICE") ||
        key.includes("RATE")
      ) {
        return formatCurrency(value);
      }

      // จัดรูปแบบ boolean/flag
      if (key.includes("FLAG") || key === "CONFIRMAUTO" || key === "CANPRINT") {
        return value === 1 || value === true ? "ใช่" : "ไม่";
      }

      return value.toString();
    };

    return (
      <TableRow key={`${prItem.DOCNO}-${index}`}>
        <TableCell>{sequenceNumber}</TableCell>
        <TableCell>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDocNoClick(prItem.DOCNO)}
            className="text-sky-600 border-sky-300 hover:bg-sky-400 hover:text-white"
          >
            {prItem.DOCNO}
          </Button>
        </TableCell>
        <TableCell>{prItem.WAREHOUSE}</TableCell>
        <TableCell>{formatValue("DOCDATE", prItem.DOCDATE)}</TableCell>
        <TableCell>{formatValue("WANTDATE", prItem.WANTDATE)}</TableCell>
      </TableRow>
    );
  };

  // Render states
  if (!isClient) return <LoadingState />;
  if (loading) return <ClientLoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="w-full max-w-full overflow-hidden">
      <TableWrapper>
        {po.length > 0 ? (
          po.map((poItem, index) => (
            <PRRow key={`${poItem.DOCNO}-${index}`} prItem={poItem} index={index} />
          ))
        ) : (
          <NoDataState />
        )}
      </TableWrapper>

      <AllPrPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        isClient={isClient}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default AllPrTable;
