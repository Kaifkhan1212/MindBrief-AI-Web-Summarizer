"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/auth-guard";
import Vault from "@/components/vault";
import Navbar from "@/components/Navbar";
import SearchInput from "@/components/SearchInput";
import SourceList from "@/components/SourceList";
import SummaryView from "@/components/SummaryView";
import { api } from "@/lib/api";
import { downloadText, downloadMarkdown, formatFilename } from "@/lib/download";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [topic, setTopic] = useState("");
  const [searching, setSearching] = useState(false);
  const [links, setLinks] = useState([]);
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [savingToVault, setSavingToVault] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await api.health();
        setBackendStatus("online");
      } catch (error) {
        console.error("Backend health check failed:", error);
        setBackendStatus("offline");
      }
    };
    checkBackend();
  }, []);

  const handleSearch = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic to search");
      return;
    }

    setSearching(true);
    setLinks([]);
    setSelectedLinks([]);
    setSummary(null);

    try {
      const data = await api.search.searchTopic(topic.trim());

      if (data.success && data.links) {
        setLinks(data.links);
        setBackendStatus("online");
      } else {
        alert(data.error || "Failed to search. Please try again.");
      }
    } catch (error) {
      console.error("Search error:", error);
      setBackendStatus("offline");
      alert(
        error.message ||
        "Error searching. Please check if the backend is running on port 5000."
      );
    } finally {
      setSearching(false);
    }
  };

  const toggleLinkSelection = (url) => {
    setSelectedLinks((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const handleSummarize = async () => {
    if (selectedLinks.length === 0) {
      alert("Please select at least one link to summarize");
      return;
    }

    setSummarizing(true);
    setSummary(null);

    try {
      const data = await api.summarize.summarizeUrls(
        topic.trim(),
        selectedLinks
      );

      if (data.success && data.summary) {
        setSummary(data.summary);
        setBackendStatus("online");
      } else {
        alert(data.error || "Failed to summarize. Please try again.");
      }
    } catch (error) {
      console.error("Summarize error:", error);
      setBackendStatus("offline");
      alert(
        error.message ||
        "Error summarizing. Please check if the backend is running on port 5000."
      );
    } finally {
      setSummarizing(false);
    }
  };

  const handleSaveToVault = async () => {
    if (!summary || !user?.uid) {
      alert("No summary to save");
      return;
    }

    setSavingToVault(true);

    try {
      const selectedLinksData = links.filter((link) =>
        selectedLinks.includes(link.url)
      );

      const data = await api.vault.saveItem(user.uid, {
        topic: topic.trim(),
        summary: summary,
        sources: selectedLinksData.map((link) => ({
          url: link.url,
          title: link.title,
        })),
      });

      if (data.success) {
        alert("Summary saved to Vault!");
        setVaultOpen(true);
        setBackendStatus("online");
      } else {
        alert(data.error || "Failed to save to Vault. Please try again.");
      }
    } catch (error) {
      console.error("Save to vault error:", error);
      setBackendStatus("offline");
      alert(
        error.message ||
        "Error saving to Vault. Please check if the backend is running on port 5000."
      );
    } finally {
      setSavingToVault(false);
    }
  };

  const handleDownloadTxt = () => {
    if (!summary || !topic) return;
    const filename = formatFilename(topic, "txt");
    downloadText(summary, filename);
  };

  const handleDownloadMarkdown = () => {
    if (!summary || !topic) return;
    const filename = formatFilename(topic, "md");
    downloadMarkdown(summary, filename);
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-slate-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <Navbar backendStatus={backendStatus} setVaultOpen={setVaultOpen} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
              Research & Summarize
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Enter a topic to search the web and generate comprehensive
              AI-powered summaries.
            </p>
          </div>

          <SearchInput
            topic={topic}
            setTopic={setTopic}
            handleSearch={handleSearch}
            searching={searching}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <SourceList
                links={links}
                selectedLinks={selectedLinks}
                toggleLinkSelection={toggleLinkSelection}
              />
            </div>

            <div className="lg:col-span-8">
              <SummaryView
                summary={summary}
                selectedLinks={selectedLinks}
                links={links}
                summarizing={summarizing}
                handleSummarize={handleSummarize}
                handleDownloadTxt={handleDownloadTxt}
                handleDownloadMarkdown={handleDownloadMarkdown}
                handleSaveToVault={handleSaveToVault}
                savingToVault={savingToVault}
              />
            </div>
          </div>
        </main>

        <Vault isOpen={vaultOpen} onClose={() => setVaultOpen(false)} />
      </div>
    </AuthGuard>
  );
}
