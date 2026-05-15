"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
    listFooterApi,
    updateFooterApi,
    Footer,
} from "@/app/api/footer/footer";
import FooterForm from "@/app/Components/FooterForm";

export default function EditFooterPage() {
    const { id } = useParams();
    const router = useRouter();

    const [data, setData] = useState<Footer | null>(null);

    useEffect(() => {
        const load = async () => {
            const res = await listFooterApi({});
            const found = res.find((i) => i._id === id);
            setData(found || null);
        };

        load();
    }, [id]);

    const handleSubmit = async (form: any) => {
        await updateFooterApi({ ...form, _id: id as string });
        router.push("/admin/footer");
    };

    if (!data) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Edit Footer</h1>
            <FooterForm initialData={data} onSubmit={handleSubmit} />
        </div>
    );
}
