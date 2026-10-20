"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import {
  adminPlaceActionSchema,
  adminReportActionSchema,
  roleSchema,
} from "@/lib/validation";
import { safeString } from "@/lib/utils";

const DEMO_MESSAGE =
  "Mode demo belum menyimpan perubahan. Isi kredensial Supabase di .env.local untuk mengaktifkan database.";

async function ensureAdmin() {
  const { profile } = await getCurrentUser();
  if (!profile) return { error: "Masuk terlebih dahulu." as const, profile: null };
  if (profile.role !== "admin") return { error: "Hanya admin yang dapat melakukan ini." as const, profile };
  return { error: null, profile };
}

export async function verifyPlaceAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = adminPlaceActionSchema.safeParse({
    place_id: safeString(formData.get("place_id")),
    action: safeString(formData.get("action")),
    note: safeString(formData.get("note")),
  });

  if (!parsed.success) {
    return { ok: false, message: "Aksi verifikasi tidak valid." };
  }

  if (!isSupabaseConfigured) {
    return { ok: false, message: DEMO_MESSAGE };
  }

  const admin = await ensureAdmin();
  if (admin.error || !admin.profile) {
    return { ok: false, message: admin.error ?? "Akses ditolak." };
  }

  const status = parsed.data.action === "approve" ? "verified" : "rejected";
  const supabase = await createClient();
  const { error } = await supabase
    .from("places")
    .update({ status })
    .eq("id", parsed.data.place_id);

  if (error) return { ok: false, message: error.message };

  await supabase.from("audit_logs").insert({
    admin_id: admin.profile.id,
    action: `place.${status}`,
    target_type: "place",
    target_id: parsed.data.place_id,
    note: parsed.data.note || null,
  });

  revalidatePath("/admin");
  revalidatePath("/jelajah");
  revalidatePath("/");
  return {
    ok: true,
    message: status === "verified" ? "Tempat diverifikasi." : "Tempat ditolak.",
  };
}

export async function resolveReportAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = adminReportActionSchema.safeParse({
    report_id: safeString(formData.get("report_id")),
    action: safeString(formData.get("action")),
  });

  if (!parsed.success) {
    return { ok: false, message: "Aksi laporan tidak valid." };
  }

  if (!isSupabaseConfigured) {
    return { ok: false, message: DEMO_MESSAGE };
  }

  const admin = await ensureAdmin();
  if (admin.error || !admin.profile) {
    return { ok: false, message: admin.error ?? "Akses ditolak." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("reports")
    .update({
      status: parsed.data.action,
      handled_by: admin.profile.id,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.report_id);

  if (error) return { ok: false, message: error.message };

  await supabase.from("audit_logs").insert({
    admin_id: admin.profile.id,
    action: `report.${parsed.data.action}`,
    target_type: "report",
    target_id: parsed.data.report_id,
  });

  revalidatePath("/admin");
  return { ok: true, message: "Status laporan diperbarui." };
}

export async function updateRoleAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = roleSchema.safeParse({
    user_id: safeString(formData.get("user_id")),
    role: safeString(formData.get("role")),
  });

  if (!parsed.success) {
    return { ok: false, message: "Peran tidak valid." };
  }

  if (!isSupabaseConfigured) {
    return { ok: false, message: DEMO_MESSAGE };
  }

  const admin = await ensureAdmin();
  if (admin.error || !admin.profile) {
    return { ok: false, message: admin.error ?? "Akses ditolak." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: parsed.data.role })
    .eq("id", parsed.data.user_id);

  if (error) return { ok: false, message: error.message };

  await supabase.from("audit_logs").insert({
    admin_id: admin.profile.id,
    action: "profile.role",
    target_type: "profile",
    target_id: parsed.data.user_id,
    note: parsed.data.role,
  });

  revalidatePath("/admin");
  return { ok: true, message: "Peran pengguna diperbarui." };
}

export async function verifyPlaceFormAction(formData: FormData): Promise<void> {
  await verifyPlaceAction(null, formData);
}

export async function resolveReportFormAction(formData: FormData): Promise<void> {
  await resolveReportAction(null, formData);
}

export async function updateRoleFormAction(formData: FormData): Promise<void> {
  await updateRoleAction(null, formData);
}
