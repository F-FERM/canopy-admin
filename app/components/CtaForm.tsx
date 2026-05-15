"use client";

import { useState } from "react";

import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";

// ─────────────────────────────────────

interface CTAButton {
    label: string;
    link: string;
    variant: "primary" | "outline";
    icon: string;
}

interface ContactCTASection {
    _id?: string;

    badgeText: string;

    heading: string;

    headingHighlight: string;

    description: string;

    buttons: CTAButton[];

    backgroundColor: string;
}

type Props = {
    initialData?: Partial<ContactCTASection>;
    onSubmit: (data: Partial<ContactCTASection>) => Promise<void>;
};

// ─────────────────────────────────────

const defaultButton = (): CTAButton => ({
    label: "",
    link: "",
    variant: "primary",
    icon: "",
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

// ─────────────────────────────────────

export default function ContactCTAForm({
    initialData,
    onSubmit,
}: Props) {
    const [form, setForm] = useState<Partial<ContactCTASection>>(
        initialData || {
            badgeText: "",
            heading: "",
            headingHighlight: "",
            description: "",
            buttons: [defaultButton()],
            backgroundColor: "#7A0019",
        }
    );

    const [submitting, setSubmitting] = useState(false);

    const set = (key: keyof ContactCTASection, value: any) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    // ─────────────────────────────────────
    // Buttons
    // ─────────────────────────────────────

    const addButton = () =>
        set("buttons", [...(form.buttons || []), defaultButton()]);

    const removeButton = (i: number) =>
        set(
            "buttons",
            (form.buttons || []).filter((_, idx) => idx !== i)
        );

    const updateButton = (i: number, key: keyof CTAButton, value: any) => {
        const updated = (form.buttons || []).map((b, idx) =>
            idx === i ? { ...b, [key]: value } : b
        );
        set("buttons", updated);
    };

    // ─────────────────────────────────────

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

    // ─────────────────────────────────────

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            {/* Basic Fields */}
            <Section title="Basic Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                        <input
                            className="input"
                            placeholder="e.g. READY TO START?"
                            value={form.badgeText || ""}
                            onChange={(e) => set("badgeText", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={form.backgroundColor || "#7A0019"}
                                onChange={(e) => set("backgroundColor", e.target.value)}
                                className="w-12 h-10 border rounded cursor-pointer"
                            />
                            <input
                                className="input flex-1"
                                placeholder="#7A0019"
                                value={form.backgroundColor || ""}
                                onChange={(e) => set("backgroundColor", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                            <input
                                className="input"
                                placeholder="Main heading text"
                                value={form.heading || ""}
                                onChange={(e) => set("heading", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Heading Highlight</label>
                            <input
                                className="input"
                                placeholder="Highlighted part of heading"
                                value={form.headingHighlight || ""}
                                onChange={(e) => set("headingHighlight", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="input min-h-[100px]"
                            placeholder="Brief description for the CTA section..."
                            value={form.description || ""}
                            onChange={(e) => set("description", e.target.value)}
                        />
                    </div>
                </div>
            </Section>

            {/* Buttons */}
            <Section title={`Buttons (${(form.buttons || []).length})`}>
                <div className="space-y-4">
                    {(form.buttons || []).map((btn, i) => (
                        <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border">
                            <div className="flex items-center">
                                <GripVertical size={16} className="text-gray-400" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                                    <input
                                        className="input"
                                        placeholder="Button Label"
                                        value={btn.label}
                                        onChange={(e) => updateButton(i, "label", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
                                    <input
                                        className="input"
                                        placeholder="/contact"
                                        value={btn.link}
                                        onChange={(e) => updateButton(i, "link", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Icon (optional)</label>
                                    <input
                                        className="input"
                                        placeholder="icon-name"
                                        value={btn.icon}
                                        onChange={(e) => updateButton(i, "icon", e.target.value)}
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
                                className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors self-end md:self-center"
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
                    "Save CTA Section"
                )}
            </button>
        </form>
    );
}