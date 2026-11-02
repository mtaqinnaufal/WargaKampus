import { getCurrentUser } from "../auth.js";
import { url } from "../config.js";
import { getCampuses } from "../api/campuses.js";
import { brandMarkHtml } from "../components/shell.js";
import { mountSignUpForm } from "../components/forms.js";
import { refreshIcons } from "../components/icons.js";

document.querySelectorAll("[data-brand]").forEach((node) => {
  node.innerHTML = brandMarkHtml({ tone: node.dataset.brand === "light" ? "light" : "dark" });
});

const [current, campuses] = await Promise.all([getCurrentUser(), getCampuses()]);
if (current.profile) {
  window.location.assign(url("/jelajah"));
} else {
  mountSignUpForm(document.getElementById("auth-form"), { campuses, isDemo: current.isDemo });
  refreshIcons();
}
