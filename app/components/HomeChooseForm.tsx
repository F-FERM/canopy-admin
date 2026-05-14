"use client";

import { useState } from "react";

import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────

interface FeatureItem {
  number: string;
  title: string;
  description: string;
  icon: string;
}

interface WhyChooseUsSection {
  _id?: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  description: string;
  features: FeatureItem[];
}

type Props = {
  initialData?: Partial<WhyChooseUsSection>;
  onSubmit: (
    data: Partial<WhyChooseUsSection>
  ) => Promise<void>;
};

// ─────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────

const defaultFeature = (): FeatureItem => ({
  number: "",
  title: "",
  description: "",
  icon: "Shield",
});

// ─────────────────────────────────────────────
// Section Component
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
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
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
        <div className="p-6 space-y-4">{children}</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Form
// ─────────────────────────────────────────────

export default function WhyChooseUsForm({
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<Partial<WhyChooseUsSection>>(
      initialData || {
        badgeText: "",
        heading: "",
        headingHighlight: "",
        description: "",
        features: [defaultFeature()],
      }
    );

  const [submitting, setSubmitting] =
    useState(false);

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────

  const set = (
    key: keyof WhyChooseUsSection,
    value: any
  ) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  // ─────────────────────────────────────────────
  // Feature handlers
  // ─────────────────────────────────────────────

  const addFeature = () =>
    set("features", [
      ...(form.features || []),
      defaultFeature(),
    ]);

  const removeFeature = (i: number) =>
    set(
      "features",
      (form.features || []).filter(
        (_, idx) => idx !== i
      )
    );

  const updateFeature = (
    i: number,
    key: keyof FeatureItem,
    value: any
  ) => {
    const updated = (form.features || []).map(
      (feature, idx) =>
        idx === i
          ? { ...feature, [key]: value }
          : feature
    );

    set("features", updated);
  };

  // ─────────────────────────────────────────────
  // Submit
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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-4xl"
    >
      {/* ───────────────────────── */}
      {/* Section Content */}
      {/* ───────────────────────── */}

      <Section title="Section Content">
        <input
          className="input"
          placeholder="Badge Text"
          value={form.badgeText || ""}
          onChange={(e) =>
            set("badgeText", e.target.value)
          }
        />

        <input
          className="input"
          placeholder="Heading"
          value={form.heading || ""}
          onChange={(e) =>
            set("heading", e.target.value)
          }
        />

        <input
          className="input"
          placeholder="Heading Highlight"
          value={form.headingHighlight || ""}
          onChange={(e) =>
            set(
              "headingHighlight",
              e.target.value
            )
          }
        />

        <textarea
          className="input min-h-[120px]"
          placeholder="Description"
          value={form.description || ""}
          onChange={(e) =>
            set("description", e.target.value)
          }
        />
      </Section>

      {/* ───────────────────────── */}
      {/* Features */}
      {/* ───────────────────────── */}

      <Section
        title={`Features (${(form.features || []).length})`}
      >
        <div className="space-y-6">
          {(form.features || []).map(
            (feature, fi) => (
              <div
                key={fi}
                className="border rounded-xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                  <div className="flex items-center gap-2">
                    <GripVertical
                      size={16}
                      className="text-gray-400"
                    />

                    <span className="font-medium text-gray-700 text-sm">
                      Feature {fi + 1}
                      {feature.title
                        ? ` — ${feature.title}`
                        : ""}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeFeature(fi)
                    }
                    disabled={
                      (form.features || [])
                        .length <= 1
                    }
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      className="input"
                      placeholder="Number (e.g. 01)"
                      value={feature.number}
                      onChange={(e) =>
                        updateFeature(
                          fi,
                          "number",
                          e.target.value
                        )
                      }
                    />

                    <select
                      className="input"
                      value={feature.icon}
                      onChange={(e) =>
                        updateFeature(
                          fi,
                          "icon",
                          e.target.value
                        )
                      }
                    >
                      <option value="Shield">
                        Shield
                      </option>

                      <option value="Clock">
                        Clock
                      </option>

                      <option value="CheckCircle">
                        CheckCircle
                      </option>

                      <option value="Zap">
                        Zap
                      </option>

                      <option value="DollarSign">
                        DollarSign
                      </option>

                      <option value="Users">
                        Users
                      </option>
                    </select>
                  </div>

                  <input
                    className="input"
                    placeholder="Feature Title"
                    value={feature.title}
                    onChange={(e) =>
                      updateFeature(
                        fi,
                        "title",
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Feature Description"
                    value={feature.description}
                    onChange={(e) =>
                      updateFeature(
                        fi,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            )
          )}
        </div>

        <button
          type="button"
          onClick={addFeature}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors mt-2"
        >
          <Plus size={16} />
          Add Feature
        </button>
      </Section>

      {/* ───────────────────────── */}
      {/* Submit */}
      {/* ───────────────────────── */}

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
          "Save Why Choose Us Section"
        )}
      </button>
    </form>
  );
}