"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import {
  useParams,
  useRouter,
} from "next/navigation";
import { listServicesPageApi, RootObject, updateServicesPage } from "@/app/api/service/serviceSecurity";
import ServicesPageForm from "@/app/Components/ServiceSecurityForm";



export default function EditServicesPage() {
  const router = useRouter();

  const params = useParams();

  const id = params?.id as string;

  const [loading, setLoading] =
    useState(true);

  const [initialData, setInitialData] =
    useState<
      Partial<RootObject> | null
    >(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res =
          await listServicesPageApi(
            {}
          );

        const all =
          Array.isArray(res)
            ? res
            : (res as any)?.data || [
                res,
              ];

        const found = all.find(
          (
            item: RootObject
          ) => item._id === id
        );

        setInitialData(
          found || null
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSubmit = async (
    data: any
  ) => {
    try {
      await updateServicesPage({
        ...data,
        _id: id,
      });

      router.push(
        "/admin/service/service-security"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update section"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="text-center py-10">
        Data not found
      </div>
    );
  }

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
            Edit Services Page
          </h1>

          <p className="text-gray-500">
            Update services page
            section
          </p>
        </div>
      </div>

      <div className="bg-gray-50 border rounded-xl p-6">
        <ServicesPageForm 
          initialData={
            initialData
          }
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}