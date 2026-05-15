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

interface CareerButton {
    label: string;
    link: string;
    variant: "primary" | "outline";
}

interface CareerStat {
    value: string;
    label: string;
}

interface CareerLandingSection {
    _id?: string;
    badgeText: string;
    heading: string;
    headingHighlight: string;
    headingEnd: string;
    description: string;
    image: string;
    patternImage: string;
    buttons: CareerButton[];
    statsTitle: string;
    stats: CareerStat[];
}

type Props = {
    initialData?: Partial<CareerLandingSection>;

    onSubmit: (
        data: Partial<CareerLandingSection>
    ) => Promise<void>;
};

// ─────────────────────────────────────

const defaultButton = (): CareerButton => ({
    label: "",
    link: "",
    variant: "primary",
});

const defaultStat = (): CareerStat => ({
    value: "",
    label: "",
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

export default function CareerLandingForm({
    initialData,
    onSubmit,
}: Props) {
    const [form, setForm] =
        useState<
            Partial<CareerLandingSection>
        >(
            initialData || {
                badgeText: "",
                heading: "",
                headingHighlight: "",
                headingEnd: "",
                description: "",
                image: "",
                patternImage: "",
                buttons: [defaultButton()],
                statsTitle: "",
                stats: [defaultStat()],
            }
        );

    const [submitting, setSubmitting] =
        useState(false);

    // ─────────────────────────────────────

    const set = (
        key: keyof CareerLandingSection,
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
            ).filter((_, idx) => idx !== i)
        );

    const updateButton = (
        i: number,
        key: keyof CareerButton,
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
    // Stats
    // ─────────────────────────────────────

    const addStat = () =>
        set("stats", [
            ...(form.stats || []),
            defaultStat(),
        ]);

    const removeStat = (
        i: number
    ) =>
        set(
            "stats",
            (
                form.stats || []
            ).filter((_, idx) => idx !== i)
        );

    const updateStat = (
        i: number,
        key: keyof CareerStat,
        value: any
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

            {/* Buttons */}

            <Section title="Buttons">
                {(form.buttons || []).map(
                    (btn, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-4 gap-3 border rounded-lg p-3"
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
                                className="p-2 text-red-500"
                            >
                                <Trash2 size={16} />
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

            {/* Stats */}

            <Section title="Stats">
                <input
                    className="input"
                    placeholder="Stats Title"
                    value={form.statsTitle || ""}
                    onChange={(e) =>
                        set(
                            "statsTitle",
                            e.target.value
                        )
                    }
                />

                {(form.stats || []).map(
                    (stat, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-3 gap-3 border rounded-lg p-3"
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
                                className="p-2 text-red-500"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )
                )}

                <button
                    type="button"
                    onClick={addStat}
                    className="flex items-center gap-2 text-blue-600"
                >
                    <Plus size={16} />
                    Add Stat
                </button>
            </Section>

            {/* Submit */}

            <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold"
            >
                {submitting
                    ? "Saving..."
                    : "Save Career Landing"}
            </button>
        </form>
    );
}