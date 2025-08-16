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

  const isEdit = useMemo(() => Boolean(editId), [editId]);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/therapists");
      if (!res.ok) throw new Error("Failed to load therapists");
      const data: Therapist[] = await res.json();
      setList(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load therapists");
    } finally {
      setLoading(false);
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
    setShowForm(true);
  }

  function openEdit(t: Therapist) {
    setEditId(t.id);
    setName(t.name || "");
    setEmail(t.email || "");
    setMobile("");
    setImageUrl(t.image || "");
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
      const payload: any = {
        name,
        email,
        mobileNumber: mobile || undefined,
        image: imageUrl || undefined,
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
    } catch (e: any) {
      setError(e?.message || "Failed to save therapist");
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
    } catch (e: any) {
      setError(e?.message || "Failed to delete therapist");
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
          <div className="w-full max-w-md rounded-2xl bg-card/95 border border-border/50 p-5 space-y-4">
            <div className="text-lg font-semibold">{isEdit ? "Edit" : "Add"} Therapist</div>
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
                <label className="text-xs text-muted-foreground">Avatar URL</label>
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background/50 border border-border/50"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
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
