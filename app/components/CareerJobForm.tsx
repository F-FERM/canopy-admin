"use client";

import { useState } from "react";

import {
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

// ─────────────────────────────────────

interface Requirement {
    text: string;
}

interface Job {
    title: string;
    description: string;
    requirements: Requirement[];
    buttonText: string;
    applyLink: string;
    isActive: boolean;
}

interface CareerOpeningsSection {
    _id?: string;
    badgeText: string;
    heading: string;
    headingHighlight: string;
    headingEnd: string;
    description: string;
    jobs: Job[];
}

type Props = {
    initialData?: Partial<CareerOpeningsSection>;

    onSubmit: (
        data: Partial<CareerOpeningsSection>
    ) => Promise<void>;
};

// ─────────────────────────────────────

const defaultRequirement =
    (): Requirement => ({
        text: "",
    });

const defaultJob = (): Job => ({
    title: "",
    description: "",
    requirements: [
        defaultRequirement(),
    ],
    buttonText: "",
    applyLink: "",
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
                className="w-full flex items-center justify-between px-6 py-4 border-b bg-gray-50 hover:bg-gray-100"
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

export default function CareerOpeningsForm({
    initialData,
    onSubmit,
}: Props) {
    const [form, setForm] =
        useState<
            Partial<CareerOpeningsSection>
        >(
            initialData || {
                badgeText: "",
                heading: "",
                headingHighlight: "",
                headingEnd: "",
                description: "",
                jobs: [defaultJob()],
            }
        );

    const [submitting, setSubmitting] =
        useState(false);

    // ─────────────────────────────────────

    const set = (
        key: keyof CareerOpeningsSection,
        value: any
    ) =>
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));

    // ─────────────────────────────────────
    // Jobs
    // ─────────────────────────────────────

    const addJob = () =>
        set("jobs", [
            ...(form.jobs || []),
            defaultJob(),
        ]);

    const removeJob = (
        i: number
    ) =>
        set(
            "jobs",
            (
                form.jobs || []
            ).filter((_, idx) => idx !== i)
        );

    const updateJob = (
        i: number,
        key: keyof Job,
        value: any
    ) => {
        const updated = (
            form.jobs || []
        ).map((job, idx) =>
            idx === i
                ? {
                    ...job,
                    [key]: value,
                }
                : job
        );

        set("jobs", updated);
    };

    // ─────────────────────────────────────
    // Requirements
    // ─────────────────────────────────────

    const addRequirement = (
        jobIndex: number
    ) => {
        const jobs = [
            ...(form.jobs || []),
        ];

        jobs[jobIndex] = {
            ...jobs[jobIndex],
            requirements: [
                ...jobs[jobIndex]
                    .requirements,
                defaultRequirement(),
            ],
        };

        set("jobs", jobs);
    };

    const updateRequirement = (
        jobIndex: number,
        reqIndex: number,
        value: string
    ) => {
        const jobs = [
            ...(form.jobs || []),
        ];

        jobs[jobIndex].requirements[
            reqIndex
        ] = {
            text: value,
        };

        set("jobs", jobs);
    };

    const removeRequirement = (
        jobIndex: number,
        reqIndex: number
    ) => {
        const jobs = [
            ...(form.jobs || []),
        ];

        jobs[jobIndex].requirements =
            jobs[
                jobIndex
            ].requirements.filter(
                (_, i) => i !== reqIndex
            );

        set("jobs", jobs);
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
            </Section>

            {/* Jobs */}

            <Section
                title={`Jobs (${(form.jobs || []).length})`}
            >
                <div className="space-y-6">
                    {(form.jobs || []).map(
                        (job, ji) => (
                            <div
                                key={ji}
                                className="border rounded-xl overflow-hidden"
                            >
                                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                                    <h4 className="font-medium">
                                        Job {ji + 1}
                                    </h4>

                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    job.isActive
                                                }
                                                onChange={(e) =>
                                                    updateJob(
                                                        ji,
                                                        "isActive",
                                                        e.target
                                                            .checked
                                                    )
                                                }
                                            />

                                            Active
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeJob(ji)
                                            }
                                            className="text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 space-y-4">
                                    <input
                                        className="input"
                                        placeholder="Job Title"
                                        value={job.title}
                                        onChange={(e) =>
                                            updateJob(
                                                ji,
                                                "title",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <textarea
                                        className="input min-h-[100px]"
                                        placeholder="Description"
                                        value={
                                            job.description
                                        }
                                        onChange={(e) =>
                                            updateJob(
                                                ji,
                                                "description",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <input
                                        className="input"
                                        placeholder="Button Text"
                                        value={
                                            job.buttonText
                                        }
                                        onChange={(e) =>
                                            updateJob(
                                                ji,
                                                "buttonText",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <input
                                        className="input"
                                        placeholder="Apply Link"
                                        value={
                                            job.applyLink
                                        }
                                        onChange={(e) =>
                                            updateJob(
                                                ji,
                                                "applyLink",
                                                e.target.value
                                            )
                                        }
                                    />

                                    {/* Requirements */}

                                    <div className="space-y-3">
                                        <h5 className="font-medium text-sm">
                                            Requirements
                                        </h5>

                                        {job.requirements.map(
                                            (req, ri) => (
                                                <div
                                                    key={ri}
                                                    className="flex gap-2"
                                                >
                                                    <input
                                                        className="input flex-1"
                                                        placeholder="Requirement"
                                                        value={req.text}
                                                        onChange={(e) =>
                                                            updateRequirement(
                                                                ji,
                                                                ri,
                                                                e.target
                                                                    .value
                                                            )
                                                        }
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeRequirement(
                                                                ji,
                                                                ri
                                                            )
                                                        }
                                                        className="text-red-500"
                                                    >
                                                        <Trash2
                                                            size={16}
                                                        />
                                                    </button>
                                                </div>
                                            )
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                addRequirement(
                                                    ji
                                                )
                                            }
                                            className="flex items-center gap-2 text-blue-600 text-sm"
                                        >
                                            <Plus size={14} />
                                            Add Requirement
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>

                <button
                    type="button"
                    onClick={addJob}
                    className="flex items-center gap-2 text-blue-600"
                >
                    <Plus size={16} />
                    Add Job
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
                    : "Save Career Openings"}
            </button>
        </form>
    );
}