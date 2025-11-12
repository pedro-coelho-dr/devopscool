import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export default function RoadmapTree({ roadmap, onSelect, activeTopic }) {
  const [expanded, setExpanded] = useState({});

  const toggle = (title) =>
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));

  const setAll = (value) => {
    const all = {};
    const walk = (nodes) => {
      nodes.forEach((n) => {
        all[n.title] = value;
        if (n.children) walk(n.children);
      });
    };
    walk(roadmap);
    setExpanded(all);
  };

  useEffect(() => {
    const expandHandler = () => setAll(true);
    const collapseHandler = () => setAll(false);
    document.addEventListener("expandAll", expandHandler);
    document.addEventListener("collapseAll", collapseHandler);
    return () => {
      document.removeEventListener("expandAll", expandHandler);
      document.removeEventListener("collapseAll", collapseHandler);
    };
  }, [roadmap]); // Rebuild when language changes

  const renderNode = (node, depth = 0, path = []) => {
    const currentPath = [...path, node.title];
    const hasChildren = node.children && node.children.length > 0;
    const isOpen = expanded[node.title];
    const isActive = activeTopic === node.title;

    return (
      <li key={node.title} className="my-1">
        <div
          className={`flex items-center justify-between rounded-md px-3 py-2 border transition-all duration-200 cursor-pointer select-none
            ${
              isActive
                ? "border-orange-500 bg-orange-500/10 text-orange-400"
                : "border-transparent bg-[#1a1a1a] text-neutral-300 hover:bg-[#222] hover:border-[#333]"
            }`}
          style={{ marginLeft: depth * 10 }}
        >
          <button
            onClick={() => onSelect(currentPath)}
            className="flex-1 text-left text-sm sm:text-base font-medium break-words whitespace-normal leading-snug"
          >

            {node.title}
          </button>

          {hasChildren && (
            <button
              onClick={() => toggle(node.title)}
              title={isOpen ? "Collapse" : "Expand"}
              className="ml-2 p-1 rounded-md text-orange-400 hover:bg-orange-500/20 transition"
            >
              {isOpen ? (
                <ChevronUpIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          )}
        </div>

        {hasChildren && isOpen && (
          <ul className="ml-3 border-l border-[#333] pl-3 mt-1 space-y-1">
            {node.children.map((child) =>
              renderNode(child, depth + 1, currentPath)
            )}
          </ul>
        )}
      </li>
    );
  };

  return (
    <ul className="text-sm sm:text-base">
      {roadmap.map((n) => renderNode(n))}
    </ul>
  );
}
