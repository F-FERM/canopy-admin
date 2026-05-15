"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { createAboutCards } from "@/app/api/about/aboutValues";
import AboutCardsForm from "@/app/Components/AboutValuesForm";



export default function CreateAboutCardsPage() {
  const router = useRouter();

  const handleSubmit = async (
    data: any
  ) => {
    try {
      await createAboutCards(data);

      router.push(
        "/admin/about/values"
      );
    } catch (err) {
      console.error(
        "Create error:",
        err
      );

      alert(
        "Failed to create cards section"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/about/values"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Add About Cards
          </h1>

          <p className="text-gray-500">
            Create about cards section.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
        <AboutCardsForm  
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
