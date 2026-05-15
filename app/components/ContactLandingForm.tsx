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
// Interfaces
// ─────────────────────────────────────

interface Button {
    label: string;
    link: string;
    variant: "primary" | "outline";
    icon: string;
}

interface ContactCard {
    title: string;
    icon: string;
    details: string[];
}

interface FeatureCard {
    title: string;
    description: string;
    icon: string;
}

interface ContactLandingSection {
    _id?: string;

    badgeText: string;

    heading: string;

    headingHighlight: string;

    description: string;

    backgroundImage: string;

    buttons: Button[];

    contactTitle: string;

    contactHighlight: string;

    contactCards: ContactCard[];

    featureCards: FeatureCard[];
}

type Props = {
    initialData?: Partial<ContactLandingSection>;

    onSubmit: (
        data: Partial<ContactLandingSection>
    ) => Promise<void>;
};

// ─────────────────────────────────────

const defaultButton =
    (): Button => ({
        label: "",

        link: "",

        variant: "primary",

        icon: "",
    });

const defaultContactCard =
    (): ContactCard => ({
        title: "",

        icon: "",

        details: [""],
    });

const defaultFeatureCard =
    (): FeatureCard => ({
        title: "",

        description: "",

        icon: "",
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
                className="w-full flex items-center justify-between px-6 py-4 border-b bg-gray-50"
            >
                <h3 className="font-semibold text-gray-800">
                    {title}
                </h3>

                {open ? (
                    <ChevronUp size={18} />
                ) : (
                    <ChevronDown size={18} />
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

export default function ContactLandingForm({
    initialData,
    onSubmit,
}: Props) {
    const [form, setForm] =
        useState<
            Partial<ContactLandingSection>
        >(
            initialData || {
                badgeText: "",

                heading: "",

                headingHighlight: "",

                description: "",

                backgroundImage: "",

                buttons: [defaultButton()],

                contactTitle: "",

                contactHighlight: "",

                contactCards: [
                    defaultContactCard(),
                ],

                featureCards: [
                    defaultFeatureCard(),
                ],
            }
        );

    const [submitting, setSubmitting] =
        useState(false);

    // ─────────────────────────────────────

    const set = (
        key: keyof ContactLandingSection,
        value: any
    ) =>
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));

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
            ).filter(
                (_, idx) => idx !== i
            )
        );

    const updateButton = (
        i: number,
        key: keyof Button,
        value: any
    ) => {
        const updated = (
            form.buttons || []
        ).map((item, idx) =>
            idx === i
                ? {
                    ...item,
                    [key]: value,
                }
                : item
        );

        set("buttons", updated);
    };

    // ─────────────────────────────────────
    // Contact Cards
    // ─────────────────────────────────────

    const addContactCard = () =>
        set("contactCards", [
            ...(form.contactCards || []),
            defaultContactCard(),
        ]);

    const removeContactCard = (
        i: number
    ) =>
        set(
            "contactCards",
            (
                form.contactCards || []
            ).filter(
                (_, idx) => idx !== i
            )
        );

    const updateContactCard = (
        i: number,
        key: keyof ContactCard,
        value: any
    ) => {
        const updated = (
            form.contactCards || []
        ).map((item, idx) =>
            idx === i
                ? {
                    ...item,
                    [key]: value,
                }
                : item
        );

        set("contactCards", updated);
    };

    // ─────────────────────────────────────
    // Feature Cards
    // ─────────────────────────────────────

    const addFeatureCard = () =>
        set("featureCards", [
            ...(form.featureCards || []),
            defaultFeatureCard(),
        ]);

    const removeFeatureCard = (
        i: number
    ) =>
        set(
            "featureCards",
            (
                form.featureCards || []
            ).filter(
                (_, idx) => idx !== i
            )
        );

    const updateFeatureCard = (
        i: number,
        key: keyof FeatureCard,
        value: any
    ) => {
        const updated = (
            form.featureCards || []
        ).map((item, idx) =>
            idx === i
                ? {
                    ...item,
                    [key]: value,
                }
                : item
        );

        set("featureCards", updated);
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
            className="space-y-6 max-w-4xl"
        >
            {/* Hero */}

            <Section title="Hero Section">
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
                        form.headingHighlight ||
                        ""
                    }
                    onChange={(e) =>
                        set(
                            "headingHighlight",
                            e.target.value
                        )
                    }
                />

                <textarea
                    className="input min-h-[100px]"
                    placeholder="Description"
                    value={form.description || ""}
                    onChange={(e) =>
                        set(
                            "description",
                            e.target.value
                        )
                    }
                />

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
            </Section>

            {/* Buttons */}

            <Section title="Buttons">
                {(form.buttons || []).map(
                    (btn, i) => (
                        <div
                            key={i}
                            className="grid md:grid-cols-4 gap-3 border p-4 rounded-lg"
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

                            <input
                                className="input"
                                placeholder="Icon"
                                value={btn.icon}
                                onChange={(e) =>
                                    updateButton(
                                        i,
                                        "icon",
                                        e.target.value
                                    )
                                }
                            />

                            <div className="flex gap-2">
                                <select
                                    className="input"
                                    value={btn.variant}
                                    onChange={(e) =>
                                        updateButton(
                                            i,
                                            "variant",
                                            e.target.value
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
                                    className="p-2 text-red-500"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    )
                )}

                <button
                    type="button"
                    onClick={addButton}
                    className="flex items-center gap-2 text-blue-600"
                >
                    <Plus size={16} />
                    Add Button
                </button>
            </Section>

            {/* Contact */}

            <Section title="Contact Information">
                <input
                    className="input"
                    placeholder="Contact Title"
                    value={
                        form.contactTitle || ""
                    }
                    onChange={(e) =>
                        set(
                            "contactTitle",
                            e.target.value
                        )
                    }
                />

                <input
                    className="input"
                    placeholder="Contact Highlight"
                    value={
                        form.contactHighlight ||
                        ""
                    }
                    onChange={(e) =>
                        set(
                            "contactHighlight",
                            e.target.value
                        )
                    }
                />

                {(form.contactCards || []).map(
                    (card, i) => (
                        <div
                            key={i}
                            className="border rounded-lg p-4 space-y-3"
                        >
                            <div className="grid md:grid-cols-2 gap-3">
                                <input
                                    className="input"
                                    placeholder="Title"
                                    value={card.title}
                                    onChange={(e) =>
                                        updateContactCard(
                                            i,
                                            "title",
                                            e.target.value
                                        )
                                    }
                                />

                                <input
                                    className="input"
                                    placeholder="Icon"
                                    value={card.icon}
                                    onChange={(e) =>
                                        updateContactCard(
                                            i,
                                            "icon",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <textarea
                                className="input min-h-[100px]"
                                placeholder="Details (one per line)"
                                value={(
                                    card.details || []
                                ).join("\n")}
                                onChange={(e) =>
                                    updateContactCard(
                                        i,
                                        "details",
                                        e.target.value
                                            .split("\n")
                                            .filter(Boolean)
                                    )
                                }
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    removeContactCard(i)
                                }
                                className="text-red-500"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )
                )}

                <button
                    type="button"
                    onClick={addContactCard}
                    className="flex items-center gap-2 text-blue-600"
                >
                    <Plus size={16} />
                    Add Contact Card
                </button>
            </Section>

            {/* Feature Cards */}

            <Section title="Feature Cards">
                {(form.featureCards || []).map(
                    (card, i) => (
                        <div
                            key={i}
                            className="border rounded-lg p-4 space-y-3"
                        >
                            <input
                                className="input"
                                placeholder="Title"
                                value={card.title}
                                onChange={(e) =>
                                    updateFeatureCard(
                                        i,
                                        "title",
                                        e.target.value
                                    )
                                }
                            />

                            <textarea
                                className="input min-h-[80px]"
                                placeholder="Description"
                                value={
                                    card.description
                                }
                                onChange={(e) =>
                                    updateFeatureCard(
                                        i,
                                        "description",
                                        e.target.value
                                    )
                                }
                            />

                            <div className="flex gap-3">
                                <input
                                    className="input flex-1"
                                    placeholder="Icon"
                                    value={card.icon}
                                    onChange={(e) =>
                                        updateFeatureCard(
                                            i,
                                            "icon",
                                            e.target.value
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeFeatureCard(i)
                                    }
                                    className="p-2 text-red-500"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    )
                )}

                <button
                    type="button"
                    onClick={addFeatureCard}
                    className="flex items-center gap-2 text-blue-600"
                >
                    <Plus size={16} />
                    Add Feature Card
                </button>
            </Section>

            {/* Submit */}

            <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold"
            >
                {submitting
                    ? "Saving..."
                    : "Save Contact Landing"}
            </button>
        </form>
    );
}