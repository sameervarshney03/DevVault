import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";

const Navbar = ({ setMobileMenuOpen }) => {
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const displayName = currentUser ? currentUser.email?.split('@')[0] || "User" : "";

  return (
    <header className="w-full sticky top-0 z-40 bg-[#131b2e] border-b border-slate-700 flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button 
          className="md:hidden material-symbols-outlined text-on-surface-variant hover:text-on-surface"
          onClick={() => setMobileMenuOpen(true)}
        >
          menu
        </button>

        {/* Logo (visible only on mobile/tablet if sidebar hides it, or always visible here? Dashboard spec says "Top navbar: DevVault logo (left)") */}
        <Link to="/" className="font-sans font-bold text-lg text-primary tracking-tight lg:hidden">
          DevVault
        </Link>
        
        {/* Desktop search */}
        <div className="hidden md:flex relative items-center ml-2 lg:ml-0">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-sm">search</span>
          <input 
            type="text"
            placeholder="Search repositories..."
            className="bg-[#020617] border border-slate-700 rounded-sm pl-9 pr-4 py-1.5 font-mono text-sm text-on-surface focus:outline-none focus:border-primary transition-all w-64 lg:w-96 placeholder:text-slate-500"
            style={{ boxShadow: "none" }}
            onFocus={(e) => e.target.style.boxShadow = "0 0 8px 0 rgba(173, 198, 255, 0.3)"}
            onBlur={(e) => e.target.style.boxShadow = "none"}
          />
          <div className="absolute right-2 flex gap-1">
            <span className="border border-slate-700 bg-slate-800 text-slate-400 text-[10px] px-1 rounded uppercase">Ctrl</span>
            <span className="border border-slate-700 bg-slate-800 text-slate-400 text-[10px] px-1 rounded uppercase">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-on-surface-variant hover:text-on-surface transition-colors text-xl">
          notifications
        </button>

        {currentUser ? (
          <div className="relative">
            <div 
              className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img 
                className="w-8 h-8 rounded-full border border-slate-600 object-cover" 
                src={`https://ui-avatars.com/api/?name=${displayName}&background=020617&color=adc6ff&size=100`}
                alt="Profile" 
              />
              <span className="material-symbols-outlined text-on-surface-variant text-sm hidden sm:inline">
                arrow_drop_down
              </span>
            </div>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 py-1 bg-[#1E293B] border border-slate-700 rounded-lg shadow-lg z-50">
                  <div className="px-4 py-2 border-b border-slate-700 mb-1">
                    <p className="text-xs text-on-surface-variant">Signed in as</p>
                    <p className="text-sm font-bold text-on-surface truncate">@{displayName}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-on-surface hover:bg-slate-700 transition-colors"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/create"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-on-surface hover:bg-slate-700 transition-colors"
                  >
                    New Repository
                  </Link>
                  <div className="h-px bg-slate-700 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link to="/auth" className="btn-primary">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
