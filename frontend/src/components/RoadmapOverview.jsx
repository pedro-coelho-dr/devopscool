import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function RoadmapOverview({ roadmap, onSelect }) {
  const renderNode = (node, depth = 0, path = []) => {
    const currentPath = [...path, node.title];
    const hasChildren = node.children && node.children.length > 0;

    const depthStyles = [
      // depth 0 — main topic (deep orange accent)
      "w-80 py-5 px-7 text-[1.05rem] font-semibold text-[#ff7a1a] border-[#ff7a1a] bg-[#1b1b1b]",
      // depth 1 — subtopic (neutral bright grey)
      "w-64 py-4 px-6 text-[0.95rem] font-medium text-[#e0e0e0] border-[#666] bg-[#191919]",
      // depth 2 — darker grey (clearer step down)
      "w-48 py-2.5 px-4 text-[0.8rem] text-[#aaaaaa] border-[#2a2a2a] bg-[#101010]",
    ];

    return (
      <div key={node.title} className="flex flex-col items-center relative">
        {/* Node */}
        <div
          onClick={() => onSelect(currentPath)}
          className={`border rounded-sm text-center cursor-pointer transition-colors duration-200 hover:border-[#ffb868]
            ${depthStyles[depth] || depthStyles[2]}
          `}
        >
          {node.title}
        </div>

        {/* Connector line */}
        {hasChildren && (
          <div
            className={`w-[1.5px] h-10 my-3 bg-linear-to-b from-[#444] to-transparent ${
              depth > 1 ? "opacity-60" : ""
            }`}
          />
        )}

        {/* Children */}
        {hasChildren && (
          <div
            className={`flex flex-wrap justify-center gap-6 ${
              depth === 0
                ? "max-w-7xl mt-4"
                : depth === 1
                ? "max-w-6xl mt-3"
                : "max-w-5xl mt-2"
            }`}
          >
            {node.children.map((child) =>
              renderNode(child, depth + 1, currentPath)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fadeIn flex flex-col items-center text-center min-h-[80vh] px-4 py-12">
      {/* === Header === */}
      <img
        src="/favicon.png"
        alt="DevOpsCool Logo"
        className="w-20 h-20 mb-5 opacity-90 hover:scale-105 transition-transform"
      />
      <h1 className="text-3xl font-semibold font-[Orbitron] text-[#ff7a1a] mb-2 tracking-wide">
        DevOpsCool
      </h1>

      <p className="text-[#8f8f8f] text-xs mb-10">
        Adapted from{" "}
        <a
          href="https://roadmap.sh/devops"
          target="_blank"
          rel="noreferrer"
          className="text-[#ff7a1a] hover:underline"
        >
          roadmap.sh
        </a>
      </p>

      {/* separator line */}
      <div className="w-2/3 h-px bg-linear-to-r from-transparent via-[#333] to-transparent mb-3" />

      {/* arrow down */}
      <ChevronDownIcon className="w-6 h-6 text-[#555] mb-12 animate-bounce-slow" />

      {/* === Roadmap === */}
      <div className="flex flex-col items-center gap-20 w-full max-w-7xl">
        {roadmap.map((root, i) => (
          <div key={root.title} className="flex flex-col items-center w-full">
            {renderNode(root, 0)}

            {/* Separator between root sections */}
            {i < roadmap.length - 1 && (
              <div className="w-3/4 h-px bg-linear-to-r from-transparent via-[#333] to-transparent my-10" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
