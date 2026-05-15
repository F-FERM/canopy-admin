"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createSecurityServices } from "@/app/api/home/homeservice";
import SecurityServicesForm from "@/app/Components/HomeServiceForm";


export default function CreateSecurityServicesPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await createSecurityServices(data);

      router.push("/admin/home/home-service");
    } catch (err) {
      console.error("Create error:", err);
      alert("Failed to create Security Services section");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/home/home-service"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Add Security Services
          </h1>

          <p className="text-gray-500">
            Create Security Services section for Home page.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
        <SecurityServicesForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
