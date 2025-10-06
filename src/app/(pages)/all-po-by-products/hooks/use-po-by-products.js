"use client";
import { useState, useCallback } from "react";

export const usePOByProducts = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPOByProduct = useCallback(async (productCode) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/proxy-po", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productCode }),
      });

      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

      const result = await res.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch PO data");
        setData(null);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch PO data");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []); // empty dependency array

  const clearData = useCallback(() => {
    setData(null);
    setError("");
  }, []);

  return { data, loading, error, fetchPOByProduct, clearData };
};
