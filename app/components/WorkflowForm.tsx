"use client";

import { useState } from "react";
import { UpdateWorkFlow, UpdateStep } from "@/interfaces/Home";

type Props = {
  initialData?: Partial<UpdateWorkFlow>;
  onSubmit: (data: UpdateWorkFlow) => Promise<void>;
};

const defaultForm: UpdateWorkFlow = {
  heading: "",
  description: "",
  cta: "",
  steps: [],
};

export default function WorkflowForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<UpdateWorkFlow>({
    ...defaultForm,
    ...initialData,
    steps: initialData?.steps || [],
  });

  const handleChange = <K extends keyof Omit<UpdateWorkFlow, "steps">>(
    key: K,
    value: UpdateWorkFlow[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleStepChange = <K extends keyof UpdateStep>(
    index: number,
    key: K,
    value: UpdateStep[K]
  ) => {
    const newSteps = [...form.steps];
    newSteps[index] = { ...newSteps[index], [key]: value };
    setForm((prev) => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    const nextId = form.steps.length + 1;
    const newStep: UpdateStep = {
      id: `#${nextId}`,
      title: "",
      description: "",
      variant: "blue",
    };
    setForm((prev) => ({ ...prev, steps: [...prev.steps, newStep] }));
  };

  const removeStep = (index: number) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Construct a clean payload matching the UpdateWorkFlow structure
    const payload: UpdateWorkFlow = {
      heading: form.heading,
      description: form.description,
      cta: form.cta,
      steps: form.steps.map(({ id, title, description, variant }) => ({
        id,
        title,
        description,
        variant,
      })),
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="space-y-4">
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
           <input
            className="input w-full border-gray-300 rounded-md"
            placeholder="Heading"
            value={form.heading || ""}
            onChange={(e) => handleChange("heading", e.target.value)}
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
           <textarea
            className="input w-full border-gray-300 rounded-md"
            placeholder="Description"
            rows={3}
            value={form.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
           <input
            className="input w-full border-gray-300 rounded-md"
            placeholder="CTA Text"
            value={form.cta || ""}
            onChange={(e) => handleChange("cta", e.target.value)}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Workflow Steps</h3>
          <button
            type="button"
            onClick={addStep}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            + Add Step
          </button>
        </div>

        <div className="grid gap-6">
          {form.steps?.map((step, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50/50 relative border-gray-200">
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Step ID</label>
                  <input
                    className="input bg-white w-full border-gray-300 rounded-md"
                    placeholder="#1"
                    value={step.id || ""}
                    onChange={(e) => handleStepChange(index, "id", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Step Title</label>
                  <input
                    className="input bg-white w-full border-gray-300 rounded-md"
                    placeholder="Step Title"
                    value={step.title || ""}
                    onChange={(e) => handleStepChange(index, "title", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Variant</label>
                  <select
                    className="input bg-white w-full border-gray-300 rounded-md"
                    value={step.variant || "blue"}
                    onChange={(e) => handleStepChange(index, "variant", e.target.value)}
                  >
                    <option value="blue">Blue</option>
                    <option value="maroon">Maroon</option>
                    <option value="yellow">Yellow</option>
                    <option value="green">Green</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Step Description</label>
                <textarea
                  className="input bg-white w-full border-gray-300 rounded-md"
                  placeholder="Step Description"
                  rows={2}
                  value={step.description || ""}
                  onChange={(e) => handleStepChange(index, "description", e.target.value)}
                />
              </div>
            </div>
          ))}

          {form.steps.length === 0 && (
            <p className="text-gray-500 text-center py-4 italic">No steps added yet.</p>
          )}
        </div>
      </div>

      <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md">
        Save Workflow Efficiency
      </button>
    </form>
  );
}
