"use client";

import { useState } from "react";
import { ListVesselLanding } from "@/interfaces/Home";
import ImageUpload from "./ImageUpload";

type Props = {
  initialData?: Partial<ListVesselLanding>;
  onSubmit: (data: any) => Promise<void>;
};

export default function HeroForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<ListVesselLanding>>(
    initialData || {
      heading: "",
      leftInfo: "",
      summary: "",
      rightTitle: "",
      rightDescription: "",
      rightBullets: [],
      backgroundImage: "",
      pillImage: "",
      cardImage: "",
    }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleBullets = (value: string) => {
    setForm((prev) => ({
      ...prev,
      rightBullets: value.split(",").map((b) => b.trim()),
    }));
  };

  const submit = async (e: any) => {
    e.preventDefault();
    const { _id, createdAt, updatedAt, __v, ...cleanPayload } = form as any;
    await onSubmit(cleanPayload);
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-xl">
      <div className="space-y-4">
        <input
          className="input"
          placeholder="Heading"
          value={form.heading || ""}
          onChange={(e) => handleChange("heading", e.target.value)}
        />

        <input
          className="input"
          placeholder="Left Info"
          value={form.leftInfo || ""}
          onChange={(e) => handleChange("leftInfo", e.target.value)}
        />

        <textarea
          className="input"
          placeholder="Summary"
          value={form.summary || ""}
          onChange={(e) => handleChange("summary", e.target.value)}
        />

        <input
          className="input"
          placeholder="Right Title"
          value={form.rightTitle || ""}
          onChange={(e) => handleChange("rightTitle", e.target.value)}
        />

        <textarea
          className="input"
          placeholder="Right Description"
          value={form.rightDescription || ""}
          onChange={(e) =>
            handleChange("rightDescription", e.target.value)
          }
        />

        <input
          className="input"
          placeholder="Bullets (comma separated)"
          defaultValue={form.rightBullets?.join(",")}
          onChange={(e) => handleBullets(e.target.value)}
        />
      </div>

      <div className="border-t pt-6 space-y-6">
        <ImageUpload 
          label="Background Image"
          value={form.backgroundImage || ""}
          onChange={(url) => handleChange("backgroundImage", url)}
        />

        <ImageUpload 
          label="Pill Image"
          value={form.pillImage || ""}
          onChange={(url) => handleChange("pillImage", url)}
        />

        <ImageUpload 
          label="Card Image"
          value={form.cardImage || ""}
          onChange={(url) => handleChange("cardImage", url)}
        />
      </div>

      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Submit
      </button>
    </form>
  );
}