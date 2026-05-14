"use client";

import { useState } from "react";
import { ListShipManagementLogistics } from "@/interfaces/Home";
import ImageUpload from "./ImageUpload";

type Props = {
  initialData?: Partial<ListShipManagementLogistics>;
  onSubmit: (data: any) => Promise<void>;
};

export default function ShipForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<ListShipManagementLogistics>>(
    initialData || {
      heading: "",
      description: "",
      sideCardTitle: "",
      sideCardDescription: "",
      sideImage: "",
      cards: [],
    }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCardChange = (index: number, key: string, value: any) => {
    const newCards = [...(form.cards || [])];
    if (key === "tags") {
      newCards[index] = { ...newCards[index], [key]: value.split(",").map((t: string) => t.trim()) };
    } else {
      newCards[index] = { ...newCards[index], [key]: value };
    }
    setForm((prev) => ({ ...prev, cards: newCards }));
  };

  const addCard = () => {
    setForm((prev) => ({
      ...prev,
      cards: [...(prev.cards || []), { title: "", description: "", tags: [] } as any],
    }));
  };

  const removeCard = (index: number) => {
    setForm((prev) => ({
      ...prev,
      cards: (prev.cards || []).filter((_, i) => i !== index),
    }));
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

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Side Card Title"
            value={form.sideCardTitle || ""}
            onChange={(e) => handleChange("sideCardTitle", e.target.value)}
          />
          <input
            className="input"
            placeholder="Side Card Description"
            value={form.sideCardDescription || ""}
            onChange={(e) => handleChange("sideCardDescription", e.target.value)}
          />
        </div>

        <ImageUpload
          label="Side Image"
          value={form.sideImage || ""}
          onChange={(url) => handleChange("sideImage", url)}
        />
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Cards</h3>
          <button
            type="button"
            onClick={addCard}
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm font-medium hover:bg-blue-200"
          >
            + Add Card
          </button>
        </div>

        <div className="grid gap-6">
          {form.cards?.map((card, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50/50 relative">
              <button
                type="button"
                onClick={() => removeCard(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
              
              <input
                className="input bg-white"
                placeholder="Card Title"
                value={card.title || ""}
                onChange={(e) => handleCardChange(index, "title", e.target.value)}
              />

              <textarea
                className="input bg-white"
                placeholder="Card Description"
                value={card.description || ""}
                onChange={(e) => handleCardChange(index, "description", e.target.value)}
              />

              <input
                className="input bg-white"
                placeholder="Tags (comma separated)"
                defaultValue={card.tags?.join(", ")}
                onChange={(e) => handleCardChange(index, "tags", e.target.value)}
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
