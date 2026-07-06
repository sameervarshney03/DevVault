import React, { useState, useEffect } from "react";
import API_BASE from "../../config";

const CodeViewer = ({ repoId }) => {
  const [fileTree, setFileTree] = useState([]);

  useEffect(() => {
    const fetchFileTree = async () => {
      try {
        const response = await fetch(`${API_BASE}/repo/${repoId}/tree`);
        const data = await response.json();
        setFileTree(data);
      } catch (err) {
        console.error("Error fetching file tree:", err);
      }
    };
    fetchFileTree();
  }, [repoId]);

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <h3 className="text-sm font-medium text-gray-300">File Explorer</h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-mono">
          main
        </span>
      </div>
      <ul>
        {fileTree.map((item, index) => (
          <li key={index}>
            <div className="px-4 py-2.5 flex items-center gap-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer">
              <span className="text-gray-500">📄</span>
              <span className="text-sm font-mono text-violet-400">{item.name}</span>
            </div>
            <div className="bg-[#06060b] p-4 overflow-x-auto border-b border-white/5">
              <pre className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">
                {item.content}
              </pre>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CodeViewer;
