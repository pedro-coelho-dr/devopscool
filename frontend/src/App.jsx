import "./styles/main.css";
import { useState } from "react";
import RoadmapTree from "./components/RoadmapTree";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [topicPath, setTopicPath] = useState([]); // stores path array
  const [messages, setMessages] = useState([]);

  // --- Select a topic from the roadmap
  const handleSelectTopic = (path) => {
    setTopicPath(path);
    setMessages([]); // reset chat on new topic
  };

  // --- Send message + mock assistant reply
  const handleSend = (message) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Response for "${message}" about ${topicPath.join(" / ")}`,
        },
      ]);
    }, 400);
  };

  // --- Reset everything (used by logo)
  const handleReset = () => {
    setTopicPath([]);
    setMessages([]);
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


        <ChatWindow
          topic={currentTopic}
          messages={messages}
          onSend={handleSend}
        />
      </main>
    </div>
  );
}
