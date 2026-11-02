// Feed: post card, composer, and feed client. Ported from components/feed/*.
import { categoryColor, cx, distanceKm, escapeHtml, relativeTime } from "../utils.js";
import { CAMPUS_CENTER, POST_CATEGORIES, ROLE_LABELS, url } from "../config.js";
import { addComment, createPost, savePost, toggleLike } from "../actions/posts.js";
import { uploadPostPhotos } from "../storage.js";
import { avatar, badge, buttonClass, formMessage, selectClass, textareaClass } from "./ui.js";
import { icon, refreshIcons } from "./icons.js";

function placeChip(place) {
  if (!place) return "";
  return `<a href="${url(`/tempat/${place.slug}`)}" class="mt-3 inline-flex max-w-full items-center gap-2 rounded-sm border border-line bg-surface px-2.5 py-1.5 text-xs text-ink-soft transition-colors hover:border-ink">
    <span class="h-1.5 w-1.5 shrink-0 rounded-full" style="background-color:${categoryColor(place.category.slug)}" aria-hidden="true"></span>
    <span class="truncate">${escapeHtml(place.name)}</span><span class="text-muted">·</span><span class="font-mono text-[10px] text-muted">${escapeHtml(
      place.category.name,
    )}</span></a>`;
}

function postPhotos(photos, authorName) {
  if (!photos.length) return "";
  return `<div class="${cx("mt-4 grid gap-2", photos.length > 1 && "sm:grid-cols-2")}">${photos
    .map(
      (photo, index) =>
        `<div class="relative aspect-[16/9] overflow-hidden rounded-lg border border-line bg-paper-deep"><img src="${escapeHtml(
          photo,
        )}" alt="Foto unggahan ${escapeHtml(authorName)}${index > 0 ? `, foto ${index + 1}` : ""}" loading="lazy" class="h-full w-full object-cover" onerror="this.closest('div').textContent='Foto tidak dapat dimuat';this.closest('div').classList.add('grid','place-items-center','text-sm','text-muted')"></div>`,
    )
    .join("")}</div>`;
}

export function postCardHtml(post, { currentUserId } = {}) {
  const comments = post.comments
    .map(
      (comment) => `<div class="flex gap-2.5 py-2">
        ${avatar({ name: comment.author.name, src: comment.author.avatar_url, size: "xs", decorative: true })}
        <div class="min-w-0"><p class="text-xs"><span class="font-medium text-ink">${escapeHtml(comment.author.name)}</span> <time datetime="${escapeHtml(
          comment.created_at,
        )}" class="text-muted">${escapeHtml(relativeTime(comment.created_at))}</time></p><p class="prose-kp mt-0.5 text-sm text-ink-soft">${escapeHtml(
          comment.body,
        )}</p></div>
      </div>`,
    )
    .join("");

  const commentForm = currentUserId
    ? `<form data-comment class="mt-4 flex items-end gap-2"><input type="hidden" name="post_id" value="${escapeHtml(post.id)}"><label class="sr-only" for="comment-${escapeHtml(
        post.id,
      )}">Tulis komentar</label><textarea id="comment-${escapeHtml(post.id)}" name="body" rows="1" required class="${textareaClass} min-h-10 py-2" placeholder="Tulis komentar"></textarea><button type="submit" aria-label="Kirim komentar" class="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-ink bg-signal text-ink disabled:opacity-50">${icon(
        "send",
        "h-4 w-4",
      )}</button></form>`
    : `<p class="mt-4 text-xs text-muted"><a href="${url("/masuk")}" class="font-semibold text-ink underline decoration-signal decoration-2 underline-offset-2">Masuk</a> untuk berkomentar.</p>`;

  return `<article id="post-${escapeHtml(post.id)}" data-post-id="${escapeHtml(
    post.id,
  )}" class="group rounded-xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(11,26,40,0.04)] transition-all duration-300 hover:border-ink/25 hover:shadow-lift sm:p-5">
    <div class="flex gap-4">
      <div class="hidden w-10 shrink-0 flex-col items-center sm:flex">${avatar({
        name: post.author.name,
        src: post.author.avatar_url,
        size: "md",
        decorative: true,
      })}<span class="mt-3 w-px flex-1 bg-line" aria-hidden="true"></span></div>
      <div class="min-w-0 flex-1">
        <header class="flex items-start gap-3">
          <div class="sm:hidden">${avatar({ name: post.author.name, src: post.author.avatar_url, size: "sm", decorative: true })}</div>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-x-2 gap-y-1"><span class="font-medium text-ink">${escapeHtml(
              post.author.name,
            )}</span><span class="text-xs text-muted">${escapeHtml(ROLE_LABELS[post.author.role] ?? "")}</span><span class="text-xs text-muted">·</span><time datetime="${escapeHtml(
              post.created_at,
            )}" class="text-xs text-muted">${escapeHtml(relativeTime(post.created_at))}</time></div>
            <div class="mt-2 flex flex-wrap items-center gap-2">${badge(POST_CATEGORIES[post.category] ?? "", { variant: "outline" })}</div>
          </div>
        </header>
        <p class="prose-kp mt-3 text-[15px] text-ink-soft">${escapeHtml(post.body)}</p>
        ${placeChip(post.place)}
        ${postPhotos(post.photos, post.author.name)}
        <div class="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" data-like aria-pressed="${post.liked_by_me}" class="${cx(
            "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors",
            post.liked_by_me ? "border-live/30 bg-live/10 text-live" : "border-line text-muted hover:border-ink/30 hover:bg-paper-deep",
          )}">${icon("heart", cx("h-4 w-4", post.liked_by_me && "fill-current"))}<span data-like-count>${post.like_count}</span></button>
          <button type="button" data-toggle-comments aria-expanded="false" class="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs text-muted transition-colors hover:border-ink/30 hover:bg-paper-deep">${icon(
            "message-circle",
            "h-4 w-4",
          )}<span data-comment-count>${post.comment_count}</span></button>
          <button type="button" data-save aria-pressed="${post.saved_by_me}" class="${cx(
            "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors",
            post.saved_by_me ? "border-ink bg-ink text-surface" : "border-line text-muted hover:border-ink/30 hover:bg-paper-deep",
          )}">${icon("bookmark", cx("h-4 w-4", post.saved_by_me && "fill-current"))}<span data-save-label>${
            post.saved_by_me ? "Tersimpan" : "Simpan"
          }</span></button>
          <button type="button" data-share class="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs text-muted transition-colors hover:border-ink/30 hover:bg-paper-deep">${icon(
            "link-2",
            "h-4 w-4",
          )}<span data-share-label>Bagikan</span></button>
        </div>
        <div data-card-message class="mt-3"></div>
        <div class="mt-4 rounded-lg border border-line bg-paper/60 p-3 ${post.comments.length ? "" : "hidden"}" data-comments>${
          post.comments.length > 2
            ? `<button type="button" data-show-comments class="text-xs font-medium text-ink underline underline-offset-2">Lihat ${post.comments.length} komentar</button>`
            : ""
        }<div data-comments-list>${comments}</div></div>
        ${commentForm}
      </div>
    </div>
  </article>`;
}

function postComposerHtml(places) {
  const options = places
    .map((place) => `<option value="${escapeHtml(place.id)}">${escapeHtml(place.name)}</option>`)
    .join("");
  const categories = Object.entries(POST_CATEGORIES)
    .map(([value, label]) => `<option value="${value}">${escapeHtml(label)}</option>`)
    .join("");
  return `<section class="border-b border-line py-6" aria-labelledby="composer-title">
    <div class="flex items-start justify-between gap-4">
      <div><h2 id="composer-title" class="font-display text-xl font-semibold text-ink">Bagi pengalaman</h2><p class="mt-1 text-sm text-muted">Tulis info yang kamu ingin temukan sendiri waktu pertama kali sampai di Jakarta.</p></div>
      <button type="button" data-composer-toggle aria-expanded="false" class="inline-flex min-h-9 items-center gap-2 rounded-sm border border-ink bg-signal px-3 text-sm font-semibold text-ink">${icon(
        "pen-line",
        "h-4 w-4",
      )}<span data-composer-label>Tulis</span></button>
    </div>
    <form data-composer hidden class="mt-5 space-y-4" novalidate>
      <div><label for="post-body" class="mb-1.5 block text-sm font-medium text-ink">Isi postingan</label><textarea id="post-body" name="body" rows="4" required class="${textareaClass}" placeholder="Contoh: Warung di sebelah gerbang timur buka sampai jam 11 malam."></textarea><p class="mt-1.5 text-xs leading-relaxed text-muted">Jangan bagikan nomor pribadi atau alamat kos yang detail.</p></div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div><label for="post-category" class="mb-1.5 block text-sm font-medium text-ink">Kategori</label><select id="post-category" name="category" class="${selectClass}">${categories}</select></div>
        <div><label for="post-place" class="mb-1.5 block text-sm font-medium text-ink">Tandai tempat</label><select id="post-place" name="place_id" class="${selectClass}"><option value="">Tanpa tempat</option>${options}</select></div>
      </div>
      <p class="text-xs leading-relaxed text-muted">Semua postingan dapat dibaca publik. Like, komentar, dan simpan memerlukan login.</p>
      <div><label for="post-photos" class="mb-1.5 block text-sm font-medium text-ink">Foto <span class="font-normal text-muted">opsional</span></label><input id="post-photos" type="file" accept="image/*" multiple class="mt-2 block w-full cursor-pointer text-xs text-muted file:mr-3 file:rounded-sm file:border-0 file:bg-paper-deep file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink"><p class="mt-1.5 text-xs leading-relaxed text-muted">JPG, PNG, WebP, atau GIF. Maksimal 5 MB per gambar.</p></div>
      <div data-composer-message></div>
      <div class="flex items-center gap-3"><button type="submit" class="${buttonClass()}">Kirim postingan</button><span class="flex items-center gap-1.5 text-xs text-muted">${icon(
        "image-plus",
        "h-3.5 w-3.5",
      )} Foto bersifat opsional</span></div>
    </form>
  </section>`;
}

export function mountFeed(container, { posts, places, currentUserId, isDemo, campusName }) {
  const tabs = [
    { id: "terbaru", label: "Terbaru" },
    { id: "sekitar", label: "Sekitar" },
    { id: "tersimpan", label: "Tersimpan" },
  ];
  let activeTab = "terbaru";

  const nearCampus = (post) =>
    post.place &&
    distanceKm(CAMPUS_CENTER.latitude, CAMPUS_CENTER.longitude, post.place.latitude, post.place.longitude) <= 2;

  const filter = (tab) =>
    tab === "tersimpan"
      ? posts.filter((p) => p.saved_by_me)
      : tab === "sekitar"
        ? posts.filter(nearCampus)
        : posts;

  const count = (tab) =>
    tab === "tersimpan" ? posts.filter((p) => p.saved_by_me).length : tab === "sekitar" ? posts.filter(nearCampus).length : posts.length;

  container.innerHTML = `<div>
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
      <div class="flex flex-wrap gap-1" role="group" aria-label="Urutkan linimasa">
        ${tabs
          .map(
            (tab) =>
              `<button type="button" data-tab="${tab.id}" aria-pressed="${tab.id === activeTab}" class="${cx(
                "inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors",
                tab.id === activeTab ? "bg-ink text-surface" : "text-muted hover:bg-paper-deep hover:text-ink",
              )}">${tab.label}<span class="font-mono text-[10px]">${count(tab.id)}</span></button>`,
          )
          .join("")}
      </div>
      <span class="font-mono text-[10px] text-muted">${escapeHtml(campusName ?? "")}</span>
    </div>
    ${
      !currentUserId
        ? `<div class="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm shadow-[0_1px_2px_rgba(11,26,40,0.04)]"><p class="max-w-[56ch] leading-relaxed text-muted">Semua cerita bisa dibaca tanpa login. Masuk untuk like, komentar, dan menyimpan.</p><div class="flex items-center gap-3"><a href="${url(
            "/masuk?next=/linimasa",
          )}" class="font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4">Masuk</a><a href="${url("/daftar")}" class="text-muted hover:text-ink">Daftar</a></div></div>`
        : `<div class="mt-5 rounded-xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(11,26,40,0.04)]">${
            isDemo
              ? ""
              : postComposerHtml(places)
          }</div>`
    }
    <div data-feed-list class="mt-5 space-y-4"></div>
  </div>`;

  const list = container.querySelector("[data-feed-list]");

  const renderList = () => {
    const items = filter(activeTab);
    if (!items.length) {
      list.innerHTML = `<div class="py-8">${require_emptystate(activeTab)}</div>`;
    } else {
      list.innerHTML = items.map((post) => postCardHtml(post, { currentUserId })).join("");
    }
    wireCards(items);
    refreshIcons();
  };

  function require_emptystate(tab) {
    const title =
      tab === "tersimpan" ? "Belum ada yang disimpan" : tab === "sekitar" ? "Belum ada cerita dekat kampus" : "Linimasa masih kosong";
    const description =
      tab === "tersimpan"
        ? "Tekan tombol Simpan pada postingan atau tempat yang ingin kamu buka lagi nanti."
        : "Jadi yang pertama menulis pengalaman. Sebut nama tempat dan hal yang paling berguna untuk anak kos lain.";
    return `<div class="rounded-md border border-dashed border-line-strong bg-surface/65 px-6 py-10 text-center"><h3 class="font-display text-xl font-semibold text-ink">${title}</h3><p class="mx-auto mt-2 max-w-[48ch] text-sm leading-relaxed text-muted">${description}</p><div class="mt-5 flex justify-center"><a href="${url(
      "/jelajah",
    )}" class="text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4">Cari tempat dulu</a></div></div>`;
  }

  container.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTab = btn.dataset.tab;
      container.querySelectorAll("[data-tab]").forEach((b) => {
        const on = b.dataset.tab === activeTab;
        b.setAttribute("aria-pressed", String(on));
        b.classList.toggle("bg-ink", on);
        b.classList.toggle("text-surface", on);
        b.classList.toggle("text-muted", !on);
        b.classList.toggle("hover:bg-paper-deep", !on);
      });
      renderList();
    });
  });

  function wireCards(items) {
    const byId = new Map(items.map((p) => [p.id, p]));
    list.querySelectorAll("[data-post-id]").forEach((card) => {
      const id = card.dataset.postId;
      const post = byId.get(id);

      card.querySelector("[data-like]")?.addEventListener("click", async (event) => {
        if (!currentUserId) return redirectLogin();
        const btn = event.currentTarget;
        const liked = btn.getAttribute("aria-pressed") === "true";
        const next = !liked;
        btn.setAttribute("aria-pressed", String(next));
        const countEl = btn.querySelector("[data-like-count]");
        countEl.textContent = String(Math.max(0, Number(countEl.textContent) + (next ? 1 : -1)));
        btn.classList.toggle("border-live/30", next);
        btn.classList.toggle("bg-live/10", next);
        btn.classList.toggle("text-live", next);
        btn.classList.toggle("border-line", !next);
        btn.classList.toggle("text-muted", !next);
        const result = await toggleLike(id, next);
        if (!result.ok) cardMessage(card, result.message);
      });

      card.querySelector("[data-save]")?.addEventListener("click", async (event) => {
        if (!currentUserId) return redirectLogin();
        const btn = event.currentTarget;
        const saved = btn.getAttribute("aria-pressed") === "true";
        const next = !saved;
        btn.setAttribute("aria-pressed", String(next));
        btn.querySelector("[data-save-label]").textContent = next ? "Tersimpan" : "Simpan";
        btn.classList.toggle("border-ink", next);
        btn.classList.toggle("bg-ink", next);
        btn.classList.toggle("text-surface", next);
        btn.classList.toggle("border-line", !next);
        btn.classList.toggle("text-muted", !next);
        const result = await savePost(id, next);
        if (!result.ok) cardMessage(card, result.message);
      });

      card.querySelector("[data-share]")?.addEventListener("click", async (event) => {
        try {
          await navigator.clipboard.writeText(`${window.location.origin}${url(`/linimasa#post-${id}`)}`);
          event.currentTarget.querySelector("[data-share-label]").textContent = "Tautan disalin";
          window.setTimeout(() => {
            const label = event.currentTarget.querySelector("[data-share-label]");
            if (label) label.textContent = "Bagikan";
          }, 1800);
        } catch {
          /* ignore */
        }
      });

      card.querySelector("[data-toggle-comments]")?.addEventListener("click", () => {
        const box = card.querySelector("[data-comments]");
        box.classList.toggle("hidden");
      });
      card.querySelector("[data-show-comments]")?.addEventListener("click", (event) => {
        event.currentTarget.classList.add("hidden");
      });

      card.querySelector("[data-comment]")?.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!currentUserId) return redirectLogin();
        const form = event.currentTarget;
        const result = await addComment(id, form.body.value);
        if (result.ok) window.location.reload();
        else cardMessage(card, result.message);
      });
    });
  }

  function cardMessage(card, message) {
    const el = card.querySelector("[data-card-message]");
    if (el) {
      el.innerHTML = formMessage(message);
      refreshIcons();
    }
  }

  function redirectLogin() {
    window.location.assign(url("/masuk?next=/linimasa"));
  }

  // Composer wiring
  const composer = container.querySelector("[data-composer]");
  if (composer) {
    const toggle = container.querySelector("[data-composer-toggle]");
    const label = container.querySelector("[data-composer-label]");
    toggle.addEventListener("click", () => {
      const open = composer.hasAttribute("hidden");
      if (open) composer.removeAttribute("hidden");
      else composer.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", String(open));
      label.textContent = open ? "Tutup" : "Tulis";
    });

    const files = [];
    composer.querySelector("#post-photos").addEventListener("change", (event) => {
      files.length = 0;
      Array.from(event.target.files ?? []).forEach((file) => file.size > 0 && files.push(file));
    });

    composer.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submit = composer.querySelector("button[type=submit]");
      submit.disabled = true;
      const messageEl = composer.querySelector("[data-composer-message]");
      messageEl.innerHTML = "";
      const result = await createPost({
        body: composer.body.value,
        category: composer.category.value,
        place_id: composer.place_id.value,
      });
      if (!result.ok) {
        messageEl.innerHTML = formMessage(result.message);
        refreshIcons();
        submit.disabled = false;
        return;
      }
      if (files.length && result.postId) {
        try {
          await uploadPostPhotos(result.postId, files);
        } catch {
          /* keep post */
        }
      }
      window.location.reload();
    });
  }

  renderList();
}
