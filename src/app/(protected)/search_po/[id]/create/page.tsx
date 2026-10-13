// @ts-nocheck
import React, { Suspense } from 'react';
import { CreateGrSection } from '@/components/screens/search_po/CreateGrSection';

export default async function CreateGoodsReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="pb-8">
      <Suspense fallback={<div>Loading...</div>}>
        <CreateGrSection poNumber={resolvedParams.id} />
      </Suspense>
    </div>
  );
}
