"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface Button {
    label: string;
    link: string;
    variant: "primary" | "outline";
}

interface BlogLanding {
    badgeText: string;
    heading: string;
    headingHighlight: string;
    description: string;
    backgroundImage: string;
    buttons: Button[];
}

type Props = {
    initialData?: Partial<BlogLanding>;
    onSubmit: (data: Partial<BlogLanding>) => Promise<void>;
};

const defaultButton = (): Button => ({
    label: "",
    link: "",
    variant: "primary",
});

// ─── Collapsible Section ───────────────────────────────────────────────────────

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
                <h3 className="text-base font-semibold text-gray-800">{title}</h3>
                {open ? (
                    <ChevronUp size={18} className="text-gray-500" />
                ) : (
                    <ChevronDown size={18} className="text-gray-500" />
                )}
            </button>
            {open && <div className="p-6 space-y-4">{children}</div>}
        </div>
    );
}

export default function BlogLandingForm({ initialData, onSubmit }: Props) {
    const [form, setForm] = useState<Partial<BlogLanding>>(
        initialData || {
            badgeText: "",
            heading: "",
            headingHighlight: "",
            description: "",
            backgroundImage: "",
            buttons: [defaultButton()],
        }
    );

    const [submitting, setSubmitting] = useState(false);

    const set = (key: keyof BlogLanding, value: any) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    /* ---------------- BUTTONS ---------------- */
    const addButton = () =>
        set("buttons", [...(form.buttons || []), defaultButton()]);

    const updateButton = (i: number, key: keyof Button, value: any) => {
        const updated = (form.buttons || []).map((b, idx) =>
            idx === i ? { ...b, [key]: value } : b
        );
        set("buttons", updated);
    };

    const removeButton = (i: number) =>
        set("buttons", form.buttons?.filter((_, idx) => idx !== i));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { _id, createdAt, updatedAt, __v, ...payload } = form as any;
            await onSubmit(payload);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">

            {/* ---------- HERO CONTENT ---------- */}
            <Section title="Hero Content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                        <input
                            className="input"
                            placeholder="e.g. OUR BLOG"
                            value={form.badgeText || ""}
                            onChange={(e) => set("badgeText", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Heading</label>
                        <input
                            className="input"
                            placeholder="e.g. Insights &"
                            value={form.heading || ""}
                            onChange={(e) => set("heading", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Heading Highlight</label>
                        <input
                            className="input"
                            placeholder="e.g. Updates"
                            value={form.headingHighlight || ""}
                            onChange={(e) => set("headingHighlight", e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="input min-h-[100px]"
                            placeholder="Brief description for the blog section..."
                            value={form.description || ""}
                            onChange={(e) => set("description", e.target.value)}
                        />
                    </div>
                </div>
            </Section>

            {/* ---------- BACKGROUND ---------- */}
            <Section title="Background Image">
                <ImageUpload
                    label="Hero Background"
                    value={form.backgroundImage || ""}
                    onChange={(url) => set("backgroundImage", url)}
                />
            </Section>

            {/* ---------- BUTTONS ---------- */}
            <Section title={`Buttons (${(form.buttons || []).length})`}>
                <div className="space-y-4">
                    {form.buttons?.map((btn, i) => (
                        <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border">
                            <div className="flex items-center">
                                <GripVertical size={16} className="text-gray-400" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                                    <input
                                        className="input"
                                        placeholder="Button Label"
                                        value={btn.label}
                                        onChange={(e) =>
                                            updateButton(i, "label", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
                                    <input
                                        className="input"
                                        placeholder="/blog"
                                        value={btn.link}
                                        onChange={(e) =>
                                            updateButton(i, "link", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Variant</label>
                                    <select
                                        className="input"
                                        value={btn.variant}
                                        onChange={(e) =>
                                            updateButton(i, "variant", e.target.value as any)
                                        }
                                    >
                                        <option value="primary">Primary</option>
                                        <option value="outline">Outline</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeButton(i)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addButton}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-1"
                >
                    <Plus size={16} /> Add Button
                </button>
            </Section>

            {/* ---------- SUBMIT ---------- */}
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
                    "Save Blog Landing Configuration"
                )}
            </button>
        </form>
    );
}