"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { createAboutSection } from "@/app/api/about/abouthero";
import AboutSectionForm from "@/app/Components/AboutHero";


export default function CreateAboutSectionPage() {
  const router = useRouter();

  const handleSubmit = async (
    data: any
  ) => {
    try {
      await createAboutSection(data);

      router.push(
        "/admin/about/hero"
      );
    } catch (err) {
      console.error(
        "Create error:",
        err
      );

      alert(
        "Failed to create About section"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/about/hero"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Add About Section
          </h1>

          <p className="text-gray-500">
            Create about section.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
        <AboutSectionForm
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
