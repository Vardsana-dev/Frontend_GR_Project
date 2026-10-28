import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export const useGetGrDetail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const fetchGrDetail = useCallback(async (identifier: string) => {
    if (!identifier) return { success: false, error: "No identifier provided" };
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      const envEndpoint = process.env.NEXT_PUBLIC_GR_DETAIL || "";
      const token = getAuthToken();

      let targetGrid = String(identifier).trim();

      // If the identifier is a document code (e.g. "GR13261015-0009") or PO number instead of a numeric ID,
      // search for the draft GR record to retrieve its numeric grid ID
      if (!/^\d+$/.test(targetGrid)) {
        try {
          const listEndpoint = process.env.NEXT_PUBLIC_GET_ALL_GR || "/api/gr";
          const searchUrl = `${apiUrl}${listEndpoint}?search=${encodeURIComponent(targetGrid)}`;
          const searchRes = await fetch(searchUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });

          if (searchRes.ok) {
            const listData = await searchRes.json();
            const items = Array.isArray(listData)
              ? listData
              : (listData?.items || listData?.data || listData?.rows || []);

            const matched = items.find((it: any) =>
              String(it.grcode || it.docno || it.grNumber || '').toUpperCase() === targetGrid.toUpperCase() ||
              String(it.purchaseOrder?.docno || it.pocode || it.poNumber || '').toUpperCase() === targetGrid.toUpperCase()
            ) || items[0];

            if (matched && (matched.grid !== undefined && matched.grid !== null || matched.id)) {
              targetGrid = String(matched.grid ?? matched.id);
            }
          }
        } catch (searchErr) {
          console.warn("Could not resolve grcode to grid via search:", searchErr);
        }
      }

      const queryParams = new URLSearchParams();
      if (targetGrid) {
        queryParams.append("grid", targetGrid);
      }

      const queryString = queryParams.toString();
      const apiEndpoint = `${apiUrl}${envEndpoint}${queryString ? (envEndpoint.includes('?') ? (envEndpoint.endsWith('?') ? '' : '&') : '?') + queryString : ''}`;

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
        throw new Error(errorData.message || "FETCH_GR_DETAIL_ERROR");
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

  return { loading, error, data, fetchGrDetail };
};
