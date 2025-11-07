export function getLastPair(messages) {
  const rev = [...messages].reverse();
  const lastUser = rev.find((m) => m.role === "user");
  const lastAssistant = rev.find((m) => m.role === "assistant");
  return lastUser && lastAssistant ? [lastUser, lastAssistant] : null;
}
