import { useEffect, useRef, useCallback, useState } from "react";
import { logout } from "@/lib/auth";

export const useIdleTimeout = (timeoutMinutes = 10) => {
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const [showWarning, setShowWarning] = useState(false);

  const resetTimeout = useCallback(() => {
    lastActivityRef.current = Date.now();

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Hide warning if showing
    setShowWarning(false);

    // Set warning timeout (1 minute before logout)
    const warningTime = (timeoutMinutes - 1) * 60 * 1000;
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
    }, warningTime);

    // Set logout timeout
    timeoutRef.current = setTimeout(() => {
      const now = Date.now();
      const timeSinceLastActivity =
        (now - lastActivityRef.current) / (1000 * 60);

      if (timeSinceLastActivity >= timeoutMinutes) {
        console.log(
          `User has been idle for ${timeoutMinutes} minutes. Logging out...`
        );
        logout();
      }
    }, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes]);

  const handleActivity = useCallback(() => {
    resetTimeout();
  }, [resetTimeout]);

  const handleStayLoggedIn = useCallback(() => {
    setShowWarning(false);
    resetTimeout();
  }, [resetTimeout]);

  const handleLogoutNow = useCallback(() => {
    setShowWarning(false);
    logout();
  }, []);

  useEffect(() => {
    const events = [
      "mousedown",
      // "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    resetTimeout();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [handleActivity, resetTimeout]);

  return {
    resetTimeout,
    showWarning,
    handleStayLoggedIn,
    handleLogoutNow,
  };
};
