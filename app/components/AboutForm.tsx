"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { AboutSection, AboutStat } from "../api/home/homeaboutstat";


// ─── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  initialData?: Partial<AboutSection>;
  onSubmit: (data: Partial<AboutSection>) => Promise<void>;
};

// ─── Defaults ──────────────────────────────────────────────────────────────────

const defaultStat = (): AboutStat => ({ value: "", label: "" });

// ─── Collapsible Section ───────────────────────────────────────────────────────

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 border-b bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        {open ? (
          <ChevronUp size={18} className="text-gray-500" />
        ) : (
          <ChevronDown size={18} className="text-gray-500" />
        )}
      </button>
      {open && <div className="p-6 space-y-4">{children}</div>}
    </div>
  );
}

// ─── Main Form ─────────────────────────────────────────────────────────────────

export default function AboutForm({ initialData, onSubmit }: Props) {
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
  const [submitting, setSubmitting] = useState(false);

  // ── Generic field setter ───────────────────────────────────────────────────
  const set = (key: keyof AboutSection, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Descriptions ──────────────────────────────────────────────────────────
  const addDescription = () =>
    set("descriptions", [...(form.descriptions || []), ""]);

  const updateDescription = (i: number, value: string) => {
    const updated = (form.descriptions || []).map((d, idx) => (idx === i ? value : d));
    set("descriptions", updated);
  };

  const removeDescription = (i: number) =>
    set(
      "descriptions",
      (form.descriptions || []).filter((_, idx) => idx !== i)
    );

  // ── Stats ──────────────────────────────────────────────────────────────────
  const addStat = () => set("stats", [...(form.stats || []), defaultStat()]);

  const updateStat = (i: number, key: keyof AboutStat, value: string) => {
    const updated = (form.stats || []).map((s, idx) =>
      idx === i ? { ...s, [key]: value } : s
    );
    set("stats", updated);
  };

  const removeStat = (i: number) =>
    set(
      "stats",
      (form.stats || []).filter((_, idx) => idx !== i)
    );

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { _id, __v, createdAt, updatedAt, ...payload } = form as any;
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">

      {/* ── Badge & Heading ── */}
      <Section title="Heading">
        <input
          className="input"
          placeholder="Badge Text  e.g. ABOUT"
          value={form.badgeText || ""}
          onChange={(e) => set("badgeText", e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Main Heading  e.g. Canopy"
            value={form.heading || ""}
            onChange={(e) => set("heading", e.target.value)}
          />
          <input
            className="input"
            placeholder="Highlighted Text  e.g. Security Services"
            value={form.headingHighlight || ""}
            onChange={(e) => set("headingHighlight", e.target.value)}
          />
        </div>
      </Section>

      {/* ── Descriptions ── */}
      <Section title={`Descriptions (${(form.descriptions || []).length})`}>
        <div className="space-y-3">
          {(form.descriptions || []).map((desc, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex items-center pt-3">
                <GripVertical size={16} className="text-gray-400" />
              </div>
              <textarea
                className="input flex-1 min-h-[80px]"
                placeholder={`Paragraph ${i + 1}`}
                value={desc}
                onChange={(e) => updateDescription(i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeDescription(i)}
                disabled={(form.descriptions || []).length <= 1}
                className="p-2 mt-2 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addDescription}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-1"
        >
          <Plus size={16} /> Add Paragraph
        </button>
      </Section>

      {/* ── Images ── */}
      <Section title="Images">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUpload
            label="Primary Image"
            value={form.primaryImage || ""}
            onChange={(url: string) => set("primaryImage", url)}
          />
          <ImageUpload
            label="Secondary Image"
            value={form.secondaryImage || ""}
            onChange={(url: string) => set("secondaryImage", url)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <ImageUpload
            label="Pattern Image (Top)"
            value={form.patternImageTop || ""}
            onChange={(url: string) => set("patternImageTop", url)}
          />
          <ImageUpload
            label="Pattern Image (Bottom)"
            value={form.patternImageBottom || ""}
            onChange={(url: string) => set("patternImageBottom", url)}
          />
        </div>
      </Section>

      {/* ── Button ── */}
      <Section title="CTA Button">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Button Text  e.g. Learn More"
            value={form.buttonText || ""}
            onChange={(e) => set("buttonText", e.target.value)}
          />
          <input
            className="input"
            placeholder="Button Link  e.g. /about"
            value={form.buttonLink || ""}
            onChange={(e) => set("buttonLink", e.target.value)}
          />
        </div>
      </Section>

      {/* ── Stats ── */}
      <Section title={`Stats (${(form.stats || []).length})`}>
        <div className="space-y-3">
          {(form.stats || []).map((stat, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center bg-gray-50 p-3 rounded-lg border"
            >
              <input
                className="input"
                placeholder="Value  e.g. 16+"
                value={stat.value}
                onChange={(e) => updateStat(i, "value", e.target.value)}
              />
              <input
                className="input"
                placeholder="Label  e.g. Nationalities"
                value={stat.label}
                onChange={(e) => updateStat(i, "label", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeStat(i)}
                disabled={(form.stats || []).length <= 1}
                className="p-2 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addStat}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-1"
        >
          <Plus size={16} /> Add Stat
        </button>
      </Section>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            Saving…
          </>
        ) : (
          "Save About Section"
        )}
      </button>
    </form>
  );
}