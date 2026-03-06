"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_MESSAGE =
  "You are about to exit the portal. Unsaved changes will be lost. Do you want to continue?";

type DashboardExitGuardProps = {
  message?: string;
  redirectTo?: string;
};

export const DashboardExitGuard = ({
  message = DEFAULT_MESSAGE,
  redirectTo = "/",
}: DashboardExitGuardProps) => {
  const router = useRouter();
  const ignorePop = useRef(false);

  useEffect(() => {
    const pushSentinel = () => {
      window.history.pushState({ portalGuard: true }, "", window.location.href);
    };

    const handlePopState = (event: PopStateEvent) => {
      if (ignorePop.current) return;
      event.preventDefault();
      // Restore sentinel immediately so the user stays on the dashboard
      pushSentinel();

      const shouldLeave = window.confirm(message);

      if (shouldLeave) {
        ignorePop.current = true;
        window.removeEventListener("popstate", handlePopState);
        router.replace(redirectTo);
        // Hard fallback so browser history truly changes.
        setTimeout(() => {
          window.location.replace(redirectTo);
        }, 50);
        return;
      }
    };

    pushSentinel();
    window.addEventListener("popstate", handlePopState);

    return () => {
      ignorePop.current = true;
      window.removeEventListener("popstate", handlePopState);
    };
  }, [message, redirectTo, router]);

  return null;
};
