"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ContactCTASection, listContactCTAApi, updateContactCTA } from "@/app/api/home/cta";
import ContactCTAForm from "@/app/Components/CtaForm";



export default function EditCTA() {
    const { id } = useParams();
    const router = useRouter();

    const [data, setData] = useState<Partial<ContactCTASection> | null>(null);

    useEffect(() => {
        const load = async () => {
            const res = await listContactCTAApi({});
            const all = Array.isArray(res) ? res : (res as any)?.data || [];
            setData(all.find((i: ContactCTASection) => i._id === id));
        };

        load();
    }, [id]);

    const handleSubmit = async (form: any) => {
        await updateContactCTA({ ...form, _id: id as string });
        router.push("/admin/home/cta-section");
    };

    if (!data) return <p>Loading...</p>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/home/cta-section" className="p-2">
                    <ArrowLeft size={22} />
                </Link>

                <div>
                    <h1 className="text-xl font-bold">Edit CTA</h1>
                </div>
            </div>

            <ContactCTAForm initialData={data} onSubmit={handleSubmit} />
        </div>
    );
}
