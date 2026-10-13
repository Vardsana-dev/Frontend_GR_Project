import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";
import { GrReportResponse, GrReportItem } from "./useGetGrReport";

export interface PrintGrReportParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  receiptStatus?: string;
  apcode?: string;
}

export const usePrintGrReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const printGrReport = useCallback(async (params: PrintGrReportParams = {}) => {
    // 1. OPEN TAB SYNCHRONOUSLY
    // This MUST happen before any `await` to bypass strict browser popup blockers!
    const previewTab = window.open("about:blank", "_blank");
    if (previewTab) {
      previewTab.document.write(
        "<html><body style='font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh;'><h2>Loading PDF Preview...</h2></body></html>"
      );
    }

    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      const envEndpointRaw = process.env.NEXT_PUBLIC_PRINT_GR_REPORT || "";
      const envEndpoint = envEndpointRaw.split('?')[0]; 
      
      const buildQueryParams = () => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append("search", params.search);
        if (params.startDate) {
          queryParams.append("dateFrom", params.startDate);
        }
        if (params.endDate) {
          queryParams.append("dateTo", params.endDate);
        }
        if (params.receiptStatus && params.receiptStatus !== "ທັງໝົດ" && params.receiptStatus !== "all") {
          queryParams.append("status", params.receiptStatus);
        }
        if (params.apcode && params.apcode !== "ທັງໝົດ" && params.apcode !== "all") {
          queryParams.append("apcode", params.apcode);
        }
        return queryParams.toString();
      };

      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const queryString = buildQueryParams();
      const apiEndpoint = `${apiUrl}${envEndpoint}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(apiEndpoint, {
        method: "GET",
        headers,
      });

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
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);
      
      // 2. UPDATE THE TAB URL
      // Now that the download is finished, navigate our pre-opened tab to the PDF
      if (previewTab) {
        previewTab.location.href = url;
      } else {
        // Fallback if the popup was somehow still blocked
        window.location.href = url;
      }
      
      return { success: true };
    } catch (err: any) {
      // 3. CLOSE TAB ON ERROR
      if (previewTab) {
        previewTab.close();
      }
      console.error("Print Catch Error:", err);
      if (err.name === "AbortError") {
        setError(ERROR_MESSAGES?.TIMEOUT_ERROR || "Request timed out");
      } else {
        setError(
          ERROR_MESSAGES?.[err.message] ||
            err.message ||
            ERROR_MESSAGES?.UNKNOWN_ERROR ||
            "An error occurred during print data fetch"
        );
      }
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, printGrReport };
};
