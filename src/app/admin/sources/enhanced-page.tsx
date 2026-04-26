"use client";

import AdminSidebar from "@/components/AdminSidebar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

interface Source {
  id: string;
  domain: string;
  name: string;
  tier: "TRUSTED" | "QUESTIONABLE" | "DISINFO";
  biasIndex: number;
  credibilityScore: number;
  category: string;
  region?: string;
  description?: string;
  lastUpdated: string;
  auditDate: string;
  auditor: string;
}

export default function EnhancedAdminSourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [filteredSources, setFilteredSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<Source | null>(null);

  const categories = ["NEWS", "SOCIAL_MEDIA", "BLOG", "FORUM", "GOVERNMENT", "EDUCATIONAL"];
  const tiers = ["TRUSTED", "QUESTIONABLE", "DISINFO"];

  useEffect(() => {
    fetchSources();
  }, []);

  useEffect(() => {
    filterSources();
  }, [sources, searchTerm, selectedCategory, selectedTier]);

  const fetchSources = async () => {
    try {
      const res = await fetch("/api/sources");
      if (res.ok) {
        const data = await res.json();
        setSources(data);
      }
    } catch (error) {
      console.error("Sources fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterSources = () => {
    let filtered = sources;

    if (searchTerm) {
      filtered = filtered.filter(source =>
        source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        source.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(source => source.category === selectedCategory);
    }

    if (selectedTier) {
      filtered = filtered.filter(source => source.tier === selectedTier);
    }

    setFilteredSources(filtered);
  };

  const handleCreateSource = async (sourceData: Partial<Source>) => {
    try {
      const res = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sourceData)
      });

      if (res.ok) {
        setShowCreateModal(false);
        fetchSources(); // Refresh list
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create source");
      }
    } catch (error) {
      console.error("Create source error:", error);
      alert("Failed to create source");
    }
  };

  const handleUpdateSource = async (id: string, sourceData: Partial<Source>) => {
    try {
      const res = await fetch(`/api/sources/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sourceData)
      });

      if (res.ok) {
        setEditingSource(null);
        fetchSources(); // Refresh list
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update source");
      }
    } catch (error) {
      console.error("Update source error:", error);
      alert("Failed to update source");
    }
  };

  const handleDeleteSource = async (source: Source) => {
    try {
      const res = await fetch(`/api/sources/${source.id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setShowDeleteModal(null);
        fetchSources(); // Refresh list
      } else {
        const error = await res.json();
        alert(error.error || "Failed to delete source");
      }
    } catch (error) {
      console.error("Delete source error:", error);
      alert("Failed to delete source");
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "TRUSTED": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "QUESTIONABLE": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "DISINFO": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 ml-72 p-10 max-w-7xl">
        <header className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(14,165,233,1)]"></span>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.3em]">Enhanced Source Management</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight leading-tight italic">Bias Database <span className="text-sky-500">Control</span></h1>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-slate-950 rounded-xl font-black text-xs tracking-widest uppercase transition-all shadow-lg shadow-sky-600/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Add New Source
          </button>
        </header>

        {/* Filters */}
        <div className="glass-panel rounded-2xl p-6 mb-8 border border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sources..."
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Tier</label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">All Tiers</option>
                {tiers.map(tier => (
                  <option key={tier} value={tier}>{tier}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
                {filteredSources.length} / {sources.length} sources
              </div>
            </div>
          </div>
        </div>

        {/* Sources Table */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-20 text-center text-slate-600 uppercase tracking-[0.3em] font-mono text-xs animate-pulse">
                Loading source database...
              </div>
            ) : filteredSources.length === 0 ? (
              <div className="p-20 text-center text-slate-600 font-mono text-xs uppercase tracking-widest italic">
                No sources found matching criteria.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
                    <th className="px-6 py-4">Source Name</th>
                    <th className="px-6 py-4">Domain</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Tier</th>
                    <th className="px-6 py-4">Bias Index</th>
                    <th className="px-6 py-4">Credibility</th>
                    <th className="px-6 py-4">Last Updated</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredSources.map((source) => (
                    <tr key={source.id} className="hover:bg-slate-800 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-white">{source.name}</div>
                          {source.description && (
                            <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {source.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sky-400 font-mono text-sm">{source.domain}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                          {source.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border ${getTierColor(source.tier)}`}>
                          {source.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                source.biasIndex <= 30 ? "bg-green-500" :
                                source.biasIndex <= 60 ? "bg-amber-500" : "bg-red-500"
                              }`}
                              style={{ width: `${source.biasIndex}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-mono">{source.biasIndex}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getCredibilityColor(source.credibilityScore)}`}
                              style={{ width: `${source.credibilityScore}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-mono ${getCredibilityColor(source.credibilityScore)}`}>
                            {source.credibilityScore}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-slate-500">
                          {new Date(source.lastUpdated).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingSource(source)}
                            className="p-2 text-sky-500 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition-all"
                            title="Edit source"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(source)}
                            className="p-2 text-red-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all"
                            title="Delete source"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="mt-20">
          <Footer />
        </div>
      </main>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingSource) && (
        <SourceModal
          source={editingSource}
          onClose={() => {
            setShowCreateModal(false);
            setEditingSource(null);
          }}
          onSave={editingSource ? 
            (data) => handleUpdateSource(editingSource.id, data) :
            handleCreateSource
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          source={showDeleteModal}
          onConfirm={() => handleDeleteSource(showDeleteModal)}
          onCancel={() => setShowDeleteModal(null)}
        />
      )}
    </div>
  );
}

// Source Modal Component
function SourceModal({ 
  source, 
  onClose, 
  onSave 
}: { 
  source: Source | null; 
  onClose: () => void; 
  onSave: (data: Partial<Source>) => void; 
}) {
  const [formData, setFormData] = useState<Partial<Source>>({
    name: source?.name || "",
    domain: source?.domain || "",
    tier: source?.tier || "QUESTIONABLE",
    biasIndex: source?.biasIndex || 50,
    category: source?.category || "NEWS",
    region: source?.region || "",
    description: source?.description || ""
  });

  const categories = ["NEWS", "SOCIAL_MEDIA", "BLOG", "FORUM", "GOVERNMENT", "EDUCATIONAL"];
  const tiers = ["TRUSTED", "QUESTIONABLE", "DISINFO"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-2xl font-bold text-white">
            {source ? "Edit Source" : "Create New Source"}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Source Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="e.g., Reuters News"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Domain *</label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="e.g., reuters.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                {tiers.map(tier => (
                  <option key={tier} value={tier}>{tier}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Bias Index (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.biasIndex}
                onChange={(e) => setFormData({ ...formData, biasIndex: parseInt(e.target.value) })}
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Region</label>
            <input
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="e.g., US, UK, EU"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              placeholder="Brief description of the source..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-slate-950 rounded-lg font-medium transition-all"
            >
              {source ? "Update Source" : "Create Source"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmModal({ 
  source, 
  onConfirm, 
  onCancel 
}: { 
  source: Source; 
  onConfirm: () => void; 
  onCancel: () => void; 
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-md w-full">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500">warning</span>
            Confirm Deletion
          </h3>
        </div>
        
        <div className="p-6">
          <p className="text-slate-300 mb-6">
            Are you sure you want to delete <span className="font-bold text-white">{source.name}</span>?
          </p>
          <p className="text-sm text-slate-500 mb-6">
            This action cannot be undone. The source will be permanently removed from the database.
          </p>
          
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
            >
              Delete Source
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
