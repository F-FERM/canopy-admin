"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { createServicesSection } from "@/app/api/service/serviceSecurity";
import ServicesSectionForm from "@/app/Components/ServiceSecurityForm";



export default function CreateServicesSectionPage() {
  const router = useRouter();

  const handleSubmit = async (
    data: any
  ) => {
    try {
      await createServicesSection(
        data
      );

      router.push(
        "/admin/service/service-security"
      );
    } catch (err) {
      console.error(
        "Create error:",
        err
      );

      alert(
        "Failed to create section"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/service/service-security"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Add Services Section
          </h1>

          <p className="text-gray-500">
            Create services section.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
        <ServicesSectionForm
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
