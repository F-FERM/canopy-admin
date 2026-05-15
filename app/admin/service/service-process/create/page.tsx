"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { createProcessSection } from "@/app/api/service/serviceProcess";
import ProcessSectionForm from "@/app/Components/ServiceForm";


export default function CreateProcessSectionPage() {
    const router = useRouter();

    const handleSubmit = async (
        data: any
    ) => {
        try {
            await createProcessSection(
                data
            );

            router.push(
                "/admin/service/service-process"
            );
        } catch (err) {
            console.error(
                "Create error:",
                err
            );

            alert(
                "Failed to create process section"
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/service/service-process"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </Link>

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Add Process Section
                    </h1>

                    <p className="text-gray-500">
                        Create process section.
                    </p>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
                <ProcessSectionForm
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
