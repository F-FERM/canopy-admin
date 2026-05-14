"use client";

import { useState } from "react";
import { ListFooterResponse } from "@/interfaces/Footer";

type Props = {
  initialData?: Partial<ListFooterResponse>;
  onSubmit: (data: any) => Promise<void>;
};

export default function FooterForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<ListFooterResponse>>(
    initialData || {
      brand: "",
      copyright: "",
      sections: [],
      officeAddress: "",
      email: "",
      phone: "",
      privacyPolicy: "",
      terms: "",
      ctaText: "",
      ctaLink: "",
    }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSectionChange = (index: number, key: string, value: any) => {
    const newSections = [...(form.sections || [])];
    newSections[index] = { ...newSections[index], [key]: value };
    setForm((prev) => ({ ...prev, sections: newSections }));
  };

  const handleLinkChange = (sectionIndex: number, linkIndex: number, key: string, value: any) => {
    const newSections = [...(form.sections || [])];
    const newLinks = [...(newSections[sectionIndex]?.links || [])];
    newLinks[linkIndex] = { ...newLinks[linkIndex], [key]: value };
    newSections[sectionIndex] = { ...newSections[sectionIndex], links: newLinks };
    setForm((prev) => ({ ...prev, sections: newSections }));
  };

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), { title: "", links: [] } as any],
    }));
  };

  const removeSection = (index: number) => {
    setForm((prev) => ({
      ...prev,
      sections: (prev.sections || []).filter((_, i) => i !== index),
    }));
  };

  const addLink = (sectionIndex: number) => {
    const newSections = [...(form.sections || [])];
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      links: [...(newSections[sectionIndex]?.links || []), { label: "", url: "" } as any],
    };
    setForm((prev) => ({ ...prev, sections: newSections }));
  };

  const removeLink = (sectionIndex: number, linkIndex: number) => {
    const newSections = [...(form.sections || [])];
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      links: (newSections[sectionIndex]?.links || []).filter((_, i) => i !== linkIndex),
    };
    setForm((prev) => ({ ...prev, sections: newSections }));
  };

  const submit = async (e: any) => {
    e.preventDefault();
    const cleanSections = (form.sections || []).map((section: any) => {
      const { _id, __v, createdAt, updatedAt, ...rest } = section;
      return {
        ...rest,
        links: (rest.links || []).map(({ _id: linkId, __v: v, createdAt: ca, updatedAt: ua, ...linkRest }: any) => linkRest),
      };
    });
    
    const payload = {
      brand: form.brand,
      copyright: form.copyright,
      sections: cleanSections,
      officeAddress: form.officeAddress,
      email: form.email,
      phone: form.phone,
      privacyPolicy: form.privacyPolicy,
      terms: form.terms,
      ctaText: form.ctaText,
      ctaLink: form.ctaLink,
    };
    
    await onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      {/* Basic Footer Info */}
      <div className="border rounded-lg p-4 space-y-4 bg-gray-50/50">
        <h3 className="text-lg font-medium">Footer Information</h3>
        
        <input
          className="input"
          placeholder="Brand Name"
          value={form.brand || ""}
          onChange={(e) => handleChange("brand", e.target.value)}
        />

        <textarea
          className="input"
          placeholder="Copyright Text"
          value={form.copyright || ""}
          onChange={(e) => handleChange("copyright", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Office Address"
            value={form.officeAddress || ""}
            onChange={(e) => handleChange("officeAddress", e.target.value)}
          />
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={form.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <input
          className="input"
          placeholder="Phone Number"
          value={form.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Privacy Policy URL"
            value={form.privacyPolicy || ""}
            onChange={(e) => handleChange("privacyPolicy", e.target.value)}
          />
          <input
            className="input"
            placeholder="Terms URL"
            value={form.terms || ""}
            onChange={(e) => handleChange("terms", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="CTA Text"
            value={form.ctaText || ""}
            onChange={(e) => handleChange("ctaText", e.target.value)}
          />
          <input
            className="input"
            placeholder="CTA Link"
            value={form.ctaLink || ""}
            onChange={(e) => handleChange("ctaLink", e.target.value)}
          />
        </div>
      </div>

      {/* Footer Sections */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Footer Sections</h3>
          <button
            type="button"
            onClick={addSection}
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm font-medium hover:bg-blue-200"
          >
            + Add Section
          </button>
        </div>

        <div className="grid gap-6">
          {form.sections?.map((section, sectionIndex) => (
            <div key={sectionIndex} className="p-4 border rounded-lg space-y-4 bg-gray-50/50 relative">
              <button
                type="button"
                onClick={() => removeSection(sectionIndex)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                Remove Section
              </button>

              <input
                className="input bg-white"
                placeholder="Section Title"
                value={section.title || ""}
                onChange={(e) => handleSectionChange(sectionIndex, "title", e.target.value)}
              />

              {/* Links within Section */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">Links</h4>
                  <button
                    type="button"
                    onClick={() => addLink(sectionIndex)}
                    className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs font-medium hover:bg-green-200"
                  >
                    + Add Link
                  </button>
                </div>

                <div className="space-y-3">
                  {section.links?.map((link, linkIndex) => (
                    <div key={linkIndex} className="p-3 bg-white border rounded-md flex gap-3 items-end">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input
                          className="input bg-gray-50"
                          placeholder="Link Label"
                          value={link.label || ""}
                          onChange={(e) =>
                            handleLinkChange(sectionIndex, linkIndex, "label", e.target.value)
                          }
                        />
                        <input
                          className="input bg-gray-50"
                          placeholder="Link URL"
                          value={link.url || ""}
                          onChange={(e) =>
                            handleLinkChange(sectionIndex, linkIndex, "url", e.target.value)
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLink(sectionIndex, linkIndex)}
                        className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
