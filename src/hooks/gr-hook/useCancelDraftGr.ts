import { useState, useCallback } from "react";
import { getAuthToken, getSelectedApiUrl } from "@/lib/auth";
import { ERROR_MESSAGES, translateApiError } from "@/constants";

export interface CancelDraftGrPayload {
  grid: number | string;
}

export interface CancelDraftGrResponse {
  grid: number;
  grcode: string;
  status: string;
  cancelledAt: string;
  alreadyCancelled: boolean;
  legacyCancelled: boolean;
  [key: string]: any;
}

export const useCancelDraftGr = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<CancelDraftGrResponse | null>(null);

  const cancelDraftGr = useCallback(
    async (payloadOrGrid: number | string | CancelDraftGrPayload) => {
      setLoading(true);
      setError("");

      try {
        const rawGrid =
          typeof payloadOrGrid === "object" && payloadOrGrid !== null
            ? payloadOrGrid.grid
            : payloadOrGrid;

        if (rawGrid === undefined || rawGrid === null || rawGrid === "") {
          throw new Error("REQUIRED_FIELD");
        }

        const numericGrid = Number(rawGrid);
        const gridValue = !isNaN(numericGrid) ? numericGrid : rawGrid;

        const apiUrl = process.env.NEXT_PUBLIC_API || getSelectedApiUrl() || "";
        const base = (apiUrl || "").replace(/\/+$/, "");
        const envEndpoint =
          process.env.NEXT_PUBLIC_POST_CANCEL_DRAFT_GR || "/api/gr/cancel";
        const apiEndpoint = `${base}${envEndpoint}`;

        const token = getAuthToken();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ grid: gridValue }),
          signal: controller.signal,
        }).finally(() => clearTimeout(timeout));

        if (!response.ok) {
          const errorText = await response.text();
          let errorData: any = {};
          try {
            errorData = JSON.parse(errorText);
          } catch {
            // Not JSON
          }

          console.error(`Cancel Draft GR Error (${response.status}):`, errorText);
          const rawMessage =
            errorData.message ||
            errorData.error ||
            errorData.msg ||
            "CANCEL_DRAFT_GR_ERROR";

          const translated = translateApiError(rawMessage);
          throw new Error(translated);
        }

        const result: CancelDraftGrResponse = await response.json();
        setData(result);
        return { success: true, data: result };
      } catch (err: any) {
        let errorMsg = ERROR_MESSAGES.UNKNOWN_ERROR;

        if (err.name === "AbortError") {
          errorMsg = ERROR_MESSAGES.TIMEOUT_ERROR || "Request timed out";
        } else if (err.message === "REQUIRED_FIELD") {
          errorMsg = ERROR_MESSAGES.REQUIRED_FIELD || "ກະລຸນາໃສ່ຂໍ້ມູນໃຫ້ຄົບຖ້ວນ";
        } else if (err.message) {
          errorMsg = err.message;
        }

        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const resetState = useCallback(() => {
    setError("");
    setData(null);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    data,
    cancelDraftGr,
    resetState,
  };
};
