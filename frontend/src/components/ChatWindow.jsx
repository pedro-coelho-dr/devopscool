import { useRef, useEffect } from "react";

export default function ChatWindow({ topic, messages, onSend }) {
  const formRef = useRef(null);
  const chatBoxRef = useRef(null);

  // --- Auto-scroll to bottom when messages update
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputElement = e.target.elements.message;
    const input = inputElement.value.trim();

    // === Input validation ===
    if (input.length < 3 || input.length > 1000) {
      inputElement.classList.add("invalid");
      setTimeout(() => inputElement.classList.remove("invalid"), 400);
      return;
    }

    onSend(input);
    formRef.current.reset();
  };

  return (
    <section className="chat">
      <div className="chat-box" ref={chatBoxRef}>
        {messages.length === 0 ? (
          <p className="placeholder">Select a topic and start chatting.</p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              <p>{m.content}</p>
            </div>
          ))
        )}
      </div>

      <form className="input-area" onSubmit={handleSubmit} ref={formRef}>
        <input
          name="message"
          placeholder="Ask anything..."
          maxLength={1000} // safety limit
        />
        <button type="submit" className="icon-button" title="Send message">
          <span className="material-symbols-outlined">arrow_upward</span>
        </button>
      </form>
    </section>
  );
}
