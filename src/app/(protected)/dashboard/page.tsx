// @ts-nocheck
"use client";

import React, { useEffect } from 'react';
import { StatCard } from '@/components/screens/dashboard/StatCard';
import { PoStatusChart } from '@/components/screens/dashboard/PoStatusChart';
import { TopSuppliers } from '@/components/screens/dashboard/TopSuppliers';
import { LatestPoTable } from '@/components/screens/dashboard/LatestPoTable';
import { GrListSection } from '@/components/screens/dashboard/GrListSection';
import { useDashboardSummary } from '@/hooks/dashboard-hook/useDashboardSummary';

export default function DashboardPage() {
  const { data, loading, fetchCurrentSummary } = useDashboardSummary();

  useEffect(() => {
    fetchCurrentSummary();
  }, [fetchCurrentSummary]);

  const summary = data?.summary;
  const statusBreakdown = data?.statusBreakdown || {};
  const topSuppliers = data?.topSuppliers || [];
  const latestPurchaseOrders = data?.latestPurchaseOrders || [];

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Top Layout: Left Column (Stats + Latest POs) and Right Column (Top Suppliers) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              title="ໃບສັ່ງຊື້ທັງໝົດ (PO)"
              value={loading ? "..." : (summary?.totalPurchaseOrders || 0)}
              dotColor="blue"
              subText={
                <span className="text-gray-400">
                  ທຽບກັບເດືອນຜ່ານມາ <span className={summary?.percentChangeFromPreviousMonth && summary?.percentChangeFromPreviousMonth < 0 ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
                    {summary?.percentChangeFromPreviousMonth != null
                      ? `${summary?.percentChangeFromPreviousMonth > 0 ? '+' : ''}${summary?.percentChangeFromPreviousMonth}%`
                      : "0%"}
                  </span>
                </span>
              }
            />
            <StatCard
              title="ຮັບສິນຄ້າແລ້ວມື້ນີ້"
              value={loading ? "..." : (summary?.received || 0)}
              dotColor="green"
              subText={<span className="text-gray-400">ອັບເດດລ່າສຸດ 10 ນາທີກ່ອນ</span>}
            />
          </div>

          {/* Latest PO Table */}
          <div className="flex-1">
            {loading ? (
              <div className="h-full bg-white rounded-2xl animate-pulse min-h-[300px]"></div>
            ) : (
              <LatestPoTable latestPos={latestPurchaseOrders} />
            )}
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          {loading ? (
            <div className="h-full bg-white rounded-2xl animate-pulse min-h-[500px]"></div>
          ) : (
            <TopSuppliers suppliers={topSuppliers} />
          )}
        </div>
      </div>

      {/* Bottom Section: Search, Filters & GR Table */}
      <GrListSection />

    </div>
  );
}
