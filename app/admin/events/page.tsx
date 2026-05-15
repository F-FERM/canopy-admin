"use client";

import {
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import {
    Plus,
    Edit,
    Trash2,
    ImageIcon,
} from "lucide-react";
import { deleteEventsLanding, EventsLandingSection, listEventsLandingApi } from "@/app/api/events/landing";



export default function EventsLandingPage() {
    const [data, setData] = useState<
        EventsLandingSection[]
    >([]);

    const [loading, setLoading] =
        useState(true);

    // ─────────────────────────────────────

    const fetchData = async () => {
        try {
            const res =
                await listEventsLandingApi(
                    {}
                );

            const arrayData =
                Array.isArray(res)
                    ? res
                    : (res as any)?.data || [res];

            setData(
                Array.isArray(arrayData)
                    ? arrayData
                    : []
            );
        } catch (err) {
            console.error(
                "Fetch error:",
                err
            );

            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ─────────────────────────────────────

    const handleDelete = async (
        id: string
    ) => {
        if (
            !confirm(
                "Are you sure you want to delete this events section?"
            )
        )
            return;

        try {
            await deleteEventsLanding(id);

            fetchData();
        } catch (err) {
            console.error(
                "Delete error:",
                err
            );

            alert("Failed to delete item");
        }
    };

    // ─────────────────────────────────────

    if (loading)
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );

    return (
        <div className="space-y-6">
            {/* Header */}

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Events Landing
                    </h1>

                    <p className="text-gray-500">
                        Manage events landing section.
                    </p>
                </div>

                <Link
                    href="/admin/events/create"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={18} />
                    Add Section
                </Link>
            </div>

            {/* Table */}

            <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-4 font-semibold">
                                Heading
                            </th>

                            <th className="p-4 font-semibold">
                                Badge
                            </th>

                            <th className="p-4 font-semibold">
                                Images
                            </th>

                            <th className="p-4 font-semibold">
                                Featured Event
                            </th>

                            <th className="p-4 font-semibold">
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
                                    {/* Heading */}

                                    <td className="p-4">
                                        <p className="font-medium text-gray-800">
                                            {item.heading}
                                        </p>

                                        <p className="text-sm text-blue-600">
                                            {
                                                item.headingHighlight
                                            }
                                        </p>
                                    </td>

                                    {/* Badge */}

                                    <td className="p-4 text-gray-600">
                                        {item.badgeText ||
                                            "—"}
                                    </td>

                                    {/* Images */}

                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                                            <ImageIcon
                                                size={15}
                                            />

                                            {item.images?.length ??
                                                0}{" "}
                                            Images
                                        </span>
                                    </td>

                                    {/* Featured Event */}

                                    <td className="p-4">
                                        <p className="text-sm font-medium text-gray-700">
                                            {
                                                item
                                                    .featuredEvent
                                                    ?.title
                                            }
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {
                                                item
                                                    .featuredEvent
                                                    ?.date
                                            }
                                        </p>
                                    </td>

                                    {/* Actions */}

                                    <td className="p-4">
                                        <div className="flex gap-3">
                                            <Link
                                                href={`/admin/events/edit/${item._id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                                            >
                                                <Edit
                                                    size={18}
                                                />
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
                                    colSpan={5}
                                    className="p-8 text-center text-gray-500"
                                >
                                    No events sections found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}