"use client";

import { useState } from "react";

import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import ImageUpload from "./ImageUpload";

// ─────────────────────────────────────────────

interface StatItem {
  value: string;
  label: string;
}

interface AboutSection {
  _id?: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  headingEnd: string;
  descriptions: string[];
  image: string;
  stats: StatItem[];
  patternImage: string;
}

type Props = {
  initialData?: Partial<AboutSection>;

  onSubmit: (
    data: Partial<AboutSection>
  ) => Promise<void>;
};

// ─────────────────────────────────────────────

const defaultStat = (): StatItem => ({
  value: "",
  label: "",
});

// ─────────────────────────────────────────────

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] =
    useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <button
        type="button"
        onClick={() =>
          setOpen((v) => !v)
        }
        className="w-full flex items-center justify-between px-6 py-4 border-b bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <h3 className="text-base font-semibold text-gray-800">
          {title}
        </h3>

        {open ? (
          <ChevronUp
            size={18}
            className="text-gray-500"
          />
        ) : (
          <ChevronDown
            size={18}
            className="text-gray-500"
          />
        )}
      </button>

      {open && (
        <div className="p-6 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────

export default function AboutSectionForm({
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<Partial<AboutSection>>(
      initialData || {
        badgeText: "",
        heading: "",
        headingHighlight: "",
        headingEnd: "",
        descriptions: [""],
        image: "",
        stats: [defaultStat()],
        patternImage: "",
      }
    );

  const [submitting, setSubmitting] =
    useState(false);

  // ─────────────────────────────────────────────

  const set = (
    key: keyof AboutSection,
    value: any
  ) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  // ─────────────────────────────────────────────
  // Description handlers
  // ─────────────────────────────────────────────

  const addDescription = () =>
    set("descriptions", [
      ...(form.descriptions || []),
      "",
    ]);

  const removeDescription = (
    i: number
  ) =>
    set(
      "descriptions",
      (
        form.descriptions || []
      ).filter((_, idx) => idx !== i)
    );

  const updateDescription = (
    i: number,
    value: string
  ) => {
    const updated = [
      ...(form.descriptions || []),
    ];

    updated[i] = value;

    set("descriptions", updated);
  };

  // ─────────────────────────────────────────────
  // Stats handlers
  // ─────────────────────────────────────────────

  const addStat = () =>
    set("stats", [
      ...(form.stats || []),
      defaultStat(),
    ]);

  const removeStat = (i: number) =>
    set(
      "stats",
      (form.stats || []).filter(
        (_, idx) => idx !== i
      )
    );

  const updateStat = (
    i: number,
    key: keyof StatItem,
    value: string
  ) => {
    const updated = (
      form.stats || []
    ).map((stat, idx) =>
      idx === i
        ? {
            ...stat,
            [key]: value,
          }
        : stat
    );

    set("stats", updated);
  };

  // ─────────────────────────────────────────────

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const {
        _id,
        __v,
        _v,
        createdAt,
        updatedAt,
        created_at,
        updated_at,
        ...payload
      } = form as any;

      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-5xl"
    >
      {/* Section Content */}

      <Section title="Section Content">
        <input
          className="input"
          placeholder="Badge Text"
          value={form.badgeText || ""}
          onChange={(e) =>
            set(
              "badgeText",
              e.target.value
            )
          }
        />

        <input
          className="input"
          placeholder="Heading"
          value={form.heading || ""}
          onChange={(e) =>
            set(
              "heading",
              e.target.value
            )
          }
        />

        <input
          className="input"
          placeholder="Heading Highlight"
          value={
            form.headingHighlight || ""
          }
          onChange={(e) =>
            set(
              "headingHighlight",
              e.target.value
            )
          }
        />

        <input
          className="input"
          placeholder="Heading End"
          value={form.headingEnd || ""}
          onChange={(e) =>
            set(
              "headingEnd",
              e.target.value
            )
          }
        />
      </Section>

      {/* Descriptions */}

      <Section
        title={`Descriptions (${(form.descriptions || []).length})`}
      >
        <div className="space-y-4">
          {(form.descriptions || []).map(
            (desc, i) => (
              <div
                key={i}
                className="flex gap-3"
              >
                <textarea
                  className="input min-h-[120px] flex-1"
                  placeholder={`Description ${
                    i + 1
                  }`}
                  value={desc}
                  onChange={(e) =>
                    updateDescription(
                      i,
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    removeDescription(i)
                  }
                  disabled={
                    (
                      form.descriptions ||
                      []
                    ).length <= 1
                  }
                  className="p-2 h-fit text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )
          )}
        </div>

        <button
          type="button"
          onClick={addDescription}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
        >
          <Plus size={16} />
          Add Description
        </button>
      </Section>

      {/* Images */}

      <Section title="Images">
        <ImageUpload
          label="Main Image"
          value={form.image || ""}
          onChange={(url: string) =>
            set("image", url)
          }
        />

        <ImageUpload
          label="Pattern Image"
          value={form.patternImage || ""}
          onChange={(url: string) =>
            set("patternImage", url)
          }
        />
      </Section>

      {/* Stats */}

      <Section
        title={`Stats (${(form.stats || []).length})`}
      >
        <div className="space-y-4">
          {(form.stats || []).map(
            (stat, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_2fr_auto] gap-3 items-center"
              >
                <input
                  className="input"
                  placeholder="Value"
                  value={stat.value}
                  onChange={(e) =>
                    updateStat(
                      i,
                      "value",
                      e.target.value
                    )
                  }
                />

                <input
                  className="input"
                  placeholder="Label"
                  value={stat.label}
                  onChange={(e) =>
                    updateStat(
                      i,
                      "label",
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    removeStat(i)
                  }
                  disabled={
                    (
                      form.stats || []
                    ).length <= 1
                  }
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )
          )}
        </div>

        <button
          type="button"
          onClick={addStat}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
        >
          <Plus size={16} />
          Add Stat
        </button>
      </Section>

      {/* Submit */}

      <button
        type="submit"
        disabled={submitting}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            Saving...
          </>
        ) : (
          "Save About Section"
        )}
      </button>
    </form>
  );
}