"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Plus,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { deleteServicesPage, listServicesPageApi, RootObject } from "@/app/api/service/serviceSecurity";


export default function ServicesPageListPage() {
  const [data, setData] = useState<RootObject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await listServicesPageApi({});

      const arrayData = Array.isArray(res)
        ? res
        : (res as any)?.data || [res];

      setData(
        Array.isArray(arrayData)
          ? arrayData
          : []
      );
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (
    id: string
  ) => {
    if (
      !confirm(
        "Are you sure you want to delete this section?"
      )
    )
      return;

    try {
      await deleteServicesPage(id);
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Services Page
          </h1>

          <p className="text-gray-500">
            Manage services page content
          </p>
        </div>

        <Link
          href="/admin/service/service-security/create"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Add Section
        </Link>
      </div>

      {/* Table */}

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left p-4">
                Heading
              </th>

              <th className="text-left p-4">
                Services
              </th>

              <th className="text-left p-4">
                Description
              </th>

              <th className="text-left p-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">
                    <h3 className="font-semibold">
                      {item.heading}
                    </h3>

                    <p className="text-blue-600 text-sm">
                      {
                        item.headingHighlight
                      }
                    </p>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Eye size={16} />

                      {
                        item.services
                          ?.length
                      }{" "}
                      Services
                    </div>
                  </td>

                  <td className="p-4 max-w-md">
                    <p className="line-clamp-2 text-sm text-gray-600">
                      {item.description}
                    </p>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/service/service-security/edit/${item._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <Edit size={18} />
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            item._id
                          )
                        }
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <Trash2
                          size={18}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="p-10 text-center text-gray-500"
                >
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