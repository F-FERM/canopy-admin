"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Layers } from "lucide-react";
import { deleteHomeHero, HomeHeroSection, listHomeHeroApi } from "@/app/api/home/home";

export default function HomeHeroPage() {
  const [data, setData] = useState<HomeHeroSection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await listHomeHeroApi({});
      const arrayData = Array.isArray(res) ? res : (res as any)?.data || [res];
      setData(Array.isArray(arrayData) ? arrayData : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Home Hero section?")) return;
    try {
      await deleteHomeHero(id);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete item");
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
          <h1 className="text-2xl font-bold text-gray-800">Home Hero Section</h1>
          <p className="text-gray-500">Manage the hero section of the Home page.</p>
        </div>
        <Link
          href="/admin/home/hero/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add Hero Section
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-700">Heading</th>
              <th className="p-4 font-semibold text-gray-700">Badge</th>
              <th className="p-4 font-semibold text-gray-700">Slides</th>
              <th className="p-4 font-semibold text-gray-700">Accent</th>
              <th className="p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-gray-800">{item.heading}</p>
                    {item.headingHighlight && (
                      <p className="text-sm text-blue-600">{item.headingHighlight}</p>
                    )}
                  </td>
                  <td className="p-4 text-gray-600 text-sm">{item.badgeText || "—"}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                      <Layers size={14} />
                      {item.slides?.length ?? 0} slide{item.slides?.length !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="p-4">
                    {item.accentColor ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-5 h-5 rounded-full border"
                          style={{ backgroundColor: item.accentColor }}
                        />
                        <span className="text-xs text-gray-500">{item.accentColor}</span>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/home/hero/edit/${item._id}`}
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
                <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                  No Home Hero sections found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}