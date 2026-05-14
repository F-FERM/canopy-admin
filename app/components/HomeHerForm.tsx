"use client";

import { useState } from "react";

import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import ImageUpload from "./ImageUpload";

// --- Interfaces ---
interface Button {
  label: string;
  href: string;
  variant: "primary" | "outline";
}

interface Slide {
  image: string;
  galleryImages: string[];
  title: string;
  description: string;
  isActive: boolean;
}

interface HomeHeroSection {
  _id?: string;
  badgeText: string;
  badgeIcon: string;
  heading: string;
  headingHighlight: string;
  subtext: string;
  buttons: Button[];
  slides: Slide[];
  slideInterval: number;
  patternImage: string;
  accentColor: string;
}

type Props = {
  initialData?: Partial<HomeHeroSection>;
  onSubmit: (data: Partial<HomeHeroSection>) => Promise<void>;
};

// --- Default values ---
const defaultSlide = (): Slide => ({
  image: "",
  galleryImages: [],
  title: "",
  description: "",
  isActive: true,
});

const defaultButton = (): Button => ({
  label: "",
  href: "",
  variant: "primary",
});

// --- Sub-component: Collapsible Section ---
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
        {open ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
      </button>
      {open && <div className="p-6 space-y-4">{children}</div>}
    </div>
  );
}

