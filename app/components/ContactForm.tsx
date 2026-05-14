"use client";

import { useState } from "react";
import { ListContactResponse } from "@/interfaces/Contact";
import ImageUpload from "./ImageUpload";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  initialData?: Partial<ListContactResponse>;
  onSubmit: (data: any) => Promise<void>;
};

export default function ContactForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<ListContactResponse>>(
    initialData || {
      heading: "",
      description: "",
      backgroundImage: "",
      contactInfo: [],
      formTitle: "",
      buttonText: "",
      bottomTitle: "",
      bottomDescription: "",
      bottomImage: "",
    }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addItem = () => {
    const newItem = { title: "", value: "", _id: Date.now().toString() };
    handleChange("contactInfo", [...(form.contactInfo || []), newItem]);
  };

  const removeItem = (index: number) => {
    const updatedArray = [...(form.contactInfo || [])];
    updatedArray.splice(index, 1);
    handleChange("contactInfo", updatedArray);
  };

  const handleArrayItemChange = (index: number, field: string, value: any) => {
    const updatedArray = [...(form.contactInfo || [])] as any[];
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    handleChange("contactInfo", updatedArray);
  };

  const submit = async (e: any) => {
    e.preventDefault();
    const payload = {
      ...form,
      contactInfo: form.contactInfo?.map(({ _id, __v, createdAt, updatedAt, ...rest }: any) => rest),
    };

    // Remove metadata fields from the top-level payload
    const { _id, __v, createdAt, updatedAt, ...cleanPayload } = payload as any;

    await onSubmit(cleanPayload);
  };

  return (
    <form onSubmit={submit} className="space-y-10 max-w-5xl">
      {/* Hero Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Hero Section</h3>
        <input
          className="input"
          placeholder="Heading"
          value={form.heading || ""}
          onChange={(e) => handleChange("heading", e.target.value)}
        />
        <textarea
          className="input min-h-[80px]"
          placeholder="Description"
          value={form.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <ImageUpload
          label="Background Image"
          value={form.backgroundImage || ""}
          onChange={(url) => handleChange("backgroundImage", url)}
        />
      </div>

      {/* Contact Info Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-bold text-gray-800">Contact Info</h3>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100"
          >
            <Plus size={16} /> Add Info
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.contactInfo?.map((info, index) => (
            <div key={info._id || index} className="p-4 border rounded-lg bg-gray-50 relative group">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
              <div className="space-y-3">
                <input
                  className="input bg-white font-medium"
                  placeholder="Title (e.g. Email)"
                  value={info.title}
                  onChange={(e) => handleArrayItemChange(index, "title", e.target.value)}
                />
                <input
                  className="input bg-white"
                  placeholder="Value (e.g. info@clio.com)"
                  value={info.value}
                  onChange={(e) => handleArrayItemChange(index, "value", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Form Settings</h3>
        <input
          className="input"
          placeholder="Form Title"
          value={form.formTitle || ""}
          onChange={(e) => handleChange("formTitle", e.target.value)}
        />
        <input
          className="input"
          placeholder="Button Text"
          value={form.buttonText || ""}
          onChange={(e) => handleChange("buttonText", e.target.value)}
        />
      </div>

      {/* Bottom Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold border-b pb-3 text-gray-800">Bottom Section</h3>
        <input
          className="input"
          placeholder="Bottom Title"
          value={form.bottomTitle || ""}
          onChange={(e) => handleChange("bottomTitle", e.target.value)}
        />
        <textarea
          className="input min-h-[80px]"
          placeholder="Bottom Description"
          value={form.bottomDescription || ""}
          onChange={(e) => handleChange("bottomDescription", e.target.value)}
        />
        <ImageUpload
          label="Bottom Image"
          value={form.bottomImage || ""}
          onChange={(url) => handleChange("bottomImage", url)}
        />
      </div>

      <button className="w-full px-4 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg sticky bottom-6 z-10">
        Update Contact Section
      </button>
    </form>
  );
}
