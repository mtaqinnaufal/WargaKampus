// Icon helper backed by the vendored lucide UMD (window.lucide).
export function icon(name, className = "h-4 w-4") {
  return `<i data-lucide="${name}" class="${className}" aria-hidden="true"></i>`;
}

export function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}
