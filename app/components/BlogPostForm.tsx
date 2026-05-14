"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";

type BlogPost = {
  _id?: string;
  title: string;
  description: string;
  content: string;
  image: string;
  tag: string;
  tags: string[];
  date: string;
  isPublished: boolean;
};

type Props = {
  initialData?: Partial<BlogPost>;
  onSubmit: (data: any) => Promise<void>;
};

export default function BlogPostForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<BlogPost>>(
    initialData || {
      title: "",
      description: "",
      content: "",
      image: "",
      tag: "",
      tags: [],
      date: new Date().toISOString().split("T")[0],
      isPublished: true,
    }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTags = (value: string) => {
    handleChange("tags", value.split(",").map(t => t.trim()).filter(t => t !== ""));
  };

  const formatDateForInput = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    // If it's already YYYY-MM-DD, return it
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      return dateStr.split("T")[0];
    }
    // If it's DD-MM-YYYY, convert it
    const parts = dateStr.split("-");
    if (parts.length === 3 && parts[2].length === 4) {
      // Assuming DD-MM-YYYY
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    // Fallback: try new Date()
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split("T")[0];
      }
    } catch (e) {}
    return "";
  };

  const submit = async (e: any) => {
    e.preventDefault();
    const { isPublished, ...payload } = form;
    await onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-8 max-w-4xl">
      <div className="space-y-6 bg-white p-6 rounded-xl border">
        <h3 className="text-xl font-semibold border-b pb-3">Post Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Post Title"
            value={form.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          <input
            className="input"
            type="date"
            value={formatDateForInput(form.date)}
            onChange={(e) => handleChange("date", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Main Category (Tag)"
            value={form.tag || ""}
            onChange={(e) => handleChange("tag", e.target.value)}
          />
          <input
            className="input"
            placeholder="Tags (comma separated)"
            value={form.tags?.join(", ") || ""}
            onChange={(e) => handleTags(e.target.value)}
          />
        </div>

        <textarea
          className="input min-h-[80px]"
          placeholder="Short Description"
          value={form.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <textarea
          className="input min-h-[300px]"
          placeholder="Full Content (Markdown or HTML supported)"
          value={form.content || ""}
          onChange={(e) => handleChange("content", e.target.value)}
        />


        <ImageUpload
          label="Feature Image"
          value={form.image || ""}
          onChange={(url) => handleChange("image", url)}
        />
      </div>

      <button className="w-full px-4 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg">
        {initialData?._id ? "Update Blog Post" : "Create Blog Post"}
      </button>
    </form>
  );
}
