import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { GrReportResponse, GrReportItem } from "./useGetGrReport";

export interface FetchAllGrReportParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  receiptStatus?: string;
  apcode?: string;
}

export const useFetchAllGrReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllGrReport = useCallback(async (params: FetchAllGrReportParams = {}) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || "";
      const envEndpointRaw = process.env.NEXT_PUBLIC_GET_GR_REPORT || "";
      const envEndpoint = envEndpointRaw.split('?')[0]; 
      
      const buildQueryParams = (page: number, limit: number) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append("search", params.search);
        if (params.startDate) {
          queryParams.append("startDate", params.startDate);
          queryParams.append("dateFrom", params.startDate);
        }
        if (params.endDate) {
          queryParams.append("endDate", params.endDate);
          queryParams.append("dateTo", params.endDate);
        }
        if (params.receiptStatus && params.receiptStatus !== "ທັງໝົດ" && params.receiptStatus !== "all") {
          queryParams.append("receiptStatus", params.receiptStatus);
        }
        if (params.apcode && params.apcode !== "ທັງໝົດ" && params.apcode !== "all") {
          queryParams.append("apcode", params.apcode);
        }
        queryParams.append("page", page.toString());
        queryParams.append("limit", limit.toString());
        return queryParams.toString();
      };

      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const fetchPage = async (page: number, limit: number) => {
        const queryString = buildQueryParams(page, limit);
        const apiEndpoint = `${apiUrl}${envEndpoint}?${queryString}`;
        
        const response = await fetch(apiEndpoint, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          throw new Error("FETCH_GR_REPORT_ERROR");
        }
        const result = await response.json();
        return result.data ? result.data : result;
      };

      const limit = 100;
      let firstPageData = await fetchPage(1, limit);
      let allItems: GrReportItem[] = [...(firstPageData.items || [])];

      const totalPages = firstPageData.pagination?.totalPages || 1;

      if (totalPages > 1) {
        const pagePromises = [];
        for (let p = 2; p <= totalPages; p++) {
          pagePromises.push(fetchPage(p, limit));
        }
        const remainingPagesData = await Promise.all(pagePromises);
        remainingPagesData.forEach(pageData => {
          if (pageData.items) {
            allItems = [...allItems, ...pageData.items];
          }
        });
      }
      
      return { success: true, data: { ...firstPageData, items: allItems } as GrReportResponse };
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch all data for printing.");
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchAllGrReport };
};
