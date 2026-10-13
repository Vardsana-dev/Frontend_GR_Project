import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export interface PoDropdownItem {
  docno: string;
  apname: string;
  docdate: string;
}

export interface PoDropdownParams {
  search?: string;
  limit?: number;
}

export const useGetPoDropdown = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<PoDropdownItem[]>([]);

  const fetchPoDropdown = useCallback(async (params: PoDropdownParams = {}) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      const envEndpoint = process.env.NEXT_PUBLIC_GET_PO_DROPDOWN || "";
      
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "FETCH_PO_DROPDOWN_ERROR");
      }

      const result = await response.json();
      const items = result.items || [];
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

  return { loading, error, data, fetchPoDropdown };
};
