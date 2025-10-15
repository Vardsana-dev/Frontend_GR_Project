"use client"

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

const AllPrFilter = ({
  limit,
  searchTerm,
  department,
  onLimitChange,
  onSearchChange,
  onDepartmentChange,
  onApplyFilter,
  usePRDepartment,
}) => {
  const [tempLimit, setTempLimit] = useState(limit);
  const [selectedDepartment, setSelectedDepartment] = useState(department);

  useEffect(() => {
    setTempLimit(limit);
  }, [limit]);

  useEffect(() => {
    setSelectedDepartment(department === "" ? "empty" : department);
  }, [department]);

  const handleApplyFilter = () => {
    onLimitChange(tempLimit.toString());
    // แปลง "empty" เป็นค่าว่างก่อนส่งไป API
    const departmentValue = selectedDepartment === "empty" ? "" : selectedDepartment;
    onDepartmentChange(departmentValue);
    onApplyFilter();
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { departments, loading } = usePRDepartment();

  return (
    <div className="flex flex-col gap-6 md:flex-row justify-between mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-end">
        <div className="hidden md:block min-w-[150px]">
          <Label>ຈຳນວນສັ່ງຊື້</Label>
          {isClient && (
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
          )}
        </div>

        <div className="hidden md:block min-w-[150px]">
          <Label>ພະແນກ</Label>
          {isClient && (
            <Select
              value={selectedDepartment}
              onValueChange={(value) => setSelectedDepartment(value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="ເລືອກພະແນກ" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>ກຳລັງໂຫຼດ...</SelectItem>
                ) : (
                  <>
                    {departments.map((department) => {
                      const value = department.DEPARTMENT === "" ? "empty" : department.DEPARTMENT;
                      const label = department.DEPARTMENT === "" ? "ທັງໝົດ" : department.DEPARTMENT;
                      return (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </>
                )}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* mobile filter */}
        <div className="grid grid-cols-2 gap-4 md:hidden">
          <div>
            <Label>ຈຳນວນສັ່ງຊື້</Label>
            {isClient && (
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
            )}
          </div>

          <div>
            <Label>ພະແນກ</Label>
            {isClient && (
              <Select
                value={selectedDepartment}
                onValueChange={(value) => setSelectedDepartment(value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ເລືອກພະແນກ" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="loading" disabled>ກຳລັງໂຫຼດ...</SelectItem>
                  ) : (
                    <>
                      {departments.map((department) => {
                        const value = department.DEPARTMENT === "" ? "empty" : department.DEPARTMENT;
                        const label = department.DEPARTMENT === "" ? "ຄ່າວ່າງ" : department.DEPARTMENT;
                        return (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        );
                      })}
                    </>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <Button
          className="bg-amber-400 hover:bg-amber-500 hidden md:block"
          onClick={handleApplyFilter}
          suppressHydrationWarning={true}
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
          suppressHydrationWarning={true}
        />
      </div>

      <Button
        className="bg-amber-400 hover:bg-amber-500 md:hidden"
        onClick={handleApplyFilter}
        suppressHydrationWarning={true}
      >
        ລາຍງານ
      </Button>
    </div>
  );
};

export default AllPrFilter;
