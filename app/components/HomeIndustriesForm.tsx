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

interface IndustryItem {
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
}

interface IndustriesWeServeSection {
  _id?: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  description: string;
  industries: IndustryItem[];
}

type Props = {
  initialData?: Partial<IndustriesWeServeSection>;
  onSubmit: (
    data: Partial<IndustriesWeServeSection>
  ) => Promise<void>;
};

// ─────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────

const defaultIndustry = (): IndustryItem => ({
  title: "",
  description: "",
  icon: "Construction",
  isActive: true,
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

export default function IndustriesWeServeForm({
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<
      Partial<IndustriesWeServeSection>
    >(
      initialData || {
        badgeText: "",
        heading: "",
        headingHighlight: "",
        description: "",
        industries: [defaultIndustry()],
      }
    );

  const [submitting, setSubmitting] =
    useState(false);

  // ─────────────────────────────────────────────

  const set = (
    key: keyof IndustriesWeServeSection,
    value: any
  ) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  // ─────────────────────────────────────────────
  // Industry Handlers
  // ─────────────────────────────────────────────

  const addIndustry = () =>
    set("industries", [
      ...(form.industries || []),
      defaultIndustry(),
    ]);

  const removeIndustry = (i: number) =>
    set(
      "industries",
      (form.industries || []).filter(
        (_, idx) => idx !== i
      )
    );

  const updateIndustry = (
    i: number,
    key: keyof IndustryItem,
    value: any
  ) => {
    const updated = (
      form.industries || []
    ).map((industry, idx) =>
      idx === i
        ? {
            ...industry,
            [key]: value,
          }
        : industry
    );

    set("industries", updated);
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
      {/* Industries */}
      {/* ───────────────────────── */}

      <Section
        title={`Industries (${(form.industries || []).length})`}
      >
        <div className="space-y-6">
          {(form.industries || []).map(
            (industry, ii) => (
              <div
                key={ii}
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
                      Industry {ii + 1}
                      {industry.title
                        ? ` — ${industry.title}`
                        : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          industry.isActive
                        }
                        onChange={(e) =>
                          updateIndustry(
                            ii,
                            "isActive",
                            e.target.checked
                          )
                        }
                        className="accent-blue-600 w-4 h-4"
                      />

                      Active
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        removeIndustry(ii)
                      }
                      disabled={
                        (
                          form.industries ||
                          []
                        ).length <= 1
                      }
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                  <input
                    className="input"
                    placeholder="Industry Title"
                    value={industry.title}
                    onChange={(e) =>
                      updateIndustry(
                        ii,
                        "title",
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Industry Description"
                    value={
                      industry.description
                    }
                    onChange={(e) =>
                      updateIndustry(
                        ii,
                        "description",
                        e.target.value
                      )
                    }
                  />

                  <select
                    className="input"
                    value={industry.icon}
                    onChange={(e) =>
                      updateIndustry(
                        ii,
                        "icon",
                        e.target.value
                      )
                    }
                  >
                    <option value="Construction">
                      Construction
                    </option>

                    <option value="Home">
                      Home
                    </option>

                    <option value="ShoppingBag">
                      ShoppingBag
                    </option>

                    <option value="Briefcase">
                      Briefcase
                    </option>

                    <option value="Building">
                      Building
                    </option>

                    <option value="Factory">
                      Factory
                    </option>
                  </select>
                </div>
              </div>
            )
          )}
        </div>

        <button
          type="button"
          onClick={addIndustry}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors mt-2"
        >
          <Plus size={16} />
          Add Industry
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
          "Save Industries Section"
        )}
      </button>
    </form>
  );
}