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
// Interfaces
// ─────────────────────────────────────────────

interface RootObject {
  _id?: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  description: string;
  services: Service[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Service {
  title: string;
  slug?: string;
  image: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  detailPage?: DetailPage;
}

interface DetailPage {
  heroSection: HeroSection;
  whyChooseSection: WhyChooseSection;
  responsibilitiesSection: ResponsibilitiesSection;
  industriesSection: IndustriesSection;
}

interface IndustriesSection {
  heading: string;
  headingHighlight: string;
  description: string;
  industries: Responsibility[];
}

interface ResponsibilitiesSection {
  heading: string;
  headingHighlight: string;
  responsibilities: Responsibility[];
}

interface Responsibility {
  title: string;
  description: string;
}

interface WhyChooseSection {
  heading: string;
  headingHighlight: string;
  descriptionOne: string;
  descriptionTwo: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

interface HeroSection {
  badgeText: string;
  heading: string;
  headingHighlight: string;
  description: string;
  backgroundImage: string;
  buttonText: string;
  buttonLink: string;
}

type Props = {
  initialData?: Partial<RootObject>;
  onSubmit: (data: Partial<RootObject>) => Promise<void>;
};

// ─────────────────────────────────────────────
// Default Values
// ─────────────────────────────────────────────

const defaultResponsibility = (): Responsibility => ({
  title: "",
  description: "",
});

const defaultService = (): Service => ({
  title: "",
  slug: "",
  image: "",
  description: "",
  buttonText: "",
  buttonLink: "",
  isActive: true,

  detailPage: {
    heroSection: {
      badgeText: "",
      heading: "",
      headingHighlight: "",
      description: "",
      backgroundImage: "",
      buttonText: "",
      buttonLink: "",
    },

    whyChooseSection: {
      heading: "",
      headingHighlight: "",
      descriptionOne: "",
      descriptionTwo: "",
      image: "",
      buttonText: "",
      buttonLink: "",
    },

    responsibilitiesSection: {
      heading: "",
      headingHighlight: "",
      responsibilities: [defaultResponsibility()],
    },

    industriesSection: {
      heading: "",
      headingHighlight: "",
      description: "",
      industries: [defaultResponsibility()],
    },
  },
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
    <div className="border rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 border-b"
      >
        <h3 className="font-semibold text-gray-800">{title}</h3>

        {open ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}
      </button>

      {open && <div className="p-5 space-y-4">{children}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function ServicesLandingForm({
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<Partial<RootObject>>(
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

  const set = (key: keyof RootObject, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ─────────────────────────────────────────────
  // Service Handlers
  // ─────────────────────────────────────────────

  const addService = () => {
    set("services", [...(form.services || []), defaultService()]);
  };

  const removeService = (index: number) => {
    set(
      "services",
      (form.services || []).filter((_, i) => i !== index)
    );
  };

  const updateService = (
    index: number,
    key: keyof Service,
    value: any
  ) => {
    const updated = [...(form.services || [])];

    updated[index] = {
      ...updated[index],
      [key]: value,
    };

    set("services", updated);
  };

  // ─────────────────────────────────────────────
  // Detail Page Update
  // ─────────────────────────────────────────────

  const updateDetailPage = (
    serviceIndex: number,
    section: keyof DetailPage,
    key: string,
    value: any
  ) => {
    const updated = [...(form.services || [])];

    updated[serviceIndex].detailPage = {
      ...updated[serviceIndex].detailPage!,
      [section]: {
        ...(updated[serviceIndex].detailPage as any)[section],
        [key]: value,
      },
    };

    set("services", updated);
  };

  // ─────────────────────────────────────────────
  // Responsibilities
  // ─────────────────────────────────────────────

  const addResponsibility = (
    serviceIndex: number,
    section: "responsibilitiesSection" | "industriesSection"
  ) => {
    const updated = [...(form.services || [])];

    const detailPage = updated[serviceIndex].detailPage;
    if (!detailPage) return;

    if (section === "responsibilitiesSection") {
      detailPage.responsibilitiesSection.responsibilities.push(defaultResponsibility());
    } else {
      detailPage.industriesSection.industries.push(defaultResponsibility());
    }

    set("services", updated);
  };

  const updateResponsibility = (
    serviceIndex: number,
    section: "responsibilitiesSection" | "industriesSection",
    itemIndex: number,
    key: keyof Responsibility,
    value: string
  ) => {
    const updated = [...(form.services || [])];

    const target =
      section === "responsibilitiesSection"
        ? updated[serviceIndex].detailPage?.responsibilitiesSection
            .responsibilities
        : updated[serviceIndex].detailPage?.industriesSection
            .industries;

    if (!target) return;

    target[itemIndex] = {
      ...target[itemIndex],
      [key]: value,
    };

    set("services", updated);
  };

  const removeResponsibility = (
    serviceIndex: number,
    section: "responsibilitiesSection" | "industriesSection",
    itemIndex: number
  ) => {
    const updated = [...(form.services || [])];

    if (section === "responsibilitiesSection") {
      updated[
        serviceIndex
      ].detailPage!.responsibilitiesSection.responsibilities =
        updated[
          serviceIndex
        ].detailPage!.responsibilitiesSection.responsibilities.filter(
          (_, i) => i !== itemIndex
        );
    } else {
      updated[
        serviceIndex
      ].detailPage!.industriesSection.industries =
        updated[
          serviceIndex
        ].detailPage!.industriesSection.industries.filter(
          (_, i) => i !== itemIndex
        );
    }

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
        createdAt,
        updatedAt,
        __v,
        ...rest
      } = form as any;

      const payload = {
        ...rest,
        services: rest.services?.map((s: any) => {
          const { _id, ...serviceRest } = s;
          return serviceRest;
        }),
      };

      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-5xl"
    >
      {/* Main Section */}

      <Section title="Main Content">
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
            set("headingHighlight", e.target.value)
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

      {/* Services */}

      <Section
        title={`Services (${(form.services || []).length})`}
      >
        <div className="space-y-8">
          {(form.services || []).map((service, si) => (
            <div
              key={si}
              className="border rounded-2xl overflow-hidden"
            >
              {/* Header */}

              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b">
                <h3 className="font-semibold">
                  Service {si + 1}
                </h3>

                <button
                  type="button"
                  onClick={() => removeService(si)}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="p-5 space-y-6">
                {/* Basic */}

                <Section title="Basic Details">
                  <input
                    className="input"
                    placeholder="Title"
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
                    placeholder="Slug"
                    value={service.slug}
                    onChange={(e) =>
                      updateService(
                        si,
                        "slug",
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Description"
                    value={service.description}
                    onChange={(e) =>
                      updateService(
                        si,
                        "description",
                        e.target.value
                      )
                    }
                  />

                  <ImageUpload
                    label="Service Image"
                    value={service.image}
                    onChange={(url: string) =>
                      updateService(si, "image", url)
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  <label className="flex items-center gap-2 text-sm">
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
                    />

                    Active
                  </label>
                </Section>

                {/* Hero Section */}

                <Section title="Hero Section">
                  <input
                    className="input"
                    placeholder="Badge Text"
                    value={
                      service.detailPage?.heroSection
                        .badgeText || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "heroSection",
                        "badgeText",
                        e.target.value
                      )
                    }
                  />

                  <input
                    className="input"
                    placeholder="Heading"
                    value={
                      service.detailPage?.heroSection
                        .heading || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "heroSection",
                        "heading",
                        e.target.value
                      )
                    }
                  />

                  <input
                    className="input"
                    placeholder="Heading Highlight"
                    value={
                      service.detailPage?.heroSection
                        .headingHighlight || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "heroSection",
                        "headingHighlight",
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Description"
                    value={
                      service.detailPage?.heroSection
                        .description || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "heroSection",
                        "description",
                        e.target.value
                      )
                    }
                  />

                  <ImageUpload
                    label="Background Image"
                    value={
                      service.detailPage?.heroSection
                        .backgroundImage || ""
                    }
                    onChange={(url: string) =>
                      updateDetailPage(
                        si,
                        "heroSection",
                        "backgroundImage",
                        url
                      )
                    }
                  />

                  <input
                    className="input"
                    placeholder="Button Text"
                    value={
                      service.detailPage?.heroSection
                        .buttonText || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "heroSection",
                        "buttonText",
                        e.target.value
                      )
                    }
                  />

                  <input
                    className="input"
                    placeholder="Button Link"
                    value={
                      service.detailPage?.heroSection
                        .buttonLink || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "heroSection",
                        "buttonLink",
                        e.target.value
                      )
                    }
                  />
                </Section>

                {/* Why Choose */}

                <Section title="Why Choose Section">
                  <input
                    className="input"
                    placeholder="Heading"
                    value={
                      service.detailPage?.whyChooseSection
                        .heading || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "whyChooseSection",
                        "heading",
                        e.target.value
                      )
                    }
                  />

                  <input
                    className="input"
                    placeholder="Heading Highlight"
                    value={
                      service.detailPage?.whyChooseSection
                        .headingHighlight || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "whyChooseSection",
                        "headingHighlight",
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Description One"
                    value={
                      service.detailPage?.whyChooseSection
                        .descriptionOne || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "whyChooseSection",
                        "descriptionOne",
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Description Two"
                    value={
                      service.detailPage?.whyChooseSection
                        .descriptionTwo || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "whyChooseSection",
                        "descriptionTwo",
                        e.target.value
                      )
                    }
                  />

                  <ImageUpload
                    label="Why Choose Image"
                    value={
                      service.detailPage?.whyChooseSection
                        .image || ""
                    }
                    onChange={(url: string) =>
                      updateDetailPage(
                        si,
                        "whyChooseSection",
                        "image",
                        url
                      )
                    }
                  />

                  <input
                    className="input"
                    placeholder="Button Text"
                    value={
                      service.detailPage?.whyChooseSection
                        .buttonText || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "whyChooseSection",
                        "buttonText",
                        e.target.value
                      )
                    }
                  />

                  <input
                    className="input"
                    placeholder="Button Link"
                    value={
                      service.detailPage?.whyChooseSection
                        .buttonLink || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "whyChooseSection",
                        "buttonLink",
                        e.target.value
                      )
                    }
                  />
                </Section>

                {/* Responsibilities */}

                <Section title="Responsibilities Section">
                  <input
                    className="input"
                    placeholder="Heading"
                    value={
                      service.detailPage
                        ?.responsibilitiesSection
                        .heading || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "responsibilitiesSection",
                        "heading",
                        e.target.value
                      )
                    }
                  />

                  <input
                    className="input"
                    placeholder="Heading Highlight"
                    value={
                      service.detailPage
                        ?.responsibilitiesSection
                        .headingHighlight || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "responsibilitiesSection",
                        "headingHighlight",
                        e.target.value
                      )
                    }
                  />

                  <div className="space-y-4">
                    {service.detailPage?.responsibilitiesSection.responsibilities.map(
                      (item, ri) => (
                        <div
                          key={ri}
                          className="border rounded-xl p-4 space-y-3"
                        >
                          <input
                            className="input"
                            placeholder="Title"
                            value={item.title}
                            onChange={(e) =>
                              updateResponsibility(
                                si,
                                "responsibilitiesSection",
                                ri,
                                "title",
                                e.target.value
                              )
                            }
                          />

                          <textarea
                            className="input min-h-[90px]"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) =>
                              updateResponsibility(
                                si,
                                "responsibilitiesSection",
                                ri,
                                "description",
                                e.target.value
                              )
                            }
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeResponsibility(
                                si,
                                "responsibilitiesSection",
                                ri
                              )
                            }
                            className="text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addResponsibility(
                        si,
                        "responsibilitiesSection"
                      )
                    }
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <Plus size={16} />
                    Add Responsibility
                  </button>
                </Section>

                {/* Industries */}

                <Section title="Industries Section">
                  <input
                    className="input"
                    placeholder="Heading"
                    value={
                      service.detailPage?.industriesSection
                        .heading || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "industriesSection",
                        "heading",
                        e.target.value
                      )
                    }
                  />

                  <input
                    className="input"
                    placeholder="Heading Highlight"
                    value={
                      service.detailPage?.industriesSection
                        .headingHighlight || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "industriesSection",
                        "headingHighlight",
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Description"
                    value={
                      service.detailPage?.industriesSection
                        .description || ""
                    }
                    onChange={(e) =>
                      updateDetailPage(
                        si,
                        "industriesSection",
                        "description",
                        e.target.value
                      )
                    }
                  />

                  <div className="space-y-4">
                    {service.detailPage?.industriesSection.industries.map(
                      (item, ii) => (
                        <div
                          key={ii}
                          className="border rounded-xl p-4 space-y-3"
                        >
                          <input
                            className="input"
                            placeholder="Industry Title"
                            value={item.title}
                            onChange={(e) =>
                              updateResponsibility(
                                si,
                                "industriesSection",
                                ii,
                                "title",
                                e.target.value
                              )
                            }
                          />

                          <textarea
                            className="input min-h-[90px]"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) =>
                              updateResponsibility(
                                si,
                                "industriesSection",
                                ii,
                                "description",
                                e.target.value
                              )
                            }
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeResponsibility(
                                si,
                                "industriesSection",
                                ii
                              )
                            }
                            className="text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addResponsibility(
                        si,
                        "industriesSection"
                      )
                    }
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <Plus size={16} />
                    Add Industry
                  </button>
                </Section>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addService}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-blue-600"
        >
          <Plus size={18} />
          Add Service
        </button>
      </Section>

      {/* Submit */}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Save Services"}
      </button>
    </form>
  );
}