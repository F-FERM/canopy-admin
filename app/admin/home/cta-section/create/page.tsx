"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createContactCTA } from "@/app/api/home/cta";
import ContactCTAForm from "@/app/Components/CtaForm";



export default function CreateCTA() {
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        try {
            await createContactCTA(data);
            router.push("/admin/home/cta-section");
        } catch (err) {
            alert("Failed to create CTA");
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/home/cta-section" className="p-2">
                    <ArrowLeft size={22} />
                </Link>

                <div>
                    <h1 className="text-xl font-bold">Add CTA</h1>
                    <p className="text-gray-500">Create contact CTA section</p>
                </div>
            </div>

            <ContactCTAForm onSubmit={handleSubmit} />
        </div>
    );
}
