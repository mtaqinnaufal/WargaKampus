import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Masukkan email yang valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(80),
  email: z.string().trim().email("Masukkan email yang valid."),
  password: z.string().min(8, "Password minimal 8 karakter."),
  campus_id: z.string().trim().optional(),
});

export const placeSchema = z.object({
  name: z.string().trim().min(3, "Nama tempat minimal 3 karakter.").max(120),
  category_id: z.string().trim().min(1, "Pilih kategori."),
  description: z.string().trim().max(1200).optional().default(""),
  address: z.string().trim().max(240).optional().default(""),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  price_min: z.coerce.number().int().min(0).max(10_000_000).optional(),
  price_max: z.coerce.number().int().min(0).max(10_000_000).optional(),
  price_level: z.coerce.number().int().min(1).max(4).default(2),
  facilities: z.array(z.string().max(60)).max(20).default([]),
  open_hours_note: z.string().trim().max(160).optional().default(""),
});

export const reviewSchema = z.object({
  place_id: z.string().trim().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().trim().max(1200).optional().default(""),
});

export const postSchema = z.object({
  body: z.string().trim().min(8, "Tulis minimal 8 karakter.").max(2000),
  category: z.enum(["tips", "promo", "review", "cari-teman", "info-kampus", "curhat"]),
  place_id: z.string().trim().optional(),
  visibility: z.enum(["campus", "public"]).default("campus"),
  photo_url: z.string().trim().url("URL foto tidak valid.").optional().or(z.literal("")),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(80),
  bio: z.string().trim().max(280).optional().default(""),
  campus_id: z.string().trim().optional(),
  avatar_url: z.string().trim().url("URL avatar tidak valid.").optional().or(z.literal("")),
});

export const reportSchema = z.object({
  target_type: z.enum(["place", "post", "comment", "user"]),
  target_id: z.string().trim().min(1),
  reason: z.string().trim().min(8, "Jelaskan alasan laporan minimal 8 karakter.").max(500),
});

export const adminPlaceActionSchema = z.object({
  place_id: z.string().trim().min(1),
  action: z.enum(["approve", "reject"]),
  note: z.string().trim().max(300).optional().default(""),
});

export const adminReportActionSchema = z.object({
  report_id: z.string().trim().min(1),
  action: z.enum(["reviewed", "actioned", "rejected"]),
});

export const roleSchema = z.object({
  user_id: z.string().trim().min(1),
  role: z.enum(["mahasiswa", "pemilik", "admin"]),
});
