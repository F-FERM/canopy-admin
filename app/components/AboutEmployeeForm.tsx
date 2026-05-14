"use client";

import { useState } from "react";

import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import ImageUpload from "./ImageUpload";

// ─────────────────────────────────────────────

interface Employee {
  name: string;
  month: string;
  image: string;
  designation: string;
  description: string;
  isActive: boolean;
}

interface EmployeeServiceSection {
  _id?: string;
  heading: string;
  headingHighlight: string;
  description: string;
  employees: Employee[];
}

type Props = {
  initialData?: Partial<EmployeeServiceSection>;

  onSubmit: (
    data: Partial<EmployeeServiceSection>
  ) => Promise<void>;
};

// ─────────────────────────────────────────────

const defaultEmployee =
  (): Employee => ({
    name: "",
    month: "",
    image: "",
    designation: "",
    description: "",
    isActive: true,
  });

// ─────────────────────────────────────────────

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] =
    useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <button
        type="button"
        onClick={() =>
          setOpen((v) => !v)
        }
        className="w-full flex items-center justify-between px-6 py-4 border-b bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <h3 className="text-base font-semibold text-gray-800">
          {title}
        </h3>

        {open ? (
          <ChevronUp
            size={18}
            className="text-gray-500"
          />
        ) : (
          <ChevronDown
            size={18}
            className="text-gray-500"
          />
        )}
      </button>

      {open && (
        <div className="p-6 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────

export default function EmployeeServiceForm({
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<
      Partial<EmployeeServiceSection>
    >(
      initialData || {
        heading: "",
        headingHighlight: "",
        description: "",
        employees: [
          defaultEmployee(),
        ],
      }
    );

  const [submitting, setSubmitting] =
    useState(false);

  // ─────────────────────────────────────────────

  const set = (
    key: keyof EmployeeServiceSection,
    value: any
  ) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  // ─────────────────────────────────────────────
  // Employee handlers
  // ─────────────────────────────────────────────

  const addEmployee = () =>
    set("employees", [
      ...(form.employees || []),
      defaultEmployee(),
    ]);

  const removeEmployee = (
    i: number
  ) =>
    set(
      "employees",
      (
        form.employees || []
      ).filter((_, idx) => idx !== i)
    );

  const updateEmployee = (
    i: number,
    key: keyof Employee,
    value: any
  ) => {
    const updated = (
      form.employees || []
    ).map((employee, idx) =>
      idx === i
        ? {
            ...employee,
            [key]: value,
          }
        : employee
    );

    set("employees", updated);
  };

  // ─────────────────────────────────────────────

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const {
        _id,
        __v,
        _v,
        createdAt,
        updatedAt,
        created_at,
        updated_at,
        ...payload
      } = form as any;

      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-5xl"
    >
      {/* Heading */}

      <Section title="Section Content">
        <input
          className="input"
          placeholder="Heading"
          value={form.heading || ""}
          onChange={(e) =>
            set(
              "heading",
              e.target.value
            )
          }
        />

        <input
          className="input"
          placeholder="Heading Highlight"
          value={
            form.headingHighlight || ""
          }
          onChange={(e) =>
            set(
              "headingHighlight",
              e.target.value
            )
          }
        />

        <textarea
          className="input min-h-[100px]"
          placeholder="Description"
          value={form.description || ""}
          onChange={(e) =>
            set(
              "description",
              e.target.value
            )
          }
        />
      </Section>

      {/* Employees */}

      <Section
        title={`Employees (${(form.employees || []).length})`}
      >
        <div className="space-y-6">
          {(form.employees || []).map(
            (employee, i) => (
              <div
                key={i}
                className="border rounded-xl overflow-hidden"
              >
                {/* Header */}

                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                  <div className="font-medium text-sm text-gray-700">
                    Employee {i + 1}
                    {employee.name
                      ? ` — ${employee.name}`
                      : ""}
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          employee.isActive
                        }
                        onChange={(e) =>
                          updateEmployee(
                            i,
                            "isActive",
                            e.target.checked
                          )
                        }
                        className="accent-blue-600 w-4 h-4"
                      />

                      Active
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        removeEmployee(i)
                      }
                      disabled={
                        (
                          form.employees ||
                          []
                        ).length <= 1
                      }
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Fields */}

                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      className="input"
                      placeholder="Employee Name"
                      value={
                        employee.name
                      }
                      onChange={(e) =>
                        updateEmployee(
                          i,
                          "name",
                          e.target.value
                        )
                      }
                    />

                    <input
                      className="input"
                      placeholder="Month"
                      value={
                        employee.month
                      }
                      onChange={(e) =>
                        updateEmployee(
                          i,
                          "month",
                          e.target.value
                        )
                      }
                    />

                    <input
                      className="input"
                      placeholder="Designation"
                      value={
                        employee.designation
                      }
                      onChange={(e) =>
                        updateEmployee(
                          i,
                          "designation",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Description"
                    value={
                      employee.description
                    }
                    onChange={(e) =>
                      updateEmployee(
                        i,
                        "description",
                        e.target.value
                      )
                    }
                  />

                  <ImageUpload
                    label="Employee Image"
                    value={
                      employee.image
                    }
                    onChange={(
                      url: string
                    ) =>
                      updateEmployee(
                        i,
                        "image",
                        url
                      )
                    }
                  />
                </div>
              </div>
            )
          )}
        </div>

        <button
          type="button"
          onClick={addEmployee}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </Section>

      {/* Submit */}

      <button
        type="submit"
        disabled={submitting}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            Saving...
          </>
        ) : (
          "Save Employee Section"
        )}
      </button>
    </form>
  );
}