import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import API_BASE from "../../config";

const PullRequests = () => {
  const { id: repoId } = useParams();
  const { repoDetails } = useOutletContext();
  const [prs, setPrs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sourceBranch, setSourceBranch] = useState("");
  const [targetBranch, setTargetBranch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchPRs();
  }, [repoId]);

  const fetchPRs = async () => {
    try {
      const response = await fetch(`${API_BASE}/pr/repo/${repoId}`);
      if (response.ok) {
        const data = await response.json();
        setPrs(data);
      }
    } catch (err) {
      console.error("Error fetching PRs:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/pr/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, sourceBranch, targetBranch, repository: repoId, author: userId }),
      });
      if (response.ok) {
        setTitle("");
        setDescription("");
        setSourceBranch("");
        setTargetBranch("");
        setIsCreating(false);
        fetchPRs();
      }
    } catch (err) {
      console.error("Error creating PR:", err);
    }
  };

  const handleMerge = async (prId) => {
    if (!window.confirm("Are you sure you want to merge this pull request?")) return;
    try {
      const response = await fetch(`${API_BASE}/pr/merge/${prId}`, { method: "PUT" });
      if (response.ok) fetchPRs();
    } catch (err) {
      console.error("Error merging PR:", err);
    }
  };

  const filteredPRs = filter === "all" ? prs : prs.filter((pr) => pr.status === filter);
  const openCount = prs.filter(p => p.status === "open").length;
  const mergedCount = prs.filter(p => p.status === "merged").length;

  return (
    <div className="fade-in">
      {/* Create PR Section */}
      {isCreating ? (
        <div className="card p-6 mb-6">
          <h3 className="font-bold text-lg mb-4 text-on-surface">Create a pull request</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="PR title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <textarea
                placeholder="Describe your changes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                className="input-field font-sans resize-y"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Source branch (e.g. feature-x)"
                value={sourceBranch}
                onChange={(e) => setSourceBranch(e.target.value)}
                required
                className="input-field"
              />
              <input
                type="text"
                placeholder="Target branch (e.g. main)"
                value={targetBranch}
                onChange={(e) => setTargetBranch(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
              >
                Create PR
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => setIsCreating(true)}
            className="btn-secondary"
          >
            New pull request
          </button>
        </div>
      )}

      {/* PRs Interface */}
      <div className="card overflow-hidden">
        {/* Filter Bar */}
        <div className="bg-slate-900 border-b border-slate-700 p-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm font-semibold">
            <button 
              onClick={() => setFilter("open")}
              className={`flex items-center gap-1.5 transition-colors ${filter === "open" || filter === "all" ? "text-on-surface" : "text-outline hover:text-on-surface"}`}
            >
              <span className="material-symbols-outlined text-[16px]">merge_type</span>
              {openCount} Open
            </button>
            <button 
              onClick={() => setFilter("merged")}
              className={`flex items-center gap-1.5 transition-colors ${filter === "merged" ? "text-on-surface" : "text-outline hover:text-on-surface"}`}
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {mergedCount} Merged
            </button>
          </div>
          <div className="flex items-center gap-4 text-sm text-outline font-semibold">
            <span className="cursor-pointer hover:text-on-surface flex items-center gap-1">Label <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span></span>
            <span className="cursor-pointer hover:text-on-surface flex items-center gap-1">Sort <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span></span>
          </div>
        </div>

        {/* PR List */}
        <div className="flex flex-col bg-slate-800">
          {filteredPRs.length === 0 ? (
            <div className="p-8 text-center text-outline">
              <span className="material-symbols-outlined text-4xl mb-2">merge_type</span>
              <h4 className="text-on-surface font-semibold">No pull requests found</h4>
              <p className="text-sm mt-1">No PRs match the current filter.</p>
            </div>
          ) : (
            filteredPRs.map((pr) => (
              <div key={pr._id} className="table-row group flex items-start gap-4 p-4 text-[14px]">
                <div className="pt-0.5">
                  <span className={`material-symbols-outlined text-[18px] ${pr.status === "open" ? "text-secondary" : "text-tertiary"}`}>
                    {pr.status === "open" ? "merge_type" : "check_circle"}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-on-surface text-base hover:text-primary cursor-pointer transition-colors break-words mb-1">
                        {pr.title}
                      </h4>
                      <div className="flex items-center gap-2 text-outline text-xs">
                        <span>#1 opened recently by</span>
                        <span className="hover:text-primary cursor-pointer font-semibold text-on-surface-variant">author</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`status-pill ${pr.status === "open" ? "status-open" : "status-merged"}`}>
                           {pr.status === "open" && <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>}
                           {pr.status}
                        </span>
                        <div className="flex items-center gap-1 ml-2 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-code-sm text-outline">
                          <span>{pr.sourceBranch}</span>
                          <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                          <span>{pr.targetBranch}</span>
                        </div>
                      </div>
                    </div>
                    
                    {pr.status === "open" && (
                      <div className="flex flex-col items-end gap-2">
                         <div className="flex -space-x-2 mr-2">
                           {/* Assignee mock */}
                           <img src={`https://ui-avatars.com/api/?name=A&background=020617&color=adc6ff`} className="w-5 h-5 rounded-full border border-slate-700" alt="avatar" />
                         </div>
                         <button
                           onClick={() => handleMerge(pr._id)}
                           className="opacity-0 group-hover:opacity-100 btn-secondary py-1 px-3 text-xs"
                         >
                           Merge
                         </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PullRequests;
