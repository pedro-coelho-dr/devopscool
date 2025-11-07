const KEY = "devopscool_state";

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { topicPath: [], messages: [] };
  } catch {
    return { topicPath: [], messages: [] };
  }
}

export function saveState(topicPath, messages) {
  localStorage.setItem(KEY, JSON.stringify({ topicPath, messages }));
}

export function clearState() {
  localStorage.removeItem(KEY);
}
