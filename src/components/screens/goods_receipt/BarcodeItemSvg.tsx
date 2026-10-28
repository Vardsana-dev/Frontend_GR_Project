'use client';

import React, { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';

export interface BarcodeItemSvgProps {
  value: string;
  format?: 'CODE128' | 'EAN13' | 'UPC' | 'CODE39' | 'ITF14';
  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
  margin?: number;
  className?: string;
  textMargin?: number;
}

export function BarcodeItemSvg({
  value,
  format = 'CODE128',
  width = 1.3,
  height = 36,
  displayValue = true,
  fontSize = 11,
  margin = 2,
  textMargin = 2,
  className = '',
}: BarcodeItemSvgProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const rawVal = (value || '').trim();
    if (!rawVal || !svgRef.current) {
      setError(true);
      return;
    }

    try {
      setError(false);

      // Determine appropriate format:
      // If format is EAN13 but value is not 13 digits, fallback to CODE128
      let selectedFormat = format;
      if (format === 'EAN13' && (!/^\d{13}$/.test(rawVal))) {
        selectedFormat = 'CODE128';
      }

      JsBarcode(svgRef.current, rawVal, {
        format: selectedFormat,
        width,
        height,
        displayValue,
        fontSize,
        margin,
        textMargin,
        font: 'monospace',
        background: '#ffffff',
        lineColor: '#000000',
        valid: (valid) => {
          if (!valid) {
            // Attempt fallback to CODE128 if primary format was rejected
            if (selectedFormat !== 'CODE128' && svgRef.current) {
              try {
                JsBarcode(svgRef.current, rawVal, {
                  format: 'CODE128',
                  width,
                  height,
                  displayValue,
                  fontSize,
                  margin,
                  textMargin,
                  font: 'monospace',
                  background: '#ffffff',
                  lineColor: '#000000',
                });
                setError(false);
                return;
              } catch {
                setError(true);
              }
            } else {
              setError(true);
            }
          }
        },
      });
    } catch (err) {
      console.warn(`JsBarcode error for value "${rawVal}":`, err);
      // Secondary fallback attempt to CODE128
      if (format !== 'CODE128' && svgRef.current) {
        try {
          JsBarcode(svgRef.current, rawVal, {
            format: 'CODE128',
            width,
            height,
            displayValue,
            fontSize,
            margin,
            textMargin,
            font: 'monospace',
            background: '#ffffff',
            lineColor: '#000000',
          });
          setError(false);
          return;
        } catch {
          // Both failed
        }
      }
      setError(true);
    }
  }, [value, format, width, height, displayValue, fontSize, margin, textMargin]);

  if (!value || error) {
    return (
      <div className={`flex flex-col items-center justify-center p-1 text-center ${className}`}>
        <span className="font-mono text-xs font-bold text-gray-700 tracking-wider">
          {value || 'NO BARCODE'}
        </span>
        <span className="text-[10px] text-amber-600 font-medium">ບໍ່ສາມາດສ້າງບາໂຄດໄດ້</span>
      </div>
    );
  }

  return (
    <svg
      ref={svgRef}
      className={`block mx-auto max-w-full h-auto ${className}`}
      style={{ shapeRendering: 'crispEdges' }}
    />
  );
}
