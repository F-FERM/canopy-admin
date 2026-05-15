"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    useRouter,
    useParams,
} from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import EventsLandingForm from "@/app/Components/EventLandingForm";
import { EventsLandingSection, listEventsLandingApi, updateEventsLanding } from "@/app/api/events/landing";



export default function EditEventsLandingPage() {
    const router = useRouter();

    const params = useParams();

    const id = params?.id as string;

    const [initialData, setInitialData] =
        useState<
            Partial<EventsLandingSection> | null
        >(null);

    const [loading, setLoading] =
        useState(true);

    // ─────────────────────────────────────

    useEffect(() => {
        const load = async () => {
            try {
                const res =
                    await listEventsLandingApi(
                        {}
                    );

                const all = Array.isArray(res)
                    ? res
                    : (res as any)?.data || [res];

                const found = all.find(
                    (
                        item: EventsLandingSection
                    ) => item._id === id
                );

                setInitialData(found || null);
            } catch (err) {
                console.error(
                    "Load error:",
                    err
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    // ─────────────────────────────────────

    const handleSubmit = async (
        data: any
    ) => {
        try {
            await updateEventsLanding({
                ...data,
                _id: id,
            });

            router.push(
                "/admin/events"
            );
        } catch (err) {
            console.error(
                "Update error:",
                err
            );

            alert(
                "Failed to update events landing section"
            );
        }
    };

    // ─────────────────────────────────────

    if (loading)
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );

    if (!initialData)
        return (
            <div className="p-8 text-center text-gray-500">
                Item not found.{" "}
                <Link
                    href="/admin/events"
                    className="text-blue-600 underline"
                >
                    Go back
                </Link>
            </div>
        );

    // ─────────────────────────────────────

    return (
        <div className="space-y-6">
            {/* Header */}

            <div className="flex items-center gap-4">
                <Link
                    href="/admin/events"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </Link>

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Edit Events Landing
                    </h1>

                    <p className="text-gray-500">
                        Update the events landing
                        section.
                    </p>
                </div>
            </div>

            {/* Form */}

            <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
                <EventsLandingForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
