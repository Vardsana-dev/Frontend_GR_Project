// @ts-nocheck
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  dotColor?: 'blue' | 'yellow' | 'green' | 'red';
  subText?: React.ReactNode;
  className?: string;
}

const colorMap = {
  blue: 'bg-blue-600',
  yellow: 'bg-yellow-600',
  green: 'bg-green-600',
  red: 'bg-red-500',
};

export function StatCard({ title, value, dotColor = 'blue', subText, className }: StatCardProps) {
  return (
    <Card className={cn("shadow-sm border-gray-200/60 rounded-2xl overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-semibold text-gray-500/90 truncate">{title}</h3>
          <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0 ml-1", colorMap[dotColor])} />
        </div>
        <div className="text-[28px] xl:text-[32px] font-bold text-[#1f3a8a] mb-1 leading-tight">{value}</div>
        <div className="text-xs text-gray-400 h-4 truncate">
          {subText}
        </div>
      </CardContent>
    </Card>
  );
}
