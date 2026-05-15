"use client";

import { useState } from "react";

import {
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

// ─────────────────────────────────────

interface ProcessItem {
    title: string;
    description: string;
    isActive: boolean;
}

interface ProcessSection {
    _id?: string;
    badgeText: string;
    heading: string;
    headingHighlight: string;
    processes: ProcessItem[];
}

type Props = {
    initialData?: Partial<ProcessSection>;

    onSubmit: (
        data: Partial<ProcessSection>
    ) => Promise<void>;
};

// ─────────────────────────────────────

const defaultProcess = (): ProcessItem => ({
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

export default function ProcessSectionForm({
    initialData,
    onSubmit,
}: Props) {
    const [form, setForm] =
        useState<Partial<ProcessSection>>(
            initialData || {
                badgeText: "",
                heading: "",
                headingHighlight: "",
                processes: [defaultProcess()],
            }
        );

    const [submitting, setSubmitting] =
        useState(false);

    // ─────────────────────────────────────

    const set = (
        key: keyof ProcessSection,
        value: any
    ) =>
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));

    // ─────────────────────────────────────

    const addProcess = () =>
        set("processes", [
            ...(form.processes || []),
            defaultProcess(),
        ]);

    const removeProcess = (
        i: number
    ) =>
        set(
            "processes",
            (
                form.processes || []
            ).filter((_, idx) => idx !== i)
        );

    const updateProcess = (
        i: number,
        key: keyof ProcessItem,
        value: any
    ) => {
        const updated = (
            form.processes || []
        ).map((item, idx) =>
            idx === i
                ? {
                    ...item,
                    [key]: value,
                }
                : item
        );

        set("processes", updated);
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
            {/* Header */}

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

            {/* Processes */}

            <Section
                title={`Processes (${(form.processes || []).length})`}
            >
                <div className="space-y-6">
                    {(form.processes || []).map(
                        (process, i) => (
                            <div
                                key={i}
                                className="border rounded-xl overflow-hidden"
                            >
                                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                                    <h4 className="font-medium text-gray-700">
                                        Process {i + 1}
                                    </h4>

                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-2 text-sm text-gray-600">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    process.isActive
                                                }
                                                onChange={(e) =>
                                                    updateProcess(
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
                                                removeProcess(i)
                                            }
                                            disabled={
                                                (
                                                    form.processes ||
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
                                        placeholder="Process Title"
                                        value={process.title}
                                        onChange={(e) =>
                                            updateProcess(
                                                i,
                                                "title",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <textarea
                                        className="input min-h-[100px]"
                                        placeholder="Process Description"
                                        value={
                                            process.description
                                        }
                                        onChange={(e) =>
                                            updateProcess(
                                                i,
                                                "description",
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
                    onClick={addProcess}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    <Plus size={16} />
                    Add Process
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
                    "Save Process Section"
                )}
            </button>
        </form>
    );
}