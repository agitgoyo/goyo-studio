export function formatClassSnapshot(item) {
  if (!item) return "";

  const title = String(item.title || "").trim();
  const date = String(item.date || "").trim();
  const timeText = String(item.time_text || "").trim();
  const parts = [];

  if (date) {
    parts.push(`[ ${date} ]`);
  }

  if (title) {
    parts.push(title);
  }

  if (timeText) {
    parts.push(`| ${timeText}`);
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export function formatClassOptionLabel(item) {
  if (!item) return "";

  const snapshot = formatClassSnapshot(item);
  const price = Number(item.price);
  const priceLabel = Number.isFinite(price)
    ? `${price.toLocaleString()}원`
    : "";

  return [snapshot, priceLabel].filter(Boolean).join(" - ");
}

export function formatClassMeta(item) {
  if (!item) return [];

  const price = Number(item.price);

  return [
    String(item.date || "").trim(),
    String(item.time_text || "").trim(),
    Number.isFinite(price) ? `${price.toLocaleString()}원` : "",
  ].filter(Boolean);
}
