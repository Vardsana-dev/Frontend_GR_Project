import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { GrReportItem } from "@/hooks/gr-report-hook/useGetGrReport";
import { Globe, Facebook, MapPin, Phone } from "lucide-react";

interface PrintableGrReportProps {
  data: GrReportItem[];
  printDate: string;
}

export const PrintableGrReport = React.forwardRef<
  HTMLDivElement,
  PrintableGrReportProps
>(({ data, printDate }, ref) => {
  const internalRef = React.useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Merge forwarded ref with internal ref
  React.useImperativeHandle(
    ref,
    () => internalRef.current as HTMLDivElement
  );

  // With the new exact manual pagination technique, we don't need 
  // any Javascript layout tracking or measurement during beforeprint!

  const formatAmount = (amount: number | null | undefined) => {
    if (!amount || amount === 0) return "";

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate totals
  const totals = data.reduce(
    (acc, row) => ({
      poValue: acc.poValue + (row.purchaseOrder?.amount || 0),
      invoiceValue: acc.invoiceValue + (row.invoiceAmount || 0),
      damagedValue: acc.damagedValue + (row.damagedAmount || 0),
      overValue: acc.overValue + 0,
      shortValue: acc.shortValue + (row.shortAmount || 0),
      otherValue: acc.otherValue + (row.otherAmount || 0),
      receivedValue: acc.receivedValue + (row.receivedAmount || 0),
    }),
    {
      poValue: 0,
      invoiceValue: 0,
      damagedValue: 0,
      overValue: 0,
      shortValue: 0,
      otherValue: 0,
      receivedValue: 0,
    }
  );

  // ---------------------------------------------------------
  // PAGINATION LOGIC
  // ---------------------------------------------------------
  const pages: GrReportItem[][] = [];
  let currentIndex = 0;
  
  while (currentIndex < data.length) {
    const remaining = data.length - currentIndex;
    
    // Default maximum rows per page is 9.
    // (This guarantees the table will NEVER overlap with the footer, 
    // even if some rows have extra long text that wraps to multiple lines).
    let chunkSize = 9;
    
    // If we are nearing the end, we must ensure there is enough room for the signatures.
    // The signatures take up the space of about 4 rows.
    // If we have between 6 and 9 items remaining, they would technically fit on one page,
    // BUT the signatures at the bottom would overlap the footer or overflow.
    // By forcing the chunk size to 5 here, the remaining items get pushed to 
    // a new final page, leaving plenty of beautiful room for the signatures!
    if (remaining <= 9 && remaining > 5) {
      chunkSize = 5;
    }
    
    pages.push(data.slice(currentIndex, currentIndex + chunkSize));
    currentIndex += chunkSize;
  }
  
  if (pages.length === 0) {
    pages.push([]);
  }

  // ---------------------------------------------------------
  // RENDER CONTENT
  // ---------------------------------------------------------
  const content = (
    <div
      ref={internalRef}
      className="hidden print:block absolute top-0 left-0 w-full z-30 print-document bg-white text-black"
      style={{
        fontFamily: "Saysettha OT, sans-serif",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      <style type="text/css" media="print">
        {`
          @page {
            size: A4 landscape;
            margin: 0mm;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Explicitly define each page to be exactly A4 Landscape size */
          .a4-page-container {
             width: 1122.5px;
             height: 793px;
             position: relative;
             overflow: hidden;
             page-break-after: always;
             background-color: white;
             display: flex;
             flex-direction: column;
          }

          .a4-page-container:last-child {
             page-break-after: auto;
          }
        `}
      </style>

      {pages.map((pageData, pageIndex) => {
        const isLastPage = pageIndex === pages.length - 1;
        // Keep track of true row numbers across pages
        const startRowIndex = pages.slice(0, pageIndex).reduce((sum, p) => sum + p.length, 0);

        return (
          <div key={pageIndex} className="a4-page-container">
            
            {/* ============================================================
                HEADER (Repeats on every page)
                ============================================================ */}
            <div className="flex-none pt-1 px-12">
              <div className="flex flex-col w-full mb-4 mt-2">
                <div className="flex w-full items-end justify-between">
                  {/* Left: CSC Logo */}
                  <div className="w-[220px] flex justify-start z-20 pb-2">
                    <svg
                      width="110"
                      height="95"
                      viewBox="0 0 140 120"
                      style={{
                        WebkitPrintColorAdjust: "exact",
                        printColorAdjust: "exact",
                      }}
                    >
                      <g transform="translate(15, 0)">
                        <polygon points="40,5 80,45 40,85 0,45" fill="#aee0f5" />
                        <polygon points="75,40 115,80 75,120 35,80" fill="#0071bc" style={{ mixBlendMode: "multiply" }} />
                        <polygon points="70,5 90,25 70,45 50,25" fill="#ee1d25" />
                      </g>
                      <text x="70" y="115" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="50" fill="#1e348a" textAnchor="middle" letterSpacing="-1">
                        CSC
                      </text>
                    </svg>
                  </div>

                  {/* Top Center: National Motto */}
                  <div className="flex-1 flex flex-col items-center z-20 pb-6">
                    <h2 className="text-[14px] font-semibold mb-1 tracking-wide">
                      ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ
                    </h2>
                    <h3 className="text-[14px] font-semibold tracking-wide">
                      ສັນຕິພາບ ເອກະລາດ ປະຊາທິປະໄຕ ເອກະພາບ ວັດທະນາຖາວອນ
                    </h3>
                  </div>

                  <div className="w-[220px]" />
                </div>

                {/* Stepped Double Line */}
                <div className="w-full h-8 relative -mt-6 z-10">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 32">
                    <path d="M 0 24 L 220 24 L 250 8 L 1000 8" fill="none" stroke="black" strokeWidth="2.5" />
                    <path d="M 0 28 L 222 28 L 252 12 L 1000 12" fill="none" stroke="black" strokeWidth="0.5" />
                  </svg>
                </div>

                {/* Bottom row: Branch, Title, Date */}
                <div className="w-full flex items-start justify-between mt-2">
                  <div className="text-[11px] font-semibold pt-1 w-[220px] text-left">
                    ສາຂາ: ບໍລິສັດ
                  </div>
                  <div className="flex-1 flex justify-center pt-2">
                    <h1 className="text-lg font-bold tracking-wider">
                      ບົດສະຫຼຸບການກວດນັບສິນຄ້າເຂົ້າສາງປະຈຳວັນ
                    </h1>
                  </div>
                  <div className="flex flex-col items-end text-[12px] font-semibold w-[220px] text-right">
                    <p className="mb-1">ເລກທີ: ກ ຂ ສ 075.ວຈ</p>
                    <p>ວັນທີ: {printDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 px-12 mt-4 relative">
              <table className="w-full table-fixed border-collapse border border-black text-[11px] mb-8">
                <colgroup>
                  {/* 1. ລ/ດ */}
                  <col style={{ width: "3%" }} />
                  {/* 2. ລະຫັດ */}
                  <col style={{ width: "6%" }} />
                  {/* 3. ຊື່ */}
                  <col style={{ width: "12%" }} />
                  {/* 4. PO ເລກທີ */}
                  <col style={{ width: "9%" }} />
                  {/* 5. PO ມູນຄ່າ */}
                  <col style={{ width: "9%" }} />
                  {/* 6. Invoice */}
                  <col style={{ width: "9%" }} />
                  {/* 7. ຊຳລຸດ */}
                  <col style={{ width: "8%" }} />
                  {/* 8. ມາເກີນ */}
                  <col style={{ width: "7%" }} />
                  {/* 9. ບໍ່ຄົບ */}
                  <col style={{ width: "8%" }} />
                  {/* 10. ອື່ນໆ */}
                  <col style={{ width: "7%" }} />
                  {/* 11. ຮັບເຂົ້າສາງ */}
                  <col style={{ width: "11%" }} />
                  {/* 12. ໝາຍເຫດ */}
                  <col style={{ width: "11%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th rowSpan={2} className="border border-black p-1 text-center bg-gray-50">ລ/ດ</th>
                    <th rowSpan={2} className="border border-black p-1 text-center bg-gray-50">ລະຫັດ</th>
                    <th rowSpan={2} className="border border-black p-1 text-center bg-gray-50">ຊື່</th>
                    <th colSpan={2} className="border border-black p-1 text-center bg-gray-50">ໃບສັ່ງຊື້ (PO)</th>
                    <th rowSpan={2} className="border border-black p-1 text-center bg-gray-50">ມູນຄ່າ Invoice</th>
                    <th rowSpan={2} className="border border-black p-1 text-center bg-gray-50">ມູນຄ່າ<br />ຊຳລຸດ</th>
                    <th colSpan={3} className="border border-black p-1 text-center bg-gray-50">ການກວດຮັບເຄື່ອງ</th>
                    <th rowSpan={2} className="border border-black p-1 text-center bg-gray-50">ມູນຄ່າ<br />ຮັບເຂົ້າສາງ</th>
                    <th rowSpan={2} className="border border-black p-1 text-center bg-gray-50">ໝາຍເຫດ</th>
                  </tr>
                  <tr>
                    <th className="border border-black p-1 text-center bg-gray-50">ເລກທີ</th>
                    <th className="border border-black p-1 text-center bg-gray-50">ມູນຄ່າ</th>
                    <th className="border border-black p-1 text-center bg-gray-50">ມູນຄ່າ<br />ສິນຄ້າມາເກີນ</th>
                    <th className="border border-black p-1 text-center bg-gray-50">ມູນຄ່າ<br />ສິນຄ້າມາບໍ່ຄົບ</th>
                    <th className="border border-black p-1 text-center bg-gray-50">ອື່ນໆ</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((row, index) => (
                    <tr key={row.grid || `print-row-${index}`}>
                      <td className="border border-black p-1 text-center">{startRowIndex + index + 1}</td>
                      <td className="border border-black p-1 text-center text-[10px] break-all">{row.supplier?.apcode}</td>
                      <td className="border border-black p-1 truncate max-w-[10rem]">{row.supplier?.apname}</td>
                      <td className="border border-black p-1 text-center text-[10px] break-all">{row.purchaseOrder?.docno}</td>
                      <td className="border border-black p-1 text-right text-[10px] tracking-tighter">{formatAmount(row.purchaseOrder?.amount)}</td>
                      <td className="border border-black p-1 text-right text-[10px] tracking-tighter">{formatAmount(row.invoiceAmount)}</td>
                      <td className="border border-black p-1 text-right text-[10px] tracking-tighter">{formatAmount(row.damagedAmount)}</td>
                      <td className="border border-black p-1 text-right text-[10px] tracking-tighter">{formatAmount(0)}</td>
                      <td className="border border-black p-1 text-right text-[10px] tracking-tighter">{formatAmount(row.shortAmount)}</td>
                      <td className="border border-black p-1 text-right text-[10px] tracking-tighter">{formatAmount(row.otherAmount)}</td>
                      <td className="border border-black p-1 text-right text-[10px] tracking-tighter">{formatAmount(row.receivedAmount)}</td>
                      <td className="border border-black p-1 text-left text-[9px] break-words">{row.remark || row.damageNotes || ""}</td>
                    </tr>
                  ))}

                  {/* Show totals only on the last page */}
                  {isLastPage && (
                    <tr className="font-bold text-[10px]">
                      <td colSpan={4} className="border border-black p-1 text-center">ລວມ</td>
                      <td className="border border-black p-1 text-right tracking-tighter">{formatAmount(totals.poValue)}</td>
                      <td className="border border-black p-1 text-right tracking-tighter">{formatAmount(totals.invoiceValue)}</td>
                      <td className="border border-black p-1 text-right tracking-tighter">{formatAmount(totals.damagedValue)}</td>
                      <td className="border border-black p-1 text-right tracking-tighter">{formatAmount(totals.overValue)}</td>
                      <td className="border border-black p-1 text-right tracking-tighter">{formatAmount(totals.shortValue)}</td>
                      <td className="border border-black p-1 text-right tracking-tighter">{formatAmount(totals.otherValue)}</td>
                      <td className="border border-black p-1 text-right tracking-tighter">{formatAmount(totals.receivedValue)}</td>
                      <td className="border border-black p-1"></td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Signatures only on the last page */}
              {isLastPage && (
                <div className="signature-section flex justify-between items-start pt-4 px-16 mb-8">
                  <div className="flex flex-col items-center">
                    <p className="font-bold text-[12px] mb-16">ພະນັກງານ ຮັບເຄື່ອງ</p>
                    <div className="border-b border-black w-32"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-bold text-[12px] mb-16">ຜູ້ກວດສອບ (LP)</p>
                    <div className="border-b border-black w-32"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-bold text-[12px] mb-16">ຫົວໜ້າພະແນກສາງ</p>
                    <div className="border-b border-black w-32"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-bold text-[12px] mb-16">ຜູ້ກວດຮັບ (GR)</p>
                    <div className="border-b border-black w-32"></div>
                  </div>
                </div>
              )}
            </div>

            {/* PAGE NUMBER (Below table/signatures, above footer) */}
            <div className="w-full flex justify-end px-12 pb-2">
              <span className="text-[12px] font-medium text-gray-700">
                ໜ້າ {pageIndex + 1}/{pages.length}
              </span>
            </div>

            {/* ============================================================
                FOOTER (Repeats on every page)
                ============================================================ */}
            <div className="flex-none absolute bottom-0 left-0 w-full h-[105px]">
              <div className="w-full h-full relative text-[#135c98]">
                {/* Background SVG */}
                <div className="absolute inset-x-0 bottom-0 top-0 z-0">
                  <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-full block">
                    <path d="M 0 45 L 850 45 C 950 45 1000 15 1100 15 L 1200 15 L 1200 20 L 1100 20 C 1000 20 950 50 850 50 L 0 50 Z" fill="#135c98" />
                    <path d="M 0 55 L 850 55 C 950 55 1000 25 1100 25 L 1200 25 L 1200 100 L 0 100 Z" fill="#135c98" />
                  </svg>
                </div>
                
                {/* Foreground Content */}
                <div className="relative z-10 w-full h-full flex flex-col justify-between pt-3 pb-3">
                  <div className="flex justify-between px-16 text-[12px] font-bold items-center h-[35px]">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>http://csccomplex-center.com</span>
                    </div>
                    <div className="flex items-center gap-2 pr-64">
                      <Facebook className="w-4 h-4 fill-current" />
                      <span>csc complex center Co.,Ltd</span>
                    </div>
                  </div>
                  <div className="flex justify-between px-16 text-white font-semibold items-center h-[55px]">
                    <div className="flex items-center gap-3">
                      <div className="bg-white text-[#135c98] rounded-full p-1.5 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col leading-tight mt-1">
                        <span className="text-[13px] font-bold">ຊີເອັສຊີ ສໍານັກງານໃຫຍ່</span>
                        <span className="text-[11px] font-medium">ຕັ້ງຢູ່ ຖະໜົນ 450 ປີ, ບ້ານ ໂຊກໃຫຍ່, ເມືອງ ໄຊເສດຖາ, ນະຄອນຫຼວງວຽງຈັນ</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pr-8 mt-1">
                      <div className="bg-white text-[#135c98] rounded-full p-1.5 flex items-center justify-center">
                        <Phone className="w-4 h-4 fill-current" />
                      </div>
                      <span className="text-[15px] font-bold">021 463 555-57</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (!isClient) return null;

  return createPortal(content, document.body);
});

PrintableGrReport.displayName = "PrintableGrReport";