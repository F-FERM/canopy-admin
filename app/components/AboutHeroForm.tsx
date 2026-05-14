"use client";

import { useState } from "react";
import { ListAboutHeroSection } from "@/interfaces/About";
import ImageUpload from "./ImageUpload";

type Props = {
  initialData?: Partial<ListAboutHeroSection>;
  onSubmit: (data: any) => Promise<void>;
};

export default function AboutHeroForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<ListAboutHeroSection>>(
    initialData || {
      heading: "",
      description: "",
      heroImage: "",
      whoWeAre: { title: "", description: "" },
      whoImage: "",
      mission: { title: "", description: "" },
      vision: { title: "", description: "" },
    }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNestedChange = (parent: "whoWeAre" | "mission" | "vision", key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] || { title: "", description: "" }),
        [key]: value,
      },
    }));
  };

  const submit = async (e: any) => {
    e.preventDefault();
    
    // Ensure _id is removed from nested objects
    const payload = {
      ...form,
      whoWeAre: form.whoWeAre ? { title: form.whoWeAre.title, description: form.whoWeAre.description } : undefined,
      mission: form.mission ? { title: form.mission.title, description: form.mission.description } : undefined,
      vision: form.vision ? { title: form.vision.title, description: form.vision.description } : undefined,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-8 max-w-2xl">
      <div className="space-y-4 bg-white p-6 rounded-xl border">
        <h3 className="text-lg font-medium border-b pb-2">Main Content</h3>
        <input
          className="input"
          placeholder="Heading"
          value={form.heading || ""}
          onChange={(e) => handleChange("heading", e.target.value)}
        />
        <textarea
          className="input min-h-[100px]"
          placeholder="Description"
          value={form.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <ImageUpload
          label="Hero Image"
          value={form.heroImage || ""}
          onChange={(url) => handleChange("heroImage", url)}
        />
      </div>

      <div className="space-y-4 bg-white p-6 rounded-xl border">
        <h3 className="text-lg font-medium border-b pb-2">Who We Are</h3>
        <input
          className="input"
          placeholder="Who We Are Title"
          value={form.whoWeAre?.title || ""}
          onChange={(e) => handleNestedChange("whoWeAre", "title", e.target.value)}
        />
        <textarea
          className="input min-h-[100px]"
          placeholder="Who We Are Description"
          value={form.whoWeAre?.description || ""}
          onChange={(e) => handleNestedChange("whoWeAre", "description", e.target.value)}
        />
        <ImageUpload
          label="Who Image"
          value={form.whoImage || ""}
          onChange={(url) => handleChange("whoImage", url)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 bg-white p-6 rounded-xl border">
          <h3 className="text-lg font-medium border-b pb-2">Mission</h3>
          <input
            className="input"
            placeholder="Mission Title"
            value={form.mission?.title || ""}
            onChange={(e) => handleNestedChange("mission", "title", e.target.value)}
          />
          <textarea
            className="input min-h-[100px]"
            placeholder="Mission Description"
            value={form.mission?.description || ""}
            onChange={(e) => handleNestedChange("mission", "description", e.target.value)}
          />
        </div>

        <div className="space-y-4 bg-white p-6 rounded-xl border">
          <h3 className="text-lg font-medium border-b pb-2">Vision</h3>
          <input
            className="input"
            placeholder="Vision Title"
            value={form.vision?.title || ""}
            onChange={(e) => handleNestedChange("vision", "title", e.target.value)}
          />
          <textarea
            className="input min-h-[100px]"
            placeholder="Vision Description"
            value={form.vision?.description || ""}
            onChange={(e) => handleNestedChange("vision", "description", e.target.value)}
          />
        </div>
      </div>

      <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md">
        Save About Hero Section
      </button>
    </form>
  );
}
