import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export interface ProductUnit {
  unitcode: string;
  barcode: string;
  barcodetext: string;
  closed: boolean;
}

export interface ProductDetail {
  code: string;
  nameth: string;
  nameen: string;
  maingroup: string;
  subgroup1: string;
  stockunit: string;
  stockqty: number;
  closed: boolean;
  imageUrl: string | null;
  oldcode: string;
  description: string;
  subgroup2: string;
  subgroup3: string;
  subgroup4: string;
  subgroup5: string;
  saleunit: string;
  pounit: string;
  stockqtywh: number;
  stockqtygi: number;
  minstock: number;
  images: string[];
  units: ProductUnit[];
  syncedAt: string;
}

export const useGetEachProductDetail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<ProductDetail | null>(null);

  const fetchProductDetail = useCallback(async (productId: string) => {
    if (!productId) {
      const errorMsg = "Product ID is required";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      let envEndpoint = process.env.NEXT_PUBLIC_GET_EACH_PRODUCT_DETAIL || "/api/product/details";
      
      let apiEndpoint = "";
      
      // Handle different endpoint structures (e.g. /api/product/{{id}} or /api/product?id=)
      if (envEndpoint.includes("{{productId}}")) {
        apiEndpoint = `${apiUrl}${envEndpoint.replace("{{productId}}", productId)}`;
      } else if (envEndpoint.endsWith("?")) {
        apiEndpoint = `${apiUrl}${envEndpoint}productId=${productId}`;
      } else {
        // Fallback assuming it's a RESTful path like /api/product/[id]
        apiEndpoint = `${apiUrl}${envEndpoint}/${productId}`;
      }

      const token = getAuthToken();

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(apiEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "FETCH_PRODUCT_DETAIL_ERROR");
      }

      const result = await response.json();
      setData(result);
      return { success: true, data: result };
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError(ERROR_MESSAGES?.TIMEOUT_ERROR || "Request timed out");
      } else {
        setError(
          ERROR_MESSAGES?.[err.message] ||
            err.message ||
            ERROR_MESSAGES?.UNKNOWN_ERROR ||
            "An error occurred"
        );
      }
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, fetchProductDetail };
};
