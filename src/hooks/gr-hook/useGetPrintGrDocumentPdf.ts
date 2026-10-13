import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export const useGetPrintGrDocumentPdf = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPdf = useCallback(async (grid: string) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      let envEndpoint = process.env.NEXT_PUBLIC_GET_PRINT_GR_DOCUMENT_PDF || "";
      
      // Replace placeholder with actual grid
      envEndpoint = envEndpoint.replace("{{grid}}", grid);
      
      const apiEndpoint = `${apiUrl}${envEndpoint}`;
      const token = getAuthToken();

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // give it more time for PDF generation

      const response = await fetch(apiEndpoint, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (!response.ok) {
        let errorMsg = "GET_PDF_ERROR";
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
        } catch {
            // Not json
        }
        throw new Error(errorMsg);
      }

      const blob = await response.blob();
      const pdfUrl = window.URL.createObjectURL(blob);
      
      return { success: true, url: pdfUrl, blob };
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

  return { loading, error, fetchPdf };
};
