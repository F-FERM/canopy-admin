"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import EventsLandingForm from "@/app/Components/EventLandingForm";
import { createEventsLanding } from "@/app/api/events/landing";



export default function CreateEventsLandingPage() {
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        try {
            await createEventsLanding(data);

            router.push("/admin/events");
        } catch (err) {
            console.error("Create error:", err);

            alert(
                "Failed to create events landing section"
            );
        }
    };

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
                        Add Events Landing
                    </h1>

                    <p className="text-gray-500">
                        Create the events landing
                        section.
                    </p>
                </div>
            </div>

            {/* Form */}

            <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
                <EventsLandingForm
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
