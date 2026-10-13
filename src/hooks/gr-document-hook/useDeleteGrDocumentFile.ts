import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export const useDeleteGrDocumentFile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const deleteFile = useCallback(async (attachmentId: string) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      let envEndpoint = process.env.NEXT_PUBLIC_DELETE_GR_DOCUMENT_FILES || "";
      
      if (envEndpoint.includes("{{")) {
        envEndpoint = envEndpoint.replace(/\{\{[^}]*\}\}/, attachmentId);
      } else {
        const separator = envEndpoint.includes('?') ? '&' : '?';
        envEndpoint = `${envEndpoint}${separator}attachmentId=${attachmentId}`;
      }
      
      const apiEndpoint = `${apiUrl}${envEndpoint}`;
      const token = getAuthToken();

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(apiEndpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (!response.ok) {
        let errorData: any = {};
        try {
          const errorText = await response.text();
          errorData = JSON.parse(errorText);
        } catch (e) {}
        
        throw new Error(errorData.message || errorData.error || "DELETE_DOCUMENT_ERROR");
      }

      // DELETE requests might not return a JSON body
      const result = await response.json().catch(() => ({})); 
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

  return { loading, error, data, deleteFile };
};
