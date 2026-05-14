"use client";

import { useState } from "react";

import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import ImageUpload from "./ImageUpload";

// ─────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────

interface ServiceItem {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
}

interface SecurityServicesSection {
  _id?: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  description: string;
  services: ServiceItem[];
}

type Props = {
  initialData?: Partial<SecurityServicesSection>;
  onSubmit: (
    data: Partial<SecurityServicesSection>
  ) => Promise<void>;
};

// ─────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────

const defaultService = (): ServiceItem => ({
  title: "",
  description: "",
  image: "",
  buttonText: "",
  buttonLink: "",
  isActive: true,
});

// ─────────────────────────────────────────────
// Collapsible Section
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

export default function SecurityServicesForm({
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<Partial<SecurityServicesSection>>(
      initialData || {
        badgeText: "",
        heading: "",
        headingHighlight: "",
        description: "",
        services: [defaultService()],
      }
    );

  const [submitting, setSubmitting] = useState(false);

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────

  const set = (
    key: keyof SecurityServicesSection,
    value: any
  ) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  // ─────────────────────────────────────────────
  // Service handlers
  // ─────────────────────────────────────────────

  const addService = () =>
    set("services", [
      ...(form.services || []),
      defaultService(),
    ]);

  const removeService = (i: number) =>
    set(
      "services",
      (form.services || []).filter(
        (_, idx) => idx !== i
      )
    );

  const updateService = (
    i: number,
    key: keyof ServiceItem,
    value: any
  ) => {
    const updated = (form.services || []).map(
      (service, idx) =>
        idx === i
          ? { ...service, [key]: value }
          : service
    );

    set("services", updated);
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
      {/* Section Info */}
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
      {/* Services */}
      {/* ───────────────────────── */}

      <Section
        title={`Services (${(form.services || []).length})`}
      >
        <div className="space-y-6">
          {(form.services || []).map(
            (service, si) => (
              <div
                key={si}
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
                      Service {si + 1}
                      {service.title
                        ? ` — ${service.title}`
                        : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={service.isActive}
                        onChange={(e) =>
                          updateService(
                            si,
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
                        removeService(si)
                      }
                      disabled={
                        (form.services || [])
                          .length <= 1
                      }
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      className="input"
                      placeholder="Service Title"
                      value={service.title}
                      onChange={(e) =>
                        updateService(
                          si,
                          "title",
                          e.target.value
                        )
                      }
                    />

                    <input
                      className="input"
                      placeholder="Button Text"
                      value={service.buttonText}
                      onChange={(e) =>
                        updateService(
                          si,
                          "buttonText",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Service Description"
                    value={service.description}
                    onChange={(e) =>
                      updateService(
                        si,
                        "description",
                        e.target.value
                      )
                    }
                  />

                  <input
                    className="input"
                    placeholder="Button Link"
                    value={service.buttonLink}
                    onChange={(e) =>
                      updateService(
                        si,
                        "buttonLink",
                        e.target.value
                      )
                    }
                  />

                  <ImageUpload
                    label="Service Image"
                    value={service.image}
                    onChange={(url: string) =>
                      updateService(
                        si,
                        "image",
                        url
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
          onClick={addService}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors mt-2"
        >
          <Plus size={16} />
          Add Service
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
          "Save Security Services"
        )}
      </button>
    </form>
  );
}