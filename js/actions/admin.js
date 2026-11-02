// Admin actions ported from src/app/actions/admin.ts.
import { supabase } from "../supabase.js";
import { getCurrentUser } from "../auth.js";

async function ensureAdmin() {
  const { profile } = await getCurrentUser();
  if (!profile) return { error: "Masuk terlebih dahulu.", profile: null };
  if (profile.role !== "admin") return { error: "Hanya admin yang dapat melakukan ini.", profile };
  return { error: null, profile };
}

export async function verifyPlace(placeId, action, note) {
  const admin = await ensureAdmin();
  if (admin.error) return { ok: false, message: admin.error };

  const status = action === "approve" ? "verified" : "rejected";
  const supabaseClient = supabase;
  const { error } = await supabaseClient.from("places").update({ status }).eq("id", placeId);
  if (error) return { ok: false, message: error.message };

  await supabaseClient.from("audit_logs").insert({
    admin_id: admin.profile.id,
    action: `place.${status}`,
    target_type: "place",
    target_id: placeId,
    note: note || null,
  });

  return { ok: true, message: status === "verified" ? "Tempat diverifikasi." : "Tempat ditolak." };
}

export async function resolveReport(reportId, action) {
  const admin = await ensureAdmin();
  if (admin.error) return { ok: false, message: admin.error };

  const { error } = await supabase
    .from("reports")
    .update({
      status: action,
      handled_by: admin.profile.id,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", reportId);
  if (error) return { ok: false, message: error.message };

  await supabase.from("audit_logs").insert({
    admin_id: admin.profile.id,
    action: `report.${action}`,
    target_type: "report",
    target_id: reportId,
  });

  return { ok: true, message: "Status laporan diperbarui." };
}

export async function updateRole(userId, role) {
  const admin = await ensureAdmin();
  if (admin.error) return { ok: false, message: admin.error };
  if (!["mahasiswa", "pemilik", "admin"].includes(role)) {
    return { ok: false, message: "Peran tidak valid." };
  }

  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
  if (error) return { ok: false, message: error.message };

  await supabase.from("audit_logs").insert({
    admin_id: admin.profile.id,
    action: "profile.role",
    target_type: "profile",
    target_id: userId,
    note: role,
  });

  return { ok: true, message: "Peran pengguna diperbarui." };
}
