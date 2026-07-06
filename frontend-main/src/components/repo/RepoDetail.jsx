import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import API_BASE from "../../config";

const RepoDetail = () => {
  const { id } = useParams();
  const { repoDetails } = useOutletContext();
  const [fileTree, setFileTree] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFileTree = async () => {
      try {
        const response = await fetch(`${API_BASE}/repo/${id}/tree`);
        if (response.ok) {
           const data = await response.json();
           setFileTree(data);
        }
      } catch (err) {
        console.error("Error fetching file tree:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFileTree();
  }, [id]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      
      {/* File Browser & Code View (Left 9 columns) */}
      <section className="col-span-1 lg:col-span-9 flex flex-col gap-4">
        
        {/* Controls Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <button className="btn-secondary py-1.5 px-3 flex items-center gap-2 bg-slate-800">
              <span className="material-symbols-outlined text-[16px]">call_split</span>
              <span className="font-bold">main</span>
              <span className="material-symbols-outlined text-[16px] text-outline">arrow_drop_down</span>
            </button>
            <div className="flex items-center gap-4 ml-4 text-outline font-sans">
              <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors"><span className="material-symbols-outlined text-[16px]">history</span> <span className="font-bold text-on-surface">1</span> Commit</span>
              <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors"><span className="material-symbols-outlined text-[16px]">device_hub</span> <span className="font-bold text-on-surface">1</span> Branch</span>
              <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors"><span className="material-symbols-outlined text-[16px]">sell</span> <span className="font-bold text-on-surface">0</span> Tags</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-primary py-1.5 px-4 flex items-center gap-1">
              Code <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
            </button>
          </div>
        </div>

        {/* File Table / Code View */}
        <div className="card overflow-hidden">
          {/* Latest commit header */}
          <div className="bg-slate-900 border-b border-slate-700 p-3 flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <img src={`https://ui-avatars.com/api/?name=${repoDetails?.owner?.username || 'U'}&background=020617&color=adc6ff`} alt="Avatar" className="w-6 h-6 rounded-full border border-slate-700" />
              <span className="font-bold text-on-surface">{repoDetails?.owner?.username || 'Unknown'}</span>
              <span className="text-outline truncate max-w-xs md:max-w-md">Initial commit</span>
            </div>
            <div className="flex items-center gap-3 text-outline font-mono text-[13px]">
              <span className="hover:text-primary cursor-pointer transition-colors">a9f3e41</span>
              <span>2 hours ago</span>
            </div>
          </div>

          {/* File list */}
          <div className="flex flex-col">
            {loading ? (
              <div className="p-4 text-center text-outline text-sm animate-pulse">Loading files...</div>
            ) : fileTree.length === 0 ? (
              <div className="p-8 text-center text-outline text-sm italic">No files in repository</div>
            ) : (
              fileTree.map((item, index) => (
                <div key={index}>
                  <div className="table-row grid grid-cols-12 items-center text-sm group">
                    <div className="col-span-12 md:col-span-5 flex items-center gap-3">
                      <span className="material-symbols-outlined text-outline text-[18px]">description</span>
                      <span className="text-on-surface font-mono text-[13px] group-hover:text-primary group-hover:underline transition-colors truncate">{item.name}</span>
                    </div>
                    <div className="col-span-5 hidden md:block text-outline truncate pr-4">Updated via DevVault</div>
                    <div className="col-span-2 hidden md:block text-right text-outline font-mono text-[13px]">2h ago</div>
                  </div>
                  {/* Inline Code View for demo */}
                  <div className="bg-[#020617] border-b border-slate-800 last:border-b-0 overflow-x-auto text-[13px] leading-[20px] font-mono">
                    <div className="flex">
                      <div className="text-slate-600 bg-slate-900/50 py-4 px-4 text-right select-none border-r border-slate-800 min-w-[3rem]">
                        {item.content?.split('\n').map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        )) || "1"}
                      </div>
                      <div className="p-4 whitespace-pre text-on-surface-variant flex-1">
                        {item.content?.split('\n').map((line, i) => (
                          <div key={i} className="hover:bg-slate-800 border-l-2 border-transparent hover:border-primary pl-2 -ml-2">{line || " "}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* README Section */}
        <div className="card mt-4">
          <div className="border-b border-slate-700 bg-slate-900 p-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-outline text-[18px]">menu_book</span>
            <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">README.md</h3>
          </div>
          <div className="p-6 text-on-surface-variant text-sm font-sans">
            <h1 className="text-2xl font-bold text-on-surface mb-4">{repoDetails?.name || "Repository"}</h1>
            <p className="mb-4">{repoDetails?.description || "No description provided."}</p>
          </div>
        </div>

      </section>

      {/* Sidebar details (Right 3 columns) */}
      <aside className="col-span-1 lg:col-span-3 flex flex-col gap-6">
        <div className="pb-4 border-b border-slate-800">
          <h3 className="font-bold text-base text-on-surface mb-3">About</h3>
          <p className="text-outline text-sm leading-relaxed mb-4">
            {repoDetails?.description || "No description, website, or topics provided."}
          </p>
          <div className="space-y-2">
            <div className="flex items-center text-outline text-sm hover:text-primary cursor-pointer transition-colors">
              <span className="material-symbols-outlined mr-2 text-[16px]">menu_book</span> Readme
            </div>
            <div className="flex items-center text-outline text-sm hover:text-primary cursor-pointer transition-colors">
              <span className="material-symbols-outlined mr-2 text-[16px]">gavel</span> MIT License
            </div>
            <div className="flex items-center text-outline text-sm hover:text-primary cursor-pointer transition-colors">
              <span className="material-symbols-outlined mr-2 text-[16px]">visibility</span> 1 watching
            </div>
            <div className="flex items-center text-outline text-sm hover:text-primary cursor-pointer transition-colors">
              <span className="material-symbols-outlined mr-2 text-[16px]">star</span> 0 stars
            </div>
          </div>
        </div>

        <div className="pb-4 border-b border-slate-800">
          <h3 className="font-bold text-sm text-on-surface mb-3">Languages</h3>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2 flex">
            <div className="bg-[#f1e05a] h-full" style={{ width: '100%' }}></div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface">
            <span className="lang-dot lang-js"></span> JavaScript <span className="text-outline font-normal ml-1">100.0%</span>
          </div>
        </div>
      </aside>
      
    </div>
  );
};

export default RepoDetail;
