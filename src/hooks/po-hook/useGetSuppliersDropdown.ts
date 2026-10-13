import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export interface SupplierDropdownItem {
  apcode: string;
  apname: string;
}

export interface SupplierDropdownParams {
  search?: string;
  limit?: number;
}

export const useGetSuppliersDropdown = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<SupplierDropdownItem[]>([]);

  const fetchSuppliersDropdown = useCallback(async (params: SupplierDropdownParams = {}) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      const envEndpoint = process.env.NEXT_PUBLIC_GET_SUPPLIERS_DROPDOWN || "";
      
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append("search", params.search);
      if (params.limit) queryParams.append("limit", params.limit.toString());

      const queryString = queryParams.toString();
      const apiEndpoint = `${apiUrl}${envEndpoint}${queryString ? (envEndpoint.includes('?') ? (envEndpoint.endsWith('?') ? '' : '&') : '?') + queryString : ''}`;

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
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {}
        throw new Error(errorData?.message || "FETCH_SUPPLIERS_DROPDOWN_ERROR");
      }

      const result = await response.json();
      // Extract array from various possible API response shapes
      let items = [];
      if (Array.isArray(result)) {
        items = result;
      } else if (result.items && Array.isArray(result.items)) {
        items = result.items;
      } else if (result.data && Array.isArray(result.data)) {
        items = result.data;
      } else if (result.data?.items && Array.isArray(result.data.items)) {
        items = result.data.items;
      } else if (result.suppliers && Array.isArray(result.suppliers)) {
        items = result.suppliers;
      }
      
      setData(items);
      return { success: true, data: items };
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

  return { loading, error, data, fetchSuppliersDropdown };
};
