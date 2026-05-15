"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Plus } from "lucide-react";
import {
    deleteFooterApi,
    Footer,
    listFooterApi,
} from "@/app/api/footer/footer";

export default function FooterListPage() {
    const [data, setData] = useState<Footer[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await listFooterApi({});
            setData(res || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this footer configuration?")) return;
        try {
            await deleteFooterApi(id);
            fetchData();
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete footer");
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
                    <h1 className="text-2xl font-bold text-gray-800">Footer Configurations</h1>
                    <p className="text-gray-500">Manage the global footer content, links, and contact info.</p>
                </div>

                <Link
                    href="/admin/footer/create"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                    <Plus size={18} />
                    Add Footer
                </Link>
            </div>

            <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-4 font-semibold text-gray-700">Company Name</th>
                            <th className="p-4 font-semibold text-gray-700 text-center">Social Links</th>
                            <th className="p-4 font-semibold text-gray-700 text-center">Nav Groups</th>
                            <th className="p-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <p className="font-medium text-gray-800">{item.companyName}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-xs">{item.copyrightText}</p>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {item.socialLinks?.length || 0} Links
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-sm text-gray-600">
                                        {(item.companyLinks?.length || 0) + (item.serviceLinks?.length || 0) + (item.bottomLinks?.length || 0)} Total
                                    </td>

                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <Link 
                                                href={`/admin/footer/edit/${item._id}`}
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
                                        <p>No footer configurations found.</p>
                                        <Link href="/admin/footer/create" className="text-blue-600 hover:underline text-sm font-medium">
                                            Create your first footer
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