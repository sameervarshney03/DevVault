import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  if (!currentUser) return null;

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItemClass = (path) => {
    return isActive(path)
      ? "flex items-center gap-3 px-4 py-2 bg-surface-container border-l-2 border-primary text-primary font-semibold transition-all duration-150"
      : "flex items-center gap-3 px-4 py-2 border-l-2 border-transparent text-on-surface-variant hover:bg-slate-700/50 hover:text-on-surface transition-all duration-150";
  };

  const displayName = currentUser.email?.split('@')[0] || "Developer";

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed top-0 left-0 h-screen bg-slate-800 border-r border-slate-700 flex flex-col py-4 z-50 transition-transform duration-300
        w-64 transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:w-20 lg:w-64
      `}>
        {/* Header/Logo */}
        <div className="flex items-center gap-3 px-4 mb-6 md:justify-center lg:justify-start">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-lg">code_blocks</span>
          </div>
          <div className="flex flex-col md:hidden lg:flex">
            <span className="font-sans font-bold text-lg text-on-surface leading-tight tracking-tight">DevVault</span>
          </div>
          {/* Close button for mobile */}
          <button 
            className="md:hidden ml-auto material-symbols-outlined text-on-surface-variant hover:text-on-surface"
            onClick={() => setMobileMenuOpen(false)}
          >
            close
          </button>
        </div>

        {/* User profile snippet */}
        <div className="px-4 mb-6 flex items-center gap-3 md:justify-center lg:justify-start">
          <img 
            src={`https://ui-avatars.com/api/?name=${displayName}&background=020617&color=adc6ff&size=100`}
            alt="Avatar"
            className="w-10 h-10 rounded-full border border-slate-600 shrink-0 object-cover"
          />
          <div className="flex flex-col overflow-hidden md:hidden lg:flex">
            <span className="font-semibold text-sm text-on-surface truncate">@{displayName}</span>
            <span className="text-xs text-on-surface-variant truncate">Developer</span>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="px-4 mb-6 md:flex md:justify-center lg:justify-start lg:block">
          <button 
            onClick={() => { navigate('/create'); setMobileMenuOpen(false); }}
            className="btn-primary w-full flex items-center justify-center gap-2 md:w-auto md:p-2 lg:w-full lg:px-4"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span className="md:hidden lg:inline">New Repo</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className={navItemClass("/")}>
            <span className="material-symbols-outlined shrink-0 md:mx-auto lg:mx-0">home</span>
            <span className="text-sm md:hidden lg:inline">Home</span>
          </Link>
          <Link to="/explore" onClick={() => setMobileMenuOpen(false)} className={navItemClass("/explore")}>
            <span className="material-symbols-outlined shrink-0 md:mx-auto lg:mx-0">explore</span>
            <span className="text-sm md:hidden lg:inline">Explore</span>
          </Link>
          <Link to="/pulls" onClick={() => setMobileMenuOpen(false)} className={navItemClass("/pulls")}>
            <span className="material-symbols-outlined shrink-0 md:mx-auto lg:mx-0">merge_type</span>
            <span className="text-sm md:hidden lg:inline">Pull Requests</span>
          </Link>
          <Link to="/issues" onClick={() => setMobileMenuOpen(false)} className={navItemClass("/issues")}>
            <span className="material-symbols-outlined shrink-0 md:mx-auto lg:mx-0">error_outline</span>
            <span className="text-sm md:hidden lg:inline">Issues</span>
          </Link>
          <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className={navItemClass("/profile")}>
            <span className="material-symbols-outlined shrink-0 md:mx-auto lg:mx-0">account_circle</span>
            <span className="text-sm md:hidden lg:inline">Profile</span>
          </Link>
        </nav>

        {/* Footer Navigation */}
        <div className="pt-4 mt-auto border-t border-slate-700 space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-slate-700/50 hover:text-on-surface transition-all duration-150">
            <span className="material-symbols-outlined shrink-0 md:mx-auto lg:mx-0">settings</span>
            <span className="text-sm md:hidden lg:inline">Settings</span>
          </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
