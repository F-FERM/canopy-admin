"use client";

import { useState } from "react";
import { LisBlogResponse } from "@/interfaces/Blog";
import ImageUpload from "./ImageUpload";
import { Plus, Trash2, Edit } from "lucide-react";

type Props = {
  initialData?: Partial<LisBlogResponse>;
  onSubmit: (data: any) => Promise<void>;
  onIndividualCardUpdate?: (id: string, data: any) => Promise<void>;
};

export default function BlogLandingForm({
  initialData,
  onSubmit,
  onIndividualCardUpdate,
}: Props) {
  const [form, setForm] = useState<Partial<LisBlogResponse>>(
    initialData || {
      heroTitle: "",
      heroSubtitle: "",
      heroImage: "",
      heading: "",
      leftTitle: "",
      leftText: "",
      leftImage: "",
      rightTitle: "",
      rightText: "",
      rightImage: "",
      cards: [],
    },
  );

  const [blogSectionLoading, setBlogSectionLoading] = useState(false);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCardChange = (index: number, field: string, value: any) => {
    const updatedCards = [...(form.cards || [])];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    handleChange("cards", updatedCards);
  };

  const addCard = () => {
    const newCard = {
      _id: Date.now().toString(),
      title: "",
      description: "",
      content: "",
      image: "",
      tag: "",
      tags: [],
      date: new Date().toISOString().split("T")[0],
      isPublished: true,
    };
    handleChange("cards", [...(form.cards || []), newCard]);
  };

  const removeCard = (index: number) => {
    const updatedCards = [...(form.cards || [])];
    updatedCards.splice(index, 1);
    handleChange("cards", updatedCards);
  };

  const submit = async (e: any) => {
    e.preventDefault();
    // Exclude cards from the main payload as they are updated individually
    const { _id, __v, createdAt, updatedAt, cards, ...cleanPayload } = form as any;
    await onSubmit(cleanPayload);
  };

  const formatDateForInput = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      return dateStr.split("T")[0];
    }
    const parts = dateStr.split("-");
    if (parts.length === 3 && parts[2].length === 4) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split("T")[0];
      }
    } catch (e) {}
    return "";
  };

  const updateCard = async (index: number) => {
    console.log("Update card clicked for index:", index);
    const card = (form.cards || [])[index];
    if (!card || !card._id) {
      alert("Cannot update a card without an ID. Save the landing page first if it's new.");
      return;
    }
    
    setBlogSectionLoading(true);
    try {
      const cleanCard = {
        title: card.title,
        description: card.description,
        content: card.content,
        image: card.image,
        tag: card.tag,
        tags: card.tags,
        date: card.date
      };
      
      if (onIndividualCardUpdate) {
        await onIndividualCardUpdate(card._id, cleanCard);
      }
    } catch (err) {
      console.error("Card update error:", err);
    } finally {
      setBlogSectionLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-10 max-w-5xl">
      {/* Hero Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold border-b pb-3 text-gray-800">
          Hero Section
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Hero Title
            </label>
            <input
              className="input"
              placeholder="Enter hero title"
              value={form.heroTitle || ""}
              onChange={(e) => handleChange("heroTitle", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Hero Subtitle
            </label>
            <input
              className="input"
              placeholder="Enter hero subtitle"
              value={form.heroSubtitle || ""}
              onChange={(e) => handleChange("heroSubtitle", e.target.value)}
            />
          </div>
        </div>
        <ImageUpload
          label="Hero Image"
          value={form.heroImage || ""}
          onChange={(url) => handleChange("heroImage", url)}
        />
      </div>

      {/* Main Content Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold border-b pb-3 text-gray-800">
          Main Content
        </h3>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Main Heading
          </label>
          <input
            className="input"
            placeholder="Enter main heading"
            value={form.heading || ""}
            onChange={(e) => handleChange("heading", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider">
              Left Column
            </h4>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                className="input bg-white"
                placeholder="Left title"
                value={form.leftTitle || ""}
                onChange={(e) => handleChange("leftTitle", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Text Content
              </label>
              <textarea
                className="input bg-white min-h-[120px]"
                placeholder="Left text content"
                value={form.leftText || ""}
                onChange={(e) => handleChange("leftText", e.target.value)}
              />
            </div>
            <ImageUpload
              label="Left Image"
              value={form.leftImage || ""}
              onChange={(url) => handleChange("leftImage", url)}
            />
          </div>

          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider">
              Right Column
            </h4>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                className="input bg-white"
                placeholder="Right title"
                value={form.rightTitle || ""}
                onChange={(e) => handleChange("rightTitle", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Text Content
              </label>
              <textarea
                className="input bg-white min-h-[120px]"
                placeholder="Right text content"
                value={form.rightText || ""}
                onChange={(e) => handleChange("rightText", e.target.value)}
              />
            </div>
            <ImageUpload
              label="Right Image"
              value={form.rightImage || ""}
              onChange={(url) => handleChange("rightImage", url)}
            />
          </div>
        </div>
      </div>

      {/* Blog Cards Section */}
      <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-bold text-gray-800">
            Blog Posts (Cards)
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addCard}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold shadow-sm"
            >
              <Plus size={18} /> Add Post
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {form.cards?.map((card, index) => (
            <div
              key={card._id || index}
              className="p-6 border rounded-xl bg-gray-50 relative group shadow-inner"
            >
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => updateCard(index)}
                  className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-full"
                  title="Update Individual Card"
                >
                  <Edit size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => removeCard(index)}
                  className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-full"
                  title="Remove Post"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Post Title
                    </label>
                    <input
                      className="input bg-white"
                      placeholder="Post title"
                      value={card.title}
                      onChange={(e) =>
                        handleCardChange(index, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Category (Tag)
                      </label>
                      <input
                        className="input bg-white"
                        placeholder="e.g. Maritime"
                        value={card.tag}
                        onChange={(e) =>
                          handleCardChange(index, "tag", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Tags (comma separated)
                      </label>
                      <input
                        className="input bg-white"
                        placeholder="tag1, tag2, tag3"
                        value={card.tags?.join(", ")}
                        onChange={(e) =>
                          handleCardChange(
                            index,
                            "tags",
                            e.target.value.split(",").map((t) => t.trim()),
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        className="input bg-white"
                        type="date"
                        value={formatDateForInput(card.date)}
                        onChange={(e) =>
                          handleCardChange(index, "date", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Short Description
                    </label>
                    <textarea
                      className="input bg-white min-h-[80px]"
                      placeholder="Summary of the post"
                      value={card.description}
                      onChange={(e) =>
                        handleCardChange(index, "description", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Full Content
                    </label>
                    <textarea
                      className="input bg-white min-h-[200px]"
                      placeholder="Article content"
                      value={card.content}
                      onChange={(e) =>
                        handleCardChange(index, "content", e.target.value)
                      }
                    />
                  </div>
                  <ImageUpload
                    label="Post Image"
                    value={card.image}
                    onChange={(url) => handleCardChange(index, "image", url)}
                  />
                </div>
              </div>
            </div>
          ))}
          {(!form.cards || form.cards.length === 0) && (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed text-gray-500 italic">
              No blog posts added yet. Click "Add Post" to start.
            </div>
          )}
        </div>
      </div>

      <button className="w-full px-4 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg sticky bottom-6 z-10">
        Update Entire Blog Section
      </button>
    </form>
  );
}
