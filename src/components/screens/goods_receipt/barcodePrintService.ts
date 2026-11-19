import CODE128_AUTO_RAW from 'jsbarcode/bin/barcodes/CODE128/CODE128_AUTO.js';
import { CSC_LOGO_DATA_URI } from './cscLogoDataUri';

const CODE128_AUTO: any = (CODE128_AUTO_RAW as any)?.default || CODE128_AUTO_RAW;

// Printable area of an A4 page with 10 mm margins.
export const A4_W = 190;
export const A4_H = 277;

// Default 3x1 roll specification (TSC / 100x25mm 3-up roll: 32x25mm label, 2mm gap)
export const DEFAULT_BARCODE_CONFIG = {
  paper: { widthMm: 100, heightMm: 25, marginMm: 0 },
  label: { widthMm: 32, heightMm: 25, paddingMm: 0.8 },
  grid: { columns: 3, rows: 1, columnGapMm: 2, rowGapMm: 0 },
  jsBarcode: {
    format: 'CODE128',
    width: 1,
    height: 26,
    margin: 4,
    displayValue: false,
    background: 'transparent',
    lineColor: '#000000',
  },
  svgStyle: {
    width: '100%',
    height: 'auto',
    shapeRendering: 'crispEdges',
  },
};

export interface LabelSizeConfig {
  id?: string;
  name?: string;
  paper?: 'roll' | 'A4' | 'a4' | string;
  paperWmm?: number;
  paperHmm?: number;
  marginMm?: number;
  labelWmm?: number;
  labelHmm?: number;
  paddingMm?: number;
  columns?: number;
  rows?: number;
  columnGapMm?: number;
  rowGapMm?: number;
  selected?: boolean;
}

export const DEFAULT_ROLL_SIZE: LabelSizeConfig = {
  id: '1',
  name: '3 x 1 (100×25mm)',
  paperWmm: 100,
  paperHmm: 25,
  marginMm: 0,
  labelWmm: 32,
  labelHmm: 25,
  paddingMm: 0.8,
  columns: 3,
  rows: 1,
  columnGapMm: 2,
  rowGapMm: 0,
  paper: 'roll',
  selected: true,
};

// Default print size: A4 sheet, 3 columns x 5 rows of 63.5 x 38.1 mm labels.
export const DEFAULT_A4_SLIM_SIZE: LabelSizeConfig = {
  id: '3',
  name: '3 x 5 (A4 Slim)',
  labelWmm: 63.5,
  labelHmm: 38.1,
  columns: 3,
  paper: 'A4',
  selected: true,
};

// Converts millimetres to points (1/72 inch).
const MM_TO_PT = 72 / 25.4;
export const mmToPt = (mm: number) => Math.round(mm * MM_TO_PT);

