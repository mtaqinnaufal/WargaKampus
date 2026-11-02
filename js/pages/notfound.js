import { brandMarkHtml } from "../components/shell.js";
import { refreshIcons } from "../components/icons.js";

document.querySelectorAll("[data-brand]").forEach((node) => {
  node.innerHTML = brandMarkHtml({ tone: "dark" });
});
refreshIcons();
