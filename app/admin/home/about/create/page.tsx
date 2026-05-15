"use client";

import { createAboutApi } from "@/app/api/home/homeaboutstat";
import AboutSectionForm from "@/app/Components/HomeAboutForm";
import { useRouter } from "next/navigation";


export default function CreateAboutPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await createAboutApi(data);
    router.push("/admin/home/about");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Create About Section
      </h1>

      <AboutSectionForm onSubmit={handleSubmit} />
    </div>
  );
}
