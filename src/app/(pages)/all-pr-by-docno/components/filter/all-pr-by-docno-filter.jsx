import { useState, useEffect } from "react";
import {
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
} from "@/components";

const AllPoByDocNoFilter = ({
  limit,
  searchTerm,
  onLimitChange,
  onSearchChange,
  onApplyFilter,
  onExportExcel,
}) => {
  const [tempLimit, setTempLimit] = useState(limit);

  // Update temp values when props change
  useEffect(() => {
    setTempLimit(limit);
  }, [limit]);

  const handleApplyFilter = () => {
    onLimitChange(tempLimit.toString());
    onApplyFilter();
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row justify-between mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <Label>ຈຳນວນສິນຄ້າ</Label>
          <Select
            value={tempLimit.toString()}
            onValueChange={(value) => setTempLimit(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="ເລືອກຈຳນວນ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="100000">ທັງໝົດ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          className="bg-amber-400 hover:bg-amber-500 hidden md:block"
          onClick={handleApplyFilter}
        >
          ລາຍງານ
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white hidden md:block"
          onClick={onExportExcel}
        >
          Export Excel
        </Button>
      </div>
      <div className="md:w-sm">
        <Label>ຄົ້ນຫາ</Label>
        <Input
          type="text"
          placeholder="ປ້ອນຄຳຄົ້ນຫາ"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-4">
          <Button
            className="bg-amber-400 hover:bg-amber-500"
            onClick={handleApplyFilter}
          >
            ລາຍງານ
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={onExportExcel}
          >
            Export Excel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AllPoByDocNoFilter;
