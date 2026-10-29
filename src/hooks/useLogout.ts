"use client";

import { useState, useCallback } from "react";
import { clearAuthCookies, getAuthToken, getSelectedApiUrl } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const logout = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || getSelectedApiUrl() || "";
      const logoutEndpoint =
        process.env.NEXT_PUBLIC_LOGOUT || "/api/auth/logout";
      const token = getAuthToken();

      if (apiUrl) {
        const cleanBaseUrl = apiUrl.replace(/\/+$/, "");
        const cleanEndpoint = logoutEndpoint.startsWith("/")
          ? logoutEndpoint
          : `/${logoutEndpoint}`;
        const apiEndpoint = `${cleanBaseUrl}${cleanEndpoint}`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        }).finally(() => clearTimeout(timeout));

        if (!response.ok) {
          console.warn(`Logout API returned status ${response.status}`);
        }
      }

      return { success: true };
    } catch (err: any) {
      console.error("Logout API error:", err);
      if (err?.name === "AbortError") {
        setError(ERROR_MESSAGES?.TIMEOUT_ERROR || "Request timed out");
      } else {
        setError(
          err?.message || ERROR_MESSAGES?.UNKNOWN_ERROR || "Failed to logout"
        );
      }
      return { success: false, error: err };
    } finally {
      clearAuthCookies();
      setLoading(false);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }, []);

  return { logout, loading, error };
};
