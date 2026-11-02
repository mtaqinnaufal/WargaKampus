// Lightweight validators mirroring src/lib/validation.ts (same messages).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+/i;

function ok(data) {
  return { ok: true, data };
}
function fail(message) {
  return { ok: false, message };
}

export function validateSignIn(input) {
  const email = String(input.email ?? "").trim();
  const password = String(input.password ?? "");
  if (!EMAIL_RE.test(email)) return fail("Masukkan email yang valid.");
  if (password.length < 6) return fail("Password minimal 6 karakter.");
  return ok({ email, password });
}

export function validateSignUp(input) {
  const name = String(input.name ?? "").trim();
  const email = String(input.email ?? "").trim();
  const password = String(input.password ?? "");
  const campus_id = String(input.campus_id ?? "").trim();
  if (name.length < 2) return fail("Nama minimal 2 karakter.");
  if (name.length > 80) return fail("Nama maksimal 80 karakter.");
  if (!EMAIL_RE.test(email)) return fail("Masukkan email yang valid.");
  if (password.length < 8) return fail("Password minimal 8 karakter.");
  return ok({ name, email, password, campus_id: campus_id || undefined });
}

export function validatePlace(input) {
  const name = String(input.name ?? "").trim();
  if (name.length < 3) return fail("Nama tempat minimal 3 karakter.");
  if (name.length > 120) return fail("Nama tempat maksimal 120 karakter.");
  const category_id = String(input.category_id ?? "").trim();
  if (!category_id) return fail("Pilih kategori.");
  const latitude = Number(input.latitude);
  const longitude = Number(input.longitude);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return fail("Koordinat lintang tidak valid.");
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return fail("Koordinat bujur tidak valid.");
  }
  const price_level = Number(input.price_level ?? 2);
  return ok({
    name,
    category_id,
    description: String(input.description ?? "").trim(),
    address: String(input.address ?? "").trim(),
    latitude,
    longitude,
    price_min: input.price_min ?? null,
    price_max: input.price_max ?? null,
    price_level: price_level >= 1 && price_level <= 4 ? price_level : 2,
    facilities: Array.isArray(input.facilities) ? input.facilities : [],
    open_hours_note: String(input.open_hours_note ?? "").trim(),
  });
}

export function validateReview(input) {
  const place_id = String(input.place_id ?? "").trim();
  if (!place_id) return fail("Tempat tidak valid.");
  const rating = Number(input.rating ?? 0);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return fail("Pilih rating 1 sampai 5.");
  }
  return ok({ place_id, rating, body: String(input.body ?? "").trim() });
}

export function validatePost(input) {
  const body = String(input.body ?? "").trim();
  const category = String(input.category ?? "");
  if (body.length < 8) return fail("Tulis minimal 8 karakter.");
  if (body.length > 2000) return fail("Postingan maksimal 2000 karakter.");
  const allowed = ["tips", "promo", "review", "cari-teman", "info-kampus", "curhat"];
  if (!allowed.includes(category)) return fail("Kategori postingan tidak valid.");
  return ok({ body, category, place_id: String(input.place_id ?? "").trim() || null });
}

export function validateProfile(input) {
  const name = String(input.name ?? "").trim();
  if (name.length < 2) return fail("Nama minimal 2 karakter.");
  if (name.length > 80) return fail("Nama maksimal 80 karakter.");
  const bio = String(input.bio ?? "").trim();
  if (bio.length > 280) return fail("Bio maksimal 280 karakter.");
  return ok({ name, bio, campus_id: String(input.campus_id ?? "").trim() || undefined });
}

export function validateReport(input) {
  const target_type = String(input.target_type ?? "");
  const target_id = String(input.target_id ?? "").trim();
  const reason = String(input.reason ?? "").trim();
  if (!["place", "post", "comment", "user"].includes(target_type)) {
    return fail("Target laporan tidak valid.");
  }
  if (!target_id) return fail("Target laporan tidak valid.");
  if (reason.length < 8) return fail("Jelaskan alasan laporan minimal 8 karakter.");
  if (reason.length > 500) return fail("Alasan laporan maksimal 500 karakter.");
  return ok({ target_type, target_id, reason });
}

export function isValidUrl(value) {
  return URL_RE.test(String(value ?? ""));
}
