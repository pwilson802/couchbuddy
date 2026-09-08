const STORAGE_KEY = "watchlist";
const CHANGE_EVENT = "watchlist-changed";

// localStorage's own "storage" event only fires in *other* tabs, not the
// one that made the change - this custom event lets components in the same
// tab (the button that just toggled, the /watchlist page, etc.) react to
// changes made anywhere else on the page without prop-drilling shared state
// through every nav/detail page that might touch a watchlist button.
function notifyChanged() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function onWatchlistChanged(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function getWatchlist() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(list) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  notifyChanged();
}

export function isInWatchlist(id, mediaType) {
  return getWatchlist().some(
    (item) => item.id === id && item.mediaType === mediaType
  );
}

// item: { id, mediaType ("movie" | "tv"), title, posterPath, year, href }
export function addToWatchlist(item) {
  const list = getWatchlist();
  if (list.some((existing) => existing.id === item.id && existing.mediaType === item.mediaType)) {
    return;
  }
  save([{ ...item, addedAt: Date.now() }, ...list]);
}

export function removeFromWatchlist(id, mediaType) {
  const list = getWatchlist();
  save(list.filter((item) => !(item.id === id && item.mediaType === mediaType)));
}

export function toggleWatchlist(item) {
  if (isInWatchlist(item.id, item.mediaType)) {
    removeFromWatchlist(item.id, item.mediaType);
  } else {
    addToWatchlist(item);
  }
}
