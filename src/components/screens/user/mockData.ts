export interface UserItem {
  id: number;
  fullName: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
  avatarInitials: string;
  avatarBgColor: string;
}

export const MOCK_USER_DATA: UserItem[] = [
  {
    id: 1,
    fullName: "ສົມຊາຍ ວັດທະນະກິດ",
    email: "somchai@company.co.th",
    role: "ຜູ້ເບິ່ງແຍງລະບົບ",
    department: "ໄອທີ",
    isActive: true,
    avatarInitials: "ສົມ",
    avatarBgColor: "bg-teal-700",
  },
  {
    id: 2,
    fullName: "ສຸລະໄຊ ພົງໄພບູນ",
    email: "surachai@company.co.th",
    role: "ຜູ້ອະນຸມັດ",
    department: "ໄອທີ",
    isActive: true,
    avatarInitials: "ສຸ",
    avatarBgColor: "bg-purple-600",
  },
  {
    id: 3,
    fullName: "ວິພາ ສຸກສະຫວັດ",
    email: "wipa@company.co.th",
    role: "ຜູ້ໃຊ້",
    department: "ໄອທີ",
    isActive: true,
    avatarInitials: "ວິ",
    avatarBgColor: "bg-blue-600",
  },
  {
    id: 4,
    fullName: "ອອນວັນ ມະນີວົງ",
    email: "orawan@company.co.th",
    role: "ຜູ້ໃຊ້",
    department: "ໄອທີ",
    isActive: true,
    avatarInitials: "ອອນ",
    avatarBgColor: "bg-amber-700",
  },
];
