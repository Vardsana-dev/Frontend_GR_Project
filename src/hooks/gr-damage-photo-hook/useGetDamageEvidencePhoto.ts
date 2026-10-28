import { useState, useCallback } from "react";
import { getAuthToken, getSelectedApiUrl } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/constants";

export const useGetDamageEvidencePhoto = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPhoto = useCallback(async (attachmentIdOrUrl: string | number) => {
    const target = String(attachmentIdOrUrl || "").trim();
    if (!target) return { success: false, error: "No photo identifier or URL provided" };
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API || getSelectedApiUrl() || "";
      const base = (apiUrl || "").replace(/\/+$/, "");
      let apiEndpoint = "";

      // Check if target is already an absolute or relative URL
      if (target.startsWith("http://") || target.startsWith("https://") || target.startsWith("data:") || target.startsWith("blob:")) {
        if (target.startsWith("blob:") || target.startsWith("data:")) {
          return { success: true, url: target };
        }
        apiEndpoint = target;
      } else if (target.startsWith("/")) {
        apiEndpoint = `${base}${target}`;
      } else {
        // It's an attachmentId
        let envEndpoint = process.env.NEXT_PUBLIC_GET_DAMAGE_EVIDENCE_PHOTO || "/api/gr/damage-attachments/file";
        if (envEndpoint.includes("{{")) {
          envEndpoint = envEndpoint.replace(/\{\{[^}]*\}\}/, target);
        } else {
          const separator = envEndpoint.includes('?') ? '&' : '?';
          envEndpoint = `${envEndpoint}${separator}attachmentId=${encodeURIComponent(target)}`;
        }
        apiEndpoint = `${base}${envEndpoint}`;
      }

      const token = getAuthToken();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      // Only add Authorization header if it is our internal API route (not a standalone static file server)
      const isExternalStatic =
        (target.startsWith("http://") || target.startsWith("https://")) &&
        !apiEndpoint.includes("/api/");

      let response: Response;

      try {
        response = await fetch(apiEndpoint, {
          method: "GET",
          headers: {
            ...(!isExternalStatic && token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });
      } catch (directErr) {
        // If direct fetch fails (e.g. CORS on cross-origin image), fallback to same-origin proxy
        if (target.startsWith("http://") || target.startsWith("https://")) {
          const proxyUrl = `/api/download?url=${encodeURIComponent(apiEndpoint)}`;
          response = await fetch(proxyUrl, {
            method: "GET",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            signal: controller.signal,
          });
        } else {
          throw directErr;
        }
      } finally {
        clearTimeout(timeout);
      }

      if (!response.ok) {
        let errorMsg = "GET_PHOTO_ERROR";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const blob = await response.blob();
      const photoUrl = window.URL.createObjectURL(blob);

      return { success: true, url: photoUrl, blob };
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

  const downloadPhoto = useCallback(async (targetParam: string | number, customFileName?: string) => {
    const target = String(targetParam || "").trim();
    if (!target) return { success: false, error: "No image or attachment provided" };
    setLoading(true);
    setError("");

    try {
      // Direct download for blob/data URLs
      if (target.startsWith("blob:") || target.startsWith("data:")) {
        const a = document.createElement("a");
        a.href = target;
        a.download = customFileName || "image.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return { success: true };
      }

      const apiUrl = process.env.NEXT_PUBLIC_API || getSelectedApiUrl() || "";
      const base = (apiUrl || "").replace(/\/+$/, "");
      let resolvedUrl = target;

      if (!target.startsWith("http://") && !target.startsWith("https://")) {
        if (target.startsWith("/")) {
          resolvedUrl = `${base}${target}`;
        } else {
          // attachmentId
          let envEndpoint = process.env.NEXT_PUBLIC_GET_DAMAGE_EVIDENCE_PHOTO || "/api/gr/damage-attachments/file";
          if (envEndpoint.includes("{{")) {
            envEndpoint = envEndpoint.replace(/\{\{[^}]*\}\}/, target);
          } else {
            const separator = envEndpoint.includes("?") ? "&" : "?";
            envEndpoint = `${envEndpoint}${separator}attachmentId=${encodeURIComponent(target)}`;
          }
          resolvedUrl = `${base}${envEndpoint}`;
        }
      }

      // Download via our same-origin /api/download route handler to completely eliminate CORS restrictions
      const token = getAuthToken();
      const proxyDownloadUrl = `/api/download?url=${encodeURIComponent(resolvedUrl)}&fileName=${encodeURIComponent(customFileName || 'image')}`;

      const res = await fetch(proxyDownloadUrl, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error(`Download failed with status ${res.status}`);
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      let fileName = customFileName || "product-image";
      let extension = "png";
      if (blob.type.includes("jpeg") || blob.type.includes("jpg")) extension = "jpg";
      else if (blob.type.includes("png")) extension = "png";
      else if (blob.type.includes("webp")) extension = "webp";
      else if (blob.type.includes("gif")) extension = "gif";
      else if (blob.type.includes("pdf")) extension = "pdf";

      if (!fileName.includes(".")) {
        fileName = `${fileName}.${extension}`;
      }

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);

      return { success: true, url: blobUrl };
    } catch (err: any) {
      console.error("Error downloading photo:", err);

      // Last-resort fallback: trigger native download via anchor
      try {
        const a = document.createElement("a");
        a.href = target;
        a.target = "_blank";
        a.download = customFileName || "image.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return { success: true };
      } catch (fallbackErr) {
        setError(err.message || "DOWNLOAD_FAILED");
        return { success: false, error: err };
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchPhoto, downloadPhoto };
};
