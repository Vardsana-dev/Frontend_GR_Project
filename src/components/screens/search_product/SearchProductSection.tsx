'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, Search, Package, Image as ImageIcon } from 'lucide-react';
import { useGetProductList } from '@/hooks/product-hook/useGetProductList';
import Image from 'next/image';
import { ProductDetailView } from '@/components/screens/search_product/ProductDetailView';
import { AddBarcodeDialog } from '@/components/dialogs/AddBarcodeDialog';
import { StandardPagination } from '@/components/customs/StandardPagination';
import { normalizeProductImageUrl } from '@/lib/imageUtils';

export function SearchProductSection() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isAddBarcodeOpen, setIsAddBarcodeOpen] = useState(false);

  const { data, loading, fetchProductList } = useGetProductList();

  useEffect(() => {
    fetchProductList({ search, page, limit });
  }, [fetchProductList, search, page, limit]);

  const items = data?.items || [];
  const totalItems = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  if (selectedProduct) {
    return <ProductDetailView productCode={selectedProduct} onBack={() => setSelectedProduct(null)} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Card */}
      <Card className="shadow-sm border-gray-200/60 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-4">

            {/* Search Bar */}
            <div className="w-full lg:flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                className="pl-10 h-12 bg-gray-100/80 border-transparent rounded-full focus-visible:ring-1 focus-visible:ring-gray-300"
                placeholder="ຄົ້ນຫາສິນຄ້າ..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // Reset to page 1 on search
                }}
              />
            </div>

            {/* Right side filters & button */}
            <div className="flex flex-col sm:flex-row items-end gap-4 w-full lg:w-auto">
              {/* Category Filter - Disabled for now as API doesn't support dropdown yet */}
              {/* <div className="w-full sm:w-64">
                <label className="text-sm font-semibold text-gray-500 mb-1.5 block">ປະເພດສິນຄ້າ</label>
                <div className="relative">
                  <Input type="text" value="ທັງໝົດ" readOnly className="bg-[#eef2ff] border-transparent text-[#1f3a8a] h-11 font-medium rounded-lg cursor-pointer" />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1f3a8a]" />
                </div>
              </div> */}

              <Button
                onClick={() => setIsAddBarcodeOpen(true)}
                className="h-11 px-6 bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-lg whitespace-nowrap w-full sm:w-auto"
              >
                ເພີ່ມບາໂຄດ
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-10"><span className="text-gray-500 font-bold">ກຳລັງໂຫຼດ...</span></div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {items.map((product: any, idx: number) => (
            <Card
              key={product.code || idx}
              className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:bg-gray-50/50 transition-colors cursor-pointer"
              onClick={() => setSelectedProduct(product.code)}
            >
              <CardContent className="p-4 flex gap-4">
                {/* Product Image Placeholder */}
                <div className="w-32 h-32 shrink-0 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden relative">
                  {(() => {
                    const rawImg = product.imageUrl || product.image || (Array.isArray(product.images) && product.images[0]?.url ? product.images[0].url : product.images?.[0]);
                    const displayImg = normalizeProductImageUrl(rawImg);
                    return displayImg ? (
                      <Image src={displayImg} alt={product.nameen || product.nameth || 'Product'} layout="fill" objectFit="cover" unoptimized />
                    ) : (
                      <Package className="w-10 h-10 text-gray-300" />
                    );
                  })()}
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <div className="text-sm text-gray-600 font-medium mb-1">
                    ລະຫັດສິນຄ້າ : {product.code}
                  </div>
                  <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-2 line-clamp-2" title={product.nameen || product.nameth}>
                    {product.nameen || product.nameth}
                  </h3>

                  <div className="bg-gray-50 text-gray-600 text-sm px-3 py-1.5 rounded-md w-full truncate">
                    Barcode {product.primaryBarcode || product.code}
                  </div>

                  {product.barcodeCount > 1 && (
                    <div className="text-blue-600 text-sm font-medium mt-1 hover:underline cursor-pointer inline-block">
                      +{product.barcodeCount - 1} Barcode
                    </div>
                  )}

                  <div className="text-gray-400 text-sm mt-1">
                    ຫົວໜ່ວຍ ({product.stockunit || '-'})
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && (
            <div className="col-span-2 text-center py-10 text-gray-500 font-bold">ບໍ່ພົບຂໍ້ມູນສິນຄ້າ</div>
          )}
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && items.length > 0 && (
        <StandardPagination
          page={page}
          totalPages={totalPages}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          className="rounded-xl border border-gray-100"
        />
      )}

      {/* Add Barcode Dialog */}
      <AddBarcodeDialog
        isOpen={isAddBarcodeOpen}
        onClose={() => setIsAddBarcodeOpen(false)}
        onSuccess={() => {
          fetchProductList({ search, page, limit });
        }}
      />

    </div>
  );
}
