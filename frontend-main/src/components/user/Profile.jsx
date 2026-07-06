import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_BASE from "../../config";
import { useAuth } from "../../authContext";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [userRepos, setUserRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchUserRepos = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId || userId === "undefined" || userId === "null") return;
      try {
        const response = await fetch(`${API_BASE}/repo/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setUserRepos(data.repositories || []);
        
        // Mock user details since we only have auth email right now
        const displayName = currentUser ? currentUser.email?.split('@')[0] : "developer";
        setUserDetails({
          username: displayName,
          bio: "Full-stack developer building cool things.",
          location: "San Francisco, CA",
          website: "https://devvault.io",
          followers: 128,
          following: 42,
        });
      } catch (err) {
        console.error("Error fetching user repos:", err);
      }
    };

    fetchUserRepos();
  }, [currentUser]);

  if (!userDetails) {
    return (
      <div className="p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/4 space-y-4">
            <div className="animate-pulse bg-slate-800 w-full aspect-square rounded-full mx-auto max-w-[260px]" />
            <div className="animate-pulse bg-slate-800 h-6 w-2/3 rounded mx-auto" />
            <div className="animate-pulse bg-slate-800 h-10 w-full rounded" />
          </div>
          <div className="w-full lg:w-3/4">
            <div className="animate-pulse bg-slate-800 h-48 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const filteredRepos = userRepos.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6 max-w-[1440px] mx-auto w-full fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar: Profile Details */}
        <aside className="w-full lg:w-1/4 flex flex-col items-center lg:items-start gap-4">
          <img 
            src={`https://ui-avatars.com/api/?name=${userDetails.username}&background=020617&color=adc6ff&size=400`}
            alt="Profile Avatar" 
            className="w-48 h-48 lg:w-full lg:h-auto lg:aspect-square rounded-full border border-slate-700 object-cover shadow-lg"
          />
          <div className="text-center lg:text-left w-full mt-2">
            <h1 className="text-2xl font-bold text-on-surface">@{userDetails.username}</h1>
            <p className="text-on-surface-variant text-sm mt-2">{userDetails.bio}</p>
          </div>
          
          <div className="flex flex-col gap-2 w-full text-sm text-on-surface-variant mt-2">
             <div className="flex items-center justify-center lg:justify-start gap-2">
               <span className="material-symbols-outlined text-[16px]">group</span>
               <span className="text-on-surface font-bold">{userDetails.followers}</span> followers
               <span>·</span>
               <span className="text-on-surface font-bold">{userDetails.following}</span> following
             </div>
             <div className="flex items-center justify-center lg:justify-start gap-2 mt-2">
               <span className="material-symbols-outlined text-[16px]">location_on</span>
               {userDetails.location}
             </div>
             <div className="flex items-center justify-center lg:justify-start gap-2">
               <span className="material-symbols-outlined text-[16px]">link</span>
               <a href={userDetails.website} className="hover:text-primary transition-colors">{userDetails.website}</a>
             </div>
          </div>
          
          <button className="btn-secondary w-full mt-2">Edit profile</button>
        </aside>

        {/* Main Content: Repos & Heatmap */}
        <div className="w-full lg:w-3/4 flex flex-col gap-8">
          
          {/* Pinned Repos */}
          <section>
             <h2 className="text-base font-bold text-on-surface mb-4">Pinned</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userRepos.slice(0, 4).map((repo) => (
                  <div key={repo._id} className="card p-4 hover:bg-slate-700/30 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-outline text-[18px]">book</span>
                        <Link to={`/repo/${repo._id}`} className="font-bold text-on-surface hover:text-primary transition-colors text-sm break-all">
                          {repo.name}
                        </Link>
                        <span className="border border-slate-600 rounded-full text-[10px] px-2 py-0.5 text-on-surface-variant uppercase font-semibold ml-auto">
                          {repo.visibility ? "Public" : "Private"}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant line-clamp-2">
                        {repo.description || "No description provided."}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1.5">
                        <span className="lang-dot lang-js"></span> JavaScript
                      </span>
                      <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
                        <span className="material-symbols-outlined text-[14px]">star</span> 0
                      </span>
                      <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
                        <span className="material-symbols-outlined text-[14px]">call_split</span> 0
                      </span>
                    </div>
                  </div>
                ))}
                {userRepos.length === 0 && (
                  <p className="text-sm text-on-surface-variant col-span-2">You don't have any repositories yet.</p>
                )}
             </div>
          </section>

          {/* Contribution Heatmap */}
          <section>
            <h2 className="text-base font-bold text-on-surface mb-4">128 contributions in the last year</h2>
            <div className="card p-4 overflow-x-auto hide-scrollbar">
              <div className="flex gap-1 min-w-max">
                {/* Mock heatmap columns */}
                {Array.from({ length: 52 }).map((_, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, rowIndex) => {
                      const rand = Math.random();
                      let bgClass = "bg-slate-800";
                      if (rand > 0.8) bgClass = "bg-[#00a572]"; 
                      else if (rand > 0.6) bgClass = "bg-[#4edea3]/60"; 
                      else if (rand > 0.4) bgClass = "bg-[#4edea3]/30";
                      
                      return (
                        <div 
                          key={`${colIndex}-${rowIndex}`} 
                          className={`w-[10px] h-[10px] rounded-[2px] ${bgClass}`}
                          title="1 contribution on Jan 1"
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-end gap-1.5 text-xs text-outline">
                <span>Less</span>
                <div className="w-[10px] h-[10px] rounded-[2px] bg-slate-800" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-[#4edea3]/30" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-[#4edea3]/60" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-[#00a572]" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-[#4edea3]" />
                <span>More</span>
              </div>
            </div>
          </section>

          {/* Repository List */}
          <section>
            <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-4">
              <h2 className="text-base font-bold text-on-surface">Repositories</h2>
              <button onClick={() => window.location.href='/create'} className="btn-primary py-1 px-3 text-xs">New</button>
            </div>
            
            <input 
              type="text" 
              placeholder="Find a repository..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field mb-4 w-full md:w-64"
            />
            
            <div className="flex flex-col">
               {filteredRepos.length === 0 ? (
                 <p className="text-sm text-outline italic py-4">No repositories found matching your search.</p>
               ) : (
                 filteredRepos.map((repo) => (
                   <div key={repo._id} className="py-6 border-b border-slate-800 last:border-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div>
                       <div className="flex items-center gap-2 mb-2">
                         <Link to={`/repo/${repo._id}`} className="font-bold text-lg text-primary hover:underline break-all">
                           {repo.name}
                         </Link>
                         <span className="border border-slate-600 rounded-full text-[10px] px-2 py-0.5 text-on-surface-variant uppercase font-semibold">
                           {repo.visibility ? "Public" : "Private"}
                         </span>
                       </div>
                       <p className="text-sm text-on-surface-variant max-w-2xl">
                         {repo.description || "No description provided."}
                       </p>
                       <div className="mt-4 flex items-center gap-4 text-xs text-on-surface-variant">
                         <span className="flex items-center gap-1.5">
                           <span className="lang-dot lang-js"></span> JavaScript
                         </span>
                         <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
                           <span className="material-symbols-outlined text-[14px]">star</span> 0
                         </span>
                         <span>Updated recently</span>
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                       <button className="btn-secondary py-1 px-3 flex items-center gap-1 text-xs">
                         <span className="material-symbols-outlined text-[14px]">star</span> Star
                       </button>
                     </div>
                   </div>
                 ))
               )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Profile;
