"use client";

import { deleteBlogLanding, listBlogLandingApi } from "@/app/api/blog/landing";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BlogLandingListPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await listBlogLandingApi();
            setData(res || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog landing configuration?")) return;
        try {
            await deleteBlogLanding(id);
            fetchData();
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete blog landing");
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
                    <h1 className="text-2xl font-bold text-gray-800">Blog Landing Configuration</h1>
                    <p className="text-gray-500">Manage the hero section and content for the Blog page.</p>
                </div>

                <Link
                    href="/admin/blog/create"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                    <Plus size={18} />
                    Add Configuration
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
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {item.buttons?.length || 0} Buttons
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {item.backgroundImage ? (
                                            <div className="flex justify-center">
                                                <div className="w-10 h-10 rounded border overflow-hidden bg-gray-100">
                                                    <img src={item.backgroundImage} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center text-gray-400">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/blog/edit/${item._id}`}
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
                                        <p>No blog landing configurations found.</p>
                                        <Link href="/admin/blog/create" className="text-blue-600 hover:underline text-sm font-medium">
                                            Create your first configuration
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