import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SourceList({ links, selectedLinks, toggleLinkSelection }) {
    return (
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-md h-[calc(100vh-280px)] flex flex-col transition-all hover:shadow-xl overflow-hidden ring-1 ring-white/50">
            <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Sources
                    </CardTitle>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                        {links.length} FOUND
                    </span>
                </div>
                {selectedLinks.length > 0 && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs text-indigo-600 font-medium mt-1"
                    >
                        {selectedLinks.length} selected for summarization
                    </motion.p>
                )}
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {links.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12 text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                            <svg
                                className="w-8 h-8 opacity-50"
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
                        <p className="font-medium text-slate-500">No sources found</p>
                        <p className="text-sm mt-1">Start a search to discover content</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {links.map((link, index) => {
                                const isSelected = selectedLinks.includes(link.url);
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`group p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden ${isSelected
                                            ? "bg-indigo-50/50 border-indigo-500 shadow-sm"
                                            : "bg-white border-slate-100 hover:border-indigo-300 hover:shadow-md"
                                            }`}
                                        onClick={() => toggleLinkSelection(link.url)}
                                    >
                                        {isSelected && (
                                            <motion.div
                                                layoutId="active-selection"
                                                className="absolute inset-y-0 left-0 w-1 bg-indigo-500"
                                            />
                                        )}
                                        <div className="flex items-start gap-3 pl-2">
                                            <div
                                                className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 transition-colors ${isSelected
                                                    ? "bg-indigo-600 border-indigo-600"
                                                    : "border-slate-300 group-hover:border-indigo-400"
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <svg
                                                        className="w-3 h-3 text-white"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4
                                                    className={`font-semibold text-sm mb-1 line-clamp-2 ${isSelected
                                                        ? "text-indigo-900"
                                                        : "text-slate-700 group-hover:text-slate-900"
                                                        }`}
                                                >
                                                    {link.title}
                                                </h4>
                                                <p className="text-xs text-slate-400 truncate font-mono bg-slate-100/50 rounded px-1.5 py-0.5 inline-block max-w-full">
                                                    {new URL(link.url).hostname.replace('www.', '')}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
