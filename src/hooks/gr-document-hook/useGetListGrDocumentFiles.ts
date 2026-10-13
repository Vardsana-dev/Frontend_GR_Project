import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export const useGetListGrDocumentFiles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const fetchList = useCallback(async (grid: string, type?: "IMAGE" | "DOCUMENT") => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      let envEndpoint = process.env.NEXT_PUBLIC_GET_LIST_GR_DOCUMENT_FILES || "";
      
      // Handle dynamic placeholders if they are used in .env
      if (envEndpoint.includes("{{")) {
        envEndpoint = envEndpoint.replace(/\{\{[^}]*grid[^}]*\}\}/i, grid);
        if (type) {
          envEndpoint = envEndpoint.replace(/\{\{[^}]*type[^}]*\}\}/i, type);
        } else {
          // Remove type param if not provided
          envEndpoint = envEndpoint.replace(/&type=\{\{[^}]*\}\}/i, "").replace(/type=\{\{[^}]*\}\}&/i, "").replace(/\?type=\{\{[^}]*\}\}/i, "");
        }
      } else {
        // Fallback to appending query params normally
        const queryParams = new URLSearchParams();
        queryParams.append("grid", grid);
        if (type) queryParams.append("type", type);
        
        const separator = envEndpoint.includes('?') ? '&' : '?';
        envEndpoint = `${envEndpoint}${separator}${queryParams.toString()}`;
      }

      const apiEndpoint = `${apiUrl}${envEndpoint}`;
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
        let errorData: any = {};
        try {
          const errorText = await response.text();
          errorData = JSON.parse(errorText);
        } catch (e) {}
        
        throw new Error(errorData.message || "FETCH_DOCUMENT_LIST_ERROR");
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

  return { loading, error, data, fetchList };
};
