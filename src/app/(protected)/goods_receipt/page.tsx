import React from 'react';
import { GoodsReceiptSection } from '@/components/screens/goods_receipt/GoodsReceiptSection';

export const metadata = {
  title: "ຮັບສິນຄ້າ - GR System",
  description: "ຮັບສິນຄ້າ (Goods Receipt)",
};

export default function GoodsReceiptPage() {
  return (
    <div className="pb-8">
      <GoodsReceiptSection />
    </div>
  );
}

