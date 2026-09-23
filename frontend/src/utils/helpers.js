// Turn an ISO date into a short relative label like "3m", "2h", "5d".
export const timeAgo = (dateString) => {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateString).toLocaleDateString();
};

// First letter of a name, used for the fallback avatar.
export const initial = (name) => (name ? name.charAt(0).toUpperCase() : "?");
