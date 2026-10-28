import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export interface GrListParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  supplier?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const useGrList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const fetchGrList = useCallback(async (params: GrListParams = {}) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      const envEndpoint = process.env.NEXT_PUBLIC_GET_GR_LIST || "";

      // Build query string from params
      const queryParams = new URLSearchParams();
      if (params.search && typeof params.search === "string" && params.search.trim()) {
        queryParams.append("search", params.search.trim());
      }
      if (params.startDate) queryParams.append("dateFrom", params.startDate);
      if (params.endDate) queryParams.append("dateTo", params.endDate);
      if (params.supplier && params.supplier !== "ທັງໝົດ" && params.supplier !== "all" && params.supplier !== "ALL") {
        queryParams.append("apcode", params.supplier);
      }
      if (params.status && params.status !== "ທັງໝົດ" && params.status !== "all" && params.status !== "ALL") {
        const statusMap: Record<string, string> = {
          "ຮັບແລ້ວ": "RECEIVED",
          "RECEIVED": "RECEIVED",
          "ຮ່າງ": "DRAFT",
          "DRAFT": "DRAFT",
          "ຍົກເລີກ": "CANCELLED",
          "CANCELLED": "CANCELLED",
          "ບໍ່ຢືນຢັນ": "CANCELLED",
          "ບໍ່ຍືນຢັນ": "CANCELLED",
        };
        const mappedStatus = params.status
          .split(',')
          .map((s) => statusMap[s.trim()] || s.trim())
          .join(',');
        queryParams.append("status", mappedStatus);
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
      const cleanEndpoint = envEndpoint.endsWith('?') ? envEndpoint.slice(0, -1) : envEndpoint;
      const apiEndpoint = `${apiUrl}${cleanEndpoint}${queryString ? (cleanEndpoint.includes('?') ? '&' : '?') + queryString : ''}`;

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
        throw new Error(errorData.message || "FETCH_GR_LIST_ERROR");
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

  return { loading, error, data, fetchGrList };
};
