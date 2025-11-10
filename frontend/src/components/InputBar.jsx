import { useState } from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";

export default function InputBar({ onSend, disabled = false }) {
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || text.length < 3) return;
    setIsWaiting(true);
    setInput("");
    try {
      await onSend(text);
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 md:left-72 right-0 z-40 bg-[#141414]/95 border-t border-[#2a2a2a] px-6 py-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto flex items-center gap-3 bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 shadow-[0_0_10px_rgba(0,0,0,0.4)] focus-within:ring-2 focus-within:ring-[#ffb86b]/70 transition"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isWaiting || disabled}
          placeholder={isWaiting ? "Thinking..." : "Ask anything"}
          className="flex-1 bg-transparent text-[#e5e5e5] placeholder-[#777] focus:outline-none text-[15px]"
        />
        <button
          type="submit"
          disabled={isWaiting || !input.trim() || disabled}
          className="flex items-center justify-center px-4 py-2 rounded-md bg-gradient-to-br from-[#ff8c42] to-[#ffb868] text-black font-medium hover:scale-[1.03] transition-transform disabled:opacity-50"
        >
          <ArrowUpCircleIcon className="w-6 h-6" />
        </button>
      </form>
    </footer>
  );
}
