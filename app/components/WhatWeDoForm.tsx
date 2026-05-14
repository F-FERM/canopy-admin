"use client";

import { useState } from "react";
import { WhatWeDoWhyChooseClio } from "@/interfaces/About";
import ImageUpload from "./ImageUpload";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  initialData?: Partial<WhatWeDoWhyChooseClio>;
  onSubmit: (data: any) => Promise<void>;
};

export default function WhatWeDoForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<WhatWeDoWhyChooseClio>>(
    initialData || {
      title: "",
      cards: [{ title: "", description: "", image: "", _id: Date.now().toString() }],
      whyTitle: "",
      whyDescription: "",
      cta: "",
      benefits: [{ title: "", description: "", _id: (Date.now() + 1).toString() }],
    }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleArrayChange = (arrayKey: "cards" | "benefits", index: number, field: string, value: any) => {
    const updatedArray = [...(form[arrayKey] || [])] as any[];
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    handleChange(arrayKey, updatedArray);
  };

  const addItem = (arrayKey: "cards" | "benefits") => {
    const newItem = arrayKey === "cards" 
      ? { title: "", description: "", image: "", _id: Date.now().toString() }
      : { title: "", description: "", _id: Date.now().toString() };
    handleChange(arrayKey, [...(form[arrayKey] || []), newItem]);
  };

  const removeItem = (arrayKey: "cards" | "benefits", index: number) => {
    const updatedArray = [...(form[arrayKey] || [])];
    updatedArray.splice(index, 1);
    handleChange(arrayKey, updatedArray);
  };

  const submit = async (e: any) => {
    e.preventDefault();
    
    // Remove _id from nested items before submitting
    const payload = {
      ...form,
      cards: form.cards?.map(({ _id, ...rest }) => rest),
      benefits: form.benefits?.map(({ _id, ...rest }) => rest),
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-10 max-w-4xl">
      {/* What We Do Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border">
        <h3 className="text-xl font-semibold border-b pb-3">What We Do</h3>
        <input
          className="input"
          placeholder="Section Title"
          value={form.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Cards</h4>
            <button
              type="button"
              onClick={() => addItem("cards")}
              className="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100"
            >
              <Plus size={16} /> Add Card
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.cards?.map((card, index) => (
              <div key={card._id} className="p-4 border rounded-lg bg-gray-50 relative group">
                <button
                  type="button"
                  onClick={() => removeItem("cards", index)}
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
                <div className="space-y-3">
                  <input
                    className="input bg-white"
                    placeholder="Card Title"
                    value={card.title}
                    onChange={(e) => handleArrayChange("cards", index, "title", e.target.value)}
                  />
                  <textarea
                    className="input bg-white text-sm"
                    placeholder="Card Description"
                    value={card.description}
                    onChange={(e) => handleArrayChange("cards", index, "description", e.target.value)}
                  />
                  <ImageUpload
                    label="Card Image"
                    value={card.image}
                    onChange={(url) => handleArrayChange("cards", index, "image", url)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Clio Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border">
        <h3 className="text-xl font-semibold border-b pb-3">Why Choose Clio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Why Title"
            value={form.whyTitle || ""}
            onChange={(e) => handleChange("whyTitle", e.target.value)}
          />
          <input
            className="input"
            placeholder="CTA Text"
            value={form.cta || ""}
            onChange={(e) => handleChange("cta", e.target.value)}
          />
        </div>
        <textarea
          className="input min-h-[80px]"
          placeholder="Why Description"
          value={form.whyDescription || ""}
          onChange={(e) => handleChange("whyDescription", e.target.value)}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Benefits</h4>
            <button
              type="button"
              onClick={() => addItem("benefits")}
              className="flex items-center gap-2 text-sm bg-green-50 text-green-600 px-3 py-1 rounded-md hover:bg-green-100"
            >
              <Plus size={16} /> Add Benefit
            </button>
          </div>

          <div className="space-y-3">
            {form.benefits?.map((benefit, index) => (
              <div key={benefit._id} className="p-4 border rounded-lg bg-gray-50 relative group flex gap-4">
                <div className="flex-1 space-y-3">
                  <input
                    className="input bg-white"
                    placeholder="Benefit Title"
                    value={benefit.title}
                    onChange={(e) => handleArrayChange("benefits", index, "title", e.target.value)}
                  />
                  <textarea
                    className="input bg-white text-sm"
                    placeholder="Benefit Description"
                    value={benefit.description}
                    onChange={(e) => handleArrayChange("benefits", index, "description", e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem("benefits", index)}
                  className="self-start mt-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="w-full px-4 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg">
        Save What We Do / Why Choose Clio
      </button>
    </form>
  );
}
