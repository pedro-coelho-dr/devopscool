import React, { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";

export default function ChatWindow({ topic, messages, onSend }) {
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const lastMessageRef = useRef(null);

  // Auto-scroll to newest message
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <section className="flex flex-col flex-1 min-h-0">
      {/* ==== MESSAGE BOX ==== */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#181818] border border-[#2a2a2a] rounded-md shadow-inner scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-[#141414]">
        {messages
          .filter((m) => m.role === "assistant")
          .map((m, i, arr) => {
            const isLast = i === arr.length - 1;
            return (
              <div
                key={i}
                ref={isLast ? lastMessageRef : null}
                className="border border-[#2a2a2a] bg-[#1b1b1b] rounded-xl p-6 text-[#e6e6e6] leading-[1.75] shadow-sm transition hover:bg-[#202020]"
              >
                {/* === Markdown Container === */}
              <div className="prose prose-invert max-w-3xl mx-auto prose-lg leading-relaxed">



                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                    components={{
                      a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#b5b5b5] hover:text-[#ffb868] border-b border-[#444] hover:border-[#ffb868] transition-all duration-200"
                          >
                            {children}
                          </a>
                        ),


                      code: ({ inline, children }) => {
                        const text = String(children).trim();
                        const isInline = inline || !/\n/.test(text);
                        return isInline ? (
                          <code className="bg-[#252525] text-[#ffcb83] px-1.5 py-0.5 rounded font-mono text-sm">
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-[#161616] text-neutral-100 p-4 rounded-lg border border-[#2a2a2a] overflow-x-auto font-mono text-sm leading-relaxed">
                            <code>{children}</code>
                          </pre>
                        );
                      },
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-orange-500 bg-[#1a1a1a] text-[#cfcfcf] rounded-md px-4 py-2 my-3 italic">
                          {children}
                        </blockquote>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-4">
                          <table className="w-full border-collapse border border-[#333] text-sm text-left">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="border border-[#333] bg-[#222] text-[#ffb868] font-semibold px-3 py-2">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-[#333] px-3 py-2 text-neutral-300">
                          {children}
                        </td>
                      ),
                      p: ({ children }) => (
                        <p className="my-3 text-neutral-300 leading-relaxed">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1 text-neutral-300">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-1 text-neutral-300">
                          {children}
                        </ol>
                      ),
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            );
          })}

        {/* ==== TYPING FEEDBACK ==== */}
        {isWaiting && (
          <div className="flex items-center gap-3 text-neutral-400 animate-pulse">
            <div className="flex gap-1 mt-2">
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
        onSubmit={handleSubmit}
        className="flex items-center gap-3 border-t border-[#2a2a2a] bg-[#141414] p-3 mt-3 rounded-b-md"
      >
        <input
          name="message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isWaiting}
          placeholder={isWaiting ? "Waiting for response..." : "Ask anything..."}
          maxLength={10000}
          className="flex-1 px-4 py-2 bg-[#1a1a1a] text-neutral-200 placeholder-neutral-500 border border-[#333] rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-sm sm:text-base"
        />
        <button
          type="submit"
          title="Send message"
          disabled={isWaiting || !input.trim()}
          className="flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-black shadow-md hover:scale-105 transition-transform disabled:opacity-50"
        >
          <ArrowUpCircleIcon className="w-6 h-6" />
        </button>
      </form>
    </section>
  );
}
