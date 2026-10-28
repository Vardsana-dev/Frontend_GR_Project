// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface StandardPaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  className?: string;
  showLimitControl?: boolean;
}

export function StandardPagination({
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
  className = "",
  showLimitControl = true,
}: StandardPaginationProps) {
  const [limitInput, setLimitInput] = useState<string>(String(limit || 10));

  useEffect(() => {
    setLimitInput(String(limit || 10));
  }, [limit]);

  const commitLimit = (rawVal: string) => {
    if (!onLimitChange) return;
    const parsed = parseInt(rawVal, 10);
    if (isNaN(parsed) || parsed < 1) {
      setLimitInput(String(limit || 10));
    } else {
      setLimitInput(String(parsed));
      if (parsed !== limit) {
        onLimitChange(parsed);
      }
    }
  };

  const safeTotalPages = Math.max(1, totalPages || 1);

  // Generate page list
  const pages: (number | string)[] = [];
  if (safeTotalPages <= 5) {
    for (let i = 1; i <= safeTotalPages; i++) pages.push(i);
  } else {
    if (page <= 3) {
      pages.push(1, 2, 3, "...", safeTotalPages);
    } else if (page >= safeTotalPages - 2) {
      pages.push(1, "...", safeTotalPages - 2, safeTotalPages - 1, safeTotalPages);
    } else {
      pages.push(1, "...", page - 1, page, page + 1, "...", safeTotalPages);
    }
  }

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-white gap-4 ${className}`}
    >
      {/* Page Size / Limit Input */}
      {showLimitControl ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>ສະແດງ</span>
          <Input
            type="number"
            min={1}
            value={limitInput}
            onChange={(e) => {
              setLimitInput(e.target.value);
            }}
            onBlur={() => commitLimit(limitInput)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commitLimit(limitInput);
                (e.target as HTMLInputElement).blur();
              }
            }}
            className="w-16 h-8 text-center text-gray-700 bg-white border-gray-200 rounded-md font-normal shadow-none focus-visible:ring-1 focus-visible:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span>ລາຍການ</span>
        </div>
      ) : (
        <div />
      )}

      {/* Pagination Buttons */}
      <div className="flex items-center gap-1.5 text-sm text-gray-600">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>ຍ້ອນກັບ</span>
        </button>

        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-400 select-none">
                ...
              </span>
            );
          }

          const isCurrent = p === page;
          return (
            <button
              key={`page-${p}`}
              type="button"
              onClick={() => onPageChange(Number(p))}
              className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-md font-medium text-sm transition-colors ${
                isCurrent
                  ? "border border-gray-200 text-[#1e3a8a] bg-white shadow-xs font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(safeTotalPages, page + 1))}
          disabled={page >= safeTotalPages}
          className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span>ຕໍ່ໄປ</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
