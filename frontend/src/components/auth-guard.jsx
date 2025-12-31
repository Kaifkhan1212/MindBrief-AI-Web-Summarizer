"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function AuthGuard({
  children,
  requireAuth = true,
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Redirect to login if auth is required but user is not logged in
        router.replace("/login");
        setShouldRender(false);
      } else if (!requireAuth && user) {
        // Redirect to dashboard if auth is not required but user is logged in
        router.replace("/dashboard");
        setShouldRender(false);
      } else {
        // User state matches requirements, allow rendering
        setShouldRender(true);
      }
    }
  }, [user, loading, requireAuth, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary">
        <div className="text-center">
          <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-white font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if redirecting
  if (!shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary">
        <div className="text-center">
          <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-white font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
