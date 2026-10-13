// @ts-nocheck
import React, { Suspense } from 'react';
import { PoDetailSection } from '@/components/screens/search_po/PoDetailSection';

export default async function PoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="pb-8">
      <Suspense fallback={<div>Loading...</div>}>
        <PoDetailSection poNumber={resolvedParams.id} />
      </Suspense>
    </div>
  );
}
