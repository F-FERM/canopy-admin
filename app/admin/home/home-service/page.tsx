"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Plus,
  Edit,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { deleteSecurityServices, listSecurityServicesApi, SecurityServicesSection } from "@/app/api/home/homeservice";

export default function SecurityServicesPage() {
  const [data, setData] = useState<SecurityServicesSection[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await listSecurityServicesApi({});

      const arrayData = Array.isArray(res)
        ? res
        : (res as any)?.data || [res];

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
    if (!confirm("Are you sure you want to delete this section?"))
      return;

    try {
      await deleteSecurityServices(id);

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
          <h1 className="text-2xl font-bold text-gray-800">
            Security Services
          </h1>

          <p className="text-gray-500">
            Manage Home Security Services section.
          </p>
        </div>

        <Link
          href="/admin/home/home-service/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add Section
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-700">
                Heading
              </th>

              <th className="p-4 font-semibold text-gray-700">
                Description
              </th>

              <th className="p-4 font-semibold text-gray-700">
                Services
              </th>

              <th className="p-4 font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <p className="font-medium text-gray-800">
                      {item.heading}
                    </p>

                    <p className="text-sm text-blue-600">
                      {item.headingHighlight}
                    </p>
                  </td>

                  <td className="p-4 text-sm text-gray-600 max-w-md">
                    {item.description}
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                      <ShieldCheck size={14} />

                      {item.services?.length ?? 0} service
                      {item.services?.length !== 1 ? "s" : ""}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/home/home-service/edit/${item._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit size={18} />
                      </Link>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-gray-500 italic"
                >
                  No Security Services found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}