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

interface ServiceItem {
  title: string;
  image: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
}

interface ServicesSection {
  _id?: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  description: string;
  services: ServiceItem[];
}

type Props = {
  initialData?: Partial<ServicesSection>;

  onSubmit: (
    data: Partial<ServicesSection>
  ) => Promise<void>;
};

// ─────────────────────────────────────

const defaultService =
  (): ServiceItem => ({
    title: "",
    image: "",
    description: "",
    buttonText: "",
    buttonLink: "",
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

export default function ServicesSectionForm({
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<
      Partial<ServicesSection>
    >(
      initialData || {
        badgeText: "",
        heading: "",
        headingHighlight: "",
        description: "",
        services: [defaultService()],
      }
    );

  const [submitting, setSubmitting] =
    useState(false);

  // ─────────────────────────────────────

  const set = (
    key: keyof ServicesSection,
    value: any
  ) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  // ─────────────────────────────────────
  // Services
  // ─────────────────────────────────────

  const addService = () =>
    set("services", [
      ...(form.services || []),
      defaultService(),
    ]);

  const removeService = (
    i: number
  ) =>
    set(
      "services",
      (
        form.services || []
      ).filter((_, idx) => idx !== i)
    );

  const updateService = (
    i: number,
    key: keyof ServiceItem,
    value: any
  ) => {
    const updated = (
      form.services || []
    ).map((item, idx) =>
      idx === i
        ? {
            ...item,
            [key]: value,
          }
        : item
    );

    set("services", updated);
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

        <textarea
          className="input min-h-[120px]"
          placeholder="Description"
          value={form.description || ""}
          onChange={(e) =>
            set(
              "description",
              e.target.value
            )
          }
        />
      </Section>

      {/* Services */}

      <Section
        title={`Services (${(form.services || []).length})`}
      >
        <div className="space-y-6">
          {(form.services || []).map(
            (service, i) => (
              <div
                key={i}
                className="border rounded-xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                  <h4 className="font-medium text-gray-700">
                    Service {i + 1}
                  </h4>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={
                          service.isActive
                        }
                        onChange={(e) =>
                          updateService(
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
                        removeService(i)
                      }
                      disabled={
                        (
                          form.services ||
                          []
                        ).length <= 1
                      }
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <input
                    className="input"
                    placeholder="Service Title"
                    value={service.title}
                    onChange={(e) =>
                      updateService(
                        i,
                        "title",
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Description"
                    value={
                      service.description
                    }
                    onChange={(e) =>
                      updateService(
                        i,
                        "description",
                        e.target.value
                      )
                    }
                  />

                  <ImageUpload
                    label="Service Image"
                    value={service.image}
                    onChange={(
                      url: string
                    ) =>
                      updateService(
                        i,
                        "image",
                        url
                      )
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      className="input"
                      placeholder="Button Text"
                      value={
                        service.buttonText
                      }
                      onChange={(e) =>
                        updateService(
                          i,
                          "buttonText",
                          e.target.value
                        )
                      }
                    />

                    <input
                      className="input"
                      placeholder="Button Link"
                      value={
                        service.buttonLink
                      }
                      onChange={(e) =>
                        updateService(
                          i,
                          "buttonLink",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <button
          type="button"
          onClick={addService}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus size={16} />
          Add Service
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
          "Save Services Section"
        )}
      </button>
    </form>
  );
}