import "./styles/main.css";
import { useState, useEffect } from "react";
import RoadmapTree from "./components/RoadmapTree";
import ChatWindow from "./components/ChatWindow";
import { postChat } from "./utils/api";
import { loadState, saveState, clearState } from "./utils/storage";
import { getLastPair } from "./utils/chatLogic";

export default function App() {
  const [topicPath, setTopicPath] = useState([]);
  const [messages, setMessages] = useState([]);

  // === Load previous session on startup ===
  useEffect(() => {
    const { topicPath, messages } = loadState();
    setTopicPath(topicPath);
    setMessages(messages);
  }, []);

  // === Persist state in localStorage ===
  useEffect(() => {
    if (topicPath.length > 0) saveState(topicPath, messages);
  }, [topicPath, messages]);

  // === Handle topic selection ===
  const handleSelectTopic = async (path) => {
    const topicName = path[path.length - 1];
    setTopicPath(path);
    setMessages([]);
    clearState();

    try {
      // First backend fetch: introduction for that topic
      const data = await postChat(topicName, null, null);
      setMessages([{ role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error("Initial topic load failed:", err);
      setMessages([{ role: "assistant", content: "⚠️ Could not load topic." }]);
    }
  };

  // === Handle user input send ===
  const handleSend = async (message) => {
    if (!topicPath.length) return;

    const topicName = topicPath[topicPath.length - 1];
    const userMsg = { role: "user", content: message };
    const updated = [...messages, userMsg];
    setMessages(updated);

    try {
      const lastPair = getLastPair(messages);
      const data = await postChat(topicName, message, lastPair);
      const assistantMsg = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat send failed:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error contacting backend." },
      ]);
    }
  };

  // === Reset everything ===
  const handleReset = () => {
    setTopicPath([]);
    setMessages([]);
    clearState();
    document.dispatchEvent(new Event("collapseAll"));
  };

  const currentTopic = topicPath.join(" / ");

  return (
    <div className="app">
      {/* ==== SIDEBAR ==== */}
      <aside className="sidebar">
        <header className="sidebar-header">
          <button className="logo-button" onClick={handleReset} title="Reset App">
            DevOpsCool
          </button>
          <div className="header-controls">
            <button
              onClick={() => document.dispatchEvent(new Event("expandAll"))}
              className="icon-button"
              title="Expand All"
            >
              <span className="material-symbols-outlined">unfold_more</span>
            </button>
            <button
              onClick={() => document.dispatchEvent(new Event("collapseAll"))}
              className="icon-button"
              title="Collapse All"
            >
              <span className="material-symbols-outlined">unfold_less</span>
            </button>
          </div>
        </header>

        <nav className="roadmap">
          <RoadmapTree
            onSelect={handleSelectTopic}
            activeTopic={topicPath[topicPath.length - 1]}
          />
        </nav>

        <footer className="sidebar-footer">
          <p>
            Built upon the{" "}
            <a href="https://roadmap.sh/devops" target="_blank" rel="noreferrer">
              DevOps Roadmap
            </a>
          </p>
        </footer>
      </aside>

      {/* ==== MAIN CHAT AREA ==== */}
      <main className="chat-area">
        <div className="chat-header">
          <h2>
            {topicPath.length > 0 ? (
              <>
                {topicPath.map((part, i) => (
                  <span key={i}>
                    {i > 0 && <span className="path-separator">/</span>}
                    {part}
                  </span>
                ))}
              </>
            ) : (
              "Select a topic"
            )}
          </h2>

          {currentTopic && (
            <button
              className="icon-button refresh"
              onClick={() => setMessages([])}
              title="Refresh Context"
            >
              <span className="material-symbols-outlined">refresh</span>
            </button>
          )}
        </div>

        <ChatWindow topic={currentTopic} messages={messages} onSend={handleSend} />
      </main>
    </div>
  );
}
