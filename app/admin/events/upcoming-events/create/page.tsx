"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { createUpcomingEvents } from "@/app/api/events/upcoming";
import UpcomingEventsForm from "@/app/Components/UpcomingEventsForm";




export default function CreateUpcomingEventsPage() {
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        try {
            await createUpcomingEvents(data);

            router.push(
                "/admin/events/upcoming-events"
            );
        } catch (err) {
            console.error("Create error:", err);

            alert(
                "Failed to create upcoming events section"
            );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}

            <div className="flex items-center gap-4">
                <Link
                    href="/admin/events/upcoming-events"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </Link>

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Add Upcoming Events
                    </h1>

                    <p className="text-gray-500">
                        Create upcoming events section.
                    </p>
                </div>
            </div>

            {/* Form */}

            <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
                <UpcomingEventsForm
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}