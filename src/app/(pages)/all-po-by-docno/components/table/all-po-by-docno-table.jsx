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
} from "@/components";

import AllPoPagination from "../../../all-po/components/table/all-po-pagination";

const AllPoByDocNoTable = ({
  poByDocNo,
  loading,
  error,
  currentPage,
  totalPages,
  totalItems,
  isClient,
  hasLoaded,
  onPageChange,
}) => {
  const tableHeaders = [
    { key: "ລຳດັບ" },
    { key: "ລະຫັດສິນຄ້າ (ໄທ)" },
    { key: "ຊື່ສິນຄ້າ (ໄທ)" },
    { key: "ຫົວໜ່ວຍ (ໄທ)" },
    { key: "ຈຳນວນ" },
    { key: "ລາຄາຕໍ່ຫົວໜ່ວຍ" },
    { key: "ຈຳນວນຄົງເຫຼືອ" },
    { key: "ຈຳນວນອ້າງອີງ" },
    { key: "ລະຫັດສິນຄ້າ (ລາວ)" },
    { key: "ຊື່ສິນຄ້າ (ລາວ)" },
    { key: "ຫົວໜ່ວຍ (ລາວ)" },
    { key: "ສະຕ໋ອກຕໍ່າສຸດ" },
    { key: "ຈຳນວນ" },
    { key: "ຈຳນວນ 1" },
    { key: "ຈຳນວນ 2" },
    { key: "ຈຳນວນສັ່ງຊື້ 1" },
    { key: "ລາຄາສັ່ງຊື້ 1" },
    { key: "ວັນທີສັ່ງຊື້ 1" },
    { key: "ຈຳນວນສັ່ງຊື້ 2" },
    { key: "ລາຄາສັ່ງຊື້ 2" },
    { key: "ວັນທີສັ່ງຊື້ 2" },
    { key: "ຈຳນວນສັ່ງຊື້ 3" },
    { key: "ລາຄາສັ່ງຊື້ 3" },
    { key: "ວັນທີສັ່ງຊື້ 3" },
    { key: "ຈຳນວນສັ່ງຊື້ 4" },
    { key: "ລາຄາສັ່ງຊື້ 4" },
    { key: "ວັນທີສັ່ງຊື້ 4" },
    { key: "ຈຳນວນສັ່ງຊື້ 5" },
    { key: "ລາຄາສັ່ງຊື້ 5" },
    { key: "ວັນທີສັ່ງຊື້ 5" },
    { key: "ຈຳນວນສັ່ງຊື້ 6" },
    { key: "ລາຄາສັ່ງຊື້ 6" },
    { key: "ວັນທີສັ່ງຊື້ 6" },
    { key: "ຈຳນວນສັ່ງຊື້ 7" },
    { key: "ລາຄາສັ່ງຊື້ 7" },
    { key: "ວັນທີສັ່ງຊື້ 7" },
    { key: "ຈຳນວນສັ່ງຊື້ 8" },
    { key: "ລາຄາສັ່ງຊື້ 8" },
    { key: "ວັນທີສັ່ງຊື້ 8" },
    { key: "ຈຳນວນສັ່ງຊື້ 9" },
    { key: "ລາຄາສັ່ງຊື້ 9" },
    { key: "ວັນທີສັ່ງຊື້ 9" },
    { key: "ຈຳນວນສັ່ງຊື້ 10" },
    { key: "ລາຄາສັ່ງຊື້ 10" },
    { key: "ວັນທີສັ່ງຊື້ 10" },
    { key: "ຈຳນວນສັ່ງຊື້ 11" },
    { key: "ລາຄາສັ່ງຊື້ 11" },
    { key: "ວັນທີສັ່ງຊື້ 11" },
    { key: "ຈຳນວນສັ່ງຊື້ 12" },
    { key: "ລາຄາສັ່ງຊື້ 12" },
    { key: "ວັນທີສັ່ງຊື້ 12" },
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
          <div>
            <p className="text-lg text-red-500">ເກີດຂໍ້ຜິດພາດ</p>
            <p className="text-sm text-red-500 mt-2">
              ກາລຸນາຕິດຕໍ່ຝ່າຍດູແລລະບົບ ເພື່ອແກ້ໄຂບັນຫາ
            </p>
            {/* <p className="text-sm text-red-500">{error}</p> */}
          </div>
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
        ບໍ່ພົບຂໍ້ມູນສິນຄ້າໃນເອກະສານນີ້
      </TableCell>
    </TableRow>
  );

  const PORow = ({ poItem, index }) => {
    const sequenceNumber = (currentPage - 1) * 12 + index + 1;

    // ฟังก์ชันสำหรับจัดรูปแบบข้อมูล
    const formatValue = (key, value) => {
      if (value === null || value === undefined) return "-";
      if (value === "") return "-";

      // จัดรูปแบบวันที่
      if (key.includes("date")) {
        return formatDate(value);
      }

      // จัดรูปแบบเงิน
      if (key.includes("price")) {
        return formatCurrency(value);
      }

      return value.toString();
    };

    return (
      <TableRow key={poItem.PRODUCTCODE || index}>
        <TableCell>{sequenceNumber}</TableCell>
        <TableCell>{formatValue("PRODUCTCODE", poItem.PRODUCTCODE)}</TableCell>
        <TableCell>{formatValue("PRODUCTNAME", poItem.PRODUCTNAME)}</TableCell>
        <TableCell>{formatValue("UNITCODE", poItem.UNITCODE)}</TableCell>
        <TableCell>{formatValue("QUANTITY", poItem.QUANTITY)}</TableCell>
        <TableCell>{formatValue("UNITPRICE", poItem.UNITPRICE)}</TableCell>
        <TableCell>{formatValue("REMAINQTY", poItem.REMAINQTY)}</TableCell>
        <TableCell>{formatValue("REFQTY", poItem.REFQTY)}</TableCell>
        <TableCell>
          {formatValue("PRODUCTCODELA", poItem.PRODUCTCODELA)}
        </TableCell>
        <TableCell>
          {formatValue("PRODUCTNAMELA", poItem.PRODUCTNAMELA)}
        </TableCell>
        <TableCell>{formatValue("UNITCODELA", poItem.UNITCODELA)}</TableCell>
        <TableCell>{formatValue("MINSTOCK", poItem.MINSTOCK)}</TableCell>
        <TableCell>{formatValue("QTY", poItem.QTY)}</TableCell>
        <TableCell>{formatValue("QTY1", poItem.QTY1)}</TableCell>
        <TableCell>{formatValue("QTY2", poItem.QTY2)}</TableCell>
        <TableCell>{formatValue("qtytop1", poItem.qtytop1)}</TableCell>
        <TableCell>{formatValue("pricetop1", poItem.pricetop1)}</TableCell>
        <TableCell>{formatValue("datetop1", poItem.datetop1)}</TableCell>
        <TableCell>{formatValue("qtytop2", poItem.qtytop2)}</TableCell>
        <TableCell>{formatValue("pricetop2", poItem.pricetop2)}</TableCell>
        <TableCell>{formatValue("datetop2", poItem.datetop2)}</TableCell>
        <TableCell>{formatValue("qtytop3", poItem.qtytop3)}</TableCell>
        <TableCell>{formatValue("pricetop3", poItem.pricetop3)}</TableCell>
        <TableCell>{formatValue("datetop3", poItem.datetop3)}</TableCell>
        <TableCell>{formatValue("qtytop4", poItem.qtytop4)}</TableCell>
        <TableCell>{formatValue("pricetop4", poItem.pricetop4)}</TableCell>
        <TableCell>{formatValue("datetop4", poItem.datetop4)}</TableCell>
        <TableCell>{formatValue("qtytop5", poItem.qtytop5)}</TableCell>
        <TableCell>{formatValue("pricetop5", poItem.pricetop5)}</TableCell>
        <TableCell>{formatValue("datetop5", poItem.datetop5)}</TableCell>
        <TableCell>{formatValue("qtytop6", poItem.qtytop6)}</TableCell>
        <TableCell>{formatValue("pricetop6", poItem.pricetop6)}</TableCell>
        <TableCell>{formatValue("datetop6", poItem.datetop6)}</TableCell>
        <TableCell>{formatValue("qtytop7", poItem.qtytop7)}</TableCell>
        <TableCell>{formatValue("pricetop7", poItem.pricetop7)}</TableCell>
        <TableCell>{formatValue("datetop7", poItem.datetop7)}</TableCell>
        <TableCell>{formatValue("qtytop8", poItem.qtytop8)}</TableCell>
        <TableCell>{formatValue("pricetop8", poItem.pricetop8)}</TableCell>
        <TableCell>{formatValue("datetop8", poItem.datetop8)}</TableCell>
        <TableCell>{formatValue("qtytop9", poItem.qtytop9)}</TableCell>
        <TableCell>{formatValue("pricetop9", poItem.pricetop9)}</TableCell>
        <TableCell>{formatValue("datetop9", poItem.datetop9)}</TableCell>
        <TableCell>{formatValue("qtytop10", poItem.qtytop10)}</TableCell>
        <TableCell>{formatValue("pricetop10", poItem.pricetop10)}</TableCell>
        <TableCell>{formatValue("datetop10", poItem.datetop10)}</TableCell>
        <TableCell>{formatValue("qtytop11", poItem.qtytop11)}</TableCell>
        <TableCell>{formatValue("pricetop11", poItem.pricetop11)}</TableCell>
        <TableCell>{formatValue("datetop11", poItem.datetop11)}</TableCell>
        <TableCell>{formatValue("qtytop12", poItem.qtytop12)}</TableCell>
        <TableCell>{formatValue("pricetop12", poItem.pricetop12)}</TableCell>
        <TableCell>{formatValue("datetop12", poItem.datetop12)}</TableCell>
      </TableRow>
    );
  };

  // Render states
  if (!isClient || loading || !hasLoaded) return <ClientLoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="w-full max-w-full overflow-hidden">
      <TableWrapper>
        {poByDocNo.length > 0 ? (
          poByDocNo.map((poItem, index) => (
            <PORow
              key={poItem.PRODUCTCODE || index}
              poItem={poItem}
              index={index}
            />
          ))
        ) : (
          <NoDataState />
        )}
      </TableWrapper>

      <AllPoPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        isClient={isClient}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default AllPoByDocNoTable;
