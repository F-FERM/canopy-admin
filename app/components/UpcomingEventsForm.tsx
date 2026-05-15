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

interface EventButton {
    label: string;
    link: string;
}

interface UpcomingEvent {
    title: string;
    date: string;
    location: string;
    description: string;
    image: string;
    button: EventButton;
    isActive: boolean;
}

interface WhyAttendCard {
    title: string;
    description: string;
    isActive: boolean;
}

interface UpcomingEventsSection {
    _id?: string;

    upcomingHeading: string;
    upcomingHeadingHighlight: string;

    events: UpcomingEvent[];

    whyBadgeText: string;
    whyHeading: string;
    whyHeadingHighlight: string;

    whyAttendCards: WhyAttendCard[];
}

type Props = {
    initialData?: Partial<UpcomingEventsSection>;

    onSubmit: (
        data: Partial<UpcomingEventsSection>
    ) => Promise<void>;
};

// ─────────────────────────────────────

const defaultEvent =
    (): UpcomingEvent => ({
        title: "",
        date: "",
        location: "",
        description: "",
        image: "",
        button: {
            label: "",
            link: "",
        },
        isActive: true,
    });

const defaultCard =
    (): WhyAttendCard => ({
        title: "",
        description: "",
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

export default function UpcomingEventsForm({
    initialData,
    onSubmit,
}: Props) {
    const [form, setForm] =
        useState<
            Partial<UpcomingEventsSection>
        >(
            initialData || {
                upcomingHeading: "",
                upcomingHeadingHighlight:
                    "",

                events: [defaultEvent()],

                whyBadgeText: "",
                whyHeading: "",
                whyHeadingHighlight: "",

                whyAttendCards: [
                    defaultCard(),
                ],
            }
        );

    const [submitting, setSubmitting] =
        useState(false);

    // ─────────────────────────────────────

    const set = (
        key: keyof UpcomingEventsSection,
        value: any
    ) =>
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));

    // ─────────────────────────────────────
    // Events
    // ─────────────────────────────────────

    const addEvent = () =>
        set("events", [
            ...(form.events || []),
            defaultEvent(),
        ]);

    const removeEvent = (i: number) =>
        set(
            "events",
            (form.events || []).filter(
                (_, idx) => idx !== i
            )
        );

    const updateEvent = (
        i: number,
        key: keyof UpcomingEvent,
        value: any
    ) => {
        const updated = (
            form.events || []
        ).map((item, idx) =>
            idx === i
                ? { ...item, [key]: value }
                : item
        );

        set("events", updated);
    };

    // ─────────────────────────────────────
    // Cards
    // ─────────────────────────────────────

    const addCard = () =>
        set("whyAttendCards", [
            ...(form.whyAttendCards || []),
            defaultCard(),
        ]);

    const removeCard = (i: number) =>
        set(
            "whyAttendCards",
            (
                form.whyAttendCards || []
            ).filter(
                (_, idx) => idx !== i
            )
        );

    const updateCard = (
        i: number,
        key: keyof WhyAttendCard,
        value: any
    ) => {
        const updated = (
            form.whyAttendCards || []
        ).map((item, idx) =>
            idx === i
                ? { ...item, [key]: value }
                : item
        );

        set("whyAttendCards", updated);
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
            {/* Upcoming Heading */}

            <Section title="Upcoming Events Heading">
                <input
                    className="input"
                    placeholder="Heading"
                    value={
                        form.upcomingHeading || ""
                    }
                    onChange={(e) =>
                        set(
                            "upcomingHeading",
                            e.target.value
                        )
                    }
                />

                <input
                    className="input"
                    placeholder="Heading Highlight"
                    value={
                        form.upcomingHeadingHighlight ||
                        ""
                    }
                    onChange={(e) =>
                        set(
                            "upcomingHeadingHighlight",
                            e.target.value
                        )
                    }
                />
            </Section>

            {/* Events */}

            <Section
                title={`Events (${(form.events || []).length})`}
            >
                <div className="space-y-5">
                    {(form.events || []).map(
                        (event, i) => (
                            <div
                                key={i}
                                className="border rounded-xl p-4 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">
                                        Event {i + 1}
                                    </h4>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeEvent(i)
                                        }
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                    >
                                        <Trash2
                                            size={16}
                                        />
                                    </button>
                                </div>

                                <input
                                    className="input"
                                    placeholder="Title"
                                    value={event.title}
                                    onChange={(e) =>
                                        updateEvent(
                                            i,
                                            "title",
                                            e.target.value
                                        )
                                    }
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        className="input"
                                        placeholder="Date"
                                        value={event.date}
                                        onChange={(e) =>
                                            updateEvent(
                                                i,
                                                "date",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <input
                                        className="input"
                                        placeholder="Location"
                                        value={
                                            event.location
                                        }
                                        onChange={(e) =>
                                            updateEvent(
                                                i,
                                                "location",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                <textarea
                                    className="input min-h-[100px]"
                                    placeholder="Description"
                                    value={
                                        event.description
                                    }
                                    onChange={(e) =>
                                        updateEvent(
                                            i,
                                            "description",
                                            e.target.value
                                        )
                                    }
                                />

                                <ImageUpload
                                    label="Event Image"
                                    value={event.image}
                                    onChange={(
                                        url: string
                                    ) =>
                                        updateEvent(
                                            i,
                                            "image",
                                            url
                                        )
                                    }
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        className="input"
                                        placeholder="Button Label"
                                        value={
                                            event.button
                                                ?.label || ""
                                        }
                                        onChange={(e) =>
                                            updateEvent(
                                                i,
                                                "button",
                                                {
                                                    ...event.button,
                                                    label:
                                                        e.target
                                                            .value,
                                                }
                                            )
                                        }
                                    />

                                    <input
                                        className="input"
                                        placeholder="Button Link"
                                        value={
                                            event.button
                                                ?.link || ""
                                        }
                                        onChange={(e) =>
                                            updateEvent(
                                                i,
                                                "button",
                                                {
                                                    ...event.button,
                                                    link: e
                                                        .target
                                                        .value,
                                                }
                                            )
                                        }
                                    />
                                </div>

                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={
                                            event.isActive
                                        }
                                        onChange={(e) =>
                                            updateEvent(
                                                i,
                                                "isActive",
                                                e.target
                                                    .checked
                                            )
                                        }
                                    />
                                    Active
                                </label>
                            </div>
                        )
                    )}
                </div>

                <button
                    type="button"
                    onClick={addEvent}
                    className="flex items-center gap-2 text-blue-600 font-medium"
                >
                    <Plus size={16} />
                    Add Event
                </button>
            </Section>

            {/* Why Attend */}

            <Section title="Why Attend Section">
                <input
                    className="input"
                    placeholder="Badge Text"
                    value={
                        form.whyBadgeText || ""
                    }
                    onChange={(e) =>
                        set(
                            "whyBadgeText",
                            e.target.value
                        )
                    }
                />

                <input
                    className="input"
                    placeholder="Heading"
                    value={form.whyHeading || ""}
                    onChange={(e) =>
                        set(
                            "whyHeading",
                            e.target.value
                        )
                    }
                />

                <input
                    className="input"
                    placeholder="Heading Highlight"
                    value={
                        form.whyHeadingHighlight ||
                        ""
                    }
                    onChange={(e) =>
                        set(
                            "whyHeadingHighlight",
                            e.target.value
                        )
                    }
                />
            </Section>

            {/* Why Attend Cards */}

            <Section
                title={`Why Attend Cards (${(form.whyAttendCards || []).length})`}
            >
                <div className="space-y-4">
                    {(
                        form.whyAttendCards || []
                    ).map((card, i) => (
                        <div
                            key={i}
                            className="border rounded-xl p-4 space-y-3"
                        >
                            <div className="flex justify-between">
                                <h4 className="font-medium">
                                    Card {i + 1}
                                </h4>

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeCard(i)
                                    }
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                >
                                    <Trash2
                                        size={16}
                                    />
                                </button>
                            </div>

                            <input
                                className="input"
                                placeholder="Title"
                                value={card.title}
                                onChange={(e) =>
                                    updateCard(
                                        i,
                                        "title",
                                        e.target.value
                                    )
                                }
                            />

                            <textarea
                                className="input min-h-[90px]"
                                placeholder="Description"
                                value={
                                    card.description
                                }
                                onChange={(e) =>
                                    updateCard(
                                        i,
                                        "description",
                                        e.target.value
                                    )
                                }
                            />

                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={
                                        card.isActive
                                    }
                                    onChange={(e) =>
                                        updateCard(
                                            i,
                                            "isActive",
                                            e.target
                                                .checked
                                        )
                                    }
                                />
                                Active
                            </label>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={addCard}
                    className="flex items-center gap-2 text-blue-600 font-medium"
                >
                    <Plus size={16} />
                    Add Card
                </button>
            </Section>

            {/* Submit */}

            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
            >
                {submitting
                    ? "Saving..."
                    : "Save Upcoming Events"}
            </button>
        </form>
    );
}