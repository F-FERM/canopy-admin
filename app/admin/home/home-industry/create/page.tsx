"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { createIndustries } from "@/app/api/home/homeIndustries";
import IndustriesWeServeForm from "@/app/Components/HomeIndustriesForm";



export default function CreateIndustriesPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await createIndustries(data);

      router.push(
        "/admin/home/home-industry"
      );
    } catch (err) {
      console.error("Create error:", err);

      alert(
        "Failed to create Industries section"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/home/home-industry"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Add Industries Section
          </h1>

          <p className="text-gray-500">
            Create Industries We Serve section.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
        <IndustriesWeServeForm
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
