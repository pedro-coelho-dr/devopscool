const API_URL = import.meta.env.VITE_API_URL;

export async function postChat(topic, user_input = null, language = "en") {
  const payload = { topic, user_input, language };

  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return await res.json();
}
