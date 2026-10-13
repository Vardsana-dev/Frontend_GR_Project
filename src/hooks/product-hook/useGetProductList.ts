import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export interface GetProductListParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const useGetProductList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const fetchProductList = useCallback(async (params: GetProductListParams = {}) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      const envEndpoint = process.env.NEXT_PUBLIC_GET_PRODUCT_LIST || "/api/product";
      
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append("search", params.search);
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      const queryString = queryParams.toString();
      const apiEndpoint = `${apiUrl}${envEndpoint}${queryString ? (envEndpoint.includes('?') ? '&' : '?') + queryString : ''}`;

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
        throw new Error(errorData.message || "FETCH_PRODUCT_LIST_ERROR");
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

  return { loading, error, data, fetchProductList };
};
