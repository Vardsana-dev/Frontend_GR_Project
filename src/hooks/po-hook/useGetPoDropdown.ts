import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export interface PoDropdownItem {
  docno: string;
  apname: string;
  docdate: string;
  apcode?: string;
  grStatus?: string;
  status?: string;
  receiptStatus?: string;
  [key: string]: any;
}

export interface PoDropdownParams {
  search?: string;
  limit?: number;
}

/**
 * Check if a purchase order is already fully received
 */
export const isPoAlreadyReceived = (po: any): boolean => {
  if (!po) return false;

  // 1. Explicit boolean flags
  if (po.isReceived === true || po.isFullyReceived === true || po.isCompleted === true) {
    return true;
  }

  // 2. Quantity checks if available
  const ordered = Number(po.orderedQuantity ?? po.orderedQty ?? po.totalOrdered ?? po.quantity ?? 0);
  const received = Number(po.grReceivedQty ?? po.receivedQuantity ?? po.receivedQty ?? po.totalReceived ?? 0);
  const remaining = Number(po.remainingQuantity ?? po.remainingQty ?? po.remaining ?? -1);

  if (remaining === 0 && ordered > 0) return true;
  if (ordered > 0 && received >= ordered) return true;

  // 3. Status string check
  const statusStr = String(
    po.grStatus ||
    po.status ||
    po.receiptStatus ||
    po.poStatus ||
    po.approvalStatus ||
    po.statusapprove ||
    ''
  ).trim().toUpperCase();

  if (!statusStr) return false;

  // If partial, it is NOT fully received yet (user can still receive remaining items)
  if (statusStr.includes('ບາງສ່ວນ') || statusStr.includes('PARTIAL')) {
    return false;
  }

  // If pending or not received, it is available
  if (
    statusStr.includes('ຍັງບໍ່ທັນ') ||
    statusStr.includes('ລໍຖ້າ') ||
    statusStr === 'NOT_RECEIVED' ||
    statusStr === 'PENDING' ||
    statusStr === 'UNRECEIVED'
  ) {
    return false;
  }

  // Check if status means received / completed
  if (
    statusStr === 'RECEIVED' ||
    statusStr === 'COMPLETED' ||
    statusStr === 'FULL' ||
    statusStr === 'FULLY_RECEIVED' ||
    statusStr.includes('ຮັບເຂົ້າແລ້ວ') ||
    statusStr.includes('ຮັບແລ້ວ') ||
    statusStr.includes('ຄົບແລ້ວ')
  ) {
    return true;
  }

  return false;
};

export const useGetPoDropdown = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<PoDropdownItem[]>([]);

  const fetchPoDropdown = useCallback(async (params: PoDropdownParams = {}) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      // Use the main purchase order list endpoint which includes grStatus
      const envEndpoint =
        process.env.NEXT_PUBLIC_GET_PO_LIST ||
        process.env.NEXT_PUBLIC_GET_PO_DROPDOWN ||
        "/api/purchase-order";
      
      const queryParams = new URLSearchParams();
      if (params.search && typeof params.search === "string" && params.search.trim()) {
        queryParams.append("search", params.search.trim());
      }
      
      const limitVal = params.limit ? Math.max(1, params.limit) : 50;
      queryParams.append("limit", limitVal.toString());
      queryParams.append("page", "1");

      const queryString = queryParams.toString();
      const apiEndpoint = `${apiUrl}${envEndpoint}${queryString ? (envEndpoint.includes('?') ? (envEndpoint.endsWith('?') ? '' : '&') : '?') + queryString : ''}`;

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
        throw new Error(errorData.message || errorData.error || "FETCH_PO_DROPDOWN_ERROR");
      }

      const result = await response.json();
      const rawItems: any[] = result.items || result.data || (Array.isArray(result) ? result : []);

      // Normalize items and filter out any PO that is already fully received
      const availableItems: PoDropdownItem[] = rawItems
        .map((item: any) => ({
          ...item,
          docno: item.docno || item.poNumber || item.grcode || "",
          apname: item.apname || item.creditorName || item.supplier?.apname || "",
          docdate: item.docdate || item.date || item.documentDate || "",
          apcode: item.apcode || item.creditorCode || item.supplier?.apcode || "",
          grStatus: item.grStatus || item.status || "",
        }))
        .filter((item: PoDropdownItem) => !isPoAlreadyReceived(item));

      setData(availableItems);
      return { success: true, data: availableItems };
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
      return { success: false, error: err, data: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, fetchPoDropdown };
};
