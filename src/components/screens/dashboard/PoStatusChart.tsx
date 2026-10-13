// @ts-nocheck
"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSummaryResponse } from "@/hooks/dashboard-hook/useDashboardSummary";

// Map colors to specific status keys
const STATUS_COLORS: Record<string, string> = {
  "GR ຮັບເຂົ້າແລ້ວ": "#1b58ff", // blue
  "GR ຍັງບໍ່ທັນຮັບເຂົ້າ": "#f59e0b", // yellow/orange
  "GR ຮັບເຂົ້າບາງສ່ວນ": "#ef4444", // red
};

export function PoStatusChart({ statusBreakdown = {} }: { statusBreakdown?: DashboardSummaryResponse['statusBreakdown'] }) {
  const chartData = useMemo(() => {
    return Object.entries(statusBreakdown).map(([name, value]) => ({
      name,
      value,
      color: STATUS_COLORS[name] || "#d1d5db", // default gray if unknown
    }));
  }, [statusBreakdown]);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="shadow-sm border-gray-200/60 rounded-2xl h-full flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-bold text-[#1f2937]">ສະຖານະໃບສັ່ງຊື້ (PO Status)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pt-4 pb-6">
        <div className="flex w-full items-center">
          {/* Chart Side */}
          <div className="w-[180px] h-[180px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.length > 0 ? chartData : [{ value: 1, color: "#f3f4f6" }]} // Empty state handling
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  stroke="none"
                  paddingAngle={0}
                  dataKey="value"
                >
                  {chartData.length > 0 ? (
                    chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))
                  ) : (
                    <Cell fill="#f3f4f6" />
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-4xl font-bold text-[#1f2937] leading-none">{total}</span>
            </div>
          </div>

          {/* Legend Side */}
          <div className="ml-8 flex flex-col gap-4">
            {chartData.map((item, index) => {
              const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-500">
                    {item.name} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
