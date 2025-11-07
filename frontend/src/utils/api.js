const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function postChat(topic, user_input = null, last_history = null) {
  const payload = { topic, user_input, last_history };
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}
