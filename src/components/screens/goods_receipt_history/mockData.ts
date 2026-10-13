export type GoodsReceiptStatus = "SUCCESS" | "PARTIAL" | "REJECTED";

export interface GoodsReceiptHistoryItem {
  id: string;
  sequenceNo: number;
  poNumber: string;
  companyName: string;
  receivedDate: string; // DD/MM/YYYY
  quantity: number;
  receiverName: string;
  status: GoodsReceiptStatus;
}

export const mockHistoryData: GoodsReceiptHistoryItem[] = [
  {
    id: "1",
    sequenceNo: 1,
    poNumber: "PO-2026-00310",
    companyName: "ບໍລິສັດ ຈະເລີນໄຊ ການຄ້າ ຈຳກັດ",
    receivedDate: "16/07/2026",
    quantity: 12,
    receiverName: "ນາງ ສຸພາພອນ",
    status: "SUCCESS",
  },
  {
    id: "2",
    sequenceNo: 2,
    poNumber: "PO-2026-00309",
    companyName: "ວິສາຫະກິດ ພັດທະນາໄຟຟ້າ ລາວ",
    receivedDate: "16/07/2026",
    quantity: 6,
    receiverName: "ນາງ ສຸພາພອນ",
    status: "SUCCESS",
  },
  {
    id: "3",
    sequenceNo: 3,
    poNumber: "PO-2026-00308",
    companyName: "Siam Cement Group (SCG) Lao",
    receivedDate: "15/07/2026",
    quantity: 32,
    receiverName: "ນາງ ສຸພາພອນ",
    status: "SUCCESS",
  },
  {
    id: "4",
    sequenceNo: 5,
    poNumber: "PO-2026-00306",
    companyName: "DKSH Lao Co., Ltd",
    receivedDate: "13/07/2026",
    quantity: 18,
    receiverName: "ນາງ ສຸພາພອນ",
    status: "PARTIAL",
  },
  {
    id: "5",
    sequenceNo: 6,
    poNumber: "PO-2026-00305",
    companyName: "ບໍລິສັດ ສະຕາຣ ໂທລະຄົມ ຈຳກັດ",
    receivedDate: "12/07/2026",
    quantity: 4,
    receiverName: "ນາງ ສຸພາພອນ",
    status: "SUCCESS",
  },
  {
    id: "6",
    sequenceNo: 7,
    poNumber: "PO-2026-00304",
    companyName: "Lao Petroleum State Enterprise",
    receivedDate: "11/07/2026",
    quantity: 15,
    receiverName: "ນາງ ສຸພາພອນ",
    status: "REJECTED",
  },
  {
    id: "7",
    sequenceNo: 8,
    poNumber: "PO-2026-00303",
    companyName: "Souvanny Home Center",
    receivedDate: "10/07/2026",
    quantity: 22,
    receiverName: "ນາງ ສຸພາພອນ",
    status: "REJECTED",
  },
];
