"use client";

import { useState } from "react";
import { ListTransportMaritime } from "@/interfaces/Home";
import ImageUpload from "./ImageUpload";

type Props = {
  initialData?: Partial<ListTransportMaritime>;
  onSubmit: (data: any) => Promise<void>;
};

export default function TransportForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<ListTransportMaritime>>(
    initialData || {
      heading: "",
      description: "",
      cta: "",
      cardTitle: "",
      cardDescription: "",
      leftImage: "",
      rightImage: "",
    }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e: any) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <input
          className="input"
          placeholder="Heading"
          value={form.heading || ""}
          onChange={(e) => handleChange("heading", e.target.value)}
        />

        <textarea
          className="input"
          placeholder="Description"
          value={form.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <input
          className="input"
          placeholder="CTA Text"
          value={form.cta || ""}
          onChange={(e) => handleChange("cta", e.target.value)}
        />

        <div className="border-t pt-4">
          <input
            className="input"
            placeholder="Card Title"
            value={form.cardTitle || ""}
            onChange={(e) => handleChange("cardTitle", e.target.value)}
          />
          <textarea
            className="input mt-4"
            placeholder="Card Description"
            value={form.cardDescription || ""}
            onChange={(e) => handleChange("cardDescription", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 pt-4">
          <ImageUpload
            label="Left Image"
            value={form.leftImage || ""}
            onChange={(url) => handleChange("leftImage", url)}
          />
          <ImageUpload
            label="Right Image"
            value={form.rightImage || ""}
            onChange={(url) => handleChange("rightImage", url)}
          />
        </div>
      </div>

      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Submit
      </button>
    </form>
  );
}
