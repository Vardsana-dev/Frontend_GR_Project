'use client';

import React, { forwardRef } from 'react';
import { BarcodeItemSvg } from './BarcodeItemSvg';

export interface BarcodePrintItem {
  id: string;
  code: string;
  name: string;
  barcode: string;
  qty: number;
  price?: number;
  unit?: string;
}

export interface A4BarcodeSheetProps {
  items: BarcodePrintItem[];
  columns?: 2 | 3 | 4;
  repeatByQuantity?: boolean;
  showPrice?: boolean;
  showCode?: boolean;
  showName?: boolean;
  title?: string;
}

export const A4BarcodeSheet = forwardRef<HTMLDivElement, A4BarcodeSheetProps>(
  (
    {
      items = [],
      columns = 3,
      repeatByQuantity = false,
      showPrice = true,
      showCode = true,
      showName = true,
      title = '',
    },
    ref
  ) => {
    // Expand items if repeatByQuantity is enabled
    const expandedItems: (BarcodePrintItem & { printIndex: number })[] = [];
    let counter = 1;

    items.forEach((item) => {
      const times = repeatByQuantity ? Math.max(1, item.qty) : 1;
      for (let i = 0; i < times; i++) {
        expandedItems.push({
          ...item,
          printIndex: counter++,
        });
      }
    });

    // Column configurations (label dimensions and spacing)
    const colConfig = {
      2: {
        colsClass: 'grid-cols-2',
        cardMinHeight: '41mm',
        barcodeHeight: 38,
        nameSize: 'text-[11px]',
        codeSize: 'text-[11px]',
        gap: '2.5mm',
      },
      3: {
        colsClass: 'grid-cols-3',
        cardMinHeight: '31mm',
        barcodeHeight: 32,
        nameSize: 'text-[9.5px]',
        codeSize: 'text-[10px]',
        gap: '2mm',
      },
      4: {
        colsClass: 'grid-cols-4',
        cardMinHeight: '26mm',
        barcodeHeight: 26,
        nameSize: 'text-[8.5px]',
        codeSize: 'text-[9px]',
        gap: '1.5mm',
      },
    }[columns] || {
      colsClass: 'grid-cols-3',
      cardMinHeight: '31mm',
      barcodeHeight: 32,
      nameSize: 'text-[9.5px]',
      codeSize: 'text-[10px]',
      gap: '2mm',
    };

    if (expandedItems.length === 0) {
      return (
        <div ref={ref} className="p-8 text-center text-gray-500 bg-white">
          ບໍ່ມີລາຍການສິນຄ້າສຳລັບພິມບາໂຄດ
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="a4-barcode-sheet-root bg-white text-black p-0 m-0"
        style={{
          width: '100%',
          fontFamily: 'Saysettha OT, Phetsarath OT, Inter, sans-serif',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
      >
        <style type="text/css" media="all">
          {`
            @page {
              size: A4 portrait;
              margin: 8mm 6mm;
            }

            @media print {
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                color: #000000 !important;
                width: 100% !important;
                height: auto !important;
                overflow: visible !important;
              }

              .a4-barcode-sheet-root {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
              }

              .barcode-label-card {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
                -webkit-column-break-inside: avoid !important;
                border: 0.5px dashed #b5b5b5 !important;
                background: #ffffff !important;
              }
            }

            .barcode-label-card {
              box-sizing: border-box;
              break-inside: avoid;
              page-break-inside: avoid;
              border: 0.5px dashed #d1d5db;
              border-radius: 3px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              background-color: #ffffff;
              overflow: hidden;
            }
          `}
        </style>

        {/* Printable Grid */}
        <div
          className={`grid ${colConfig.colsClass} w-full`}
          style={{
            gap: colConfig.gap,
          }}
        >
          {expandedItems.map((item, index) => {
            const barcodeVal = item.barcode || item.code;
            return (
              <div
                key={`${item.id}-${index}`}
                className="barcode-label-card p-1.5"
                style={{
                  minHeight: colConfig.cardMinHeight,
                }}
              >
                {/* Header: Product Name & Code */}
                <div className="w-full text-center flex flex-col items-center justify-center leading-tight mb-0.5">
                  {showName && (
                    <div
                      className={`font-bold text-gray-900 ${colConfig.nameSize} line-clamp-1 max-w-full overflow-hidden text-ellipsis`}
                      title={item.name}
                    >
                      {item.name || '-'}
                    </div>
                  )}

                  <div className="flex items-center justify-between w-full px-1 text-gray-600 mt-0.5">
                    {showCode && (
                      <span className={`font-mono font-bold text-gray-800 ${colConfig.codeSize}`}>
                        {item.code || '-'}
                      </span>
                    )}
                    {showPrice && item.price !== undefined && item.price > 0 && (
                      <span className="font-bold text-gray-900 text-[10px] ml-auto">
                        {item.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}{' '}
                        {item.unit ? `₭/${item.unit}` : '₭'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Barcode SVG */}
                <div className="w-full flex items-center justify-center my-0.5 overflow-hidden">
                  <BarcodeItemSvg
                    value={barcodeVal}
                    format="CODE128"
                    width={columns === 4 ? 1.05 : columns === 2 ? 1.5 : 1.25}
                    height={colConfig.barcodeHeight}
                    displayValue={true}
                    fontSize={columns === 4 ? 8.5 : 9.5}
                    margin={1}
                    textMargin={1}
                  />
                </div>

                {/* Footer sequence & Doc info (subtle small stamp) */}
                {title && (
                  <div className="w-full text-center text-[7.5px] text-gray-400 font-mono tracking-tight -mt-0.5">
                    {title} #{item.printIndex}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

A4BarcodeSheet.displayName = 'A4BarcodeSheet';
