-- Seed data for KosPintar.
-- Places are derived from OpenStreetMap contributors (ODbL).
-- Prices, facilities, ratings, and review counts are demo estimates, not verified facts.

insert into public.campuses (name, slug, city, latitude, longitude, radius_km)
values ('Institut Teknologi PLN', 'itpln', 'Jakarta Barat', -6.1682438, 106.7263723, 5.0)
on conflict (slug) do update set
  name = excluded.name,
  city = excluded.city,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  radius_km = excluded.radius_km;

insert into public.place_categories (name, slug, icon, sort_order) values
  ('Makan', 'makan', 'utensils', 1),
  ('Nongkrong', 'nongkrong', 'armchair', 2),
  ('Nugas', 'nugas', 'laptop', 3),
  ('Laundry', 'laundry', 'washing-machine', 4),
  ('Fotokopi', 'fotokopi', 'printer', 5),
  ('Sembako', 'sembako', 'shopping-basket', 6),
  ('Kesehatan', 'kesehatan', 'heart-pulse', 7),
  ('Hiburan', 'hiburan', 'ticket', 8)
on conflict (slug) do update set name = excluded.name, icon = excluded.icon, sort_order = excluded.sort_order;

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Rajawali Foto', 'rajawali-foto', 'Layanan cetak, fotokopi, dan jilid dokumen. Berguna untuk tugas, laporan, dan berkas kuliah.', 'Sekitar Duri Kosambi, Cengkareng, Jakarta Barat', -6.146783, 106.734402, 500, 5000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Cetak', 'Fotokopi', 'Jilid'], 'verified', 'osm', 'node/529588133', 4.8, 6
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'fotokopi'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Pyon Prints', 'pyon-prints', 'Layanan cetak, fotokopi, dan jilid dokumen. Berguna untuk tugas, laporan, dan berkas kuliah.', 'Sekitar Duri Kosambi, Cengkareng, Jakarta Barat', -6.136712, 106.727557, 500, 5000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Cetak', 'Fotokopi', 'Jilid'], 'verified', 'osm', 'node/13594385084', 4.6, 4
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'fotokopi'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Snapy', 'snapy', 'Layanan cetak, fotokopi, dan jilid dokumen. Berguna untuk tugas, laporan, dan berkas kuliah.', 'Sekitar Duri Kosambi, Cengkareng, Jakarta Barat', -6.169659, 106.766183, 500, 5000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Cetak', 'Fotokopi', 'Jilid'], 'verified', 'osm', 'node/6221279197', 4.5, 5
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'fotokopi'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Aura Laundry', 'aura-laundry', 'Laundry kiloan di sekitar Cengkareng. Cek harga per kilo, estimasi selesai, dan layanan antar-jemput.', 'Sekitar Duri Kosambi, Cengkareng, Jakarta Barat', -6.147631, 106.731505, 6000, 12000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Kiloan', 'Express'], 'verified', 'osm', 'node/5423710922', 4.4, 8
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'laundry'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Sanggar Laundry', 'sanggar-laundry', 'Laundry kiloan di sekitar Cengkareng. Cek harga per kilo, estimasi selesai, dan layanan antar-jemput.', 'Sekitar Duri Kosambi, Cengkareng, Jakarta Barat', -6.147348, 106.730452, 6000, 12000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Kiloan', 'Express'], 'verified', 'osm', 'node/5395340125', 4.7, 9
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'laundry'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Laundry Mart', 'laundry-mart', 'Laundry kiloan di sekitar Cengkareng. Cek harga per kilo, estimasi selesai, dan layanan antar-jemput.', 'Sekitar Duri Kosambi, Cengkareng, Jakarta Barat', -6.146852, 106.734402, 6000, 12000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Kiloan', 'Express'], 'verified', 'osm', 'node/529588132', 4.5, 14
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'laundry'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Asya Laundry', 'asya-laundry', 'Laundry kiloan di sekitar Cengkareng. Cek harga per kilo, estimasi selesai, dan layanan antar-jemput.', 'Sekitar Duri Kosambi, Cengkareng, Jakarta Barat', -6.146138, 106.732649, 6000, 12000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Kiloan', 'Express'], 'verified', 'osm', 'node/5416481321', 4.6, 11
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'laundry'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Rumah Makan Kampung Kecil Duri Kosambi', 'rumah-makan-kampung-kecil-duri-kosambi', 'Warung, restoran, atau tempat makan cepat di sekitar kampus. Cocok untuk makan sebelum atau sesudah kelas.', 'Sekitar Duri Kosambi, Cengkareng, Jakarta Barat', -6.167338, 106.724169, 10000, 30000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Makan di tempat', 'Parkir'], 'verified', 'osm', 'way/526112189', 4.5, 27
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'makan'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'KFC', 'kfc', 'Warung, restoran, atau tempat makan cepat di sekitar kampus. Cocok untuk makan sebelum atau sesudah kelas. Jenis masakan: chicken.', 'Sekitar Duri Kosambi, Cengkareng, Jakarta Barat', -6.164277, 106.725066, 10000, 30000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Makan di tempat', 'Parkir'], 'verified', 'osm', 'node/9726368535', 4.3, 31
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'makan'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Donnie Seafood', 'donnie-seafood', 'Warung, restoran, atau tempat makan cepat di sekitar kampus. Cocok untuk makan sebelum atau sesudah kelas.', 'Jalan Taman Semanan Indah', -6.163422, 106.724095, 10000, 30000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Makan di tempat', 'Parkir'], 'verified', 'osm', 'node/5315749035', 4.7, 11
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'makan'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Ayam Keprabon Express - Semanan', 'ayam-keprabon-express-semanan', 'Warung, restoran, atau tempat makan cepat di sekitar kampus. Cocok untuk makan sebelum atau sesudah kelas.', 'Sekitar Duri Kosambi, Cengkareng, Jakarta Barat', -6.163368, 106.723947, 10000, 30000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Makan di tempat', 'Parkir'], 'verified', 'osm', 'node/9755068451', 4.8, 14
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'makan'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Mie Ayam Pak Tarsum', 'mie-ayam-pak-tarsum', 'Warung, restoran, atau tempat makan cepat di sekitar kampus. Cocok untuk makan sebelum atau sesudah kelas. Jenis masakan: indonesian.', 'Jalan Rawa Buaya, RT 02 RW 001', -6.157121, 106.730831, 10000, 30000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Makan di tempat', 'Parkir'], 'verified', 'osm', 'node/12271486110', 4.7, 16
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'makan'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Warteg Bumiayu', 'warteg-bumiayu', 'Warung, restoran, atau tempat makan cepat di sekitar kampus. Cocok untuk makan sebelum atau sesudah kelas. Jenis masakan: indonesian.', 'Jalan Darma Wanita IV', -6.156188, 106.733904, 10000, 30000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Makan di tempat', 'Parkir'], 'verified', 'osm', 'node/11444156471', 4.6, 12
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'makan'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Tenanan Fried Chicken', 'tenanan-fried-chicken', 'Warung, restoran, atau tempat makan cepat di sekitar kampus. Cocok untuk makan sebelum atau sesudah kelas. Jenis masakan: indonesian.', 'Jalan Darma Wanita IV', -6.156183, 106.734385, 10000, 30000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Makan di tempat', 'Parkir'], 'verified', 'osm', 'node/12271173801', 4.4, 8
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'makan'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Warung Sate Solo pak Man', 'warung-sate-solo-pak-man', 'Warung, restoran, atau tempat makan cepat di sekitar kampus. Cocok untuk makan sebelum atau sesudah kelas. Jenis masakan: steak_house.', 'Jalan Masjid Nurul Huda', -6.151888, 106.730701, 10000, 30000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Makan di tempat', 'Parkir'], 'verified', 'osm', 'node/10588199686', 4.5, 21
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'makan'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Bubur Ayam Cengkareng', 'bubur-ayam-cengkareng', 'Warung, restoran, atau tempat makan cepat di sekitar kampus. Cocok untuk makan sebelum atau sesudah kelas. Jenis masakan: chicken porridge.', 'Jalan Nusa Indah I', -6.151317, 106.731043, 10000, 30000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Makan di tempat', 'Parkir'], 'verified', 'osm', 'node/5350850523', 4.4, 9
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'makan'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Bakso Cah Solo', 'bakso-cah-solo', 'Warung, restoran, atau tempat makan cepat di sekitar kampus. Cocok untuk makan sebelum atau sesudah kelas.', 'Jalan Bangun Nusa III', -6.15096, 106.730799, 10000, 30000, 1, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Makan di tempat', 'Parkir'], 'verified', 'osm', 'node/5315749024', 4.6, 18
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'makan'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Pecel Lele Lamongan', 'pecel-lele-lamongan', 'Warung, restoran, atau tempat makan cepat di sekitar kampus. Cocok untuk makan sebelum atau sesudah kelas.', 'Jalan Bangun Nusa Raya', -6.151142, 106.731211, 10000, 30000, 1, '{"note": "Mo-Su 18:00-23:00"}'::jsonb, array['Makan di tempat', 'Parkir'], 'verified', 'osm', 'node/5315753121', 4.5, 24
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'makan'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Talaga Sampireun Puri', 'talaga-sampireun-puri', 'Tempat makan atau kafe yang bisa dipakai untuk obrolan santai dan kerja kelompok. Jenis masakan: indonesian.', 'Jalan Tol Lingkar Luar Jakarta', -6.168759, 106.728495, 15000, 50000, 2, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['WiFi', 'Colokan', 'Parkir'], 'verified', 'osm', 'way/874470698', 4.7, 22
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'nongkrong'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Kong Utjok', 'kong-utjok', 'Tempat makan atau kafe yang bisa dipakai untuk obrolan santai dan kerja kelompok.', 'Jalan Masjid Nurul Huda', -6.15439, 106.731008, 15000, 50000, 2, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['WiFi', 'Colokan', 'Parkir'], 'verified', 'osm', 'node/6691351785', 4.6, 13
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'nongkrong'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Ropang Stop', 'ropang-stop', 'Tempat makan atau kafe yang bisa dipakai untuk obrolan santai dan kerja kelompok. Jenis masakan: coffee_shop;ice_cream;snack.', 'Jalan Kedelai Raya, 19', -6.16254, 106.742151, 15000, 50000, 2, '{"note": "Mo-Su 16:00-22:00"}'::jsonb, array['WiFi', 'Colokan', 'Parkir'], 'verified', 'osm', 'way/521719381', 4.4, 19
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'nongkrong'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'McDonald''s', 'mcdonald-s', 'Kafe atau restoran yang bisa dipakai untuk mengerjakan tugas. Cek ketersediaan WiFi dan colokan sebelum datang. Jenis masakan: burger.', 'Jalan Lingkar Luar Barat', -6.174092, 106.729036, 20000, 60000, 2, '{"note": "24/7"}'::jsonb, array['WiFi', 'Colokan', 'AC', 'Parkir'], 'verified', 'osm', 'way/1047068616', 4.3, 25
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'nugas'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Harris Cafe - Harris Suites Puri Mansion', 'harris-cafe-harris-suites-puri-mansion', 'Kafe atau restoran yang bisa dipakai untuk mengerjakan tugas. Cek ketersediaan WiFi dan colokan sebelum datang.', 'Sekitar Duri Kosambi, Cengkareng, Jakarta Barat', -6.180028, 106.724535, 20000, 60000, 2, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['WiFi', 'Colokan', 'AC', 'Parkir'], 'verified', 'osm', 'node/9729403367', 4.5, 10
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'nugas'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Super Indo', 'super-indo', 'Minimarket atau toko kebutuhan harian di sekitar kampus. Berguna untuk belanja cepat.', 'Jalan Raya Duri Kosambi', -6.167063, 106.724654, 5000, 100000, 2, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Parkir', 'Buka hingga malam'], 'verified', 'osm', 'way/514735120', 4.4, 12
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'sembako'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Alfamart', 'alfamart', 'Minimarket atau toko kebutuhan harian di sekitar kampus. Berguna untuk belanja cepat.', 'Jalan Rawa Buaya', -6.155882, 106.731027, 5000, 100000, 2, '{"note": "Mo-Su 07:00-22:00"}'::jsonb, array['Parkir', 'Buka hingga malam'], 'verified', 'osm', 'node/12271466901', 4.5, 15
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'sembako'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';

