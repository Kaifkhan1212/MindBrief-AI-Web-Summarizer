"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

export default function Vault({ isOpen, onClose }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchVaultItems();
    }
  }, [isOpen, user]);

  const fetchVaultItems = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const data = await api.vault.getItems(user.uid);
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching vault items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!user?.uid) return;

    if (!confirm("Are you sure you want to delete this summary?")) {
      return;
    }

    try {
      setIsDeleting(itemId);
      const data = await api.vault.deleteItem(user.uid, itemId);

      if (data.success) {
        setItems(items.filter((item) => item.id !== itemId));
        if (selectedItem?.id === itemId) {
          setSelectedItem(null);
        }
      }
    } catch (error) {
      console.error("Error deleting vault item:", error);
      alert("Failed to delete item. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="h-full w-full max-w-4xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
        {/* Modern Header */}
        <div className="border-b border-slate-200 p-6 flex items-center justify-between bg-gradient-to-r from-indigo-50 via-white to-purple-50">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-sm">
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
                    d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h12a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Vault</h2>
                <p className="text-sm text-slate-600">
                  {items.length} saved summar{items.length !== 1 ? "ies" : "y"}
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-slate-200 hover:bg-slate-50"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Items List - Left Sidebar */}
          <div className="w-80 border-r border-slate-200 overflow-y-auto bg-slate-50/50">
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mx-auto mb-3"></div>
                <p className="text-sm text-slate-500">Loading summaries...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-slate-400"
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
                </div>
                <p className="text-slate-700 font-medium mb-1">
                  No saved summaries
                </p>
                <p className="text-sm text-slate-500">
                  Your summaries will appear here after you save them
                </p>
              </div>
            ) : (
              <div className="p-3">
                {items
                  .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`p-4 mb-2 rounded-xl cursor-pointer transition-all ${selectedItem?.id === item.id
                        ? "bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-400 shadow-sm"
                        : "bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm"
                        }`}
                    >
                      <h3 className="font-semibold text-sm text-slate-900 truncate mb-1">
                        {item.topic}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      {item.sources && item.sources.length > 0 && (
                        <p className="text-xs text-indigo-600 mt-1.5">
                          {item.sources.length} source
                          {item.sources.length !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Item Detail - Right Panel */}
          <div className="flex-1 overflow-y-auto bg-white">
            {selectedItem ? (
              <div className="p-8">
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-200">
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">
                      {selectedItem.topic}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Saved on{" "}
                      {new Date(selectedItem.createdAt).toLocaleString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(selectedItem.id)}
                    disabled={isDeleting === selectedItem.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-xl"
                  >
                    {isDeleting === selectedItem.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </>
                    )}
                  </Button>
                </div>

                <div className="prose prose-slate max-w-none mb-8">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 text-base">
                    {selectedItem.summary}
                  </div>
                </div>

                {selectedItem.sources && selectedItem.sources.length > 0 && (
                  <div className="border-t border-slate-200 pt-8">
                    <h4 className="font-semibold text-lg text-slate-900 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      Sources ({selectedItem.sources.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedItem.sources.map((source, index) => (
                        <a
                          key={index}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 bg-slate-50 hover:bg-indigo-50 rounded-xl transition-colors border border-slate-200 hover:border-indigo-300"
                        >
                          <p className="text-sm font-semibold text-indigo-700 truncate mb-1">
                            {source.title || source.url}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {source.url}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center p-8">
                <div>
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-600 font-medium">
                    Select a summary to view
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Choose an item from the list
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
