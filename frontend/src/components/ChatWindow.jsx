import React, { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export default function ChatWindow({ topic, messages, onSend }) {
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const lastMessageRef = useRef(null);

  // Auto-scroll to the newest assistant message
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || text.length < 3 || text.length > 2000) return;

    setIsWaiting(true);
    setInput("");
    try {
      await onSend(text);
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <section className="chat flex flex-col h-full">
      {/* ==== MESSAGE BOX ==== */}
      <div className="chat-box flex-1 overflow-y-auto p-4 space-y-4">
        {messages
          .filter((m) => m.role === "assistant")
          .map((m, i, arr) => {
            const isLast = i === arr.length - 1;
            return (
              <div
                key={i}
                ref={isLast ? lastMessageRef : null}
                className="message assistant shadow-sm border border-neutral-800 bg-[#1c1c1c] rounded-lg p-5 leading-relaxed"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                  components={{
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline transition-colors"
                      >
                        {children}
                      </a>
                    ),

                    // Inline vs Block code separation
                    code: ({ inline, className, children }) => {
                      const text = String(children).trim();
                      const isInline = inline || !/\n/.test(text);

                      return isInline ? (
                        <code className="inline-code">
                          {children}
                        </code>
                      ) : (
                        <pre className="code-block">
                          <code>{children}</code>
                        </pre>
                      );
                    },

                    // Prevent nested <p> issues
                    p: ({ node, children }) => {
                      const hasBlock = React.Children.toArray(children).some(
                        (child) =>
                          typeof child === "object" &&
                          ["pre", "table", "ul", "ol", "div"].includes(
                            child.type
                          )
                      );
                      return hasBlock ? <>{children}</> : <p>{children}</p>;
                    },
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            );
          })}

        {/* ==== TYPING FEEDBACK ==== */}
        {isWaiting && (
          <div className="message assistant typing flex items-center gap-2 text-neutral-400">
            <div className="typing-dots flex gap-1 mt-2">
              <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" />
              <span
                className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.12s" }}
              />
              <span
                className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.24s" }}
              />
            </div>
            <span className="text-sm italic">Thinking...</span>
          </div>
        )}
      </div>

      {/* ==== INPUT AREA ==== */}
      <form
        className="input-area flex items-center p-3 border-t border-neutral-800 bg-[#141414]"
        onSubmit={handleSubmit}
      >
        <input
          name="message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isWaiting}
          placeholder={
            isWaiting ? "Waiting for response..." : "Ask anything..."
          }
          maxLength={10000}
          className="flex-1 px-4 py-2 bg-[#1a1a1a] border border-neutral-700 rounded-full text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
        />
        <button
          type="submit"
          className="ml-3 p-3 bg-gradient-to-br from-orange-500 to-amber-400 text-black rounded-full hover:scale-105 transition-transform shadow-md disabled:opacity-50"
          title="Send message"
          disabled={isWaiting || !input.trim()}
        >
          <span className="material-symbols-outlined">arrow_upward</span>
        </button>
      </form>
    </section>
  );
}
