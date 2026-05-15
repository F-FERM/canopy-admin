"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AboutSectionForm from "@/app/Components/HomeAboutForm";
import { AboutSection, getAboutApi, updateAboutApi } from "@/app/api/home/homeaboutstat";


export default function EditAboutPage() {
  const router = useRouter();
  const { id } = useParams();

  const [data, setData] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAboutApi(id as string)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (form: any) => {
    await updateAboutApi({
      ...form,
      _id: id as string,
    });

    router.push("/admin/home/about");
  };

  if (loading) return <div className="p-10">Loading...</div>;

  if (!data)
    return <div className="p-10">Not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Edit About Section
      </h1>

      <AboutSectionForm
        initialData={data}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
