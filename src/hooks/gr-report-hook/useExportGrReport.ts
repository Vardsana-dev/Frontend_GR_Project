import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";
import { GrReportResponse, GrReportItem } from "./useGetGrReport";

export interface ExportGrReportParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  receiptStatus?: string;
  apcode?: string;
}

export const useExportGrReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const exportGrReport = useCallback(async (params: ExportGrReportParams = {}) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      const envEndpointRaw = process.env.NEXT_PUBLIC_EXPORT_GR_REPORT || "";
      const envEndpoint = envEndpointRaw.split('?')[0]; 
      
      const buildQueryParams = () => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append("search", params.search);
        if (params.startDate) {
          queryParams.append("startDate", params.startDate);
          queryParams.append("dateFrom", params.startDate);
        }
        if (params.endDate) {
          queryParams.append("endDate", params.endDate);
          queryParams.append("dateTo", params.endDate);
        }
        if (params.receiptStatus && params.receiptStatus !== "ທັງໝົດ" && params.receiptStatus !== "all") {
          queryParams.append("receiptStatus", params.receiptStatus);
        }
        if (params.apcode && params.apcode !== "ທັງໝົດ" && params.apcode !== "all") {
          queryParams.append("apcode", params.apcode);
        }
        return queryParams.toString();
      };

      const token = getAuthToken();
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const queryString = buildQueryParams();
      const apiEndpoint = `${apiUrl}${envEndpoint}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(apiEndpoint, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error("EXPORT_GR_REPORT_ERROR");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "GR_Report.xlsx";
      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition.split("filename=")[1].replace(/"/g, "");
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (err: any) {
      console.error("Export Catch Error:", err);
      if (err.name === "AbortError") {
        setError(ERROR_MESSAGES?.TIMEOUT_ERROR || "Request timed out");
      } else {
        setError(
          ERROR_MESSAGES?.[err.message] ||
            err.message ||
            ERROR_MESSAGES?.UNKNOWN_ERROR ||
            "An error occurred during export"
        );
      }
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, exportGrReport };
};
