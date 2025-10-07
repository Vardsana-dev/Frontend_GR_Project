import React, { useState } from "react";
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

import AllProductPagination from "./all-product-pagination";
// import PoByProductsModal from "../modal/po-by-products-modal"; // ลบการ import modal

const AllProductTable = ({
  products,
  loading,
  error,
  currentPage,
  totalPages,
  totalItems,
  isClient,
  onPageChange,
}) => {
  const router = useRouter();

  const tableHeaders = [
    { key: "ລຳດັບ" },
    // { key: "ລະຫັດສິນຄ້າ" },
    { key: "ລະຫັດສິນຄ້າ" },
    { key: "ຊື່ສິນຄ້າ (ໄທ)" },
    { key: "ຊື່ສິນຄ້າ (ລາວ)" },
    { key: "ຫົວໜ່ວຍສະຕ໋ອກ" },
    { key: "ຫົວໜ່ວຍຂາຍ" },
    { key: "ຫົວໜ່ວຍສັ່ງຊື້" },
    { key: "ສາງ" },
    { key: "ຕຳແໜ່ງ" },
    { key: "ສະຕ໋ອກຕໍ່າສຸດ" },
    { key: "ສະຕ໋ອກປອດໄພ" },
    // { key: "ສະຖານະ" },
    { key: "ກຸ່ມຫຼັກ" },
  ];

  const handleOldCodeClick = (product) => {
    if (product.OLDCODE && product.OLDCODE !== "-") {
      // เปลี่ยนไปหน้า all-po-by-products พร้อมส่ง productCode
      router.push(
        `/all-po-by-products?productCode=${encodeURIComponent(product.OLDCODE)}`
      );
    }
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
        ບໍ່ພົບຂໍ້ມູນສິນຄ້າ
      </TableCell>
    </TableRow>
  );

  const ProductRow = ({ product, index }) => {
    const sequenceNumber = (currentPage - 1) * 12 + index + 1;
    const isActive = product.CLOSEFLAG === 0;

    return (
      <TableRow key={product.CODE || index}>
        <TableCell>{sequenceNumber}</TableCell>
        {/* <TableCell>{product.CODE || "-"}</TableCell> */}
        {/* <TableCell
          className={`font-medium ${
            product.OLDCODE && product.OLDCODE !== "-"
              ? "text-sky-400 cursor-pointer hover:text-sky-600"
              : ""
          }`}
          onClick={() =>
            product.OLDCODE &&
            product.OLDCODE !== "-" &&
            handleOldCodeClick(product)
          }
        >
          <Button className="bg-sky-200 text-sky-500 hover:bg-sky-300 hover:text-sky-700">
            {product.OLDCODE && product.OLDCODE !== "-" ? (
              product.OLDCODE
            ) : (
              "-"
            )}
          </Button>
        </TableCell> */}
        <TableCell>
          {product.OLDCODE && product.OLDCODE !== "-" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOldCodeClick(product)}
              className="text-sky-600 border-sky-300 hover:bg-sky-400 hover:text-white"
            >
              {product.OLDCODE}
            </Button>
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell>{product.NAMETH || "-"}</TableCell>
        <TableCell>{product.NAMEEN || "-"}</TableCell>
        <TableCell>{product.STOCKUNIT || "-"}</TableCell>
        <TableCell>{product.SALEUNIT || "-"}</TableCell>
        <TableCell>{product.POUNIT || "-"}</TableCell>
        <TableCell>{product.GRWAREHOUSE || "-"}</TableCell>
        <TableCell>{product.GRLOCATION || "-"}</TableCell>
        <TableCell>{product.MINSTOCK || "-"}</TableCell>
        <TableCell>{product.SAFETYSTOCK || "-"}</TableCell>
        {/* <TableCell>
          <span
            className={`px-2 py-1 rounded text-xs ${
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isActive ? "ໃຊ້ງານ" : "ບໍ່ໃຊ້ງານ"}
          </span>
        </TableCell> */}
        <TableCell>
          <div className="flex items-center gap-2">
            <span>{product.csproduct?.MAINGROUP || "-"}</span> /
            <span>{product.csproduct?.PURCHASEORDER || 0}</span> /
            <span>{product.csproduct?.CUSTORDER || 0}</span> /
            <span>{product.csproduct?.SALEORDER || 0}</span>
          </div>
        </TableCell>
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
        {products.length > 0 ? (
          products.map((product, index) => (
            <ProductRow
              key={product.CODE || index}
              product={product}
              index={index}
            />
          ))
        ) : (
          <NoDataState />
        )}
      </TableWrapper>

      <AllProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        isClient={isClient}
        onPageChange={onPageChange}
      />

      {/* ลบ Modal component */}
    </div>
  );
};

export default AllProductTable;
