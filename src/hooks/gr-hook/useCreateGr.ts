import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES, translateApiError } from "@/constants";

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
        
        const rawMessage = 
          errorData.message || 
          errorData.error || 
          (response.status === 409 ? "ຂໍ້ມູນຊ້ຳຊ້ອນ (Conflict) ຫຼື ໃບຮັບສິນຄ້ານີ້ມີຢູ່ແລ້ວ" : "CREATE_GR_ERROR");
          
        const translatedMessage = translateApiError(rawMessage);
        const errObj: any = new Error(translatedMessage);
        const draftMatch = String(rawMessage).match(/open GR draft\s*\(([^)]+)\)/i) || 
                           String(rawMessage).match(/\((GR[^)]+)\)/i) ||
                           String(rawMessage).match(/(GR\d{6,}-\d+)/i) ||
                           String(rawMessage).match(/(GR[A-Za-z0-9-]+)/i);
        const isErrorCode = (val: any): boolean => {
          if (!val || typeof val !== 'string') return false;
          const s = val.trim();
          if (
            s.toUpperCase().includes('EXPIRED') ||
            s.toUpperCase().includes('ERROR') ||
            s.toUpperCase().includes('FAILED') ||
            s.toUpperCase().includes('INVALID') ||
            s.toUpperCase().includes('NOT_FOUND') ||
            s.toUpperCase().includes('UNAUTHORIZED') ||
            s.toUpperCase().includes('FORBIDDEN') ||
            s.toUpperCase().includes('CONFLICT') ||
            s.toUpperCase().includes('TIMEOUT')
          ) return true;
          if (/^[A-Z0-9]+_[A-Z0-9_]+$/.test(s) && !s.startsWith('GR')) return true;
          return false;
        };

        const candidateGrCode = 
          (draftMatch ? draftMatch[1].trim() : null) ||
          errorData?.grcode ||
          errorData?.grCode ||
          errorData?.data?.grcode ||
          errorData?.record?.grcode ||
          errorData?.record?.code ||
          errorData?.data?.record?.code ||
          null;

        const candidateGrid = 
          errorData?.grid ||
          errorData?.grId ||
          errorData?.data?.grid ||
          errorData?.data?.grId ||
          errorData?.record?.grid ||
          errorData?.record?.id ||
          errorData?.data?.record?.grid ||
          null;

        const resolvedGrCode = (candidateGrCode && !isErrorCode(String(candidateGrCode)) && String(candidateGrCode).trim().toUpperCase() !== payload.pocode.toUpperCase())
          ? String(candidateGrCode).trim() 
          : null;

        const resolvedGrid = candidateGrid 
          ? String(candidateGrid).trim()
          : (resolvedGrCode && /^\d+$/.test(resolvedGrCode) ? resolvedGrCode : null);

        errObj.draftGrCode = resolvedGrCode;
        errObj.grid = resolvedGrid ? String(resolvedGrid) : null;
        errObj.errorData = errorData;
        throw errObj;
      }

      const result = await response.json();
      setData(result);
      return { success: true, data: result };
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError(ERROR_MESSAGES?.TIMEOUT_ERROR || "Request timed out");
      } else {
        const translated = translateApiError(err.message);
        setError(translated);
      }
      return { 
        success: false, 
        error: err, 
        draftGrCode: err.draftGrCode || null,
        grid: err.grid || null,
        errorData: err.errorData || (err as any)?.errorData 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, createGr };
};
