"use client";

import { useRouter } from "next/navigation";
import BlogLandingForm from "@/app/Components/BlogLandingForm";
import { createBlogLanding } from "@/app/api/blog/landing";

export default function CreateBlogLandingPage() {
    const router = useRouter();

    return (
        <BlogLandingForm
            onSubmit={async (data) => {
                await createBlogLanding(data);
                router.push("/admin/blog");
            }}
        />
    );
}
