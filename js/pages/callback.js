// Supabase parses the session from the URL automatically (detectSessionInUrl).
import "../../js/supabase.js";
import { url } from "../../js/config.js";

const params = new URLSearchParams(window.location.search);
const next = params.get("next") || "/jelajah";

// Give supabase-js a moment to persist the session, then continue.
window.setTimeout(() => {
  window.location.replace(url(next));
}, 600);
