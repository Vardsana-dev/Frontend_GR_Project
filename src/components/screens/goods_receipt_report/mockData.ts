export interface ReportDataItem {
  id: number;
  creditorCode: string;
  poNumber: string;
  supplier: string;
  poValue: number | null;
  invoiceValue: number | null;
  damagedValue: number | null;
  incompleteValue: number | null;
  otherValue: number | null;
  receivedValue: number | null;
  remark: string;
}

export const MOCK_SUMMARY_DATA = {
  totalPoValue: 90000,
  totalInvoiceValue: 90000,
  goodsReceivedValue: 90000,
  totalPos: 90000 // Using the 90,000K format from the image for visual matching
};

export const MOCK_REPORT_DATA: ReportDataItem[] = [
  {
    id: 1,
    creditorCode: "SP90-690666",
    poNumber: "PO-2026-00470",
    supplier: "PT Sumber Makmur Sentosa CV Berkah Distribusi",
    poValue: 90000,
    invoiceValue: 90000,
    damagedValue: 90000,
    incompleteValue: 9090090,
    otherValue: null,
    receivedValue: 9090090,
    remark: "ຫັກ 3 pcs sw798099890087-09",
  },
  {
    id: 2,
    creditorCode: "SP90-690666",
    poNumber: "PO-2026-00470",
    supplier: "PT Sumber Makmur Sentosa CV Berkah Distribusi",
    poValue: null,
    invoiceValue: 90000,
    damagedValue: null,
    incompleteValue: null,
    otherValue: null,
    receivedValue: 90000,
    remark: "ຫັກ 3 ລະຫັດ sw79809",
  },
  {
    id: 3,
    creditorCode: "SP90-690666",
    poNumber: "PO-2026-00468",
    supplier: "PT Cahaya Elektrindo CV Berkah Distribusi",
    poValue: null,
    invoiceValue: null,
    damagedValue: null,
    incompleteValue: 9090090,
    otherValue: null,
    receivedValue: 90000,
    remark: "ຫັກ 3 ລະຫັດ sw79809",
  },
  {
    id: 4,
    creditorCode: "SP90-690666",
    poNumber: "PO-2026-00475",
    supplier: "CV Berkah Distribusi CV Berkah Distribusi",
    poValue: null,
    invoiceValue: null,
    damagedValue: null,
    incompleteValue: null,
    otherValue: null,
    receivedValue: null,
    remark: "ຫັກ 3 ລະຫັດ sw79809",
  },
];
