"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { createIndustriesGrid } from "@/app/api/service/serviceIndustries";
import IndustriesGridForm from "@/app/Components/ServiceIndustryForm";



export default function CreateIndustriesGridPage() {
  const router = useRouter();

  const handleSubmit = async (
    data: any
  ) => {
    try {
      await createIndustriesGrid(
        data
      );

      router.push(
        "/admin/service/service-industries"
      );
    } catch (err) {
      console.error(
        "Create error:",
        err
      );

      alert(
        "Failed to create industries grid"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/service/service-industries"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Add Industries Grid
          </h1>

          <p className="text-gray-500">
            Create industries grid
            section.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
        <IndustriesGridForm
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
