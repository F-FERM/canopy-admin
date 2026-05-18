"use client";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { useRouter } from "next/navigation";
import { createServicesPage } from "@/app/api/service/serviceSecurity";
import ServicesPageForm from "@/app/Components/ServiceSecurityForm";



export default function CreateServicesPage() {
  const router = useRouter();

  const handleSubmit = async (
    data: any
  ) => {
    try {
      await createServicesPage(data);

      router.push(
        "/admin/service/service-security"
      );
    } catch (error) {
      console.error(error);

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
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={22} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold">
            Create Services Page
          </h1>

          <p className="text-gray-500">
            Add new services page
            section
          </p>
        </div>
      </div>

      <div className="bg-gray-50 border rounded-xl p-6">
        <ServicesPageForm
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}