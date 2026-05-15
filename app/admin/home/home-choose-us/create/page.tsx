"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { createWhyChooseUs } from "@/app/api/home/homeChooseus";
import WhyChooseUsForm from "@/app/Components/HomeChooseForm";



export default function CreateWhyChooseUsPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await createWhyChooseUs(data);

      router.push(
        "/admin/home/home-choose-us"
      );
    } catch (err) {
      console.error("Create error:", err);

      alert(
        "Failed to create Why Choose Us section"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/home/home-choose-us"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Add Why Choose Us
          </h1>

          <p className="text-gray-500">
            Create Why Choose Us section.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
        <WhyChooseUsForm
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
