"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";

import ImageUpload from "./ImageUpload";

type Social = { platform: string; icon: string; link: string };
type LinkItem = { label: string; link: string };

interface FooterFormData {
    logo: string;
    companyName: string;
    description: string;

    socialLinks: Social[];
    companyLinks: LinkItem[];
    serviceLinks: LinkItem[];
    bottomLinks: LinkItem[];

    contactInfo: {
        phone: string;
        email: string;
        address: string;
    };

    copyrightText: string;
}

type Props = {
    initialData?: Partial<FooterFormData>;
    onSubmit: (data: Partial<FooterFormData>) => Promise<void>;
};

const defaultSocial = (): Social => ({
    platform: "",
    icon: "",
    link: "",
});

const defaultLink = (): LinkItem => ({
    label: "",
    link: "",
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

export default function FooterForm({ initialData, onSubmit }: Props) {
    const [form, setForm] = useState<Partial<FooterFormData>>(
        initialData || {
            logo: "",
            companyName: "",
            description: "",
            socialLinks: [defaultSocial()],
            companyLinks: [defaultLink()],
            serviceLinks: [defaultLink()],
            bottomLinks: [defaultLink()],
            contactInfo: {
                phone: "",
                email: "",
                address: "",
            },
            copyrightText: "",
        }
    );

    const [submitting, setSubmitting] = useState(false);

    const set = (key: keyof FooterFormData, value: any) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    /* ---------- Social ---------- */
    const addSocial = () =>
        set("socialLinks", [...(form.socialLinks || []), defaultSocial()]);

    const updateSocial = (i: number, key: keyof Social, value: any) => {
        const updated = (form.socialLinks || []).map((s, idx) =>
            idx === i ? { ...s, [key]: value } : s
        );
        set("socialLinks", updated);
    };

    const removeSocial = (i: number) =>
        set("socialLinks", form.socialLinks?.filter((_, idx) => idx !== i));

    /* ---------- Links ---------- */
    const updateLink = (
        group: "companyLinks" | "serviceLinks" | "bottomLinks",
        i: number,
        key: keyof LinkItem,
        value: any
    ) => {
        const updated = (form[group] || []).map((l, idx) =>
            idx === i ? { ...l, [key]: value } : l
        );
        set(group, updated);
    };

    const addLink = (group: keyof FooterFormData) => {
        set(group, [...((form as any)[group] || []), defaultLink()]);
    };

    const removeLink = (group: keyof FooterFormData, i: number) => {
        set(
            group,
            (form as any)[group]?.filter((_: any, idx: number) => idx !== i)
        );
    };

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

            {/* ---------- BASIC ---------- */}
            <Section title="Basic Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <input
                                className="input"
                                placeholder="e.g. Canopy"
                                value={form.companyName || ""}
                                onChange={(e) => set("companyName", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                className="input min-h-[100px]"
                                placeholder="Brief company description..."
                                value={form.description || ""}
                                onChange={(e) => set("description", e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <ImageUpload
                            label="Logo"
                            value={form.logo || ""}
                            onChange={(url) => set("logo", url)}
                        />
                    </div>
                </div>
            </Section>

            {/* ---------- CONTACT ---------- */}
            <Section title="Contact Information">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            className="input"
                            placeholder="+1 (234) 567-890"
                            value={form.contactInfo?.phone || ""}
                            onChange={(e) =>
                                set("contactInfo", { ...form.contactInfo, phone: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            className="input"
                            placeholder="contact@company.com"
                            value={form.contactInfo?.email || ""}
                            onChange={(e) =>
                                set("contactInfo", { ...form.contactInfo, email: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                            className="input"
                            placeholder="123 Street Name, City"
                            value={form.contactInfo?.address || ""}
                            onChange={(e) =>
                                set("contactInfo", { ...form.contactInfo, address: e.target.value })
                            }
                        />
                    </div>
                </div>
            </Section>

            {/* ---------- SOCIAL ---------- */}
            <Section title={`Social Links (${(form.socialLinks || []).length})`}>
                <div className="space-y-3">
                    {form.socialLinks?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
                            <div className="flex items-center">
                                <GripVertical size={16} className="text-gray-400" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                                <input
                                    className="input"
                                    placeholder="Platform (e.g. LinkedIn)"
                                    value={item.platform}
                                    onChange={(e) =>
                                        updateSocial(i, "platform", e.target.value)
                                    }
                                />
                                <input
                                    className="input"
                                    placeholder="Icon (e.g. linkedin)"
                                    value={item.icon}
                                    onChange={(e) =>
                                        updateSocial(i, "icon", e.target.value)
                                    }
                                />
                                <input
                                    className="input"
                                    placeholder="Link (URL)"
                                    value={item.link}
                                    onChange={(e) =>
                                        updateSocial(i, "link", e.target.value)
                                    }
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeSocial(i)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addSocial}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-1"
                >
                    <Plus size={16} /> Add Social Link
                </button>
            </Section>

            {/* ---------- LINK GROUPS ---------- */}
            {[
                { id: "companyLinks", label: "Company Links" },
                { id: "serviceLinks", label: "Service Links" },
                { id: "bottomLinks", label: "Bottom Links" },
            ].map((group) => (
                <Section key={group.id} title={`${group.label} (${((form as any)[group.id] || []).length})`}>
                    <div className="space-y-3">
                        {((form as any)[group.id] || []).map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
                                <div className="flex items-center">
                                    <GripVertical size={16} className="text-gray-400" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                                    <input
                                        className="input"
                                        placeholder="Label"
                                        value={item.label}
                                        onChange={(e) =>
                                            updateLink(group.id as any, i, "label", e.target.value)
                                        }
                                    />
                                    <input
                                        className="input"
                                        placeholder="Link"
                                        value={item.link}
                                        onChange={(e) =>
                                            updateLink(group.id as any, i, "link", e.target.value)
                                        }
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeLink(group.id as any, i)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => addLink(group.id as any)}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-1"
                    >
                        <Plus size={16} /> Add Link
                    </button>
                </Section>
            ))}

            {/* ---------- COPYRIGHT ---------- */}
            <Section title="Copyright">
                <input
                    className="input"
                    placeholder="e.g. © 2024 Canopy. All rights reserved."
                    value={form.copyrightText || ""}
                    onChange={(e) => set("copyrightText", e.target.value)}
                />
            </Section>

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
                    "Save Footer Configuration"
                )}
            </button>
        </form>
    );
}