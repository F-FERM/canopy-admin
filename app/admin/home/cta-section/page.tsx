"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Plus } from "lucide-react";
import { ContactCTASection, deleteContactCTA, listContactCTAApi } from "@/app/api/home/cta";



export default function CTAList() {
    const [data, setData] = useState<ContactCTASection[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await listContactCTAApi({});
            const arr = Array.isArray(res) ? res : (res as any)?.data || [];
            setData(arr);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this CTA configuration?")) return;
        try {
            await deleteContactCTA(id);
            fetchData();
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete CTA");
        }
    };

    if (loading)
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Contact CTA Sections</h1>
                    <p className="text-gray-500">Manage call-to-action sections for contact pages.</p>
                </div>

                <Link
                    href="/admin/home/cta-section/create"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                    <Plus size={18} />
                    Add Section
                </Link>
            </div>

            <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-4 font-semibold text-gray-700">Heading</th>
                            <th className="p-4 font-semibold text-gray-700 text-center">Buttons</th>
                            <th className="p-4 font-semibold text-gray-700 text-center">Background</th>
                            <th className="p-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <p className="font-medium text-gray-800">{item.heading}</p>
                                        <p className="text-sm text-blue-600 font-medium">{item.headingHighlight}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-xs">{item.badgeText}</p>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {item.buttons?.length || 0} Buttons
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div 
                                                className="w-4 h-4 rounded border shadow-sm" 
                                                style={{ backgroundColor: item.backgroundColor }}
                                            />
                                            <span className="text-xs font-mono text-gray-600 uppercase">{item.backgroundColor}</span>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <Link 
                                                href={`/admin/home/cta-section/edit/${item._id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>

                                            <button 
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <p>No CTA sections found.</p>
                                        <Link href="/admin/home/cta-section/create" className="text-blue-600 hover:underline text-sm font-medium">
                                            Create your first CTA
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}