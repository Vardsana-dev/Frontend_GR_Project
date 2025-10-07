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

import AllPoPagination from "./all-po-pagination";

const AllPoTable = ({
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
      router.push(`/all-po-by-docno?docNo=${encodeURIComponent(docNo)}`);
    }
  };

  const tableHeaders = [
    { key: "ລຳດັບ" },
    { key: "ເລກທີເອກະສານ" },
    { key: "ຜູ້ສ້າງ" },
    { key: "ຜູ້ອັບເດດ" },
    { key: "ວັນທີສ້າງ" },
    { key: "ວັນທີອັບເດດ" },
    { key: "ສະຖານະປິດ" },
    { key: "ສະຖານະການໂອນ" },
    { key: "ວັນທີຄາດການເງິນສົດ" },
    { key: "ວັນທີເອກະສານ" },
    { key: "ໝາຍເຫດ" },
    { key: "ໝາຍເຫດ 2" },
    { key: "ລະຫັດຜູ້ສະໜອງ" },
    { key: "ຊື່ຜູ້ສະໜອງ" },
    { key: "ລະຫັດເຄຣດິດ" },
    { key: "ວັນທີຈັດສົ່ງ" },
    { key: "ວັນທີຊຳລະ" },
    { key: "ລະຫັດຜູ້ຊື້" },
    { key: "ກຸ່ມເອກະສານ" },
    { key: "ລະຫັດຕິດຕໍ່" },
    { key: "ປະເພດເອກະສານ" },
    { key: "ປະເພດພາສີ" },
    { key: "ລະຫັດຈັດສົ່ງ" },
    { key: "ລະຫັດສົ່ງ" },
    { key: "ນ້ຳໜັກລວມ" },
    { key: "ພະແນກ" },
    { key: "ໂຄງການ" },
    { key: "ລະຫັດຈັດສັນ" },
    { key: "ລະຫັດສະຖານທີ່" },
    { key: "ເອກະສານອ້າງອີງ 1" },
    { key: "ເອກະສານອ້າງອີງ 2" },
    { key: "ລະຫັດລົງຊື່" },
    { key: "ຈຳນວນເງິນມັດຈຳ" },
    { key: "ໝາຍເຫດໃບເກັບເງິນ 1" },
    { key: "ໝາຍເຫດໃບເກັບເງິນ 2" },
    { key: "ໝາຍເຫດໃບເກັບເງິນ 3" },
    { key: "ໝາຍເຫດໃບເກັບເງິນ 4" },
    { key: "ໝາຍເຫດໃບເກັບເງິນ 5" },
    { key: "ຈຳນວນເງິນລວມ 1" },
    { key: "ຈຳນວນເງິນລວມ 2" },
    { key: "ຈຳນວນເງິນລວມ 2B" },
    { key: "ຄຳສັບສ່ວນຫຼຸດ 2" },
    { key: "ຈຳນວນເງິນສ່ວນຫຼຸດ 2" },
    { key: "ຄຳສັບສ່ວນຫຼຸດ" },
    { key: "ຈຳນວນເງິນສ່ວນຫຼຸດ" },
    { key: "ຈຳນວນເງິນລວມ 1VE" },
    { key: "ຈຳນວນເງິນສ່ວນຫຼຸດ VE" },
    { key: "ຫຼັງສ່ວນຫຼຸດ" },
    { key: "ອັດຕາພາສີ" },
    { key: "ຈຳນວນເງິນພາສີ" },
    { key: "ຈຳນວນເງິນລວມທັງໝົດ" },
    { key: "ຈຳນວນເງິນໜີ້" },
    { key: "ການຊຳລະຜ່ານສື່" },
    { key: "ຈຳນວນເງິນທະນາຄານ" },
    { key: "ເລກທີປຶ້ມ" },
    { key: "ຈຳນວນເງິນລາຍຈ່າຍທະນາຄານ" },
    { key: "ລາຍລະອຽດປຶ້ມ" },
    { key: "ລະຫັດເງິນສົດຂະໜາດນ້ອຍ" },
    { key: "ເງິນສົດຂະໜາດນ້ອຍ" },
    { key: "ຍອດເງິນຊ່ວຍເຫຼືອລ່ວງ" },
    { key: "ເງິນຊ່ວຍເຫຼືອລ່ວງ" },
    { key: "ຈຳນວນເງິນສົດ" },
    { key: "ຈຳນວນເງິນເຊັກ" },
    { key: "ຈຳນວນເງິນມັດຈຳ" },
    { key: "ຈຳນວນເງິນລາຍໄດ້" },
    { key: "ຈຳນວນເງິນລາຍຈ່າຍ" },
    { key: "ສະຖານະເອກະສານລະບົບ" },
    { key: "ໝາຍເຫດເອກະສານລະບົບ" },
    { key: "ເຫດຜົນປິດ" },
    { key: "ລະຫັດເຈົ້າຂອງ" },
    { key: "ຢືນຢັນອັດຕະໂນມັດ" },
    { key: "ສາມາດພິມໄດ້" },
    { key: "ອັດຕາແລກປ່ຽນ" },
    { key: "ລະຫັດສະກຸນເງິນ" },
    { key: "ຈຳນວນເງິນໜີ້ບາດ" },
    { key: "ຈຳນວນເງິນລວມບາດ 1" },
    { key: "ຈຳນວນເງິນລວມບາດ 2" },
    { key: "ຈຳນວນເງິນສ່ວນຫຼຸດບາດ 1" },
    { key: "ຈຳນວນເງິນສ່ວນຫຼຸດບາດ 2" },
    { key: "ຈຳນວນເງິນພາສີບາດ" },
    { key: "ຈຳນວນເງິນລວມທັງໝົດບາດ" },
    { key: "ເລກທີເອກະສານ CO" },
    { key: "ວັນທີເລີ່ມສ້າງ" },
    { key: "ວັນທີສຳເລັດສ້າງ" },
    { key: "ວັນທີຍົກເລີກ" },
    { key: "ຜູ້ຍົກເລີກ" },
    { key: "ພະແນກ" },
    { key: "ລະຫັດພະແນກ" },
    { key: "ລະຫັດພະແນກ ID" },
    { key: "ISMN" },
    { key: "ການດຳເນີນການ" },
    { key: "ລະດັບ" },
    { key: "ວັນທີອະນຸມັດ" },
    { key: "ຈຳນວນຄົງເຫຼືອ PS" },
    { key: "ຈຳນວນ PS" },
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
            <p className="text-sm text-red-500 mt-2">ກາລຸນາຕິດຕໍ່ຝ່າຍດູແລລະບົບ ເພື່ອແກ້ໄຂບັນຫາ</p>
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
        ບໍ່ພົບຂໍ້ມູນສັ່ງຊື້
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
      <TableRow key={poItem.DOCNO || index}>
        <TableCell>{sequenceNumber}</TableCell>
        <TableCell>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDocNoClick(poItem.DOCNO)}
            className="text-sky-600 border-sky-300 hover:bg-sky-400 hover:text-white"
          >
            {poItem.DOCNO}
          </Button>
        </TableCell>
        <TableCell>{poItem.CREATEUSER}</TableCell>
        <TableCell>{poItem.UPDATEUSER}</TableCell>
        <TableCell>{formatValue("SYSCREATE", poItem.SYSCREATE)}</TableCell>
        <TableCell>{formatValue("SYSUPDATE", poItem.SYSUPDATE)}</TableCell>
        <TableCell>{formatValue("CLOSEFLAG", poItem.CLOSEFLAG)}</TableCell>
        <TableCell>{formatValue("TRFLAG", poItem.TRFLAG)}</TableCell>
        <TableCell>
          {formatValue("CASHFORECAST", poItem.CASHFORECAST)}
        </TableCell>
        <TableCell>{formatValue("DOCDATE", poItem.DOCDATE)}</TableCell>
        <TableCell>{formatValue("REMARK", poItem.REMARK)}</TableCell>
        <TableCell>{formatValue("REMARK2", poItem.REMARK2)}</TableCell>
        <TableCell>{formatValue("APCODE", poItem.APCODE)}</TableCell>
        <TableCell>{formatValue("APNAME", poItem.APNAME)}</TableCell>
        <TableCell>{formatValue("CREDITCODE", poItem.CREDITCODE)}</TableCell>
        <TableCell>{formatValue("SHIPDATE", poItem.SHIPDATE)}</TableCell>
        <TableCell>{formatValue("PAYMENTDATE", poItem.PAYMENTDATE)}</TableCell>
        <TableCell>
          {formatValue("PURCHASECODE", poItem.PURCHASECODE)}
        </TableCell>
        <TableCell>{formatValue("DOCGROUP", poItem.DOCGROUP)}</TableCell>
        <TableCell>{formatValue("CONTACTCODE", poItem.CONTACTCODE)}</TableCell>
        <TableCell>{formatValue("DOCTYPE", poItem.DOCTYPE)}</TableCell>
        <TableCell>{formatValue("TAXTYPE", poItem.TAXTYPE)}</TableCell>
        <TableCell>{formatValue("SHIPCODE", poItem.SHIPCODE)}</TableCell>
        <TableCell>{formatValue("SENDCODE", poItem.SENDCODE)}</TableCell>
        <TableCell>{formatValue("SUMWEIGHT", poItem.SUMWEIGHT)}</TableCell>
        <TableCell>{formatValue("DEPARTMENT", poItem.DEPARTMENT)}</TableCell>
        <TableCell>{formatValue("PROJECT", poItem.PROJECT)}</TableCell>
        <TableCell>
          {formatValue("ALLOCATECODE", poItem.ALLOCATECODE)}
        </TableCell>
        <TableCell>{formatValue("SITECODE", poItem.SITECODE)}</TableCell>
        <TableCell>{formatValue("REFDOCNO1", poItem.REFDOCNO1)}</TableCell>
        <TableCell>{formatValue("REFDOCNO2", poItem.REFDOCNO2)}</TableCell>
        <TableCell>{formatValue("SIGNCODE", poItem.SIGNCODE)}</TableCell>
        <TableCell>{formatValue("DEPOSAMOUNT", poItem.DEPOSAMOUNT)}</TableCell>
        <TableCell>{formatValue("BILLREMARK1", poItem.BILLREMARK1)}</TableCell>
        <TableCell>{formatValue("BILLREMARK2", poItem.BILLREMARK2)}</TableCell>
        <TableCell>{formatValue("BILLREMARK3", poItem.BILLREMARK3)}</TableCell>
        <TableCell>{formatValue("BILLREMARK4", poItem.BILLREMARK4)}</TableCell>
        <TableCell>{formatValue("BILLREMARK5", poItem.BILLREMARK5)}</TableCell>
        <TableCell>{formatValue("SUMAMOUNT1", poItem.SUMAMOUNT1)}</TableCell>
        <TableCell>{formatValue("SUMAMOUNT2", poItem.SUMAMOUNT2)}</TableCell>
        <TableCell>{formatValue("SUMAMOUNT2B", poItem.SUMAMOUNT2B)}</TableCell>
        <TableCell>{formatValue("DISCWORD2", poItem.DISCWORD2)}</TableCell>
        <TableCell>{formatValue("DISCAMOUNT2", poItem.DISCAMOUNT2)}</TableCell>
        <TableCell>{formatValue("DISCWORD", poItem.DISCWORD)}</TableCell>
        <TableCell>{formatValue("DISCAMOUNT", poItem.DISCAMOUNT)}</TableCell>
        <TableCell>
          {formatValue("SUMAMOUNT1VE", poItem.SUMAMOUNT1VE)}
        </TableCell>
        <TableCell>
          {formatValue("DISCAMOUNTVE", poItem.DISCAMOUNTVE)}
        </TableCell>
        <TableCell>{formatValue("AFTERDISC", poItem.AFTERDISC)}</TableCell>
        <TableCell>{formatValue("TAXRATE", poItem.TAXRATE)}%</TableCell>
        <TableCell>{formatValue("TAXAMOUNT", poItem.TAXAMOUNT)}</TableCell>
        <TableCell>{formatValue("TOTALAMOUNT", poItem.TOTALAMOUNT)}</TableCell>
        <TableCell>{formatValue("DEBTAMOUNT", poItem.DEBTAMOUNT)}</TableCell>
        <TableCell>
          {formatValue("MEDIACLEARING", poItem.MEDIACLEARING)}
        </TableCell>
        <TableCell>{formatValue("BANKAMOUNT", poItem.BANKAMOUNT)}</TableCell>
        <TableCell>{formatValue("BOOKNO", poItem.BOOKNO)}</TableCell>
        <TableCell>{formatValue("BANKEXPEND", poItem.BANKEXPEND)}</TableCell>
        <TableCell>{formatValue("BOOKDESC", poItem.BOOKDESC)}</TableCell>
        <TableCell>
          {formatValue("PETTYCASHCODE", poItem.PETTYCASHCODE)}
        </TableCell>
        <TableCell>{formatValue("PETTYCASH", poItem.PETTYCASH)}</TableCell>
        <TableCell>
          {formatValue("ADVANCEPAYBAL", poItem.ADVANCEPAYBAL)}
        </TableCell>
        <TableCell>{formatValue("ADVANCEPAY", poItem.ADVANCEPAY)}</TableCell>
        <TableCell>{formatValue("CASHAMOUNT", poItem.CASHAMOUNT)}</TableCell>
        <TableCell>
          {formatValue("CHEQUEAMOUNT", poItem.CHEQUEAMOUNT)}
        </TableCell>
        <TableCell>
          {formatValue("DEPOSITAMOUNT", poItem.DEPOSITAMOUNT)}
        </TableCell>
        <TableCell>
          {formatValue("INCOMEAMOUNT", poItem.INCOMEAMOUNT)}
        </TableCell>
        <TableCell>
          {formatValue("EXPENDAMOUNT", poItem.EXPENDAMOUNT)}
        </TableCell>
        <TableCell>{formatValue("SYSDOCFLAG", poItem.SYSDOCFLAG)}</TableCell>
        <TableCell>
          {formatValue("SYSDOCREMARK", poItem.SYSDOCREMARK)}
        </TableCell>
        <TableCell>{formatValue("CLOSEREASON", poItem.CLOSEREASON)}</TableCell>
        <TableCell>{formatValue("OWNERCODE", poItem.OWNERCODE)}</TableCell>
        <TableCell>{formatValue("CONFIRMAUTO", poItem.CONFIRMAUTO)}</TableCell>
        <TableCell>{formatValue("CANPRINT", poItem.CANPRINT)}</TableCell>
        <TableCell>
          {formatValue("EXCHANGERATE", poItem.EXCHANGERATE)}
        </TableCell>
        <TableCell>
          {formatValue("CURRENCYCODE", poItem.CURRENCYCODE)}
        </TableCell>
        <TableCell>
          {formatValue("BATHDEBTAMOUNT", poItem.BATHDEBTAMOUNT)}
        </TableCell>
        <TableCell>
          {formatValue("BATHSUMAMOUNT1", poItem.BATHSUMAMOUNT1)}
        </TableCell>
        <TableCell>
          {formatValue("BATHSUMAMOUNT2", poItem.BATHSUMAMOUNT2)}
        </TableCell>
        <TableCell>
          {formatValue("BATHDISCAMOUNT1", poItem.BATHDISCAMOUNT1)}
        </TableCell>
        <TableCell>
          {formatValue("BATHDISCAMOUNT2", poItem.BATHDISCAMOUNT2)}
        </TableCell>
        <TableCell>
          {formatValue("BATHTAXAMOUNT", poItem.BATHTAXAMOUNT)}
        </TableCell>
        <TableCell>
          {formatValue("BATHTOTALAMOUNT", poItem.BATHTOTALAMOUNT)}
        </TableCell>
        <TableCell>{formatValue("CODOCNO", poItem.CODOCNO)}</TableCell>
        <TableCell>{formatValue("STARTCREATE", poItem.STARTCREATE)}</TableCell>
        <TableCell>
          {formatValue("FINISHCREATE", poItem.FINISHCREATE)}
        </TableCell>
        <TableCell>{formatValue("CANCELDATE", poItem.CANCELDATE)}</TableCell>
        <TableCell>{formatValue("CANCELUSER", poItem.CANCELUSER)}</TableCell>
        <TableCell>{formatValue("DEPT", poItem.DEPT)}</TableCell>
        <TableCell>{formatValue("DEPTCODE", poItem.DEPTCODE)}</TableCell>
        <TableCell>{formatValue("DEPTID", poItem.DEPTID)}</TableCell>
        <TableCell>{formatValue("ISMN", poItem.ISMN)}</TableCell>
        <TableCell>{formatValue("ACTION", poItem.ACTION)}</TableCell>
        <TableCell>{formatValue("LEVEL", poItem.LEVEL)}</TableCell>
        <TableCell>{formatValue("DATEAPPROVE", poItem.DATEAPPROVE)}</TableCell>
        <TableCell>{formatValue("PSREMAINQTY", poItem.PSREMAINQTY)}</TableCell>
        <TableCell>{formatValue("PSQUANTITY", poItem.PSQUANTITY)}</TableCell>
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
            <PORow key={poItem.DOCNO || index} poItem={poItem} index={index} />
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

export default AllPoTable;
