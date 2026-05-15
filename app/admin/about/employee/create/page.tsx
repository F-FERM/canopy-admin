"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { createEmployeeService } from "@/app/api/about/aboutEmployee";
import EmployeeServiceForm from "@/app/Components/AboutEmployeeForm";


export default function CreateEmployeeServicePage() {
  const router = useRouter();

  const handleSubmit = async (
    data: any
  ) => {
    try {
      await createEmployeeService(
        data
      );

      router.push(
        "/admin/about/employee"
      );
    } catch (err) {
      console.error(
        "Create error:",
        err
      );

      alert(
        "Failed to create Employee section"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/about/employee"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Add Employee Section
          </h1>

          <p className="text-gray-500">
            Create employee recognition
            section.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-dashed">
        <EmployeeServiceForm
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
