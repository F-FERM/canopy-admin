"use client";

import { useState } from "react";

import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import ImageUpload from "./ImageUpload";

// ─────────────────────────────────────

interface LandingButton {
  label: string;
  link: string;
  variant: "primary" | "outline";
}

interface ServiceLandingSection {
  _id?: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  descriptions: string[];
  backgroundImage: string;
  buttons: LandingButton[];
  overlay: boolean;
}

type Props = {
  initialData?: Partial<ServiceLandingSection>;

  onSubmit: (
    data: Partial<ServiceLandingSection>
  ) => Promise<void>;
};

// ─────────────────────────────────────

const defaultButton =
  (): LandingButton => ({
    label: "",
    link: "",
    variant: "primary",
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

export default function ServiceLandingForm({
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<
      Partial<ServiceLandingSection>
    >(
      initialData || {
        badgeText: "",
        heading: "",
        headingHighlight: "",
        descriptions: [""],
        backgroundImage: "",
        buttons: [defaultButton()],
        overlay: true,
      }
    );

  const [submitting, setSubmitting] =
    useState(false);

  // ─────────────────────────────────────

  const set = (
    key: keyof ServiceLandingSection,
    value: any
  ) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  // ─────────────────────────────────────
  // Descriptions
  // ─────────────────────────────────────

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
    const updated = (
      form.descriptions || []
    ).map((item, idx) =>
      idx === i ? value : item
    );

    set("descriptions", updated);
  };

  // ─────────────────────────────────────
  // Buttons
  // ─────────────────────────────────────

  const addButton = () =>
    set("buttons", [
      ...(form.buttons || []),
      defaultButton(),
    ]);

  const removeButton = (
    i: number
  ) =>
    set(
      "buttons",
      (
        form.buttons || []
      ).filter((_, idx) => idx !== i)
    );

  const updateButton = (
    i: number,
    key: keyof LandingButton,
    value: any
  ) => {
    const updated = (
      form.buttons || []
    ).map((btn, idx) =>
      idx === i
        ? {
            ...btn,
            [key]: value,
          }
        : btn
    );

    set("buttons", updated);
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
      {/* Main */}

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
                  className="input min-h-[100px] flex-1"
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
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30 h-fit"
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
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus size={16} />
          Add Description
        </button>
      </Section>

      {/* Background Image */}

      <Section title="Background Image">
        <ImageUpload
          label="Background Image"
          value={
            form.backgroundImage || ""
          }
          onChange={(url: string) =>
            set(
              "backgroundImage",
              url
            )
          }
        />

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.overlay || false}
            onChange={(e) =>
              set(
                "overlay",
                e.target.checked
              )
            }
            className="accent-blue-600 w-4 h-4"
          />

          Enable Overlay
        </label>
      </Section>

      {/* Buttons */}

      <Section
        title={`Buttons (${(form.buttons || []).length})`}
      >
        <div className="space-y-4">
          {(form.buttons || []).map(
            (btn, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 border rounded-xl p-4"
              >
                <input
                  className="input"
                  placeholder="Label"
                  value={btn.label}
                  onChange={(e) =>
                    updateButton(
                      i,
                      "label",
                      e.target.value
                    )
                  }
                />

                <input
                  className="input"
                  placeholder="Link"
                  value={btn.link}
                  onChange={(e) =>
                    updateButton(
                      i,
                      "link",
                      e.target.value
                    )
                  }
                />

                <select
                  className="input"
                  value={btn.variant}
                  onChange={(e) =>
                    updateButton(
                      i,
                      "variant",
                      e.target
                        .value as any
                    )
                  }
                >
                  <option value="primary">
                    Primary
                  </option>

                  <option value="outline">
                    Outline
                  </option>
                </select>

                <button
                  type="button"
                  onClick={() =>
                    removeButton(i)
                  }
                  disabled={
                    (
                      form.buttons || []
                    ).length <= 1
                  }
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )
          )}
        </div>

        <button
          type="button"
          onClick={addButton}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus size={16} />
          Add Button
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
          "Save Service Landing"
        )}
      </button>
    </form>
  );
}