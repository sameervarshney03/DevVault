import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE from "../../config";

const NewRepository = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("you");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId && userId !== "undefined") {
      axios.get(`${API_BASE}/userProfile/${userId}`)
        .then(res => setUsername(res.data.username || "you"))
        .catch(() => {});
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const userId = localStorage.getItem("userId");

    if (!userId || userId === "undefined") {
      return navigate("/auth");
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/repo/create`, {
        name,
        description,
        visibility: visibility === "public",
        owner: userId,
        issues: [],
        content: [],
      });

      if (res.data?.repositoryID) {
        navigate(`/repo/${res.data.repositoryID}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create repository.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 fade-in">
      <div className="border-b border-slate-700 pb-6 mb-8">
        <h1 className="text-2xl font-bold text-on-surface">Create a new repository</h1>
        <p className="text-on-surface-variant mt-2 text-sm">
          A repository contains all your project files, including the revision history.
        </p>
      </div>

      {error && (
        <div className="mb-6 px-3 py-2.5 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Repository name <span className="text-error">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-outline font-mono">{username} /</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                className="input-field flex-1 max-w-sm"
                placeholder="my-awesome-project"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Description <span className="text-outline text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field w-full font-sans"
              placeholder="A short description of your project"
            />
          </div>
        </div>

        <hr className="border-slate-800" />

        {/* Visibility */}
        <div className="space-y-3">
          {[
            { key: "public", icon: "public", label: "Public", desc: "Anyone can see this repository." },
            { key: "private", icon: "lock", label: "Private", desc: "Only you can see this repository." },
          ].map((opt) => (
            <div
              key={opt.key}
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                visibility === opt.key
                  ? "border-primary bg-primary/5"
                  : "border-slate-700 hover:border-outline"
              }`}
              onClick={() => setVisibility(opt.key)}
            >
              <input
                type="radio"
                name="visibility"
                value={opt.key}
                checked={visibility === opt.key}
                onChange={() => setVisibility(opt.key)}
                className="mt-1 accent-primary"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">{opt.icon}</span>
                  <span className="font-semibold text-on-surface text-sm">{opt.label}</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">{opt.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <hr className="border-slate-800" />

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="btn-primary flex items-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? "Creating..." : "Create repository"}
          </button>
          <button type="button" onClick={() => navigate("/")} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRepository;
