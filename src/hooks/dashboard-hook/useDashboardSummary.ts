import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export interface DashboardSummaryResponse {
  month: string;
  summary: {
    totalPurchaseOrders: number;
    percentChangeFromPreviousMonth: number | null;
    pendingReceipt: number;
    pendingApproval: number;
    received: number;
  };
  statusBreakdown: Record<string, number>;
  topSuppliers: Array<{
    apcode: string;
    apname: string;
    totalAmount: number;
  }>;
  latestPurchaseOrders: Array<{
    docno: string;
    apcode: string;
    apname: string;
    docdate: string;
    shipdate: string;
    itemCount: number;
    grStatus: string;
  }>;
}

export const useDashboardSummary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<DashboardSummaryResponse | null>(null);

  const fetchCurrentSummary = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      const envEndpoint = process.env.NEXT_PUBLIC_GET_DASHBOARD_SUMMARY_CURRENT || "";
      let apiEndpoint = `${apiUrl}${envEndpoint}`;

      // Append limit for top suppliers
      const params = new URLSearchParams({ topSuppliersLimit: "8" });
      apiEndpoint = `${apiEndpoint}${apiEndpoint.includes('?') ? '&' : '?'}${params.toString()}`;

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
        throw new Error(errorData.message || "FETCH_DASHBOARD_CURRENT_ERROR");
      }

      const result: DashboardSummaryResponse = await response.json();
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

  const fetchSpecificSummary = useCallback(async (month: string) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      const envEndpoint = process.env.NEXT_PUBLIC_GET_DASHBOARD_SUMMARY_SPECIFIC || "";

      let apiEndpoint = `${apiUrl}${envEndpoint}`;
      if (apiEndpoint.includes("{{dashboard_month}}")) {
        apiEndpoint = apiEndpoint.replace("{{dashboard_month}}", encodeURIComponent(month));
      } else {
        // Fallback if the placeholder is missing
        const params = new URLSearchParams({ month, topSuppliersLimit: "8", latestLimit: "5" });
        apiEndpoint = `${apiEndpoint}${apiEndpoint.includes('?') ? '&' : '?'}${params.toString()}`;
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
        throw new Error(errorData.message || "FETCH_DASHBOARD_SPECIFIC_ERROR");
      }

      const result: DashboardSummaryResponse = await response.json();
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

  return { loading, error, data, fetchCurrentSummary, fetchSpecificSummary };
};
