"use client";

import { useState } from "react";
import { ListFaqSection } from "@/interfaces/Home";

type Props = {
  initialData?: Partial<ListFaqSection>;
  onSubmit: (data: any) => Promise<void>;
};

export default function FaqForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<ListFaqSection>>(
    initialData || {
      title: "",
      description: "",
      cta: "",
      items: [],
    }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleItemChange = (index: number, key: string, value: any) => {
    const newItems = [...(form.items || [])];
    newItems[index] = { ...newItems[index], [key]: value };
    setForm((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...(prev.items || []), { question: "", answer: "" } as any],
    }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index),
    }));
  };

  const submit = async (e: any) => {
    e.preventDefault();
    // Sanitize payload: remove metadata and nested IDs
    const { _id, createdAt, updatedAt, __v, items, ...cleanForm } = form as any;
    const cleanItems = (items || []).map(({ _id, ...itemRest }: any) => itemRest);
    
    await onSubmit({ ...cleanForm, items: cleanItems });
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <input
          className="input"
          placeholder="Title"
          value={form.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
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
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">FAQ Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm font-medium hover:bg-blue-200"
          >
            + Add Item
          </button>
        </div>

        <div className="grid gap-6">
          {form.items?.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50/50 relative">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
              
              <input
                className="input bg-white"
                placeholder="Question"
                value={item.question || ""}
                onChange={(e) => handleItemChange(index, "question", e.target.value)}
              />

              <textarea
                className="input bg-white"
                placeholder="Answer"
                value={item.answer || ""}
                onChange={(e) => handleItemChange(index, "answer", e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Submit
      </button>
    </form>
  );
}
