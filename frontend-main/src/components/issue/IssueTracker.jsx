import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import API_BASE from "../../config";

const IssueTracker = () => {
  const { id: repoId } = useParams();
  const { repoDetails } = useOutletContext();
  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("all");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, [repoId]);

  const fetchIssues = async () => {
    try {
      const response = await fetch(`${API_BASE}/issue/repo/${repoId}`);
      if (response.ok) {
        const data = await response.json();
        setIssues(data);
      }
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/issue/create/${repoId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (response.ok) {
        setTitle("");
        setDescription("");
        setIsCreating(false);
        fetchIssues();
      }
    } catch (err) {
      console.error("Error creating issue:", err);
    }
  };

  const handleToggleStatus = async (issueId, currentStatus) => {
    const newStatus = currentStatus === "open" ? "closed" : "open";
    try {
      await fetch(`${API_BASE}/issue/update/${issueId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchIssues();
    } catch (err) {
      console.error("Error updating issue:", err);
    }
  };

  const filteredIssues = filter === "all" ? issues : issues.filter((i) => i.status === filter);
  const openCount = issues.filter(i => i.status === "open").length;
  const closedCount = issues.filter(i => i.status === "closed").length;

  return (
    <div className="fade-in">
      {/* Create Issue Section */}
      {isCreating ? (
        <div className="card p-6 mb-6">
          <h3 className="font-bold text-lg mb-4 text-on-surface">Open a new issue</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Issue title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <textarea
                placeholder="Describe the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                className="input-field font-sans resize-y"
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
                Submit new issue
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
            New issue
          </button>
        </div>
      )}

      {/* Issues Interface */}
      <div className="card overflow-hidden">
        {/* Filter Bar */}
        <div className="bg-slate-900 border-b border-slate-700 p-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm font-semibold">
            <button 
              onClick={() => setFilter("open")}
              className={`flex items-center gap-1.5 transition-colors ${filter === "open" || filter === "all" ? "text-on-surface" : "text-outline hover:text-on-surface"}`}
            >
              <span className="material-symbols-outlined text-[16px]">error_outline</span>
              {openCount} Open
            </button>
            <button 
              onClick={() => setFilter("closed")}
              className={`flex items-center gap-1.5 transition-colors ${filter === "closed" ? "text-on-surface" : "text-outline hover:text-on-surface"}`}
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {closedCount} Closed
            </button>
          </div>
          <div className="flex items-center gap-4 text-sm text-outline font-semibold">
            <span className="cursor-pointer hover:text-on-surface flex items-center gap-1">Label <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span></span>
            <span className="cursor-pointer hover:text-on-surface flex items-center gap-1">Assignee <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span></span>
            <span className="cursor-pointer hover:text-on-surface flex items-center gap-1">Sort <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span></span>
          </div>
        </div>

        {/* Issue List */}
        <div className="flex flex-col bg-slate-800">
          {filteredIssues.length === 0 ? (
            <div className="p-8 text-center text-outline">
              <span className="material-symbols-outlined text-4xl mb-2">task</span>
              <h4 className="text-on-surface font-semibold">No issues found</h4>
              <p className="text-sm mt-1">No issues match the current filter.</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div key={issue._id} className="table-row group flex items-start gap-4 p-4 text-[14px]">
                <div className="pt-0.5">
                  <span className={`material-symbols-outlined text-[18px] ${issue.status === "open" ? "text-secondary" : "text-error"}`}>
                    {issue.status === "open" ? "error_outline" : "task_alt"}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-on-surface text-base hover:text-primary cursor-pointer transition-colors break-words mb-1">
                        {issue.title}
                      </h4>
                      <div className="flex items-center gap-2 text-outline text-xs">
                        <span>#1 opened recently by</span>
                        <span className="hover:text-primary cursor-pointer font-semibold text-on-surface-variant">author</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`status-pill ${issue.status === "open" ? "status-open" : "status-closed"}`}>
                           {issue.status === "open" && <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>}
                           {issue.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex -space-x-2 mr-2">
                         <img src={`https://ui-avatars.com/api/?name=A&background=020617&color=adc6ff`} className="w-5 h-5 rounded-full border border-slate-700" alt="avatar" />
                      </div>
                      <button
                        onClick={() => handleToggleStatus(issue._id, issue.status)}
                        className="opacity-0 group-hover:opacity-100 btn-secondary py-1 px-3 text-xs"
                      >
                        {issue.status === "open" ? "Close" : "Reopen"}
                      </button>
                    </div>
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

export default IssueTracker;
