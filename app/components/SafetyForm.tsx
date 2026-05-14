"use client";

import { useState } from "react";
import { ListSafetyResponse } from "@/interfaces/Safety";
import ImageUpload from "./ImageUpload";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  initialData?: Partial<ListSafetyResponse>;
  onSubmit: (data: any) => Promise<void>;
};

export default function SafetyForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<ListSafetyResponse>>(
    initialData || {
      heading: "",
      description: "",
      heroImage: "",
      overlayTitle: "",
      overlayDescription: "",
      complianceItems: [],
      principlesTitle: "",
      principlesDescription: "",
      cta: "",
      principles: [],
      pillarHeading: "",
      pillarDescription: "",
      pillarCards: [],
    }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addItem = (arrayKey: "complianceItems" | "principles" | "pillarCards") => {
    const newItem = arrayKey === "complianceItems" 
      ? { text: "", _id: Date.now().toString() }
      : arrayKey === "principles"
      ? { title: "", description: "", isHighlighted: false, _id: Date.now().toString() }
      : { title: "", description: "", bg: "#ffffff", textColor: "#000000", descColor: "#666666", backgroundImage: "", _id: Date.now().toString() };
    handleChange(arrayKey, [...(form[arrayKey] || []), newItem]);
  };

  const removeItem = (arrayKey: "complianceItems" | "principles" | "pillarCards", index: number) => {
    const updatedArray = [...(form[arrayKey] || [])];
    updatedArray.splice(index, 1);
    handleChange(arrayKey, updatedArray);
  };

  const handleArrayItemChange = (arrayKey: "complianceItems" | "principles" | "pillarCards", index: number, field: string, value: any) => {
    const updatedArray = [...(form[arrayKey] || [])] as any[];
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    handleChange(arrayKey, updatedArray);
  };

  const submit = async (e: any) => {
    e.preventDefault();
    const payload = {
      ...form,
      complianceItems: form.complianceItems?.map(({ _id, ...rest }) => rest),
      principles: form.principles?.map(({ _id, ...rest }) => rest),
      pillarCards: form.pillarCards?.map(({ _id, ...rest }) => rest),
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-10 max-w-5xl">
      {/* Hero Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Hero Section</h3>
        <input
          className="input"
          placeholder="Hero Heading"
          value={form.heading || ""}
          onChange={(e) => handleChange("heading", e.target.value)}
        />
        <textarea
          className="input min-h-[80px]"
          placeholder="Hero Description"
          value={form.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <ImageUpload
          label="Hero Image"
          value={form.heroImage || ""}
          onChange={(url) => handleChange("heroImage", url)}
        />
      </div>

      {/* Overlay Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Overlay Content</h3>
        <input
          className="input"
          placeholder="Overlay Title"
          value={form.overlayTitle || ""}
          onChange={(e) => handleChange("overlayTitle", e.target.value)}
        />
        <textarea
          className="input min-h-[80px]"
          placeholder="Overlay Description"
          value={form.overlayDescription || ""}
          onChange={(e) => handleChange("overlayDescription", e.target.value)}
        />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Compliance Items</h4>
            <button
              type="button"
              onClick={() => addItem("complianceItems")}
              className="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {form.complianceItems?.map((item, index) => (
              <div key={item._id || index} className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="Compliance text"
                  value={item.text}
                  onChange={(e) => handleArrayItemChange("complianceItems", index, "text", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeItem("complianceItems", index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Principles Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Safety Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Principles Title"
            value={form.principlesTitle || ""}
            onChange={(e) => handleChange("principlesTitle", e.target.value)}
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
          placeholder="Principles Description"
          value={form.principlesDescription || ""}
          onChange={(e) => handleChange("principlesDescription", e.target.value)}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Principles List</h4>
            <button
              type="button"
              onClick={() => addItem("principles")}
              className="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100"
            >
              <Plus size={16} /> Add Principle
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.principles?.map((principle, index) => (
              <div key={principle._id || index} className="p-4 border rounded-lg bg-gray-50 relative group">
                <button
                  type="button"
                  onClick={() => removeItem("principles", index)}
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                <div className="space-y-3">
                  <input
                    className="input bg-white font-medium"
                    placeholder="Principle Title"
                    value={principle.title}
                    onChange={(e) => handleArrayItemChange("principles", index, "title", e.target.value)}
                  />
                  <textarea
                    className="input bg-white text-sm"
                    placeholder="Description (Optional)"
                    value={principle.description || ""}
                    onChange={(e) => handleArrayItemChange("principles", index, "description", e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`highlight-${index}`}
                      checked={principle.isHighlighted}
                      onChange={(e) => handleArrayItemChange("principles", index, "isHighlighted", e.target.checked)}
                    />
                    <label htmlFor={`highlight-${index}`} className="text-xs font-medium text-gray-700">Highlight this principle</label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pillars Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Safety Pillars</h3>
        <input
          className="input"
          placeholder="Pillar Section Heading"
          value={form.pillarHeading || ""}
          onChange={(e) => handleChange("pillarHeading", e.target.value)}
        />
        <textarea
          className="input min-h-[80px]"
          placeholder="Pillar Section Description"
          value={form.pillarDescription || ""}
          onChange={(e) => handleChange("pillarDescription", e.target.value)}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Pillar Cards</h4>
            <button
              type="button"
              onClick={() => addItem("pillarCards")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold shadow-sm"
            >
              <Plus size={18} /> Add Pillar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {form.pillarCards?.map((pillar, index) => (
              <div key={pillar._id || index} className="p-6 border rounded-xl bg-gray-50 relative group shadow-inner">
                <button
                  type="button"
                  onClick={() => removeItem("pillarCards", index)}
                  className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={20} />
                </button>
                <div className="space-y-4">
                  <input
                    className="input bg-white font-bold"
                    placeholder="Pillar Title"
                    value={pillar.title}
                    onChange={(e) => handleArrayItemChange("pillarCards", index, "title", e.target.value)}
                  />
                  <textarea
                    className="input bg-white min-h-[80px]"
                    placeholder="Pillar Description"
                    value={pillar.description}
                    onChange={(e) => handleArrayItemChange("pillarCards", index, "description", e.target.value)}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500">Background Color</label>
                      <input
                        type="color"
                        className="w-full h-10 rounded cursor-pointer"
                        value={pillar.bg}
                        onChange={(e) => handleArrayItemChange("pillarCards", index, "bg", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500">Text Color</label>
                      <input
                        type="color"
                        className="w-full h-10 rounded cursor-pointer"
                        value={pillar.textColor}
                        onChange={(e) => handleArrayItemChange("pillarCards", index, "textColor", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <ImageUpload
                    label="Background Image"
                    value={pillar.backgroundImage}
                    onChange={(url) => handleArrayItemChange("pillarCards", index, "backgroundImage", url)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="w-full px-4 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg sticky bottom-6 z-10">
        Update Safety & Compliance Section
      </button>
    </form>
  );
}
