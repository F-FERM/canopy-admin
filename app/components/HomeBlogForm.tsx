"use client";

import { useState } from "react";

import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import ImageUpload from "./ImageUpload";

// ─────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────

interface BlogItem {
  title: string;
  shortDescription: string;
  content: string;
  image: string;
  buttonText: string;
  slug: string;
  isActive: boolean;
  publishedAt: string;
}

interface BlogSection {
  _id?: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  description: string;
  blogs: BlogItem[];
}

type Props = {
  initialData?: Partial<BlogSection>;

  onSubmit: (
    data: Partial<BlogSection>
  ) => Promise<void>;
};

// ─────────────────────────────────────────────

const defaultBlog = (): BlogItem => ({
  title: "",
  shortDescription: "",
  content: "",
  image: "",
  buttonText: "Read More",
  slug: "",
  isActive: true,
  publishedAt:
    new Date().toISOString(),
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

export default function BlogSectionForm({
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<Partial<BlogSection>>(
      initialData || {
        badgeText: "",
        heading: "",
        headingHighlight: "",
        description: "",
        blogs: [defaultBlog()],
      }
    );

  const [submitting, setSubmitting] =
    useState(false);

  // ─────────────────────────────────────────────

  const set = (
    key: keyof BlogSection,
    value: any
  ) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  // ─────────────────────────────────────────────
  // Blog handlers
  // ─────────────────────────────────────────────

  const addBlog = () =>
    set("blogs", [
      ...(form.blogs || []),
      defaultBlog(),
    ]);

  const removeBlog = (i: number) =>
    set(
      "blogs",
      (form.blogs || []).filter(
        (_, idx) => idx !== i
      )
    );

  const updateBlog = (
    i: number,
    key: keyof BlogItem,
    value: any
  ) => {
    const updated = (
      form.blogs || []
    ).map((blog, idx) =>
      idx === i
        ? {
            ...blog,
            [key]: value,
          }
        : blog
    );

    set("blogs", updated);
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
      {/* Section Content */}

      <Section title="Section Content">
        <input
          className="input"
          placeholder="Badge Text"
          value={form.badgeText || ""}
          onChange={(e) =>
            set(
              "badgeText",
              e.target.value
            )
          }
        />

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
          className="input min-h-[120px]"
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

      {/* Blogs */}

      <Section
        title={`Blogs (${(form.blogs || []).length})`}
      >
        <div className="space-y-6">
          {(form.blogs || []).map(
            (blog, bi) => (
              <div
                key={bi}
                className="border rounded-xl overflow-hidden"
              >
                {/* Header */}

                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                  <div className="flex items-center gap-2">
                    <GripVertical
                      size={16}
                      className="text-gray-400"
                    />

                    <span className="font-medium text-gray-700 text-sm">
                      Blog {bi + 1}
                      {blog.title
                        ? ` — ${blog.title}`
                        : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          blog.isActive
                        }
                        onChange={(e) =>
                          updateBlog(
                            bi,
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
                        removeBlog(bi)
                      }
                      disabled={
                        (
                          form.blogs || []
                        ).length <= 1
                      }
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-30 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Body */}

                <div className="p-4 space-y-4">
                  <input
                    className="input"
                    placeholder="Blog Title"
                    value={blog.title}
                    onChange={(e) =>
                      updateBlog(
                        bi,
                        "title",
                        e.target.value
                      )
                    }
                  />

                  <input
                    className="input"
                    placeholder="Slug"
                    value={blog.slug}
                    onChange={(e) =>
                      updateBlog(
                        bi,
                        "slug",
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Short Description"
                    value={
                      blog.shortDescription
                    }
                    onChange={(e) =>
                      updateBlog(
                        bi,
                        "shortDescription",
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    className="input min-h-[220px]"
                    placeholder="Full Blog Content"
                    value={blog.content}
                    onChange={(e) =>
                      updateBlog(
                        bi,
                        "content",
                        e.target.value
                      )
                    }
                  />

                  <ImageUpload
                    label="Blog Image"
                    value={blog.image}
                    onChange={(
                      url: string
                    ) =>
                      updateBlog(
                        bi,
                        "image",
                        url
                      )
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      className="input"
                      placeholder="Button Text"
                      value={
                        blog.buttonText
                      }
                      onChange={(e) =>
                        updateBlog(
                          bi,
                          "buttonText",
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="datetime-local"
                      className="input"
                      value={
                        blog.publishedAt
                          ? new Date(
                              blog.publishedAt
                            )
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        updateBlog(
                          bi,
                          "publishedAt",
                          new Date(
                            e.target.value
                          ).toISOString()
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <button
          type="button"
          onClick={addBlog}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors mt-2"
        >
          <Plus size={16} />
          Add Blog
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
          "Save Blog Section"
        )}
      </button>
    </form>
  );
}