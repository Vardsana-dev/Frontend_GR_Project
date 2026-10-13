import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export interface CreateGrPayload {
  pocode: string;
  createdate: string;
  apcode: string;
  apname: string;
  creditcode: string;
  docgroup: string;
  taxtype: number;
  shipcode: string;
  vehicleRegistration: string;
  driverName: string;
  remark: string;
}

export const useCreateGr = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const createGr = useCallback(async (payload: CreateGrPayload) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      const envEndpoint = process.env.NEXT_PUBLIC_POST_GR || "";
      
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
        } catch (e) {
          // Response is not JSON
        }
        
        console.error(`Create GR Error (${response.status}):`, errorText);
        
        const errorMessage = 
          errorData.message || 
          errorData.error || 
          (response.status === 409 ? "ຂໍ້ມູນຊ້ຳຊ້ອນ (Conflict) ຫຼື ໃບຮັບສິນຄ້ານີ້ມີຢູ່ແລ້ວ" : "CREATE_GR_ERROR");
          
        throw new Error(errorMessage);
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

  return { loading, error, data, createGr };
};
