"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { createCareerLanding } from "@/app/api/career/landing";
import CareerLandingForm from "@/app/Components/CareerForm";



export default function CreateCareerLandingPage() {
    const router = useRouter();

    const handleSubmit = async (
        data: any
    ) => {
        try {
            await createCareerLanding(data);

            router.push(
                "/admin/career"
            );
        } catch (err) {
            console.error(
                "Create error:",
                err
            );

            alert(
                "Failed to create career landing section"
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/career"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </Link>

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Add Career Landing
                    </h1>

                    <p className="text-gray-500">
                        Create careers landing section.
                    </p>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
                <CareerLandingForm
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
