import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function SearchInput({ topic, setTopic, handleSearch, searching }) {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
        >
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-md mb-8 transition-all hover:shadow-xl hover:bg-white/80 overflow-hidden ring-1 ring-white/50">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <Input
                                type="text"
                                placeholder="What would you like to research? (e.g., Quantum Computing, Stoicism, CRISPR...)"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                                className="pl-12 h-14 text-lg bg-slate-50/50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500/20 transition-all rounded-xl"
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            disabled={searching || !topic.trim()}
                            className="gradient-primary text-white px-8 h-14 shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 rounded-xl text-lg font-medium min-w-[160px]"
                        >
                            {searching ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Thinking...
                                </>
                            ) : (
                                "Search"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
