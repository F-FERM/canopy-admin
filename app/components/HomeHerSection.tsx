"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface HeroButton {
  label: string;
  href: string;
  variant: "primary" | "outline";
}

interface HeroSlide {
  image: string;
  galleryImages: string[];
  title: string;
  description: string;
  isActive: boolean;
}

interface HeroSection {
  _id: string;
  badgeText: string;
  badgeIcon: string;
  heading: string;
  headingHighlight: string;
  subtext: string;
  buttons: HeroButton[];
  slides: HeroSlide[];
  slideInterval: number;
  patternImage: string;
  accentColor: string;
  createdAt: string;
  updatedAt: string;
}

type HeroPayload = Omit<HeroSection, "_id" | "createdAt" | "updatedAt">;

// ─────────────────────────────────────────────────────────────────────────────
// API
// ─────────────────────────────────────────────────────────────────────────────
const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "/api";

const api = {
  getAll: async (): Promise<HeroSection[]> => {
    const r = await fetch(`${BASE}home/hero`);
    if (!r.ok) throw new Error("Fetch failed");
    return r.json();
  },
  create: async (payload: HeroPayload): Promise<HeroSection> => {
    const r = await fetch(`${BASE}home/hero`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error("Create failed");
    return r.json();
  },
  update: async (
    id: string,
    payload: Partial<HeroPayload>,
  ): Promise<HeroSection> => {
    const r = await fetch(`${BASE}home/hero/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error("Update failed");
    return r.json();
  },
  delete: async (id: string): Promise<void> => {
    const r = await fetch(`${BASE}home/hero/${id}`, { method: "DELETE" });
    if (!r.ok) throw new Error("Delete failed");
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULTS
// ─────────────────────────────────────────────────────────────────────────────
const emptyForm = (): HeroPayload => ({
  badgeText: "",
  badgeIcon: "",
  heading: "",
  headingHighlight: "",
  subtext: "",
  buttons: [{ label: "", href: "", variant: "primary" }],
  slides: [
    {
      image: "",
      galleryImages: [""],
      title: "",
      description: "",
      isActive: true,
    },
  ],
  slideInterval: 3000,
  patternImage: "",
  accentColor: "#F26A23",
});

// ─────────────────────────────────────────────────────────────────────────────
// STYLES (shared)
// ─────────────────────────────────────────────────────────────────────────────
const inp =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

const label =
  "block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1";

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroCrudPage() {
  const qc = useQueryClient();
  const KEYS = { all: ["heroes"] as const };

  // ── Queries & Mutations ──────────────────────────────────────────────────
  const {
    data: heroes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: KEYS.all,
    queryFn: api.getAll,
  });

  const createMut = useMutation({
    mutationFn: api.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      closeModal();
    },
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<HeroPayload>;
    }) => api.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      closeModal();
    },
  });

  const deleteMut = useMutation({
    mutationFn: api.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });

  // ── Modal state ──────────────────────────────────────────────────────────
  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<HeroSection | null>(null);
  const [form, setForm] = useState<HeroPayload>(emptyForm());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openCreate = () => {
    setForm(emptyForm());
    setEditTarget(null);
    setMode("create");
  };

  const openEdit = (h: HeroSection) => {
    const { _id, createdAt, updatedAt, ...rest } = h;
    setForm(rest);
    setEditTarget(h);
    setMode("edit");
  };

  const closeModal = () => {
    setMode(null);
    setEditTarget(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create") createMut.mutate(form);
    else if (mode === "edit" && editTarget)
      updateMut.mutate({ id: editTarget._id, payload: form });
  };

  // ── Form helpers ─────────────────────────────────────────────────────────
  const set = (k: keyof HeroPayload, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }));

  const setBtn = (i: number, k: keyof HeroButton, v: string) =>
    set(
      "buttons",
      form.buttons.map((b, idx) => (idx === i ? { ...b, [k]: v } : b)),
    );

  const addBtn = () =>
    set("buttons", [
      ...form.buttons,
      { label: "", href: "", variant: "primary" as const },
    ]);
  const rmBtn = (i: number) =>
    set(
      "buttons",
      form.buttons.filter((_, idx) => idx !== i),
    );

  const setSlide = (i: number, k: keyof HeroSlide, v: unknown) =>
    set(
      "slides",
      form.slides.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)),
    );

  const addSlide = () =>
    set("slides", [
      ...form.slides,
      {
        image: "",
        galleryImages: [""],
        title: "",
        description: "",
        isActive: true,
      },
    ]);

  const rmSlide = (i: number) =>
    set(
      "slides",
      form.slides.filter((_, idx) => idx !== i),
    );

  const setGallery = (si: number, gi: number, v: string) => {
    const imgs = [...form.slides[si].galleryImages];
    imgs[gi] = v;
    setSlide(si, "galleryImages", imgs);
  };

  const addGallery = (si: number) =>
    setSlide(si, "galleryImages", [...form.slides[si].galleryImages, ""]);

  const rmGallery = (si: number, gi: number) =>
    setSlide(
      si,
      "galleryImages",
      form.slides[si].galleryImages.filter((_, i) => i !== gi),
    );

  const busy = createMut.isPending || updateMut.isPending;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Hero Sections
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage homepage hero content
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <span className="text-base leading-none">+</span> Add Hero
        </button>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="px-8 py-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {[
                  "Heading",
                  "Badge",
                  "Slides",
                  "Buttons",
                  "Interval",
                  "Accent",
                  "Updated",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-400"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-16 text-slate-400 text-sm"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      Loading…
                    </div>
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-16 text-red-400 text-sm"
                  >
                    Failed to load. Check your API connection.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && heroes.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-16 text-slate-400 text-sm"
                  >
                    No hero sections yet.{" "}
                    <button
                      onClick={openCreate}
                      className="text-indigo-500 hover:underline font-medium"
                    >
                      Create one
                    </button>
                  </td>
                </tr>
              )}
              {heroes.map((h, rowIdx) => (
                <tr
                  key={h._id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${rowIdx % 2 === 0 ? "" : "bg-slate-50/40"}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800 truncate max-w-[180px]">
                      {h.heading}
                    </p>
                    <p className="text-xs text-slate-400 truncate max-w-[180px]">
                      {h.headingHighlight}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium truncate max-w-[120px] block">
                      {h.badgeText}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
                      <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-md flex items-center justify-center font-bold text-[10px]">
                        {h.slides.length}
                      </span>
                      slides
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {h.buttons.map((b, i) => (
                        <span
                          key={i}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${b.variant === "primary" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}
                        >
                          {b.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                    {h.slideInterval}ms
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border border-slate-200 shadow-sm flex-shrink-0"
                        style={{ backgroundColor: h.accentColor }}
                      />
                      <span className="text-[10px] font-mono text-slate-400">
                        {h.accentColor}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {new Date(h.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(h)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        Edit
                      </button>
                      {deleteConfirm === h._id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              deleteMut.mutate(h._id);
                              setDeleteConfirm(null);
                            }}
                            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(h._id)}
                          disabled={deleteMut.isPending}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ──────────────────────────────────────────────────────── */}
      {mode && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Panel */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-4">
            {/* Modal header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {mode === "create"
                    ? "Create Hero Section"
                    : "Edit Hero Section"}
                </h2>
                {editTarget && (
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {editTarget._id}
                  </p>
                )}
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 text-2xl leading-none transition-colors"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="px-7 py-6 space-y-6 max-h-[80vh] overflow-y-auto"
            >
              {/* ── Basic Info ────────────────────────────────────────── */}
              <section>
                <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-4 flex items-center gap-2">
                  <span className="w-4 h-px bg-indigo-300 inline-block" />
                  Basic Info
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={label}>Badge Text</label>
                    <input
                      className={inp}
                      value={form.badgeText}
                      onChange={(e) => set("badgeText", e.target.value)}
                      placeholder="Trusted Security Partner"
                    />
                  </div>
                  <div>
                    <label className={label}>Badge Icon URL</label>
                    <input
                      className={inp}
                      value={form.badgeIcon}
                      onChange={(e) => set("badgeIcon", e.target.value)}
                      placeholder="/images/home/SideLogo.png"
                    />
                  </div>
                  <div>
                    <label className={label}>Heading</label>
                    <input
                      className={inp}
                      value={form.heading}
                      onChange={(e) => set("heading", e.target.value)}
                      placeholder="Highly Trained & Experienced"
                    />
                  </div>
                  <div>
                    <label className={label}>Heading Highlight</label>
                    <input
                      className={inp}
                      value={form.headingHighlight}
                      onChange={(e) => set("headingHighlight", e.target.value)}
                      placeholder="Security Services"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label}>Subtext</label>
                    <textarea
                      className={inp}
                      rows={2}
                      value={form.subtext}
                      onChange={(e) => set("subtext", e.target.value)}
                      placeholder="Providing professional security solutions…"
                    />
                  </div>
                  <div>
                    <label className={label}>Pattern Image URL</label>
                    <input
                      className={inp}
                      value={form.patternImage}
                      onChange={(e) => set("patternImage", e.target.value)}
                      placeholder="/images/home/HomePattern1.png"
                    />
                  </div>
                  <div>
                    <label className={label}>Slide Interval (ms)</label>
                    <input
                      className={inp}
                      type="number"
                      min={500}
                      step={500}
                      value={form.slideInterval}
                      onChange={(e) =>
                        set("slideInterval", Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <label className={label}>Accent Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={form.accentColor}
                        onChange={(e) => set("accentColor", e.target.value)}
                        className="h-[38px] w-12 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                      />
                      <input
                        className={inp}
                        value={form.accentColor}
                        onChange={(e) => set("accentColor", e.target.value)}
                        placeholder="#F26A23"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* ── Buttons ───────────────────────────────────────────── */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                    <span className="w-4 h-px bg-indigo-300 inline-block" />{" "}
                    Buttons
                  </p>
                  <button
                    type="button"
                    onClick={addBtn}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-3 py-1 rounded-lg transition-colors"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2">
                  {form.buttons.map((btn, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-end bg-slate-50 border border-slate-200 rounded-lg p-3"
                    >
                      <div>
                        <label className={label}>Label</label>
                        <input
                          className={inp}
                          value={btn.label}
                          onChange={(e) => setBtn(i, "label", e.target.value)}
                          placeholder="Explore"
                        />
                      </div>
                      <div>
                        <label className={label}>Href</label>
                        <input
                          className={inp}
                          value={btn.href}
                          onChange={(e) => setBtn(i, "href", e.target.value)}
                          placeholder="/services"
                        />
                      </div>
                      <div>
                        <label className={label}>Variant</label>
                        <select
                          className={inp}
                          value={btn.variant}
                          onChange={(e) => setBtn(i, "variant", e.target.value)}
                        >
                          <option value="primary">Primary</option>
                          <option value="outline">Outline</option>
                        </select>
                      </div>
                      {form.buttons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => rmBtn(i)}
                          className="mb-0.5 text-slate-400 hover:text-red-500 transition-colors text-xl leading-none px-1"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Slides ────────────────────────────────────────────── */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                    <span className="w-4 h-px bg-indigo-300 inline-block" />{" "}
                    Slides
                  </p>
                  <button
                    type="button"
                    onClick={addSlide}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-3 py-1 rounded-lg transition-colors"
                  >
                    + Add Slide
                  </button>
                </div>
                <div className="space-y-4">
                  {form.slides.map((slide, si) => (
                    <div
                      key={si}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Slide {si + 1}
                        </span>
                        {form.slides.length > 1 && (
                          <button
                            type="button"
                            onClick={() => rmSlide(si)}
                            className="text-slate-400 hover:text-red-500 transition-colors text-lg leading-none"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={label}>Title</label>
                          <input
                            className={inp}
                            value={slide.title}
                            onChange={(e) =>
                              setSlide(si, "title", e.target.value)
                            }
                            placeholder="General Security"
                          />
                        </div>
                        <div>
                          <label className={label}>Image URL</label>
                          <input
                            className={inp}
                            value={slide.image}
                            onChange={(e) =>
                              setSlide(si, "image", e.target.value)
                            }
                            placeholder="/images/…"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className={label}>Description</label>
                          <textarea
                            className={inp}
                            rows={2}
                            value={slide.description}
                            onChange={(e) =>
                              setSlide(si, "description", e.target.value)
                            }
                            placeholder="Trained security personnel…"
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="checkbox"
                            id={`active-${si}`}
                            checked={slide.isActive}
                            onChange={(e) =>
                              setSlide(si, "isActive", e.target.checked)
                            }
                            className="w-4 h-4 accent-indigo-600"
                          />
                          <label
                            htmlFor={`active-${si}`}
                            className="text-xs font-medium text-slate-600 cursor-pointer"
                          >
                            Active
                          </label>
                        </div>
                      </div>
                      {/* Gallery Images */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className={label}>Gallery Images</label>
                          <button
                            type="button"
                            onClick={() => addGallery(si)}
                            className="text-[10px] font-semibold text-indigo-500 hover:text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded transition-colors"
                          >
                            + Image
                          </button>
                        </div>
                        <div className="space-y-2">
                          {slide.galleryImages.map((img, gi) => (
                            <div key={gi} className="flex gap-2 items-center">
                              <input
                                className={`${inp} flex-1`}
                                value={img}
                                onChange={(e) =>
                                  setGallery(si, gi, e.target.value)
                                }
                                placeholder="/images/home/gallery/image.jpg"
                              />
                              {slide.galleryImages.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => rmGallery(si, gi)}
                                  className="text-slate-400 hover:text-red-500 text-lg transition-colors px-1"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Form Actions ──────────────────────────────────────── */}
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-sm"
                >
                  {busy
                    ? "Saving…"
                    : mode === "create"
                      ? "Create Hero"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
