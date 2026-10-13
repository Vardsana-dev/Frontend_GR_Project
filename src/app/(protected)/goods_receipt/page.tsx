import React from 'react';
import { GoodsReceiptSection } from '@/components/screens/goods_receipt/GoodsReceiptSection';

export default function GoodsReceiptPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen">
      <div className="p-6">
        <GoodsReceiptSection />
      </div>
    </div>
  );
}
