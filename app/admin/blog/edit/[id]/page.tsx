"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BlogLandingForm from "@/app/Components/BlogLandingForm";
import { listBlogLandingApi, updateBlogLanding } from "@/app/api/blog/landing";

export default function EditBlogLandingPage() {
    const { id } = useParams();
    const router = useRouter();
    const [initialData, setInitialData] = useState<any>();

    useEffect(() => {
        listBlogLandingApi().then((res) => {
            const found = res.find((i: any) => i._id === id);
            setInitialData(found);
        });
    }, [id]);

    return initialData ? (
        <BlogLandingForm
            initialData={initialData}
            onSubmit={async (data) => {
                await updateBlogLanding({ _id: id as string, ...data });
                router.push("/admin/blog");
            }}
        />
    ) : (
        <p>Loading...</p>
    );
}
