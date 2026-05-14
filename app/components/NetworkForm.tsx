"use client";

import { useState } from "react";
import { ListGlobalNetworkResponse } from "@/interfaces/Network";
import ImageUpload from "./ImageUpload";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  initialData?: Partial<ListGlobalNetworkResponse>;
  onSubmit: (data: any) => Promise<void>;
};

export default function NetworkForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<ListGlobalNetworkResponse>>(
    initialData || {
      heading: "",
      mainImage: "",
      overlay: { title: "", description: "", points: [], image: "" },
      sideText: "",
      smartTitle: "",
      smartDescription: "",
      cta: "",
      smartImages: [],
      features: [],
    }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleOverlayChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      overlay: { ...(prev.overlay || { title: "", description: "", points: [], image: "" }), [field]: value }
    }));
  };

  const addItem = (arrayKey: "smartImages" | "features") => {
const newItem = arrayKey === "smartImages" 
  ? { image: "", title: "", description: "", _id: Date.now().toString() }
  : { title: "", description: "", points: [], variant: "default", _id: Date.now().toString() };
    handleChange(arrayKey, [...(form[arrayKey] || []), newItem]);
  };

  const removeItem = (arrayKey: "smartImages" | "features", index: number) => {
    const updatedArray = [...(form[arrayKey] || [])];
    updatedArray.splice(index, 1);
    handleChange(arrayKey, updatedArray);
  };

  const handleArrayItemChange = (arrayKey: "smartImages" | "features", index: number, field: string, value: any) => {
    const updatedArray = [...(form[arrayKey] || [])] as any[];
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    handleChange(arrayKey, updatedArray);
  };

  const submit = async (e: any) => {
    e.preventDefault();
    
    // Clean payload: remove temporary _ids from nested arrays and ensure strings for points
    const payload = {
      ...form,
      smartImages: form.smartImages?.map(({ _id, ...rest }) => rest),
      features: form.features?.map(({ _id, ...rest }) => rest),
      overlay: form.overlay ? {
        title: form.overlay.title,
        description: form.overlay.description,
        image: form.overlay.image,
        points: Array.isArray(form.overlay.points) ? form.overlay.points : (form.overlay.points as string || "").split(",").map(p => p.trim())
      } : undefined
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-10 max-w-5xl">
      {/* Hero / Main Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Main Section</h3>
        <input
          className="input"
          placeholder="Main Heading"
          value={form.heading || ""}
          onChange={(e) => handleChange("heading", e.target.value)}
        />
        <ImageUpload
          label="Main Image"
          value={form.mainImage || ""}
          onChange={(url) => handleChange("mainImage", url)}
        />
        <textarea
          className="input min-h-[80px]"
          placeholder="Side Text"
          value={form.sideText || ""}
          onChange={(e) => handleChange("sideText", e.target.value)}
        />
      </div>

      {/* Overlay Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Overlay Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Overlay Title"
            value={form.overlay?.title || ""}
            onChange={(e) => handleOverlayChange("title", e.target.value)}
          />
          <input
            className="input"
            placeholder="Points (comma separated)"
            value={Array.isArray(form.overlay?.points) ? form.overlay.points.join(", ") : form.overlay?.points || ""}
            onChange={(e) => handleOverlayChange("points", e.target.value.split(",").map(p => p.trim()))}
          />
        </div>
        <textarea
          className="input min-h-[80px]"
          placeholder="Overlay Description"
          value={form.overlay?.description || ""}
          onChange={(e) => handleOverlayChange("description", e.target.value)}
        />
        <ImageUpload
          label="Overlay Image"
          value={form.overlay?.image || ""}
          onChange={(url) => handleOverlayChange("image", url)}
        />
      </div>

      {/* Smart Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Smart Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Smart Title"
            value={form.smartTitle || ""}
            onChange={(e) => handleChange("smartTitle", e.target.value)}
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
          placeholder="Smart Description"
          value={form.smartDescription || ""}
          onChange={(e) => handleChange("smartDescription", e.target.value)}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Smart Images</h4>
            <button
              type="button"
              onClick={() => addItem("smartImages")}
              className="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100"
            >
              <Plus size={16} /> Add Image
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {form.smartImages?.map((img, index) => (
              <div key={img._id || index} className="p-4 border rounded-lg bg-gray-50 relative group">
                <button
                  type="button"
                  onClick={() => removeItem("smartImages", index)}
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                <input
                  className="input bg-white mb-2 text-xs"
                  placeholder="Image Title (Optional)"
                  value={img.title || ""}
                  onChange={(e) => handleArrayItemChange("smartImages", index, "title", e.target.value)}
                />
                <textarea
                  className="input bg-white mb-2 text-xs min-h-[60px]"
                  placeholder="Image Description (Optional)"
                  value={img.description || ""}
                  onChange={(e) => handleArrayItemChange("smartImages", index, "description", e.target.value)}
                />
                <ImageUpload
                  label="Image"
                  value={img.image}
                  onChange={(url) => handleArrayItemChange("smartImages", index, "image", url)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-bold text-gray-800">Network Features</h3>
          <button
            type="button"
            onClick={() => addItem("features")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
          >
            <Plus size={18} /> Add Feature
          </button>
        </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {form.features?.map((feat, index) => (
    <div key={feat._id || index} className="p-4 border rounded-xl bg-gray-50 relative group">
      <button
        type="button"
        onClick={() => removeItem("features", index)}
        className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 size={20} />
      </button>

      <div className="space-y-4">
        <input
          className="input bg-white"
          placeholder="Feature Title"
          value={feat.title}
          onChange={(e) =>
            handleArrayItemChange("features", index, "title", e.target.value)
          }
        />

        <textarea
          className="input bg-white min-h-[80px]"
          placeholder="Feature Description"
          value={feat.description || ""}
          onChange={(e) =>
            handleArrayItemChange("features", index, "description", e.target.value)
          }
        />

        <input
          className="input bg-white"
          placeholder="Variant (e.g. blue, dark)"
          value={feat.variant}
          onChange={(e) =>
            handleArrayItemChange("features", index, "variant", e.target.value)
          }
        />

        <textarea
          className="input bg-white min-h-[80px]"
          placeholder="Points (comma separated)"
          value={Array.isArray(feat.points) ? feat.points.join(", ") : feat.points || ""}
          onChange={(e) =>
            handleArrayItemChange(
              "features",
              index,
              "points",
              e.target.value.split(",").map((p) => p.trim())
            )
          }
        />
      </div>
    </div>
  ))}
</div>
      </div>

      <button className="w-full px-4 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg sticky bottom-6 z-10">
        Update Global Network Section
      </button>
    </form>
  );
}
