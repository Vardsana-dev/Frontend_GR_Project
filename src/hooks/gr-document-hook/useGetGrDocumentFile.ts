import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export const useGetGrDocumentFile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFile = useCallback(async (attachmentId: string) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      let envEndpoint = process.env.NEXT_PUBLIC_GET_GR_DOCUMENT_FILES || "";
      
      // Handle placeholder replacement
      if (envEndpoint.includes("{{")) {
        envEndpoint = envEndpoint.replace(/\{\{[^}]*\}\}/, attachmentId);
      } else {
        // Fallback to normal query string
        const separator = envEndpoint.includes('?') ? '&' : '?';
        envEndpoint = `${envEndpoint}${separator}attachmentId=${attachmentId}`;
      }
      
      const apiEndpoint = `${apiUrl}${envEndpoint}`;
      const token = getAuthToken();

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(apiEndpoint, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (!response.ok) {
        let errorMsg = "GET_DOCUMENT_FILE_ERROR";
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      
      return { success: true, url: fileUrl, blob };
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

  return { loading, error, fetchFile };
};
