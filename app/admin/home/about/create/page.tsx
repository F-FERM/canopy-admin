"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createAbout } from "@/app/api/home/homeaboutstat";
import AboutForm from "@/app/components/AboutForm";


export default function CreateAboutPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await createAbout(data);
      router.push("/admin/home/about");
    } catch (err) {
      console.error("Create error:", err);
      alert("Failed to create About section");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/home/about"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add About Section</h1>
          <p className="text-gray-500">Create the about section for the Home page.</p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
        <AboutForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}