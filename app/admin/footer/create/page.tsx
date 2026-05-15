"use client";

import { useRouter } from "next/navigation";
import { createFooterApi } from "@/app/api/footer/footer";
import FooterForm from "@/app/Components/FooterForm";

export default function CreateFooterPage() {
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        await createFooterApi(data);
        router.push("/admin/footer");
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Create Footer</h1>
            <FooterForm onSubmit={handleSubmit} />
        </div>
    );
}
