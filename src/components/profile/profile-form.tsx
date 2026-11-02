"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { updateProfileAction } from "@/app/actions/profile";
import { Avatar } from "@/components/ui/avatar";
import { FormMessage } from "@/components/ui/form-message";
import { FieldHint, FieldLabel, Input, Select, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { uploadAvatar } from "@/lib/storage-client";
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
  const avatarFileRef = useRef<File | null>(null);
  const handledRef = useRef(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const hasFile = Boolean(file && file.size > 0);
    avatarFileRef.current = hasFile ? (file as File) : null;
    setFileName(hasFile && file ? file.name : null);
  }

  useEffect(() => {
    if (!state?.ok || handledRef.current) return;
    handledRef.current = true;

    const file = avatarFileRef.current;
    const finish = () => {
      handledRef.current = false;
      avatarFileRef.current = null;
      setFileName(null);
      setUploading(false);
      router.refresh();
    };

    if (!file) {
      finish();
      return;
    }

    setUploading(true);
    uploadAvatar(file)
      .catch(() => undefined)
      .finally(finish);
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
          Foto profil
        </FieldLabel>
        <div className="mt-2 flex items-center gap-3">
          <Avatar name={profile.name} src={profile.avatar_url} size="lg" decorative />
          <input
            id="profile-avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="block w-full cursor-pointer text-xs text-muted file:mr-3 file:rounded-sm file:border-0 file:bg-paper-deep file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink"
          />
        </div>
        <FieldHint>
          {fileName
            ? `Gambar baru: ${fileName}. Simpan untuk mengganti foto profil.`
            : "JPG, PNG, WebP, atau GIF. Maksimal 5 MB."}
        </FieldHint>
      </div>

      {isDemo ? (
        <p className="text-xs leading-relaxed text-muted">
          Mode demo belum menyimpan perubahan. Form tetap bisa dicoba untuk melihat validasi.
        </p>
      ) : null}

      <FormMessage message={state?.message} ok={state?.ok} />

      <SubmitButton pendingLabel="Menyimpan..." className="w-full">
        {uploading ? "Mengunggah foto..." : "Simpan profil"}
      </SubmitButton>
    </form>
  );
}
