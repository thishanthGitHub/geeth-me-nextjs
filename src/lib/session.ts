const SESSION_KEY = "geethme.session.v1";

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `guest_${crypto.randomUUID()}`;
  return `guest_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrSetSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) { id = makeId(); localStorage.setItem(SESSION_KEY, id); }
    return id;
  } catch { return makeId(); }
}

export function getTableFromUrl(): string {
  if (typeof window === "undefined") return "";
  try {
    const t = new URLSearchParams(window.location.search).get("table");
    return t ? t.trim() : "";
  } catch { return ""; }
}
