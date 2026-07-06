import React, { useState, useEffect } from "react";
import { Outlet, useParams, Link, useLocation } from "react-router-dom";
import API_BASE from "../../config";

const RepoLayout = () => {
  const { id } = useParams();
  const location = useLocation();
  const [repoDetails, setRepoDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        const response = await fetch(`${API_BASE}/repo/${id}`);
        if (response.ok) {
          const data = await response.json();
          setRepoDetails(data);
        }
      } catch (err) {
        console.error("Error fetching repo details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepoDetails();
  }, [id]);

  const tabs = [
    { name: "Code", path: `/repo/${id}`, icon: "code" },
    { name: "Issues", path: `/repo/${id}/issues`, icon: "error_outline" },
    { name: "Pull Requests", path: `/repo/${id}/pulls`, icon: "merge_type" },
    { name: "Actions", path: `#`, icon: "play_circle" },
    { name: "Settings", path: `#`, icon: "settings" }
  ];

  if (loading) {
    return <div className="p-xl animate-pulse bg-slate-800 h-32 m-6 rounded-lg"></div>;
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-60px)]">
      {/* Repository Header */}
      <div className="bg-[#131b2e] border-b border-slate-700 pt-6">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            
            {/* Breadcrumbs & Badge */}
            <div className="flex items-center gap-2 text-lg">
              <span className="material-symbols-outlined text-outline">book</span>
              <span className="text-primary hover:underline cursor-pointer">{repoDetails?.owner?.username || "user"}</span>
              <span className="text-on-surface-variant">/</span>
              <span className="text-on-surface font-bold hover:underline cursor-pointer">{repoDetails?.name || "repo"}</span>
              <span className="ml-2 border border-slate-600 rounded-full text-[10px] px-2 py-0.5 text-on-surface-variant uppercase font-semibold">
                {repoDetails?.visibility ? "Public" : "Private"}
              </span>
            </div>

            {/* Actions (Watch, Fork, Star) */}
            <div className="flex items-center gap-2">
              <button className="btn-secondary py-1 px-3 flex items-center gap-2 text-xs">
                <span className="material-symbols-outlined text-[14px]">visibility</span>
                Watch <span className="bg-slate-700 px-1.5 py-0.5 rounded-full text-[10px]">1</span>
              </button>
              <button className="btn-secondary py-1 px-3 flex items-center gap-2 text-xs">
                <span className="material-symbols-outlined text-[14px]">call_split</span>
                Fork <span className="bg-slate-700 px-1.5 py-0.5 rounded-full text-[10px]">0</span>
              </button>
              <button className="btn-secondary py-1 px-3 flex items-center gap-2 text-xs">
                <span className="material-symbols-outlined text-[14px]">star</span>
                Star <span className="bg-slate-700 px-1.5 py-0.5 rounded-full text-[10px]">0</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar gap-6">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className={`flex items-center gap-2 pb-2 text-sm transition-colors whitespace-nowrap ${
                    isActive 
                      ? "text-on-surface font-semibold border-b-2 border-primary" 
                      : "text-outline hover:text-on-surface border-b-2 border-transparent"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto p-4 lg:p-6 fade-in">
        <Outlet context={{ repoDetails }} />
      </div>
    </div>
  );
};

export default RepoLayout;
