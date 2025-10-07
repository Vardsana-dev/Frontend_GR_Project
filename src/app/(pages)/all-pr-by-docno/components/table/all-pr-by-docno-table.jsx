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

const AllPrByDocNoTable = ({
  poByDocNo,
  loading,
  error,
  currentPage,
  totalPages,
  totalItems,
  isClient,
  onPageChange,
}) => {
  const tableHeaders = [
    { key: "ລຳດັບ" },
    { key: "ລະຫັດສິນຄ້າ" },
    { key: "ຊື່ສິນຄ້າ" },
    { key: "ຫົວໜ່ວຍ" },
    { key: "ຈຳນວນ" },
    { key: "ລາຄາຕໍ່ຫົວໜ່ວຍ" },
    { key: "ຈຳນວນຄົງເຫຼືອ" },
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
    { key: "ຈ຾ນວນສັ່ງຊື້ 8" },
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

  const PrRow = ({ prItem, index }) => {
    const sequenceNumber = (currentPage - 1) * 12 + index + 1;

    // ฟังก์ชันสำหรับจัดรูปแบบข้อมูล
    const formatValue = (key, value) => {
      if (value === null || value === undefined) return "-";
      if (value === "") return "-";

      // จัดรูปแบบวันที่
      if (key.includes("date") || key.includes("datetop")) {
        return formatDate(value);
      }

      // จัดรูปแบบเงิน
      if (
        key.includes("price") ||
        key.includes("pricetop") ||
        key === "UNITPRICE"
      ) {
        return formatCurrency(value);
      }

      return value.toString();
    };

    return (
      <TableRow key={`${prItem.PRODUCTCODE}-${index}`}>
        <TableCell>{sequenceNumber}</TableCell>
        <TableCell>{formatValue("PRODUCTCODE", prItem.PRODUCTCODE)}</TableCell>
        <TableCell>{formatValue("PRODUCTNAME", prItem.PRODUCTNAME)}</TableCell>
        <TableCell>{formatValue("UNITCODE", prItem.UNITCODE)}</TableCell>
        <TableCell>{formatValue("QUANTITY", prItem.QUANTITY)}</TableCell>
        <TableCell>{formatValue("UNITPRICE", prItem.UNITPRICE)}</TableCell>
        <TableCell>{formatValue("REMAINQTY", prItem.REMAINQTY)}</TableCell>
        <TableCell>{formatValue("qtytop1", prItem.qtytop1)}</TableCell>
        <TableCell>{formatValue("pricetop1", prItem.pricetop1)}</TableCell>
        <TableCell>{formatValue("datetop1", prItem.datetop1)}</TableCell>
        <TableCell>{formatValue("qtytop2", prItem.qtytop2)}</TableCell>
        <TableCell>{formatValue("pricetop2", prItem.pricetop2)}</TableCell>
        <TableCell>{formatValue("datetop2", prItem.datetop2)}</TableCell>
        <TableCell>{formatValue("qtytop3", prItem.qtytop3)}</TableCell>
        <TableCell>{formatValue("pricetop3", prItem.pricetop3)}</TableCell>
        <TableCell>{formatValue("datetop3", prItem.datetop3)}</TableCell>
        <TableCell>{formatValue("qtytop4", prItem.qtytop4)}</TableCell>
        <TableCell>{formatValue("pricetop4", prItem.pricetop4)}</TableCell>
        <TableCell>{formatValue("datetop4", prItem.datetop4)}</TableCell>
        <TableCell>{formatValue("qtytop5", prItem.qtytop5)}</TableCell>
        <TableCell>{formatValue("pricetop5", prItem.pricetop5)}</TableCell>
        <TableCell>{formatValue("datetop5", prItem.datetop5)}</TableCell>
        <TableCell>{formatValue("qtytop6", prItem.qtytop6)}</TableCell>
        <TableCell>{formatValue("pricetop6", prItem.pricetop6)}</TableCell>
        <TableCell>{formatValue("datetop6", prItem.datetop6)}</TableCell>
        <TableCell>{formatValue("qtytop7", prItem.qtytop7)}</TableCell>
        <TableCell>{formatValue("pricetop7", prItem.pricetop7)}</TableCell>
        <TableCell>{formatValue("datetop7", prItem.datetop7)}</TableCell>
        <TableCell>{formatValue("qtytop8", prItem.qtytop8)}</TableCell>
        <TableCell>{formatValue("pricetop8", prItem.pricetop8)}</TableCell>
        <TableCell>{formatValue("datetop8", prItem.datetop8)}</TableCell>
        <TableCell>{formatValue("qtytop9", prItem.qtytop9)}</TableCell>
        <TableCell>{formatValue("pricetop9", prItem.pricetop9)}</TableCell>
        <TableCell>{formatValue("datetop9", prItem.datetop9)}</TableCell>
        <TableCell>{formatValue("qtytop10", prItem.qtytop10)}</TableCell>
        <TableCell>{formatValue("pricetop10", prItem.pricetop10)}</TableCell>
        <TableCell>{formatValue("datetop10", prItem.datetop10)}</TableCell>
        <TableCell>{formatValue("qtytop11", prItem.qtytop11)}</TableCell>
        <TableCell>{formatValue("pricetop11", prItem.pricetop11)}</TableCell>
        <TableCell>{formatValue("datetop11", prItem.datetop11)}</TableCell>
        <TableCell>{formatValue("qtytop12", prItem.qtytop12)}</TableCell>
        <TableCell>{formatValue("pricetop12", prItem.pricetop12)}</TableCell>
        <TableCell>{formatValue("datetop12", prItem.datetop12)}</TableCell>
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
        {poByDocNo.length > 0 ? (
          poByDocNo.map((poItem, index) => (
            <PrRow
              key={`${poItem.PRODUCTCODE}-${index}`}
              prItem={poItem}
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

export default AllPrByDocNoTable;
