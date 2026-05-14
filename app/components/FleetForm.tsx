"use client";

import { useState } from "react";
import { ListFleetResponse } from "@/interfaces/Fleet";
import ImageUpload from "./ImageUpload";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  initialData?: Partial<ListFleetResponse>;
  onSubmit: (data: any) => Promise<void>;
};

export default function FleetForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<ListFleetResponse>>(
    initialData || {
      heroTitle: "",
      heroDescription: "",
      heroImage: "",
      cta: "",
      stats: [],
      title: "",
      description: "",
      cards: [],
      bottomTitle: "",
      bottomDescription: "",
      benefits: [],
    }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addItem = (arrayKey: "stats" | "cards" | "benefits") => {
    const newItem = arrayKey === "stats" 
      ? { label: "", value: "", _id: Date.now().toString() }
      : arrayKey === "cards"
      ? { title: "", tag: "", image: "", hoverText: "", _id: Date.now().toString() }
      : { title: "", description: "", _id: Date.now().toString() };
    handleChange(arrayKey, [...(form[arrayKey] || []), newItem]);
  };

  const removeItem = (arrayKey: "stats" | "cards" | "benefits", index: number) => {
    const updatedArray = [...(form[arrayKey] || [])];
    updatedArray.splice(index, 1);
    handleChange(arrayKey, updatedArray);
  };

  const handleArrayItemChange = (arrayKey: "stats" | "cards" | "benefits", index: number, field: string, value: any) => {
    const updatedArray = [...(form[arrayKey] || [])] as any[];
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    handleChange(arrayKey, updatedArray);
  };

  const submit = async (e: any) => {
    e.preventDefault();
    const payload = {
      ...form,
      stats: form.stats?.map(({ _id, ...rest }) => rest),
      cards: form.cards?.map(({ _id, ...rest }) => rest),
      benefits: form.benefits?.map(({ _id, ...rest }) => rest),
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-10 max-w-5xl">
      {/* Hero Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Hero Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Hero Title"
            value={form.heroTitle || ""}
            onChange={(e) => handleChange("heroTitle", e.target.value)}
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
          placeholder="Hero Description"
          value={form.heroDescription || ""}
          onChange={(e) => handleChange("heroDescription", e.target.value)}
        />
        <ImageUpload
          label="Hero Image"
          value={form.heroImage || ""}
          onChange={(url) => handleChange("heroImage", url)}
        />

        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Fleet Stats</h4>
            <button
              type="button"
              onClick={() => addItem("stats")}
              className="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100"
            >
              <Plus size={16} /> Add Stat
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {form.stats?.map((stat, index) => (
              <div key={stat._id || index} className="p-3 border rounded-lg bg-gray-50 relative group">
                <button
                  type="button"
                  onClick={() => removeItem("stats", index)}
                  className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
                <input
                  className="input bg-white text-center font-bold text-lg mb-1"
                  placeholder="Value"
                  value={stat.value}
                  onChange={(e) => handleArrayItemChange("stats", index, "value", e.target.value)}
                />
                <input
                  className="input bg-white text-center text-xs"
                  placeholder="Label"
                  value={stat.label}
                  onChange={(e) => handleArrayItemChange("stats", index, "label", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Showcase Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Fleet Showcase</h3>
        <input
          className="input"
          placeholder="Showcase Title"
          value={form.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <textarea
          className="input min-h-[80px]"
          placeholder="Showcase Description"
          value={form.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Fleet Cards</h4>
            <button
              type="button"
              onClick={() => addItem("cards")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
            >
              <Plus size={18} /> Add Vessel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {form.cards?.map((card, index) => (
              <div key={card._id || index} className="p-4 border rounded-xl bg-gray-50 relative group flex flex-col shadow-inner">
                <button
                  type="button"
                  onClick={() => removeItem("cards", index)}
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-2 bg-white/80 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
                <div className="space-y-3">
                  <input
                    className="input bg-white font-bold"
                    placeholder="Vessel Title"
                    value={card.title}
                    onChange={(e) => handleArrayItemChange("cards", index, "title", e.target.value)}
                  />
                  <input
                    className="input bg-white text-xs"
                    placeholder="Category / Tag"
                    value={card.tag}
                    onChange={(e) => handleArrayItemChange("cards", index, "tag", e.target.value)}
                  />
                  <textarea
                    className="input bg-white text-xs min-h-[60px]"
                    placeholder="Hover Hover Text / Info"
                    value={card.hoverText}
                    onChange={(e) => handleArrayItemChange("cards", index, "hoverText", e.target.value)}
                  />
                  <ImageUpload
                    label="Vessel Image"
                    value={card.image}
                    onChange={(url) => handleArrayItemChange("cards", index, "image", url)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom / Benefits Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Fleet Benefits</h3>
        <input
          className="input"
          placeholder="Bottom Section Title"
          value={form.bottomTitle || ""}
          onChange={(e) => handleChange("bottomTitle", e.target.value)}
        />
        <textarea
          className="input min-h-[80px]"
          placeholder="Bottom Section Description"
          value={form.bottomDescription || ""}
          onChange={(e) => handleChange("bottomDescription", e.target.value)}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Capabilities / Benefits</h4>
            <button
              type="button"
              onClick={() => addItem("benefits")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold shadow-sm"
            >
              <Plus size={18} /> Add Benefit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {form.benefits?.map((benefit, index) => (
              <div key={benefit._id || index} className="p-4 border rounded-xl bg-gray-50 relative group shadow-inner">
                <button
                  type="button"
                  onClick={() => removeItem("benefits", index)}
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={20} />
                </button>
                <div className="space-y-3">
                  <input
                    className="input bg-white font-bold"
                    placeholder="Benefit Title"
                    value={benefit.title}
                    onChange={(e) => handleArrayItemChange("benefits", index, "title", e.target.value)}
                  />
                  <textarea
                    className="input bg-white min-h-[100px]"
                    placeholder="Benefit Description"
                    value={benefit.description}
                    onChange={(e) => handleArrayItemChange("benefits", index, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="w-full px-4 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg sticky bottom-6 z-10">
        Update Fleet Section
      </button>
    </form>
  );
}
