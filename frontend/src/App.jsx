import "./styles/main.css";
import { useState } from "react";
import RoadmapTree from "./components/RoadmapTree";
import ChatWindow from "./components/ChatWindow";
import { postChat } from "./utils/api";

export default function App() {
  const [topicPath, setTopicPath] = useState([]);
  const [messages, setMessages] = useState([]);

  // === Handle topic selection ===
  const handleSelectTopic = async (path) => {
    const topicFullPath = path.join(" / ");
    setTopicPath(path);
    setMessages([]); // clear previous chat

    try {
      const data = await postChat(topicFullPath);
      setMessages([{ role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error("Topic load failed:", err);
      setMessages([{ role: "assistant", content: "⚠️ Could not load topic." }]);
    }
  };

  // === Handle user input ===
  const handleSend = async (message) => {
    if (!topicPath.length) return; // only send if topic is selected

    const topicFullPath = topicPath.join(" / ");
    try {
      const data = await postChat(topicFullPath, message);
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

  // === Reset app or go back to DevOps root ===
  const handleReset = async () => {
    setTopicPath(["DevOps"]);
    setMessages([]);

    try {
      const data = await postChat("DevOps");
      setMessages([{ role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error("DevOps load failed:", err);
      setMessages([{ role: "assistant", content: "⚠️ Could not load DevOps intro." }]);
    }

    document.dispatchEvent(new Event("collapseAll"));
  };

  const currentTopic = topicPath.join(" / ");

  return (
    <div className="app">
      {/* ==== SIDEBAR ==== */}
      <aside className="sidebar">
        <header className="sidebar-header">
          <button className="logo-button" onClick={handleReset} title="Back to DevOps">
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
        {messages.length === 0 && topicPath.length === 0 ? (
          <div className="welcome-screen">
            <img
              src="/favicon.png"
              alt="DevOpsCool logo"
              className="welcome-logo"
              style={{ width: "120px", marginBottom: "1rem" }}
            />
            <h2>Welcome to DevOpsCool</h2>
            <p>Select a topic from the sidebar to get started.</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <h2>
                {topicPath.length > 0 &&
                  topicPath.map((part, i) => (
                    <span key={i}>
                      {i > 0 && <span className="path-separator">/</span>}
                      {part}
                    </span>
                  ))}
              </h2>

              {currentTopic && (
                <button
                  className="icon-button refresh"
                  onClick={() => handleSelectTopic(topicPath)}
                  title="Refresh Topic"
                >
                  <span className="material-symbols-outlined">refresh</span>
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
