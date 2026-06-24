import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE from "../../config";
import { useAuth } from "../../authContext";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      if (!userId || userId === "undefined" || userId === "null") {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/repo/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setRepositories(data.repositories || []);
      } catch (err) {
        console.error("Error fetching repositories:", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`${API_BASE}/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data || []);
      } catch (err) {
        console.error("Error fetching suggested repositories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  const displayName = currentUser ? currentUser.email?.split('@')[0] || "Developer" : "Developer";

  return (
    <div className="p-4 lg:p-6 max-w-[1440px] mx-auto w-full fade-in">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Main Column: Recent Repos & Activity Feed */}
        <section className="col-span-1 md:col-span-8 flex flex-col gap-6">
          
          {/* Recent Repositories */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sans font-bold text-lg text-on-surface">Recent Repositories</h2>
              <button 
                onClick={() => navigate('/create')} 
                className="btn-primary flex items-center gap-2 py-1.5 px-3"
              >
                <span className="material-symbols-outlined text-sm">add</span> New
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="card p-4 animate-pulse h-24"></div>
                ))
              ) : repositories.length === 0 ? (
                 <div className="card p-8 text-center border-dashed">
                   <span className="material-symbols-outlined text-3xl text-outline mb-2">folder_off</span>
                   <h4 className="text-on-surface font-semibold">No repositories yet</h4>
                   <p className="text-on-surface-variant text-sm mt-1">Get started by creating your first repository.</p>
                 </div>
              ) : repositories.slice(0, 5).map(repo => (
                <div 
                  key={repo._id} 
                  onClick={() => navigate(`/repo/${repo._id}`)}
                  className="card p-4 hover:bg-slate-700/30 transition-colors cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-on-surface-variant text-base">book</span>
                        <h4 className="font-bold text-on-surface text-base group-hover:text-primary transition-colors">{repo.name}</h4>
                        <span className="ml-2 border border-slate-600 rounded-full text-[10px] px-2 py-0.5 text-on-surface-variant uppercase font-semibold">
                           {repo.visibility ? "Public" : "Private"}
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-sm line-clamp-1">{repo.description || "No description provided."}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-on-surface-variant text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="lang-dot lang-js"></span> JavaScript
                    </span>
                    <span className="flex items-center gap-1 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[14px]">star</span> 0
                    </span>
                    <span>Updated recently</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed (Mock Data) */}
          <div>
            <h2 className="font-sans font-bold text-lg text-on-surface mb-4">Activity Feed</h2>
            <div className="card p-0 overflow-hidden">
              <div className="table-row flex gap-4">
                <img src={`https://ui-avatars.com/api/?name=${displayName}&background=020617&color=adc6ff`} className="w-8 h-8 rounded-full border border-slate-600 shrink-0" alt="avatar" />
                <div>
                  <p className="text-sm">
                    <span className="font-bold text-on-surface">@{displayName}</span> pushed to <span className="font-mono text-xs bg-slate-900 px-1 rounded">main</span> in <span className="font-bold text-primary cursor-pointer hover:underline">devvault-core</span>
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="table-row flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 shrink-0 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-sm">merge_type</span>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-bold text-on-surface">sarah_dev</span> opened PR <span className="font-bold text-primary cursor-pointer hover:underline">#42 Fix authentication middleware</span>
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Right Column: Trending / Explore */}
        <aside className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-5">
            <h2 className="font-sans font-bold text-lg text-on-surface mb-4">Trending Repositories</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse flex flex-col gap-2">
                   <div className="h-12 bg-slate-700 rounded"></div>
                   <div className="h-12 bg-slate-700 rounded"></div>
                </div>
              ) : suggestedRepositories.length === 0 ? (
                <p className="text-sm text-on-surface-variant">No trending repositories.</p>
              ) : suggestedRepositories.slice(0, 4).map((repo) => (
                <div key={repo._id} onClick={() => navigate(`/repo/${repo._id}`)} className="group cursor-pointer">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-outline mt-0.5">folder_open</span>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-semibold text-sm text-on-surface truncate group-hover:text-primary transition-colors">{repo.name}</h4>
                      <p className="text-xs text-on-surface-variant truncate mt-0.5">{repo.description || "No description"}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1 hover:text-primary">
                          <span className="material-symbols-outlined text-[14px]">star</span> 0
                        </span>
                        <span className="flex items-center gap-1 hover:text-primary">
                          <span className="material-symbols-outlined text-[14px]">call_split</span> 0
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="h-px bg-slate-800 my-3 group-last:hidden"></div>
                </div>
              ))}
            </div>
            <button className="w-full mt-2 py-1.5 text-xs font-semibold text-primary hover:bg-slate-800 rounded transition-colors">
              Explore more
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Dashboard;
