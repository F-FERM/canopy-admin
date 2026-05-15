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

interface Button {
    label: string;
    link: string;
    variant: "primary" | "outline";
}

interface EventImage {
    image: string;
}

interface FeaturedEvent {
    badgeText: string;
    title: string;
    date: string;
    location: string;
    description: string;
    backgroundImage: string;
    button: Button;
}

interface EventsLandingSection {
    _id?: string;
    badgeText: string;
    heading: string;
    headingHighlight: string;
    headingEnd: string;
    description: string;
    buttons: Button[];
    images: EventImage[];
    featuredEvent: FeaturedEvent;
}

type Props = {
    initialData?: Partial<EventsLandingSection>;

    onSubmit: (
        data: Partial<EventsLandingSection>
    ) => Promise<void>;
};

// ─────────────────────────────────────

const defaultButton =
    (): Button => ({
        label: "",
        link: "",
        variant: "primary",
    });

const defaultImage =
    (): EventImage => ({
        image: "",
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
                <h3 className="font-semibold">
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

export default function EventsLandingForm({
    initialData,
    onSubmit,
}: Props) {
    const [form, setForm] =
        useState<
            Partial<EventsLandingSection>
        >(
            initialData || {
                badgeText: "",
                heading: "",
                headingHighlight: "",
                headingEnd: "",
                description: "",
                buttons: [
                    defaultButton(),
                ],
                images: [defaultImage()],
                featuredEvent: {
                    badgeText: "",
                    title: "",
                    date: "",
                    location: "",
                    description: "",
                    backgroundImage: "",
                    button:
                        defaultButton(),
                },
            }
        );

    const [submitting, setSubmitting] =
        useState(false);

    // ─────────────────────────────────────

    const set = (
        key: keyof EventsLandingSection,
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

    const updateButton = (
        i: number,
        key: keyof Button,
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

    const removeButton = (
        i: number
    ) =>
        set(
            "buttons",
            (
                form.buttons || []
            ).filter((_, idx) => idx !== i)
        );

    // ─────────────────────────────────────
    // Images
    // ─────────────────────────────────────

    const addImage = () =>
        set("images", [
            ...(form.images || []),
            defaultImage(),
        ]);

    const updateImage = (
        i: number,
        value: string
    ) => {
        const updated = (
            form.images || []
        ).map((img, idx) =>
            idx === i
                ? {
                    image: value,
                }
                : img
        );

        set("images", updated);
    };

    const removeImage = (
        i: number
    ) =>
        set(
            "images",
            (
                form.images || []
            ).filter((_, idx) => idx !== i)
        );

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
            {/* Main Content */}

            <Section title="Main Content">
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

            {/* Buttons */}

            <Section title="Buttons">
                {(form.buttons || []).map(
                    (btn, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-1 md:grid-cols-4 gap-3 border rounded-lg p-4"
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
                                className="text-red-500"
                            >
                                <Trash2 size={18} />
                            </button>
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

            {/* Gallery Images */}

            <Section title="Event Images">
                {(form.images || []).map(
                    (img, i) => (
                        <div
                            key={i}
                            className="flex gap-3 items-end border rounded-lg p-4"
                        >
                            <div className="flex-1">
                                <ImageUpload
                                    label={`Image ${i + 1}`}
                                    value={img.image}
                                    onChange={(
                                        url: string
                                    ) =>
                                        updateImage(
                                            i,
                                            url
                                        )
                                    }
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    removeImage(i)
                                }
                                className="text-red-500"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )
                )}

                <button
                    type="button"
                    onClick={addImage}
                    className="flex items-center gap-2 text-blue-600"
                >
                    <Plus size={16} />
                    Add Image
                </button>
            </Section>

            {/* Featured Event */}

            <Section title="Featured Event">
                <input
                    className="input"
                    placeholder="Badge Text"
                    value={
                        form.featuredEvent
                            ?.badgeText || ""
                    }
                    onChange={(e) =>
                        set("featuredEvent", {
                            ...form.featuredEvent,
                            badgeText:
                                e.target.value,
                        })
                    }
                />

                <input
                    className="input"
                    placeholder="Title"
                    value={
                        form.featuredEvent
                            ?.title || ""
                    }
                    onChange={(e) =>
                        set("featuredEvent", {
                            ...form.featuredEvent,
                            title:
                                e.target.value,
                        })
                    }
                />

                <input
                    className="input"
                    placeholder="Date"
                    value={
                        form.featuredEvent
                            ?.date || ""
                    }
                    onChange={(e) =>
                        set("featuredEvent", {
                            ...form.featuredEvent,
                            date: e.target.value,
                        })
                    }
                />

                <input
                    className="input"
                    placeholder="Location"
                    value={
                        form.featuredEvent
                            ?.location || ""
                    }
                    onChange={(e) =>
                        set("featuredEvent", {
                            ...form.featuredEvent,
                            location:
                                e.target.value,
                        })
                    }
                />

                <textarea
                    className="input min-h-[120px]"
                    placeholder="Description"
                    value={
                        form.featuredEvent
                            ?.description || ""
                    }
                    onChange={(e) =>
                        set("featuredEvent", {
                            ...form.featuredEvent,
                            description:
                                e.target.value,
                        })
                    }
                />

                <ImageUpload
                    label="Background Image"
                    value={
                        form.featuredEvent
                            ?.backgroundImage ||
                        ""
                    }
                    onChange={(url: string) =>
                        set("featuredEvent", {
                            ...form.featuredEvent,
                            backgroundImage:
                                url,
                        })
                    }
                />

                {/* Featured Button */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                        className="input"
                        placeholder="Button Label"
                        value={
                            form.featuredEvent
                                ?.button?.label ||
                            ""
                        }
                        onChange={(e) =>
                            set("featuredEvent", {
                                ...form.featuredEvent,
                                button: {
                                    ...form
                                        .featuredEvent
                                        ?.button,
                                    label:
                                        e.target.value,
                                },
                            })
                        }
                    />

                    <input
                        className="input"
                        placeholder="Button Link"
                        value={
                            form.featuredEvent
                                ?.button?.link ||
                            ""
                        }
                        onChange={(e) =>
                            set("featuredEvent", {
                                ...form.featuredEvent,
                                button: {
                                    ...form
                                        .featuredEvent
                                        ?.button,
                                    link:
                                        e.target.value,
                                },
                            })
                        }
                    />

                    <select
                        className="input"
                        value={
                            form.featuredEvent
                                ?.button
                                ?.variant ||
                            "primary"
                        }
                        onChange={(e) =>
                            set("featuredEvent", {
                                ...form.featuredEvent,
                                button: {
                                    ...form
                                        .featuredEvent
                                        ?.button,
                                    variant:
                                        e.target
                                            .value as any,
                                },
                            })
                        }
                    >
                        <option value="primary">
                            Primary
                        </option>

                        <option value="outline">
                            Outline
                        </option>
                    </select>
                </div>
            </Section>

            {/* Submit */}

            <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold"
            >
                {submitting
                    ? "Saving..."
                    : "Save Events Section"}
            </button>
        </form>
    );
}