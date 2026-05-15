"use client";

import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import HomeHeroForm from "@/app/Components/HomeHerForm";
import { createHomeHero } from "@/app/api/home/home";

export default function CreateHomeHeroPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await createHomeHero(data);
      router.push("/admin/home/hero");
    } catch (err) {
      console.error("Create error:", err);
      alert("Failed to create Home Hero section");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/home/hero"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add Home Hero Section</h1>
          <p className="text-gray-500">Create the hero section for the Home page.</p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
        <HomeHeroForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
