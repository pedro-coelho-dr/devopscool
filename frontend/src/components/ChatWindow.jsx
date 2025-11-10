import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";

export default function ChatWindow({ messages }) {
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (lastMessageRef.current)
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col gap-6 pb-32">
      {showWelcome && (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-fadeIn">
          <img
            src="/favicon.png"
            alt="DevOpsCool Logo"
            className="w-20 h-20 mb-6 opacity-90"
          />
        </div>
      )}

      {!showWelcome &&
        messages.map((m, i) => (
          <div
            key={i}
            ref={i === messages.length - 1 ? lastMessageRef : null}
            className="border border-[#2a2a2a] bg-[#1b1b1b] rounded-xl p-6 text-[#e6e6e6] leading-[1.75] shadow-sm"
          >
            <div className="prose prose-invert max-w-3xl mx-auto prose-lg leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
    </div>
  );
}