// CODE128 barcode sized in millimetres: fills widthMm x heightMm exactly
export const buildBarcodeSvg = (
  value: string | number,
  widthMm: number,
  heightMm: number,
  quietModules: number = DEFAULT_BARCODE_CONFIG.jsBarcode.margin
): string => {
  try {
    const rawVal = String(value || '').trim();
    if (!rawVal) return '';

    const auto = new CODE128_AUTO(rawVal, {});
    const { data } = auto.encode();
    if (!data || typeof data !== 'string') return '';

    const totalModules = data.length + quietModules * 2;
    const moduleMm = widthMm / totalModules;
    const viewH = heightMm / moduleMm;

    const bars: string[] = [];
    let x = quietModules;
    for (let i = 0; i < data.length; ) {
      if (data[i] === '1') {
        let run = 0;
        while (data[i + run] === '1') run++;
        bars.push(`<rect x="${x}" y="0" width="${run}" height="${viewH}"/>`);
        x += run;
        i += run;
      } else {
        x++;
        i++;
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${widthMm}mm" height="${heightMm}mm" viewBox="0 0 ${totalModules} ${viewH}" preserveAspectRatio="none" shape-rendering="crispEdges" style="display: block; width: 100%; height: auto; shape-rendering: crispEdges; margin: 0 auto;"><g fill="#000000">${bars.join('')}</g></svg>`;
  } catch (err) {
    console.warn(`Error generating barcode SVG for "${value}":`, err);
    return '';
  }
};

// Page, grid, and balanced typography calibrated for roll and A4 labels
export const getLayout = (size: LabelSizeConfig = DEFAULT_ROLL_SIZE, labelCount: number = 1) => {
  const isRoll = size.paper === 'roll';

  if (isRoll) {
    const paperW = size.paperWmm ?? DEFAULT_BARCODE_CONFIG.paper.widthMm;
    const paperH = size.paperHmm ?? DEFAULT_BARCODE_CONFIG.paper.heightMm;
    const w = size.labelWmm ?? DEFAULT_BARCODE_CONFIG.label.widthMm;
    const h = size.labelHmm ?? DEFAULT_BARCODE_CONFIG.label.heightMm;
    const cols = size.columns ?? DEFAULT_BARCODE_CONFIG.grid.columns;
    const columnGapMm = size.columnGapMm ?? DEFAULT_BARCODE_CONFIG.grid.columnGapMm;
    const rowGapMm = size.rowGapMm ?? DEFAULT_BARCODE_CONFIG.grid.rowGapMm;
    const stripRows = Math.max(1, Math.ceil(labelCount / cols));

    // Inner usable area inside 32x25mm label with 0.8mm padding
    const padV = size.paddingMm ?? DEFAULT_BARCODE_CONFIG.label.paddingMm;
    const padH = size.paddingMm ?? DEFAULT_BARCODE_CONFIG.label.paddingMm;
    const innerW = Number((w - 2 * padH).toFixed(2)); // 32 - 1.6 = 30.4mm

    const metrics = {
      padV,
      padH,
      logoW: 4.4,
      logoH: 2.5,
      logoGap: 0.8,
      codeFont: 1.9,    // ~5.4pt bold
      subFont: 2.0,     // ~5.7pt medium
      priceFont: 1.9,   // ~5.4pt bold
      barcodeH: 9.5,    // 9.5mm bar height
      barcodeW: innerW, // 30.4mm width
      borderR: 1.5,
    };

    return {
      isRoll: true,
      pageCss: `size: ${paperW}mm ${paperH}mm; margin: 0mm;`,
      pageWpt: mmToPt(paperW),
      pageHpt: mmToPt(paperH),
      paperW,
      paperH,
      bodyPad: '0mm',
      cols,
      stripRows,
      w,
      h,
      columnGapMm,
      rowGapMm,
      metrics,
    };
  }

  // A4
  const w = size.labelWmm ?? 63.5;
  const h = size.labelHmm ?? 38.1;
  const cols = size.columns ?? 3;
  const columnGapMm = size.columnGapMm ?? 2.5;
  const rowGapMm = size.rowGapMm ?? 2.5;
  const stripRows = Math.max(1, Math.ceil(labelCount / cols));

  const metrics = {
    padV: 1.5,
    padH: 2.0,
    logoW: 7.5,
    logoH: 4.6,
    logoGap: 1.2,
    codeFont: 3.2,
    subFont: 3.0,
    priceFont: 3.2,
    barcodeH: 15.0,
    barcodeW: 55.0,
    borderR: 2.0,
  };

  return {
    isRoll: false,
    pageCss: 'size: A4; margin: 0;',
    pageWpt: 595,
    pageHpt: 842,
    paperW: 210,
    paperH: 297,
    bodyPad: '10mm',
    cols,
    stripRows,
    w,
    h,
    columnGapMm,
    rowGapMm,
    metrics,
  };
};

export interface PrintableLabelItem {
  id?: string;
  code: string;
  name?: string;
  barcode: string;
  qty?: number;
  price?: number;
  unit?: string;
}
