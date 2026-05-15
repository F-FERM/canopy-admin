"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { Stat } from "../Interfaces/HomeAboutStat";
import { AboutSection } from "../api/home/homeaboutstat";


// ─────────────────────────────

const defaultStat = (): Stat => ({
  value: "",
  label: "",
});

type Props = {
  initialData?: Partial<AboutSection>;
  onSubmit: (data: Partial<AboutSection>) => Promise<void>;
};

// ─────────────────────────────

export default function AboutSectionForm({
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<Partial<AboutSection>>(
    initialData || {
      badgeText: "",
      heading: "",
      headingHighlight: "",
      descriptions: [""],

      primaryImage: "",
      secondaryImage: "",

      buttonText: "",
      buttonLink: "",

      patternImageTop: "",
      patternImageBottom: "",

      stats: [defaultStat()],
    }
  );

  const [loading, setLoading] = useState(false);

  const set = (key: keyof AboutSection, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ─────────────────────────────
  // Descriptions
  // ─────────────────────────────
  const addDesc = () =>
    set("descriptions", [...(form.descriptions || []), ""]);

  const updateDesc = (i: number, value: string) => {
    const updated = [...(form.descriptions || [])];
    updated[i] = value;
    set("descriptions", updated);
  };

  const removeDesc = (i: number) => {
    set(
      "descriptions",
      (form.descriptions || []).filter((_, idx) => idx !== i)
    );
  };

  // ─────────────────────────────
  // Stats
  // ─────────────────────────────
  const addStat = () =>
    set("stats", [...(form.stats || []), defaultStat()]);

  const updateStat = (
    i: number,
    key: keyof Stat,
    value: string
  ) => {
    const updated = (form.stats || []).map((s, idx) =>
      idx === i ? { ...s, [key]: value } : s
    );

    set("stats", updated);
  };

  const removeStat = (i: number) => {
    set(
      "stats",
      (form.stats || []).filter((_, idx) => idx !== i)
    );
  };

  // ─────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { _id, createdAt, updatedAt, ...payload } =
        form as any;

      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* TEXT */}
      <div className="grid grid-cols-2 gap-4">
        <input
          className="input"
          placeholder="Badge Text"
          value={form.badgeText || ""}
          onChange={(e) => set("badgeText", e.target.value)}
        />

        <input
          className="input"
          placeholder="Heading"
          value={form.heading || ""}
          onChange={(e) => set("heading", e.target.value)}
        />

        <input
          className="input"
          placeholder="Highlight"
          value={form.headingHighlight || ""}
          onChange={(e) =>
            set("headingHighlight", e.target.value)
          }
        />

        <input
          className="input"
          placeholder="Button Text"
          value={form.buttonText || ""}
          onChange={(e) => set("buttonText", e.target.value)}
        />

        <input
          className="input"
          placeholder="Button Link"
          value={form.buttonLink || ""}
          onChange={(e) => set("buttonLink", e.target.value)}
        />
      </div>

      {/* IMAGES */}
      <ImageUpload
        label="Primary Image"
        value={form.primaryImage || ""}
        onChange={(url) => set("primaryImage", url)}
      />

      <ImageUpload
        label="Secondary Image"
        value={form.secondaryImage || ""}
        onChange={(url) => set("secondaryImage", url)}
      />

      <ImageUpload
        label="Pattern Top"
        value={form.patternImageTop || ""}
        onChange={(url) => set("patternImageTop", url)}
      />

      <ImageUpload
        label="Pattern Bottom"
        value={form.patternImageBottom || ""}
        onChange={(url) => set("patternImageBottom", url)}
      />

      {/* DESCRIPTION */}
      <div>
        <h3 className="font-semibold mb-2">Descriptions</h3>

        {form.descriptions?.map((d, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <textarea
              className="input flex-1"
              value={d}
              onChange={(e) => updateDesc(i, e.target.value)}
            />

            <button type="button" onClick={() => removeDesc(i)}>
              <Trash2 />
            </button>
          </div>
        ))}

        <button type="button" onClick={addDesc}>
          <Plus /> Add
        </button>
      </div>

      {/* STATS */}
      <div>
        <h3 className="font-semibold mb-2">Stats</h3>

        {form.stats?.map((s, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 mb-2">
            <input
              className="input"
              placeholder="Value"
              value={s.value}
              onChange={(e) =>
                updateStat(i, "value", e.target.value)
              }
            />

            <input
              className="input"
              placeholder="Label"
              value={s.label}
              onChange={(e) =>
                updateStat(i, "label", e.target.value)
              }
            />

            <button type="button" onClick={() => removeStat(i)}>
              <Trash2 />
            </button>
          </div>
        ))}

        <button type="button" onClick={addStat}>
          <Plus /> Add Stat
        </button>
      </div>

      {/* SUBMIT */}
      <button
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded"
      >
        {loading ? "Saving..." : "Save About Section"}
      </button>
    </form>
  );
}