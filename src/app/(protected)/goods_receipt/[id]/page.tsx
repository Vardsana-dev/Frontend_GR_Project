import React from 'react';
import { GoodsReceiptDetailSection } from '@/components/screens/goods_receipt/GoodsReceiptDetailSection';

interface GoodsReceiptDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GoodsReceiptDetailPage({ params }: GoodsReceiptDetailPageProps) {
  const { id } = await params;
  
  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <GoodsReceiptDetailSection grId={id} />
    </div>
  );
}
