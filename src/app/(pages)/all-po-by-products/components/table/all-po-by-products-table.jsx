import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  LoadingSpinner,
  TableLoadingSpinner,
  Card,
  CardContent,
} from "@/components";

const AllPoByProductsTable = ({
  data,
  loading,
  error,
}) => {
  const tableHeaders = [
    { key: "ລຳດັບ" },
    { key: "ເລກທີເອກະສານ" },
    { key: "ລະຫັດສິນຄ້າ" },
    { key: "ຊື່ສິນຄ້າ" },
    { key: "ຫົວໜ່ວຍ" },
    { key: "ຈຳນວນ" },
    { key: "ລາຄາຕໍ່ຫົວໜ່ວຍ" },
    { key: "ຍອດລວມ" },
    { key: "ວັນທີເອກະສານ" },
    // { key: "ສະຖານະ" },
  ];

  // ฟังก์ชันสำหรับจัดรูปแบบวันที่
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("lo-LA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // ฟังก์ชันสำหรับจัดรูปแบบเงิน
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("lo-LA", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // ฟังก์ชันสำหรับคำนวณยอดรวม
  const calculateTotal = (quantity, unitPrice) => {
    return quantity * unitPrice;
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
    <Card className="border-red-200 bg-red-50">
      <CardContent className="pt-6">
        <p className="text-red-600">ຂໍ້ຜິດພາດ: {error}</p>
      </CardContent>
    </Card>
  );

  const NoDataState = () => (
    <TableRow>
      <TableCell colSpan={tableHeaders.length} className="text-center py-8">
        ບໍ່ພົບຂໍ້ມູນ PO ສຳລັບລະຫັດສິນຄ້ານີ້
      </TableCell>
    </TableRow>
  );

  const PoRow = ({ poItem, index }) => {
    const sequenceNumber = index + 1;

    return (
      <TableRow key={`${poItem.DOCNO}-${index}`}>
        <TableCell>{sequenceNumber}</TableCell>
        <TableCell>{poItem.DOCNO}</TableCell>
        <TableCell>{poItem.PRODUCTCODE}</TableCell>
        <TableCell>{poItem.PRODUCTNAME}</TableCell>
        <TableCell>{poItem.UNITCODE}</TableCell>
        <TableCell>{poItem.QUANTITY}</TableCell>
        <TableCell>{formatCurrency(poItem.UNITPRICE)}</TableCell>
        <TableCell>{formatCurrency(calculateTotal(poItem.QUANTITY, poItem.UNITPRICE))}</TableCell>
        <TableCell>{formatDate(poItem.DOCDATE)}</TableCell>
        {/* <TableCell>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              poItem.CLOSEFLAG === 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {poItem.CLOSEFLAG === 0 ? "🟢" : "🔴"}
          </span>
        </TableCell> */}
      </TableRow>
    );
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="w-full max-w-full overflow-hidden">
      {data && data.message && data.message.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            📋 ລາຍລະອຽດສິນຄ້າ ({data.message.length} ລາຍການ)
          </h3>
          <TableWrapper>
            {data.message.map((poItem, index) => (
              <PoRow key={`${poItem.DOCNO}-${index}`} poItem={poItem} index={index} />
            ))}
          </TableWrapper>
        </div>
      )}

      {data && data.message && data.message.length === 0 && (
        <TableWrapper>
          <NoDataState />
        </TableWrapper>
      )}
    </div>
  );
};

export default AllPoByProductsTable;