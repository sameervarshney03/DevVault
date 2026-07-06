import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 fade-in py-20">
      <div className="text-9xl font-black text-primary mb-4 font-mono tracking-tighter">
        404
      </div>
      <h1 className="text-2xl font-bold text-on-surface mb-2 font-sans">Page not found</h1>
      <p className="text-on-surface-variant mb-8 max-w-md font-sans text-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="btn-primary flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
