import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export interface PoDocument {
  poid: number;
  docno: string;
  docdate: string;
  shipdate: string;
  refdocno1: string;
  statusapprove: string;
}

export interface PoSupplier {
  apcode: string;
  apname: string;
  addressTh: string | null;
  telephone: string | null;
  taxId: string | null;
}

export interface PoCreator {
  usercode: string;
  name: string;
}

export interface PoAmounts {
  subtotal: number;
  discount: number;
  taxRate: number;
  tax: number;
  total: number;
  currencyCode: string;
}

export interface PoCreditTerm {
  code: string;
  nameTh: string;
  shortName: string;
}

export interface PoGrDefaults {
  creditcode: string;
  docgroup: string;
  taxtype: number;
  shipcode: string;
}

export interface PoHeader {
  document: PoDocument;
  supplier: PoSupplier;
  creator: PoCreator;
  amounts: PoAmounts;
  creditTerm: PoCreditTerm;
  grDefaults: PoGrDefaults;
  remark: string;
  remark2: string;
}

export interface PoItem {
  roworder: number;
  productcode: string;
  productname: string;
  quantity: number;
  unitcode: string;
  unitprice: number;
  discamount: number;
  netamount: number;
  remark: string;
  imageUrl: string | null;
  orderedQuantity: number;
  grReceivedQty: number;
  remainingQuantity: number;
  receivedQuantity?: number;
  receivedQty?: number;
  [key: string]: any;
}

export interface PoDetailResponse {
  header: PoHeader;
  items: PoItem[];
}

export interface PoDetailParams {
  docno?: string;
  poid?: string | number;
}

export const usePoDetail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<PoDetailResponse | null>(null);

  const fetchPoDetail = useCallback(async (params: PoDetailParams) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      const envEndpoint = process.env.NEXT_PUBLIC_PO_DETAIL || "";
      
      const queryParams = new URLSearchParams();
      if (params.docno) queryParams.append("docno", params.docno);
      if (params.poid) queryParams.append("poid", params.poid.toString());

      const queryString = queryParams.toString();
      // Only append query string if we have parameters
      let apiEndpoint = `${apiUrl}${envEndpoint}`;
      if (queryString) {
          apiEndpoint += `${envEndpoint.includes('?') ? '&' : '?'}${queryString}`;
      } else {
          // If the endpoint is meant to be a path param like /api/po-detail/[docno], 
          // we might just fetch the envEndpoint directly, or they might pass docno differently.
          // The query param approach is safer as a default based on the list hook.
      }

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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "FETCH_PO_DETAIL_ERROR");
      }

      const result = await response.json();
      setData(result);
      return { success: true, data: result as PoDetailResponse };
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

  return { loading, error, data, fetchPoDetail };
};
