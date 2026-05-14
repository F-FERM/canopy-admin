"use client";

import { useState } from "react";
import { ListOurService, CardService } from "@/interfaces/Home";
import ImageUpload from "./ImageUpload";

type Props = {
  initialData?: Partial<ListOurService>;
  onSubmit: (data: any) => Promise<void>;
};

export default function ServiceForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<ListOurService>>(
    initialData || {
      title: "",
      description: "",
      cards: [],
    }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCardChange = (index: number, key: keyof CardService, value: any) => {
    const newCards = [...(form.cards || [])];
    newCards[index] = { ...newCards[index], [key]: value };
    setForm((prev) => ({ ...prev, cards: newCards }));
  };

  const addCard = () => {
    setForm((prev) => ({
      ...prev,
      cards: [...(prev.cards || []), { title: "", tag: "", image: "", hoverText: "" } as CardService],
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
    const payload = {
      ...form,
      cards: form.cards?.map(({ _id, __v, createdAt, updatedAt, ...rest }: any) => rest),
    };
    const { _id, __v, createdAt, updatedAt, ...cleanPayload } = payload as any;
    await onSubmit(cleanPayload);
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <input
          className="input"
          placeholder="Service Section Title"
          value={form.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        <textarea
          className="input"
          placeholder="Service Section Description"
          value={form.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Service Cards</h3>
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
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  className="input bg-white"
                  placeholder="Card Title"
                  value={card.title || ""}
                  onChange={(e) => handleCardChange(index, "title", e.target.value)}
                />
                <input
                  className="input bg-white"
                  placeholder="Card Tag"
                  value={card.tag || ""}
                  onChange={(e) => handleCardChange(index, "tag", e.target.value)}
                />
              </div>

              <textarea
                className="input bg-white"
                placeholder="Hover Text"
                value={card.hoverText || ""}
                onChange={(e) => handleCardChange(index, "hoverText", e.target.value)}
              />

              <ImageUpload
                label="Card Image"
                value={card.image || ""}
                onChange={(url) => handleCardChange(index, "image", url)}
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
