import { useState, useCallback } from "react";
import { getAuthToken, getSelectedApiUrl } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export interface GrReportSummary {
  baseCurrency: string;
  poCount: number;
  grCount: number;
  totalPoAmount: number;
  totalInvoiceAmount: number | null;
  totalDamagedAmount: number;
  totalShortAmount: number;
  totalOtherAmount: number | null;
  totalReceivedAmount: number;
}

export interface GrReportItem {
  grid: number;
  grcode: string;
  receivedAt: string;
  receiptStatus: string;
  supplier: {
    apcode: string;
    apname: string;
  };
  purchaseOrder: {
    poid: number;
    docno: string;
    amount: number;
    currencyCode: string;
  };
  currencyCode: string;
  exchangeRate: number;
  invoiceAmount: number | null;
  damagedAmount: number;
  shortAmount: number;
  otherAmount: number | null;
  receivedAmount: number;
  damageNotes: string | null;
  remark: string | null;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GrReportResponse {
  summary: GrReportSummary;
  items: GrReportItem[];
  pagination: PaginationInfo;
}

export interface GetGrReportParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  receiptStatus?: string;
  apcode?: string;
  page?: number;
  limit?: number;
}

export const useGetGrReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<GrReportResponse | null>(null);

  const fetchGrReport = useCallback(async (params: GetGrReportParams = {}) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || getSelectedApiUrl() || "";
      const base = (apiUrl || "").replace(/\/+$/, "");
      const envEndpointRaw = process.env.NEXT_PUBLIC_GET_GR_REPORT || "/api/gr/report";
      const envEndpoint = envEndpointRaw.split('?')[0]; // Strip hardcoded query params like ?page=1&limit=20
      const path = envEndpoint.startsWith("/") ? envEndpoint : `/${envEndpoint}`;

      const queryParams = new URLSearchParams();
      if (params.search && params.search.trim()) queryParams.append("search", params.search.trim());
      
      const dateFrom = params.dateFrom || params.startDate;
      if (dateFrom && dateFrom.trim()) {
        queryParams.append("dateFrom", dateFrom.trim());
        queryParams.append("startDate", dateFrom.trim());
      }
      
      const dateTo = params.dateTo || params.endDate;
      if (dateTo && dateTo.trim()) {
        queryParams.append("dateTo", dateTo.trim());
        queryParams.append("endDate", dateTo.trim());
      }
      
      const status = params.status || params.receiptStatus;
      if (status && status !== "ທັງໝົດ" && status !== "all") {
        queryParams.append("status", status.trim());
        queryParams.append("receiptStatus", status.trim());
      }
      
      if (params.apcode && params.apcode !== "ທັງໝົດ" && params.apcode !== "all") {
        queryParams.append("apcode", params.apcode.trim());
      }
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      const queryString = queryParams.toString();
      const apiEndpoint = `${base}${path}${queryString ? `?${queryString}` : ""}`;

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
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "FETCH_GR_REPORT_ERROR");
      }

      const result = await response.json();

      // Check if data is nested inside a 'data' property
      const responseData = result.data ? result.data : result;

      setData(responseData);
      return { success: true, data: responseData };
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

  return { loading, error, data, fetchGrReport };
};