// --- Main Form ---
export default function HomeHeroForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<HomeHeroSection>>(
    initialData || {
      badgeText: "",
      badgeIcon: "",
      heading: "",
      headingHighlight: "",
      subtext: "",
      buttons: [defaultButton()],
      slides: [defaultSlide()],
      slideInterval: 3000,
      patternImage: "",
      accentColor: "#F26A23",
    }
  );
  const [submitting, setSubmitting] = useState(false);

  // --- Helpers ---
  const set = (key: keyof HomeHeroSection, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // --- Button handlers ---
  const addButton = () =>
    set("buttons", [...(form.buttons || []), defaultButton()]);

  const removeButton = (i: number) =>
    set(
      "buttons",
      (form.buttons || []).filter((_, idx) => idx !== i)
    );

  const updateButton = (i: number, key: keyof Button, value: any) => {
    const updated = (form.buttons || []).map((btn, idx) =>
      idx === i ? { ...btn, [key]: value } : btn
    );
    set("buttons", updated);
  };

  // --- Slide handlers ---
  const addSlide = () =>
    set("slides", [...(form.slides || []), defaultSlide()]);

  const removeSlide = (i: number) =>
    set(
      "slides",
      (form.slides || []).filter((_, idx) => idx !== i)
    );

  const updateSlide = (i: number, key: keyof Slide, value: any) => {
    const updated = (form.slides || []).map((s, idx) =>
      idx === i ? { ...s, [key]: value } : s
    );
    set("slides", updated);
  };

  const addGalleryImage = (slideIdx: number) => {
    const slides = [...(form.slides || [])];
    slides[slideIdx] = {
      ...slides[slideIdx],
      galleryImages: [...(slides[slideIdx].galleryImages || []), ""],
    };
    set("slides", slides);
  };

  const updateGalleryImage = (slideIdx: number, imgIdx: number, url: string) => {
    const slides = [...(form.slides || [])];
    const imgs = [...(slides[slideIdx].galleryImages || [])];
    imgs[imgIdx] = url;
    slides[slideIdx] = { ...slides[slideIdx], galleryImages: imgs };
    set("slides", slides);
  };

  const removeGalleryImage = (slideIdx: number, imgIdx: number) => {
    const slides = [...(form.slides || [])];
    slides[slideIdx] = {
      ...slides[slideIdx],
      galleryImages: slides[slideIdx].galleryImages.filter((_, i) => i !== imgIdx),
    };
    set("slides", slides);
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Strip system fields (backend handles these)
      const { 
        _id, __v, _v,
        createdAt, updatedAt, 
        created_at, updated_at, 
        ...payload 
      } = form as any;
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* ── Badge ── */}
      <Section title="Badge">
        <input
          className="input"
          placeholder="Badge Text  e.g. Trusted Security Partner"
          value={form.badgeText || ""}
          onChange={(e) => set("badgeText", e.target.value)}
        />
        <ImageUpload
          label="Badge Icon"
          value={form.badgeIcon || ""}
          onChange={(url:string) => set("badgeIcon", url)}
        />
      </Section>

      {/* ── Heading ── */}
      <Section title="Heading">
        <input
          className="input"
          placeholder="Main Heading  e.g. Highly Trained & Experienced"
          value={form.heading || ""}
          onChange={(e) => set("heading", e.target.value)}
        />
        <input
          className="input"
          placeholder="Highlighted Word / Phrase  e.g. Security Services"
          value={form.headingHighlight || ""}
          onChange={(e) => set("headingHighlight", e.target.value)}
        />
        <textarea
          className="input min-h-[90px]"
          placeholder="Subtext / Description"
          value={form.subtext || ""}
          onChange={(e) => set("subtext", e.target.value)}
        />
      </Section>

      {/* ── Buttons ── */}
      <Section title="Buttons">
        <div className="space-y-3">
          {(form.buttons || []).map((btn, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1fr_auto_auto] gap-3 items-center bg-gray-50 p-3 rounded-lg border"
            >
              <input
                className="input"
                placeholder="Label"
                value={btn.label}
                onChange={(e) => updateButton(i, "label", e.target.value)}
              />
              <input
                className="input"
                placeholder="href  e.g. /services"
                value={btn.href}
                onChange={(e) => updateButton(i, "href", e.target.value)}
              />
              <select
                className="input"
                value={btn.variant}
                onChange={(e) => updateButton(i, "variant", e.target.value as any)}
              >
                <option value="primary">Primary</option>
                <option value="outline">Outline</option>
              </select>
              <button
                type="button"
                onClick={() => removeButton(i)}
                disabled={(form.buttons || []).length <= 1}
                className="p-2 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addButton}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-1"
        >
          <Plus size={16} /> Add Button
        </button>
      </Section>

      {/* ── Slides ── */}
      <Section title={`Slides (${(form.slides || []).length})`}>
        <div className="space-y-6">
          {(form.slides || []).map((slide, si) => (
            <div key={si} className="border rounded-xl overflow-hidden">
              {/* Slide header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                  <GripVertical size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-700 text-sm">
                    Slide {si + 1}{slide.title ? ` — ${slide.title}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={slide.isActive}
                      onChange={(e) => updateSlide(si, "isActive", e.target.checked)}
                      className="accent-blue-600 w-4 h-4"
                    />
                    Active
                  </label>
                  <button
                    type="button"
                    onClick={() => removeSlide(si)}
                    disabled={(form.slides || []).length <= 1}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Slide fields */}
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="input"
                    placeholder="Slide Title"
                    value={slide.title}
                    onChange={(e) => updateSlide(si, "title", e.target.value)}
                  />
                  <textarea
                    className="input min-h-[80px]"
                    placeholder="Slide Description"
                    value={slide.description}
                    onChange={(e) => updateSlide(si, "description", e.target.value)}
                  />
                </div>

                <ImageUpload
                  label="Main Slide Image"
                  value={slide.image}
                  onChange={(url:string) => updateSlide(si, "image", url)}
                />

                {/* Gallery Images */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Gallery Images ({(slide.galleryImages || []).length})
                  </p>
                  <div className="space-y-2">
                    {(slide.galleryImages || []).map((imgUrl, gi) => (
                      <div key={gi} className="flex items-center gap-2">
                        <div className="flex-1">
                          <ImageUpload
                            label={`Gallery Image ${gi + 1}`}
                            value={imgUrl}
                            onChange={(url:string) => updateGalleryImage(si, gi, url)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(si, gi)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors mt-6"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addGalleryImage(si)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
                  >
                    <Plus size={15} /> Add Gallery Image
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSlide}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors mt-2"
        >
          <Plus size={16} /> Add Slide
        </button>
      </Section>

      {/* ── Settings ── */}
      <Section title="Settings" defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Slide Interval (ms)
            </label>
            <input
              type="number"
              className="input"
              placeholder="e.g. 3000"
              value={form.slideInterval ?? 3000}
              min={500}
              step={500}
              onChange={(e) => set("slideInterval", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.accentColor || "#F26A23"}
                onChange={(e) => set("accentColor", e.target.value)}
                className="h-10 w-14 rounded border cursor-pointer"
              />
              <input
                className="input flex-1"
                placeholder="#F26A23"
                value={form.accentColor || ""}
                onChange={(e) => set("accentColor", e.target.value)}
              />
            </div>
          </div>
        </div>

        <ImageUpload
          label="Pattern / Background Image"
          value={form.patternImage || ""}
          onChange={(url:string) => set("patternImage", url)}
        />
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
          "Save Home Hero Section"
        )}
      </button>
    </form>
  );
}