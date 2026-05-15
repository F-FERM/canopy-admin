"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { createBlogSection } from "@/app/api/home/HomeBlog";
import BlogSectionForm from "@/app/Components/HomeBlogForm";



export default function CreateBlogSectionPage() {
  const router = useRouter();

  const handleSubmit = async (
    data: any
  ) => {
    try {
      await createBlogSection(data);

      router.push(
        "/admin/home/home-blog"
      );
    } catch (err) {
      console.error(
        "Create error:",
        err
      );

      alert(
        "Failed to create Blog section"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/home/home-blog"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Add Blog Section
          </h1>

          <p className="text-gray-500">
            Create blog section.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
        <BlogSectionForm
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
