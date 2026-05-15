"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Edit, Trash2, Plus } from "lucide-react";
import { AboutSection, deleteAboutApi, listAboutApi } from "@/app/api/home/homeaboutstat";

export default function AboutListPage() {
  const [data, setData] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await listAboutApi({});

      const arr = Array.isArray(res)
        ? res
        : (res as any)?.data || [];

      setData(arr);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this About section?")) return;

    await deleteAboutApi(id);
    fetchData();
  };

  if (loading)
    return <div className="p-10">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">About CMS</h1>
          <p className="text-gray-500">
            Manage About section content
          </p>
        </div>

        <Link
          href="/admin/home/about/create"
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} /> Create
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Heading</th>
              <th className="p-3 text-left">Highlights</th>
              <th className="p-3 text-left">Stats</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-3 font-medium">
                  {item.heading}
                </td>

                <td className="p-3 text-blue-600">
                  {item.headingHighlight}
                </td>

                <td className="p-3">
                  {item.stats?.length} items
                </td>

                <td className="p-3 flex gap-3">
                  <Link
                    href={`/admin/home/about/edit/${item._id}`}
                    className="text-blue-600"
                  >
                    <Edit size={18} />
                  </Link>

                  <button
                    onClick={() => handleDelete(item._id!)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={4}>
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}