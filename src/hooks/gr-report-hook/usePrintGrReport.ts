import { useState, useCallback } from "react";
import { getAuthToken, getSelectedApiUrl } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export interface PrintGrReportParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  receiptStatus?: string;
  apcode?: string;
}

export interface PrintGrReportResult {
  success: boolean;
  url?: string;
  blob?: Blob;
  filename?: string;
  error?: any;
}

export const usePrintGrReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const printGrReport = useCallback(async (params: PrintGrReportParams = {}): Promise<PrintGrReportResult> => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || getSelectedApiUrl() || "";
      const base = (apiUrl || "").replace(/\/+$/, "");
      const envEndpointRaw = process.env.NEXT_PUBLIC_PRINT_GR_REPORT || "/api/gr/report/pdf";
      const envEndpoint = envEndpointRaw.split("?")[0] || "/api/gr/report/pdf";
      const path = envEndpoint.startsWith("/") ? envEndpoint : `/${envEndpoint}`;

      const queryParams = new URLSearchParams();
      if (params.search && params.search.trim()) {
        queryParams.append("search", params.search.trim());
      }
      if (params.apcode && params.apcode !== "ທັງໝົດ" && params.apcode !== "all") {
        queryParams.append("apcode", params.apcode.trim());
      }
      const rawStatus = params.status || params.receiptStatus;
      if (rawStatus && rawStatus !== "ທັງໝົດ" && rawStatus !== "all" && rawStatus !== "ALL") {
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
        const mappedStatus = rawStatus
          .split(',')
          .map((s) => statusMap[s.trim()] || s.trim())
          .join(',');
        queryParams.append("status", mappedStatus);
      }
      const dateFrom = params.dateFrom || params.startDate;
      if (dateFrom && dateFrom.trim()) {
        queryParams.append("dateFrom", dateFrom.trim());
      }
      const dateTo = params.dateTo || params.endDate;
      if (dateTo && dateTo.trim()) {
        queryParams.append("dateTo", dateTo.trim());
      }

      const token = getAuthToken();
      const headers: Record<string, string> = {
        Accept: "application/pdf, application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const queryString = queryParams.toString();
      const apiEndpoint = `${base}${path}${queryString ? `?${queryString}` : ""}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // Allow up to 30s for server PDF rendering

      const response = await fetch(apiEndpoint, {
        method: "GET",
        headers,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || "PRINT_GR_REPORT_ERROR");
        } catch {
          throw new Error("PRINT_GR_REPORT_ERROR");
        }
      }

      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "";
      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition
          .split("filename=")[1]
          .replace(/["']/g, "")
          .trim();
      }

      return { success: true, url, blob: pdfBlob, filename };
    } catch (err: any) {
      console.error("Print GR Report Catch Error:", err);
      if (err.name === "AbortError") {
        setError(ERROR_MESSAGES?.TIMEOUT_ERROR || "Request timed out");
      } else {
        setError(
          ERROR_MESSAGES?.[err.message] ||
            err.message ||
            ERROR_MESSAGES?.UNKNOWN_ERROR ||
            "An error occurred during print PDF generation"
        );
      }
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, printGrReport };
};
