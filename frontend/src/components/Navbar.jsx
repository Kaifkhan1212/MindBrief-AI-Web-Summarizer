import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function Navbar({ backendStatus, setVaultOpen }) {
    const { user, logout } = useAuth();

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                            <svg
                                className="w-6 h-6 text-white"
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
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            AI Summarizer
                        </h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        {backendStatus === "online" && (
                            <div className="hidden sm:flex items-center space-x-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span>Online</span>
                            </div>
                        )}
                        {backendStatus === "offline" && (
                            <div className="hidden sm:flex items-center space-x-2 text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
                                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                                <span>Offline</span>
                            </div>
                        )}
                        <Button
                            variant="outline"
                            onClick={() => setVaultOpen(true)}
                            className="gradient-primary text-white border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h12a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                                />
                            </svg>
                            Vault
                        </Button>
                        <div className="hidden sm:flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                                {user?.email?.[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]">
                                {user?.email}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={logout}
                            className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
