/* eslint-disable @next/next/no-img-element */
'use client';

import React, { forwardRef } from 'react';
import {
  DEFAULT_ROLL_SIZE,
  DEFAULT_A4_SLIM_SIZE,
  getLayout,
  buildBarcodeSvg,
  LabelSizeConfig,
} from './barcodePrintService';
import { CSC_LOGO_DATA_URI } from './cscLogoDataUri';

export interface BarcodePrintItem {
  id: string;
  code: string;
  name: string;
  barcode: string;
  qty: number;
  receivedQty?: number;
  price?: number;
  unit?: string;
}

export interface A4BarcodeSheetProps {
  items: BarcodePrintItem[];
  paperType?: 'roll' | 'a4';
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
      paperType = 'roll',
      columns = 3,
      repeatByQuantity = false,
      showPrice = false,
      showCode = true,
      showName = true,
      title = '',
    },
    ref
  ) => {
    // Expand items by each item's barcode quantity
    const expandedItems: (BarcodePrintItem & { printIndex: number })[] = [];
    let counter = 1;

    items.forEach((item) => {
      const times = Math.max(0, Number(item.qty) || 0);
      for (let i = 0; i < times; i++) {
        expandedItems.push({
          ...item,
          printIndex: counter++,
        });
      }
    });

    if (expandedItems.length === 0) {
      return (
        <div ref={ref} className="p-8 text-center text-gray-500 bg-white">
          ບໍ່ມີລາຍການສິນຄ້າສຳລັບພິມບາໂຄດ
        </div>
      );
    }

    const isRoll = paperType === 'roll';

    // Configure size preset according to paper type
    const sizeConfig: LabelSizeConfig = isRoll
      ? DEFAULT_ROLL_SIZE
      : {
        ...DEFAULT_A4_SLIM_SIZE,
        columns: columns,
      };

    const layout = getLayout(sizeConfig, expandedItems.length);
    const { metrics } = layout;

    // Roll paper rendering (TSC 100x25mm 3-up roll: 31x24mm labels, 3mm gap)
    if (isRoll) {
      const strips: (BarcodePrintItem & { printIndex: number })[][] = [];
      for (let i = 0; i < expandedItems.length; i += layout.cols) {
        strips.push(expandedItems.slice(i, i + layout.cols));
      }

      return (
        <div
          ref={ref}
          className="roll-barcode-sheet-root bg-white text-black p-0 m-0"
          style={{
            width: '100mm',
            fontFamily:
              '"Noto Sans Lao", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
          }}
        >
          <style type="text/css" media="all">
            {`
              @page {
                size: 100mm 25mm;
                margin: 0mm !important;
              }

              @media print {
                html, body {
                  margin: 0 !important;
                  padding: 0 !important;
                  width: 100mm !important;
                  height: auto !important;
                  background: #ffffff !important;
                  color: #000000 !important;
                  overflow: visible !important;
                }

                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  box-sizing: border-box !important;
                }

                .roll-strip {
                  width: 100mm !important;
                  height: 25mm !important;
                  max-height: 25mm !important;
                  page-break-after: always !important;
                  break-after: page !important;
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                  overflow: hidden !important;
                  box-sizing: border-box !important;
                }

                .roll-strip:last-child,
                .roll-strip-last {
                  page-break-after: avoid !important;
                  break-after: avoid !important;
                  page-break-after: auto !important;
                  break-after: auto !important;
                }

                .roll-label-card {
                  width: 32mm !important;
                  height: 25mm !important;
                  max-height: 25mm !important;
                  padding: 2.0mm 0.8mm 0.8mm 0.8mm !important;
                  display: flex !important;
                  flex-direction: column !important;
                  align-items: center !important;
                  justify-content: center !important;
                  overflow: hidden !important;
                  box-sizing: border-box !important;
                }

                .roll-label-card-first {
                  position: relative !important;
                  left: -1.2mm !important;
                }
              }
            `}
          </style>

          {strips.map((strip, stripIdx) => {
            const isLast = stripIdx === strips.length - 1;
            return (
              <div
                key={`strip-${stripIdx}`}
                className={`roll-strip ${isLast ? 'roll-strip-last' : ''}`}
                style={{
                  width: '100mm',
                  height: '25mm',
                  maxHeight: '25mm',
                  overflow: 'hidden',
                  pageBreakAfter: isLast ? 'avoid' : 'always',
                  breakAfter: isLast ? 'avoid' : 'page',
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '32mm 32mm 32mm',
                    columnGap: '2mm',
                    width: '100mm',
                    height: '25mm',
                    margin: '0 auto',
                    boxSizing: 'border-box',
                  }}
                >
                  {strip.map((lbl, idx) => {
                    const barcodeValue = lbl.barcode || lbl.code || '';
                    const svgHtml = buildBarcodeSvg(barcodeValue, metrics.barcodeW, metrics.barcodeH, 4);
                    const formattedPrice =
                      lbl.price !== undefined && lbl.price > 0
                        ? `${lbl.price.toLocaleString(undefined, { minimumFractionDigits: 0 })} ₭${lbl.unit ? '/' + lbl.unit : ''
                        }`
                        : '';

                    return (
                      <div
                        key={`label-${stripIdx}-${idx}`}
                        className={`roll-label-card ${idx === 0 ? 'roll-label-card-first' : ''}`}
                        style={{
                          width: '32mm',
                          height: '25mm',
                          maxHeight: '25mm',
                          padding: '2.0mm 0.8mm 0.8mm 0.8mm',
                          background: '#FFFFFF',
                          border: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          pageBreakInside: 'avoid',
                          breakInside: 'avoid',
                          boxSizing: 'border-box',
                          position: 'relative',
                          left: idx === 0 ? '-1.2mm' : '0mm',
                        }}
                      >
                      {/* Row 1: CSC Logo + Product Code */}
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          paddingLeft: '0.6mm',
                          gap: '0.8mm',
                          lineHeight: 1,
                          height: '2.5mm',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={CSC_LOGO_DATA_URI}
                          alt="CSC"
                          style={{
                            width: '4.4mm',
                            height: '2.5mm',
                            objectFit: 'contain',
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: '1.9mm',
                            fontWeight: 700,
                            color: '#0F172A',
                            letterSpacing: '0.2px',
                            lineHeight: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {lbl.code || '-'}
                        </span>
                      </div>

                      {/* Row 2: Barcode SVG (centered, crispEdges) */}
                      <div
                        style={{
                          width: '100%',
                          height: `${metrics.barcodeH}mm`,
                          maxHeight: `${metrics.barcodeH}mm`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          marginTop: '0.6mm',
                          marginBottom: '0.4mm',
                        }}
                        dangerouslySetInnerHTML={{ __html: svgHtml }}
                      />

                      {/* Row 3: Barcode text */}
                      <div
                        style={{
                          width: '100%',
                          fontSize: '2.0mm',
                          fontWeight: 500,
                          color: '#374151',
                          textAlign: 'center',
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {barcodeValue}
                      </div>

                      {/* Row 4: Price */}
                      {showPrice && formattedPrice && (
                        <div
                          style={{
                            width: '100%',
                            fontSize: '1.9mm',
                            fontWeight: 700,
                            color: '#0F172A',
                            textAlign: 'center',
                            lineHeight: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            marginTop: '0.4mm',
                          }}
                        >
                          {formattedPrice}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
    }

    // A4 Sheet rendering
    return (
      <div
        ref={ref}
        className="a4-barcode-sheet-root bg-white text-black p-0 m-0"
        style={{
          width: '100%',
          fontFamily:
            '"Noto Sans Lao", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
          padding: '10mm',
          boxSizing: 'border-box',
        }}
      >
        <style type="text/css" media="all">
          {`
            @page {
              size: A4 portrait;
              margin: 0mm;
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
                padding: 10mm !important;
                background: #ffffff !important;
              }

              .barcode-label-card {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }
            }
          `}
        </style>

        {/* Printable Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${layout.columnGapMm}mm`,
            width: '100%',
          }}
        >
          {expandedItems.map((lbl, index) => {
            const barcodeValue = lbl.barcode || lbl.code || '';
            const svgHtml = buildBarcodeSvg(barcodeValue, metrics.barcodeW, metrics.barcodeH);
            const formattedPrice =
              lbl.price !== undefined && lbl.price > 0
                ? `${lbl.price.toLocaleString(undefined, { minimumFractionDigits: 0 })} ₭${lbl.unit ? '/' + lbl.unit : ''
                }`
                : '';

            return (
              <div
                key={`${lbl.id}-${index}`}
                className="barcode-label-card"
                style={{
                  minHeight: `${layout.h}mm`,
                  padding: `${metrics.padV}mm ${metrics.padH}mm`,
                  background: '#FFFFFF',
                  border: '0.25mm solid #E2E8F0',
                  borderRadius: `${metrics.borderR}mm`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: `${Number((metrics.padV * 0.4).toFixed(2))}mm`,
                  overflow: 'hidden',
                  breakInside: 'avoid',
                  pageBreakInside: 'avoid',
                  boxSizing: 'border-box',
                }}
              >
                {/* Header: Logo + Product Name / Code */}
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: `${metrics.logoGap}mm`,
                  }}
                >
                  <img
                    src={CSC_LOGO_DATA_URI}
                    alt="CSC"
                    style={{
                      width: `${metrics.logoW}mm`,
                      height: `${metrics.logoH}mm`,
                      objectFit: 'contain',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {showCode && (
                      <div
                        style={{
                          fontSize: `${metrics.codeFont}mm`,
                          fontWeight: 700,
                          color: '#0F172A',
                          letterSpacing: '0.5px',
                          lineHeight: 1.1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {lbl.code || '-'}
                      </div>
                    )}
                    {showName && lbl.name && (
                      <div
                        style={{
                          fontSize: `${metrics.codeFont * 0.9}mm`,
                          color: '#475569',
                          lineHeight: 1.1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {lbl.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Barcode SVG */}
                <div
                  style={{
                    width: '100%',
                    height: `${metrics.barcodeH}mm`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                  dangerouslySetInnerHTML={{ __html: svgHtml }}
                />

                {/* Barcode text */}
                <div
                  style={{
                    width: '100%',
                    fontSize: `${metrics.subFont}mm`,
                    fontWeight: 500,
                    color: '#374151',
                    textAlign: 'center',
                    lineHeight: 1.15,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: '0.8mm',
                  }}
                >
                  {barcodeValue}
                </div>

                {/* Price */}
                {showPrice && formattedPrice && (
                  <div
                    style={{
                      width: '100%',
                      fontSize: `${metrics.priceFont}mm`,
                      fontWeight: 700,
                      color: '#0F172A',
                      textAlign: 'center',
                      lineHeight: 1.1,
                    }}
                  >
                    {formattedPrice}
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
