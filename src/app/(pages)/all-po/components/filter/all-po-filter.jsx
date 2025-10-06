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

const AllPoFilter = ({
  limit,
  searchTerm,
  level,
  onLimitChange,
  onSearchChange,
  onLevelChange,
  onApplyFilter,
}) => {
  const [tempLimit, setTempLimit] = useState(limit);
  const [tempLevel, setTempLevel] = useState(level);
  const [tempLevelInput, setTempLevelInput] = useState(level.toString());

  // Update temp values when props change
  useEffect(() => {
    setTempLimit(limit);
    setTempLevel(level);
    setTempLevelInput(level.toString());
  }, [limit, level]);

  const handleApplyFilter = () => {
    onLimitChange(tempLimit.toString());
    onLevelChange(tempLevel.toString());
    onApplyFilter();
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row justify-between mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-end">
        <div className="grid grid-cols-2 gap-4 md:hidden">
          <div className="md:w-[100px]">
            <Label>ຈຳນວນສັ່ງຊື້</Label>
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
          <div className="md:w-[100px]">
            <Label>ລະດັບ</Label>
            <Select
              value={tempLevel.toString()}
              onValueChange={(value) => setTempLevel(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="ເລືອກລະດັບ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">ທັງໝົດ</SelectItem>
                <SelectItem value="1">ລະດັບ 1</SelectItem>
                <SelectItem value="2">ລະດັບ 2</SelectItem>
                <SelectItem value="3">ລະດັບ 3</SelectItem>
                <SelectItem value="4">ລະດັບ 4</SelectItem>
                <SelectItem value="5">ລະດັບ 5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="md:w-[100px] hidden md:block">
          <Label>ຈຳນວນສັ່ງຊື້</Label>
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

        {/* <div className="md:w-[100px] hidden md:block">
          <Label>ລະດັບ</Label>
          <Select
            value={tempLevel.toString()}
            onValueChange={(value) => setTempLevel(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="ເລືອກລະດັບ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">ທັງໝົດ</SelectItem>
              <SelectItem value="1">ລະດັບ 1</SelectItem>
              <SelectItem value="2">ລະດັບ 2</SelectItem>
              <SelectItem value="3">ລະດັບ 3</SelectItem>
              <SelectItem value="4">ລະດັບ 4</SelectItem>
              <SelectItem value="5">ລະດັບ 5</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        <div className="md:w-[100px] hidden md:block">
          <Label>ລະດັບ</Label>
          <Input
            type="number"
            placeholder="ປ້ອນລະດັບ"
            value={tempLevelInput}
            onChange={(e) => {
              setTempLevelInput(e.target.value);
              const numValue = parseInt(e.target.value);
              if (!isNaN(numValue)) {
                setTempLevel(numValue);
              }
            }}
            min="0"
            max="20"
          />
        </div>

        <Button
          className="bg-amber-400 hover:bg-amber-500 hidden md:block"
          onClick={handleApplyFilter}
        >
          ລາຍງານ
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

      <Button
        className="bg-amber-400 hover:bg-amber-500 md:hidden"
        onClick={handleApplyFilter}
      >
        ລາຍງານ
      </Button>
    </div>
  );
};

export default AllPoFilter;
