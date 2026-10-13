// @ts-nocheck
import React from "react";

import { TableRow, TableCell } from "@/components/ui/table";

export const Spinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        className="animate-spin text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export const LoadingSpinner = ({
  text = "ກຳລັງໂຫຼດຂໍ້ມູນ...",
  size = "md",
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Spinner size={size} />
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
};

export const TableLoadingSpinner = ({ colSpan = 14 }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-12">
        <LoadingSpinner text="ກຳລັງໂຫຼດຂໍ້ມູນ..." size="lg" />
      </TableCell>
    </TableRow>
  );
};
