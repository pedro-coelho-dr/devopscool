import "./styles/main.css";
import { useState, useEffect } from "react";
import RoadmapTree from "./components/RoadmapTree";
import ChatWindow from "./components/ChatWindow";
import RoadmapOverview from "./components/RoadmapOverview";
import InputBar from "./components/InputBar";
import { postChat } from "./utils/api";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Bars3Icon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

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
  const [inputVisible, setInputVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) {
        setInputVisible(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectTopic = async (path) => {
    const topicFullPath = path.join(" / ");
    setTopicPath(path);
    setMessages([]);
    try {
      const data = await postChat(topicFullPath);
      setMessages([{ role: "assistant", content: data.reply }]);
      if (isMobile) setSidebarOpen(false);
    } catch {
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

  const handleReset = () => {
    setTopicPath([]);
    setMessages([]);
    document.dispatchEvent(new Event("collapseAll"));
  };

  return (
    <div className="bg-[#121212] text-[#eaeaea] font-[Inter]">
      {/* ==== MOBILE TOGGLES ==== */}
      {isMobile && (
        <div className="fixed top-4 right-4 z-50 flex gap-3">
          <button
            onClick={() => setSidebarOpen((p) => !p)}
            className="p-2 bg-orange-500 text-black rounded-md shadow-md hover:scale-105 transition-transform"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          <button
            onClick={() => setInputVisible((p) => !p)}
            className="p-2 bg-orange-500 text-black rounded-md shadow-md hover:scale-105 transition-transform"
          >
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* ==== SIDEBAR ==== */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 md:w-72 bg-[#1e1e1e] border-r border-[#2a2a2a] flex flex-col justify-between transform transition-transform duration-300 ${
          sidebarOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
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
              className="hover:text-orange-400"
            >
              <ChevronDownIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => document.dispatchEvent(new Event("collapseAll"))}
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
      </aside>

      {/* ==== MAIN AREA ==== */}
      <main
        className={`transition-all duration-300 px-4 md:px-6 py-20 md:py-24 min-h-screen ${
          !isMobile ? "ml-72" : "ml-0"
        }`}
      >
        {topicPath.length === 0 ? (
          <RoadmapOverview onSelect={handleSelectTopic} />
        ) : (
          <ChatWindow messages={messages} />
        )}
      </main>

      {/* ==== INPUT BAR ==== */}
      {inputVisible && (
        <InputBar onSend={handleSend} disabled={topicPath.length === 0} />
      )}
    </div>
  );
}
