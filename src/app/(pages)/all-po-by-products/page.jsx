"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { usePOByProducts } from "./hooks/use-po-by-products";
import {
  Title,
  LoadingSpinner,
} from "@/components";
import AllPoByProductsTable from "./components/table/all-po-by-products-table";

function AllPoByProductsContent() {
  const searchParams = useSearchParams();
  const [productCode, setProductCode] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const { data, loading, error, fetchPOByProduct, clearData } = usePOByProducts();

  // รับ productCode จาก URL parameters - เรียกแค่ครั้งเดียว
  useEffect(() => {
    if (!isInitialized) {
      const codeFromUrl = searchParams.get('productCode');
      if (codeFromUrl) {
        setProductCode(codeFromUrl);
        fetchPOByProduct(codeFromUrl);
        setIsInitialized(true);
      }
    }
  }, [searchParams, isInitialized, fetchPOByProduct]);

  return (
    <div className="mx-auto space-y-6">
      <AllPoByProductsTable
        data={data}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default function AllPoByProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AllPoByProductsContent />
    </Suspense>
  );
}