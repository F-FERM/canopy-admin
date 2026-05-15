"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { createContactLanding } from "@/app/api/contact/ContactLanding";
import ContactLandingForm from "@/app/Components/ContactLandingForm";



export default function CreateContactLandingPage() {
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        try {
            await createContactLanding(data);

            router.push("/admin/contact/contact-landing");
        } catch (err) {
            console.error("Create error:", err);

            alert("Failed to create contact landing section");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}

            <div className="flex items-center gap-4">
                <Link
                    href="/admin/contact/contact-landing"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </Link>

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Add Contact Landing
                    </h1>

                    <p className="text-gray-500">
                        Create contact page landing section.
                    </p>
                </div>
            </div>

            {/* Form */}

            <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
                <ContactLandingForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
}