insert into public.places (campus_id, category_id, name, slug, description, address, latitude, longitude, price_min, price_max, price_level, open_hours, facilities, status, source, osm_id, rating_avg, review_count)
select c.id, cat.id, 'Spar', 'spar', 'Minimarket atau toko kebutuhan harian di sekitar kampus. Berguna untuk belanja cepat.', 'Jalan Lingkar Barat', -6.152886, 106.728358, 5000, 100000, 2, '{"note": "Jam buka belum diverifikasi"}'::jsonb, array['Parkir', 'Buka hingga malam'], 'verified', 'osm', 'node/5055940543', 4.6, 7
from public.campuses c, public.place_categories cat
where c.slug = 'itpln' and cat.slug = 'sembako'
on conflict (slug) do update set
  name = excluded.name, description = excluded.description, address = excluded.address,
  latitude = excluded.latitude, longitude = excluded.longitude,
  price_min = excluded.price_min, price_max = excluded.price_max, price_level = excluded.price_level,
  open_hours = excluded.open_hours, facilities = excluded.facilities, status = 'verified',
  osm_id = excluded.osm_id, source = 'osm';


-- OpenStreetMap attribution is required wherever this data is shown.
-- © OpenStreetMap contributors, ODbL: https://www.openstreetmap.org/copyright