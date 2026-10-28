import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export interface PoListParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  supplier?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const usePoList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const fetchPoList = useCallback(async (params: PoListParams = {}) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      const envEndpoint = process.env.NEXT_PUBLIC_GET_PO_LIST || "";

      const queryParams = new URLSearchParams();
      if (params.search && typeof params.search === "string" && params.search.trim()) {
        queryParams.append("search", params.search.trim());
      }
      if (params.startDate) queryParams.append("dateFrom", params.startDate);
      if (params.supplier && params.supplier !== "ທັງໝົດ" && params.supplier !== "all" && params.supplier !== "ALL") {
        queryParams.append("apcode", params.supplier);
      }

      if (params.status && params.status !== "ທັງໝົດ" && params.status !== "all" && params.status !== "ALL") {
        const statusMap: Record<string, string> = {
          "GR ຍັງບໍ່ທັນຮັບເຂົ້າ": "NOT_RECEIVED",
          "ຍັງບໍ່ທັນຮັບເຂົ້າ": "NOT_RECEIVED",
          "NOT_RECEIVED": "NOT_RECEIVED",
          "GR ຮັບເຂົ້າບາງສ່ວນ": "PARTIALLY_RECEIVED",
          "ຮັບເຂົ້າບາງສ່ວນ": "PARTIALLY_RECEIVED",
          "ຮັບບາງສ່ວນ": "PARTIALLY_RECEIVED",
          "PARTIALLY_RECEIVED": "PARTIALLY_RECEIVED",
          "PARTIAL": "PARTIALLY_RECEIVED",
          "GR ຮັບເຂົ້າແລ້ວ": "RECEIVED",
          "ຮັບເຂົ້າແລ້ວ": "RECEIVED",
          "ຮັບແລ້ວ": "RECEIVED",
          "RECEIVED": "RECEIVED",
          "COMPLETED": "RECEIVED",
        };
        const mappedStatus = statusMap[params.status] || params.status;
        queryParams.append("grStatus", mappedStatus);
      }

      // Ensure page is a valid positive integer
      const pageNum = Number(params.page);
      if (!isNaN(pageNum) && pageNum > 0) {
        queryParams.append("page", Math.floor(pageNum).toString());
      } else {
        queryParams.append("page", "1");
      }

      // Ensure limit is a valid positive integer
      const limitNum = Number(params.limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        queryParams.append("limit", Math.floor(limitNum).toString());
      } else {
        queryParams.append("limit", "10");
      }

      const queryString = queryParams.toString();
      const apiEndpoint = `${apiUrl}${envEndpoint}${queryString ? (envEndpoint.includes('?') ? '&' : '?') + queryString : ''}`;

      const token = getAuthToken();

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(apiEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Fetch PO List failed:", response.status, apiEndpoint, errorData);
        throw new Error(errorData.message || errorData.error || `FETCH_PO_LIST_ERROR (${response.status})`);
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

  return { loading, error, data, fetchPoList };
};
