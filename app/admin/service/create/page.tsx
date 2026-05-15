"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import ServiceLandingForm from "@/app/Components/ServiceLandingForm";
import { createServiceLanding } from "@/app/api/service/serviceLanding";



export default function CreateServiceLandingPage() {
  const router = useRouter();

  const handleSubmit = async (
    data: any
  ) => {
    try {
      await createServiceLanding(
        data
      );

      router.push(
        "/admin/service"
      );
    } catch (err) {
      console.error(
        "Create error:",
        err
      );

      alert(
        "Failed to create service landing section"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/service"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Add Service Landing
          </h1>

          <p className="text-gray-500">
            Create service landing
            section.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
        <ServiceLandingForm
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
