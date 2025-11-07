import { useEffect, useState } from "react";
import { roadmap } from "../data/roadmap";

export default function RoadmapTree({ onSelect, activeTopic }) {
  const [expanded, setExpanded] = useState({});

  const toggle = (title) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

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
  }, []);

  const renderNode = (node, depth = 0, path = []) => {
    const currentPath = [...path, node.title];
    const hasChildren = node.children && node.children.length > 0;
    const isOpen = expanded[node.title];

    return (
        <li key={node.title} className="roadmap-item" style={{ marginLeft: depth * 12 }}>
        <div
            className={`node-container depth-${depth} ${
            activeTopic === node.title ? "active" : ""
            }`}
        >
            <button className="topic-button" onClick={() => onSelect(currentPath)}>
            {node.title}
            </button>

            {hasChildren && (
            <span
                className="expand-arrow"
                onClick={() => toggle(node.title)}
                title={isOpen ? "Collapse" : "Expand"}
            >
                <span className="material-symbols-outlined">
                {isOpen ? "expand_less" : "expand_more"}
                </span>
            </span>
            )}
        </div>

        {hasChildren && isOpen && (
            <ul className="subtree">
            {node.children.map((child) =>
                renderNode(child, depth + 1, currentPath)
            )}
            </ul>
        )}
        </li>
    );
    };


  return <ul className="tree-root">{roadmap.map((n) => renderNode(n))}</ul>;
}
