import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export const useUploadGrDocumentFiles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const uploadFiles = useCallback(async (grid: string, files: File[]) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      const envEndpoint = process.env.NEXT_PUBLIC_PUT_UPLOAD_GR_DOCUMENT_FILES || "";
      
      const apiEndpoint = `${apiUrl}${envEndpoint}`;
      const token = getAuthToken();

      const formData = new FormData();
      formData.append("grid", grid);
      files.forEach((file) => {
        formData.append("files", file);
      });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout for file uploads

      // Note: Based on the Postman screenshot, this is actually a POST request
      const response = await fetch(apiEndpoint, {
        method: "POST", 
        headers: {
          // Do NOT set Content-Type for FormData, the browser will set it with the correct boundary automatically
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (!response.ok) {
        let errorData: any = {};
        try {
          const errorText = await response.text();
          errorData = JSON.parse(errorText);
        } catch (e) {}
        
        throw new Error(errorData.message || errorData.error || "UPLOAD_DOCUMENT_ERROR");
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

  return { loading, error, data, uploadFiles };
};
