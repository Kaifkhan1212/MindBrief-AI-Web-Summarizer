"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

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

  return null; // Will redirect
}
