import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES, translateApiError } from "@/constants";

export interface AddBarcodePayload {
  productcode: string;
  unitcode: string;
  barcode: string;
  barcodetext?: string;
}

export interface AddBarcodeResponse {
  roworder: number;
  unitcode: string;
  barcode: string;
  barcodetext: string;
  closed: boolean;
}

export const useAddBarcodeToProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<AddBarcodeResponse | null>(null);

  const addBarcodeToProduct = useCallback(async (payload: AddBarcodePayload) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      let envEndpoint = process.env.NEXT_PUBLIC_POST_ADD_BARCODE_TO_PRODUCT || "/api/product/barcodes";

      // Support optional URL template replacement if present in env
      if (envEndpoint.includes("{{productcode}}")) {
        envEndpoint = envEndpoint.replace("{{productcode}}", payload.productcode);
      }
      if (envEndpoint.includes("{{product_code}}")) {
        envEndpoint = envEndpoint.replace("{{product_code}}", payload.productcode);
      }

      const apiEndpoint = `${apiUrl}${envEndpoint}`;
      const token = getAuthToken();

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: any = {};
        try {
          errorData = JSON.parse(errorText);
        } catch {
          // Response is not JSON
        }

        console.error(`Add Barcode Error (${response.status}):`, errorText);

        const rawMessage = errorData.message || errorData.error || errorData.detail || "ADD_BARCODE_ERROR";
        throw new Error(rawMessage);
      }

      const result: AddBarcodeResponse = await response.json();
      setData(result);
      return { success: true, data: result };
    } catch (err: any) {
      const errorMsg =
        err.name === "AbortError"
          ? ERROR_MESSAGES?.TIMEOUT_ERROR || "Request timed out"
          : translateApiError(err.message) ||
            ERROR_MESSAGES?.[err.message] ||
            err.message ||
            ERROR_MESSAGES?.UNKNOWN_ERROR ||
            "An error occurred";

      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, addBarcodeToProduct };
};
