"use client";

import { useState } from "react";

import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─────────────────────────────────────

interface IndustryItem {
  title: string;
  icon: string;
  isActive: boolean;
}

interface IndustriesGridSection {
  _id?: string;
  industries: IndustryItem[];
}

type Props = {
  initialData?: Partial<IndustriesGridSection>;

  onSubmit: (
    data: Partial<IndustriesGridSection>
  ) => Promise<void>;
};

// ─────────────────────────────────────

const defaultIndustry =
  (): IndustryItem => ({
    title: "",
    icon: "",
    isActive: true,
  });

// ─────────────────────────────────────

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

// ─────────────────────────────────────

export default function IndustriesGridForm({
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<
      Partial<IndustriesGridSection>
    >(
      initialData || {
        industries: [
          defaultIndustry(),
        ],
      }
    );

  const [submitting, setSubmitting] =
    useState(false);

  // ─────────────────────────────────────

  const set = (
    key: keyof IndustriesGridSection,
    value: any
  ) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  // ─────────────────────────────────────

  const addIndustry = () =>
    set("industries", [
      ...(form.industries || []),
      defaultIndustry(),
    ]);

  const removeIndustry = (
    i: number
  ) =>
    set(
      "industries",
      (
        form.industries || []
      ).filter((_, idx) => idx !== i)
    );

  const updateIndustry = (
    i: number,
    key: keyof IndustryItem,
    value: any
  ) => {
    const updated = (
      form.industries || []
    ).map((item, idx) =>
      idx === i
        ? {
            ...item,
            [key]: value,
          }
        : item
    );

    set("industries", updated);
  };

  // ─────────────────────────────────────

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const {
        _id,
        __v,
        createdAt,
        updatedAt,
        ...payload
      } = form as any;

      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-5xl"
    >
      <Section
        title={`Industries (${(form.industries || []).length})`}
      >
        <div className="space-y-6">
          {(form.industries || []).map(
            (industry, i) => (
              <div
                key={i}
                className="border rounded-xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                  <h4 className="font-medium text-gray-700">
                    Industry {i + 1}
                  </h4>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={
                          industry.isActive
                        }
                        onChange={(e) =>
                          updateIndustry(
                            i,
                            "isActive",
                            e.target.checked
                          )
                        }
                        className="accent-blue-600"
                      />

                      Active
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        removeIndustry(i)
                      }
                      disabled={
                        (
                          form.industries ||
                          []
                        ).length <= 1
                      }
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="input"
                    placeholder="Industry Title"
                    value={industry.title}
                    onChange={(e) =>
                      updateIndustry(
                        i,
                        "title",
                        e.target.value
                      )
                    }
                  />

                  <input
                    className="input"
                    placeholder="Icon Name (e.g. Building2)"
                    value={industry.icon}
                    onChange={(e) =>
                      updateIndustry(
                        i,
                        "icon",
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
          onClick={addIndustry}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus size={16} />
          Add Industry
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
          "Save Industries Grid"
        )}
      </button>
    </form>
  );
}