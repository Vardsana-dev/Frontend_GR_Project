import React from 'react';
import { GoodsReceiptDetailSection } from '@/components/screens/goods_receipt/GoodsReceiptDetailSection';

interface GoodsReceiptDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = {
  title: "ລາຍລະອຽດການຮັບສິນຄ້າ - GR System",
  description: "ລາຍລະອຽດການຮັບສິນຄ້າ (Goods Receipt Detail)",
};

export default async function GoodsReceiptDetailPage({ params }: GoodsReceiptDetailPageProps) {
  const { id } = await params;
  
  return (
    <div className="pb-8">
      <GoodsReceiptDetailSection grId={id} />
    </div>
  );
}
