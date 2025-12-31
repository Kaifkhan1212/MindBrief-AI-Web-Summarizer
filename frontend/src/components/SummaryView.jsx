import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SummaryView({
    summary,
    selectedLinks,
    links,
    summarizing,
    handleSummarize,
    handleDownloadTxt,
    handleDownloadMarkdown,
    handleSaveToVault,
    savingToVault,
}) {
    return (
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-md h-[calc(100vh-280px)] flex flex-col transition-all hover:shadow-xl ring-1 ring-white/50">
            <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50 px-6">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Research Summary
                    </CardTitle>
                    {summary && (
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleDownloadTxt}
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs bg-white hover:bg-slate-50 border-slate-200"
                            >
                                TXT
                            </Button>
                            <Button
                                onClick={handleDownloadMarkdown}
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs bg-white hover:bg-slate-50 border-slate-200"
                            >
                                MD
                            </Button>
                            <Button
                                onClick={handleSaveToVault}
                                disabled={savingToVault}
                                size="sm"
                                className="h-8 text-xs gradient-success text-white border-0 shadow-sm hover:shadow-md"
                            >
                                {savingToVault ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white/40">
                {summary ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="prose prose-slate max-w-none"
                    >
                        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between font-mono text-xs text-slate-400 mb-6 pb-4 border-b border-slate-100">
                                <span>AI Generated Brief</span>
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="text-base leading-7">{summary}</div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 ${selectedLinks.length > 0 ? "bg-gradient-to-br from-indigo-100 to-purple-100 shadow-inner" : "bg-slate-50"}`}>
                            {summarizing ? (
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
                            ) : (
                                <svg
                                    className={`w-12 h-12 transition-colors duration-300 ${selectedLinks.length > 0 ? "text-indigo-500" : "text-slate-300"}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                    />
                                </svg>
                            )}
                        </div>

                        {summarizing ? (
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                                    Analyzing & Summarizing...
                                </h3>
                                <p className="text-slate-500">This may take a few moments</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-w-md mx-auto">
                                <h3 className="text-xl font-bold text-slate-800">
                                    Ready to Synthesize
                                </h3>
                                <p className="text-slate-500">
                                    {selectedLinks.length === 0
                                        ? "Select relevant sources from the list to enable summarization."
                                        : `You've selected ${selectedLinks.length} source${selectedLinks.length !== 1 ? "s" : ""}. We're ready to generate your brief.`}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>

            <div className="p-4 border-t border-slate-100 bg-white/60 backdrop-blur-sm">
                <Button
                    onClick={handleSummarize}
                    disabled={summarizing || selectedLinks.length === 0}
                    className="w-full h-14 gradient-primary text-white text-lg font-semibold shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 rounded-xl"
                >
                    {summarizing ? "Generating Brief..." : `Generate Summary (${selectedLinks.length})`}
                </Button>
            </div>
        </Card>
    );
}
