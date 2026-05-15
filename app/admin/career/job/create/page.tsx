"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createCareerOpenings } from "@/app/api/career/job";
import CareerOpeningsForm from "@/app/Components/CareerJobForm";



export default function CreateCareerOpeningsPage() {
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        try {
            await createCareerOpenings(data);

            router.push("/admin/career/job");
        } catch (err) {
            console.error("Create error:", err);

            alert(
                "Failed to create career openings section"
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/career/job"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </Link>

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Add Career Openings
                    </h1>

                    <p className="text-gray-500">
                        Create the careers openings
                        section.
                    </p>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
                <CareerOpeningsForm
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
