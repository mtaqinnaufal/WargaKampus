"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { updateProfileAction } from "@/app/actions/profile";
import { FormMessage } from "@/components/ui/form-message";
import { FieldHint, FieldLabel, Input, Select, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Campus, Profile } from "@/lib/types";

export function ProfileForm({
  profile,
  campuses,
  email,
  isDemo,
}: {
  profile: Profile;
  campuses: Campus[];
  email?: string;
  isDemo: boolean;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(updateProfileAction, null);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <FieldLabel htmlFor="profile-name">Nama</FieldLabel>
        <Input id="profile-name" name="name" defaultValue={profile.name} required />
      </div>

      <div>
        <FieldLabel htmlFor="profile-email">Email</FieldLabel>
        <Input
          id="profile-email"
          value={email ?? ""}
          readOnly
          className="bg-paper-deep text-muted"
          aria-describedby="profile-email-hint"
        />
        <FieldHint id="profile-email-hint">
          Email tidak bisa diubah dari halaman ini. Hubungi admin kalau perlu mengganti.
        </FieldHint>
      </div>

      <div>
        <FieldLabel htmlFor="profile-bio" hint="opsional">
          Bio
        </FieldLabel>
        <Textarea
          id="profile-bio"
          name="bio"
          rows={3}
          defaultValue={profile.bio ?? ""}
          placeholder="Contoh: Mahasiswa Ilkom. Suka tempat nugas yang tenang."
        />
      </div>

      <div>
        <FieldLabel htmlFor="profile-campus">Kampus</FieldLabel>
        <Select
          id="profile-campus"
          name="campus_id"
          defaultValue={profile.campus_id ?? campuses[0]?.id ?? ""}
        >
          {campuses.map((campus) => (
            <option key={campus.id} value={campus.id}>
              {campus.name} · {campus.city}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <FieldLabel htmlFor="profile-avatar" hint="opsional">
          URL avatar
        </FieldLabel>
        <Input
          id="profile-avatar"
          name="avatar_url"
          type="url"
          defaultValue={profile.avatar_url ?? ""}
          placeholder="https://..."
        />
        <FieldHint>Unggah langsung ke Supabase Storage bisa ditambahkan setelah kredensial aktif.</FieldHint>
      </div>

      {isDemo ? (
        <p className="text-xs leading-relaxed text-muted">
          Mode demo belum menyimpan perubahan. Form tetap bisa dicoba untuk melihat validasi.
        </p>
      ) : null}

      <FormMessage message={state?.message} ok={state?.ok} />

      <SubmitButton pendingLabel="Menyimpan..." className="w-full">
        Simpan profil
      </SubmitButton>
    </form>
  );
}
