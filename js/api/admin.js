import { supabase } from "../supabase.js";

function normalizePlace(row) {
  return {
    ...row,
    category: Array.isArray(row.category) ? row.category[0] : row.category,
    facilities: row.facilities ?? [],
    open_hours: row.open_hours ?? {},
    rating_avg: Number(row.rating_avg ?? 0),
    review_count: Number(row.review_count ?? 0),
  };
}

export async function getAdminData() {
  const [pendingResult, reportsResult, usersResult, logsResult, postsCountResult] =
    await Promise.all([
      supabase
        .from("places")
        .select("*, category:place_categories(*)")
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
      supabase
        .from("reports")
        .select("*, reporter:profiles!reports_reporter_id_fkey(id,name)")
        .in("status", ["open", "reviewed"])
        .order("created_at", { ascending: true }),
      supabase
        .from("profiles")
        .select("id,name,role,campus_id,avatar_url,bio,reputation_points,created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("audit_logs")
        .select("*, admin:profiles!audit_logs_admin_id_fkey(id,name)")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase.from("posts").select("id", { count: "exact", head: true }),
    ]);

  for (const result of [pendingResult, reportsResult, usersResult, logsResult, postsCountResult]) {
    if (result.error) throw new Error(result.error.message);
  }

  const pendingPlaces = (pendingResult.data ?? []).map(normalizePlace);
  const reports = (reportsResult.data ?? []).map((row) => ({
    ...row,
    reporter: Array.isArray(row.reporter) ? row.reporter[0] : row.reporter,
  }));
  const users = (usersResult.data ?? []).map((user) => ({ ...user, is_active: true }));
  const auditLogs = (logsResult.data ?? []).map((row) => ({
    ...row,
    admin: Array.isArray(row.admin) ? row.admin[0] : row.admin,
  }));

  return {
    pendingPlaces,
    reports,
    users,
    auditLogs,
    stats: {
      pendingPlaces: pendingPlaces.length,
      openReports: reports.filter((report) => report.status === "open").length,
      totalUsers: users.length,
      totalPosts: postsCountResult.count ?? 0,
    },
  };
}
