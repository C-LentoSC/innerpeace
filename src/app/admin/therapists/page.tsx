"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Therapist {
  id: string;
  name: string;
  email: string | null;
  image?: string | null;
  completedBookings?: number;
  title?: string | null;
  experienceYears?: number | null;
}

interface TherapistPayload {
  name: string;
  email: string;
  mobileNumber?: string;
  image?: string | null;
  title?: string | null;
  experienceYears?: number | null;
}

export default function TherapistsPage() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Therapist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [experienceYears, setExperienceYears] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const isEdit = useMemo(() => Boolean(editId), [editId]);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/therapists");
      if (!res.ok) throw new Error("Failed to load therapists");
      const data: Therapist[] = await res.json();
      setList(data);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to load therapists";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function onFileSelected(file: File) {
    try {
      setUploading(true);
      const form = new FormData();
      form.append("file", file);
      if (imageUrl) form.append("oldPath", imageUrl);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const j = (await res.json()) as { url: string };
      setImageUrl(j.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditId(null);
    setName("");
    setEmail("");
    setMobile("");
    setImageUrl("");
    setTitle("");
    setExperienceYears("");
    setShowForm(true);
  }

  function openEdit(t: Therapist) {
    setEditId(t.id);
    setName(t.name || "");
    setEmail(t.email || "");
    setMobile("");
    setImageUrl(t.image || "");
    setTitle(t.title || "");
    setExperienceYears(t.experienceYears ? String(t.experienceYears) : "");
    setShowForm(true);
  }

  async function save() {
    setError(null);
    if (!email || !name) {
      setError("Name and email are required");
      return;
    }
    try {
      setSaving(true);
      const payload: TherapistPayload = {
        name,
        email,
        mobileNumber: mobile || undefined,
        image: imageUrl || undefined,
        title: title || undefined,
        experienceYears: experienceYears ? Number(experienceYears) : undefined,
      };
      let res: Response;
      if (isEdit && editId) {
        res = await fetch("/api/therapists", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...payload }),
        });
      } else {
        res = await fetch("/api/therapists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to save therapist");
      }
      setShowForm(false);
      await load();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to save therapist";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this therapist?")) return;
    try {
      const res = await fetch(`/api/therapists?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to delete");
      }
      await load();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to delete therapist";
      setError(message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold modern-gradient-text">Therapists</h1>
        <Button onClick={openCreate} className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" /> Add Therapist
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/30 rounded-xl p-3 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((t) => (
            <div key={t.id} className="glass-card p-4 rounded-xl border border-white-border">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-glass-card flex items-center justify-center">
                  {t.image ? (
                    <Image src={t.image} alt={t.name} width={48} height={48} className="h-12 w-12 object-cover" />
                  ) : (
                    <div className="text-lg font-semibold">{t.name?.charAt(0) || "T"}</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(t)}
                    className="p-2 rounded-lg hover:bg-glass-card text-slate-300 hover:text-white"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(t.id)}
                    className="p-2 rounded-lg hover:bg-glass-card text-slate-300 hover:text-white"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {typeof t.completedBookings === "number" && (
                <div className="mt-3 text-xs text-muted-foreground">Completed bookings: {t.completedBookings}</div>
              )}
            </div>
          ))}
          {list.length === 0 && (
            <div className="text-sm text-muted-foreground">No therapists yet.</div>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-card/95 border border-border/50 p-5 space-y-4">
            <div className="text-lg font-semibold">{isEdit ? "Edit" : "Add"} Therapist</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Form */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Name</label>
                  <input
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background/50 border border-border/50"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Therapist name"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Email</label>
                  <input
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background/50 border border-border/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Mobile</label>
                  <input
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background/50 border border-border/50"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Title</label>
                  <input
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background/50 border border-border/50"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Founder of Inner Peace / Senior Therapist"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Experience (years)</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background/50 border border-border/50"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="e.g. 10"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Profile Image</label>
                  <div className="mt-1 flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void onFileSelected(f);
                      }}
                      className="block w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-glass-card file:text-foreground hover:file:bg-glass-card/80"
                    />
                    {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                  {imageUrl && (
                    <div className="text-xs text-muted-foreground mt-1 truncate">Uploaded: {imageUrl}</div>
                  )}
                </div>
              </div>

              {/* Live Card Preview */}
              <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
                <div className="relative aspect-[4/5]">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={name || "Therapist"} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-glass-card text-muted-foreground">No image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-forest/80 via-dark-forest/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h3 className="text-lg font-medium mb-1">{name || "Therapist Name"}</h3>
                    <p className="text-sm text-warm-gray mb-2">{title || "Therapist"}</p>
                    <p className="text-sm text-forest-green">{experienceYears ? `${experienceYears} years` : ""}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={save} disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
