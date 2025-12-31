"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthGuard from "@/components/auth-guard";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Modern Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-0"></div>

        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <Card className="w-full max-w-md relative z-10 shadow-card border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader className="space-y-3 text-center pb-6">
            <div className="mx-auto mb-2 w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">
              {isSignUp
                ? "Start your research journey with AI Summarizer"
                : "Sign in to access your dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-slate-700 font-medium text-sm"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="h-11 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-medium text-sm"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="h-11 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full gradient-primary text-white font-semibold h-11 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    {isSignUp ? "Creating..." : "Signing in..."}
                  </div>
                ) : isSignUp ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-11 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="text-center text-sm pt-2">
              {isSignUp ? (
                <>
                  <span className="text-slate-600">
                    Already have an account?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors underline underline-offset-2"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  <span className="text-slate-600">
                    Don't have an account?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors underline underline-offset-2"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
