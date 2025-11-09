import "./styles/main.css";
import { useState } from "react";
import RoadmapTree from "./components/RoadmapTree";
import ChatWindow from "./components/ChatWindow";
import { postChat } from "./utils/api";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowPathIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

export default function App() {
  const [topicPath, setTopicPath] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelectTopic = async (path) => {
    const topicFullPath = path.join(" / ");
    setTopicPath(path);
    setMessages([]);
    try {
      const data = await postChat(topicFullPath);
      setMessages([{ role: "assistant", content: data.reply }]);
      setSidebarOpen(false); // auto-close on mobile
    } catch (err) {
      console.error("Topic load failed:", err);
      setMessages([{ role: "assistant", content: "⚠️ Could not load topic." }]);
    }
  };

  const handleSend = async (message) => {
    if (!topicPath.length) return;
    const topicFullPath = topicPath.join(" / ");
    try {
      const data = await postChat(topicFullPath, message);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error contacting backend." },
      ]);
    }
  };

  const handleReset = async () => {
    setTopicPath(["DevOps"]);
    setMessages([]);
    try {
      const data = await postChat("DevOps");
      setMessages([{ role: "assistant", content: data.reply }]);
    } catch {
      setMessages([{ role: "assistant", content: "⚠️ Could not load DevOps intro." }]);
    }
    document.dispatchEvent(new Event("collapseAll"));
  };

  const currentTopic = topicPath.join(" / ");

  return (
    <div className="flex h-screen bg-[#121212] text-[#eaeaea] font-[Inter]">
      {/* ==== MOBILE TOGGLE ==== */}
      <button
        onClick={() => setSidebarOpen((p) => !p)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-orange-500 text-black rounded-md shadow-lg"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* ==== SIDEBAR ==== */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 h-full w-64 md:w-72 bg-[#1e1e1e] border-r border-[#2a2a2a] flex flex-col justify-between transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <header className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
          <button
            onClick={handleReset}
            className="text-orange-500 font-[Orbitron] text-lg hover:text-orange-400 transition"
          >
            DevOpsCool
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => document.dispatchEvent(new Event("expandAll"))}
              title="Expand All"
              className="hover:text-orange-400"
            >
              <ChevronDownIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => document.dispatchEvent(new Event("collapseAll"))}
              title="Collapse All"
              className="hover:text-orange-400"
            >
              <ChevronUpIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <RoadmapTree
            onSelect={handleSelectTopic}
            activeTopic={topicPath[topicPath.length - 1]}
          />
        </nav>

        <footer className="text-xs text-[#b3b3b3] border-t border-[#2a2a2a] p-3">
          Built upon the{" "}
          <a
            href="https://roadmap.sh/devops"
            target="_blank"
            rel="noreferrer"
            className="text-orange-500 hover:underline"
          >
            DevOps Roadmap
          </a>
        </footer>
      </aside>

      {/* ==== MAIN CHAT AREA ==== */}
      <main className="flex-1 flex flex-col p-4 md:p-6 min-h-0 overflow-hidden text-[15px] leading-relaxed">

        {messages.length === 0 && topicPath.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <img
              src="/favicon.png"
              alt="DevOpsCool logo"
              className="w-24 mb-4"
            />
            <h2 className="font-[Orbitron] text-2xl text-orange-500 mb-2">
              Welcome to DevOpsCool
            </h2>
            <p className="text-[#b3b3b3] text-sm">
              Select a topic from the sidebar to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center border-b border-[#2a2a2a] pb-2 mb-3">
              <h2 className="text-orange-500 text-sm font-semibold truncate">
                {currentTopic || "DevOps"}
              </h2>
              {currentTopic && (
                <button
                  onClick={() => handleSelectTopic(topicPath)}
                  title="Refresh Topic"
                  className="hover:text-orange-400"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            <ChatWindow topic={currentTopic} messages={messages} onSend={handleSend} />
          </>
        )}
      </main>
    </div>
  );
}
