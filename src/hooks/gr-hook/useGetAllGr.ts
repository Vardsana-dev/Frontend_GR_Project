import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export interface GetAllGrParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  receiptStatus?: string;
  apcode?: string;
  page?: number;
  limit?: number;
}

export const useGetAllGr = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const fetchAllGr = useCallback(async (params: GetAllGrParams = {}) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      const envEndpoint = process.env.NEXT_PUBLIC_GET_ALL_GR || "";
      
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append("search", params.search);
      if (params.startDate) queryParams.append("dateFrom", params.startDate);
      if (params.endDate) queryParams.append("dateTo", params.endDate);
      if (params.status && params.status !== "ທັງໝົດ" && params.status !== "all") queryParams.append("approvalStatus", params.status);
      if (params.receiptStatus && params.receiptStatus !== "ທັງໝົດ" && params.receiptStatus !== "all") queryParams.append("receiptStatus", params.receiptStatus);
      if (params.apcode && params.apcode !== "ທັງໝົດ" && params.apcode !== "all") queryParams.append("apcode", params.apcode);
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

  return { loading, error, data, fetchAllGr };
};
