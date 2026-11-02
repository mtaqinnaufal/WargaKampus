import { getCurrentUser } from "../auth.js";
import { DEMO_LOGIN_ENABLED, url } from "../config.js";
import { brandMarkHtml } from "../components/shell.js";
import { mountDemoLogin, mountSignInForm } from "../components/forms.js";
import { refreshIcons } from "../components/icons.js";

document.querySelectorAll("[data-brand]").forEach((node) => {
  node.innerHTML = brandMarkHtml({ tone: node.dataset.brand === "light" ? "light" : "dark" });
});
refreshIcons();

const current = await getCurrentUser();
if (current.profile) {
  window.location.assign(url("/jelajah"));
} else {
  mountSignInForm(document.getElementById("auth-form"), { isDemo: current.isDemo });
  if (DEMO_LOGIN_ENABLED) {
    mountDemoLogin(document.getElementById("demo-login"));
  }
  refreshIcons();
}
