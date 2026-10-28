/**
 * Normalizes product image URLs so that they can be safely loaded
 * in the client browser through same-origin routes or proxies,
 * avoiding subnet routing issues, Private Network Access blocks, and CORS errors.
 */
export function normalizeProductImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Blob and Data URLs
  if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Handle protocol-relative URLs
  let resolved = trimmed;
  if (resolved.startsWith('//')) {
    resolved = `http:${resolved}`;
  }

  // If already proxied
  if (resolved.startsWith('/api/proxy-image') || resolved.startsWith('/product-images/')) {
    return resolved;
  }

  // Handle 192.168.1.222:3001/uploads/
  if (resolved.includes('192.168.1.222:3001/uploads/')) {
    const parts = resolved.split('192.168.1.222:3001/uploads/');
    return `/uploads/${parts[1]}`;
  }

  // If relative path to uploads
  if (resolved.startsWith('/uploads/') || resolved.startsWith('uploads/')) {
    return resolved.startsWith('/') ? resolved : `/${resolved}`;
  }

  // Direct internal server (e.g. 192.168.2.222:65501 or other internal IPs)
  // or any cross-origin HTTP/HTTPS URL
  if (resolved.startsWith('http://') || resolved.startsWith('https://')) {
    try {
      const parsed = new URL(resolved);
      const isInternalIp =
        parsed.hostname.startsWith('192.168.') ||
        parsed.hostname.startsWith('10.') ||
        parsed.hostname.startsWith('172.') ||
        parsed.hostname === 'localhost' ||
        parsed.hostname === '127.0.0.1';

      if (isInternalIp) {
        return `/api/proxy-image?url=${encodeURIComponent(resolved)}`;
      }

      // For public external images, we can also proxy to prevent mixed content or CORS
      return `/api/proxy-image?url=${encodeURIComponent(resolved)}`;
    } catch {
      return `/api/proxy-image?url=${encodeURIComponent(resolved)}`;
    }
  }

  // Relative path fallback
  return resolved.startsWith('/') ? resolved : `/${resolved}`;
}
