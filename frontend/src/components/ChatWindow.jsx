import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

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
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <img
            src="/favicon.png"
            alt="DevOpsCool Logo"
            className="w-20 h-20 mb-6 opacity-90 animate-pulse-slow"
          />

        </div>
      )}

      {!showWelcome &&
        messages
          .filter((m) => m.role === "assistant")
          .map((m, i) => (

          <div
            key={i}
            ref={i === messages.length - 1 ? lastMessageRef : null}
            className="border border-[#2a2a2a] bg-[#1b1b1b] rounded-xl p-6 text-[#e6e6e6] leading-[1.75] shadow-sm"
          >
           <div
  className="prose prose-neutral prose-invert lg:prose-lg mx-auto leading-relaxed
             prose-headings:text-[#ff8c42]
             prose-p:text-neutral-400
             prose-li:text-neutral-400
             prose-strong:text-neutral-200
             prose-a:text-neutral-400 hover:prose-a:text-neutral-200
             prose-code:text-neutral-300
             prose-pre:bg-neutral-950 prose-pre:text-neutral-300
             prose-blockquote:text-neutral-500 prose-blockquote:border-l-neutral-700"
>
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
