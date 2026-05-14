"use client";

import { useState } from "react";

import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─────────────────────────────────────

interface AboutCard {
  number: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
}

interface AboutCardsSection {
  _id?: string;
  cards: AboutCard[];
}

type Props = {
  initialData?: Partial<AboutCardsSection>;

  onSubmit: (
    data: Partial<AboutCardsSection>
  ) => Promise<void>;
};

// ─────────────────────────────────────

const defaultCard =
  (): AboutCard => ({
    number: "",
    title: "",
    description: "",
    icon: "",
    isActive: true,
  });

// ─────────────────────────────────────

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

// ─────────────────────────────────────

export default function AboutCardsForm({
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<
      Partial<AboutCardsSection>
    >(
      initialData || {
        cards: [defaultCard()],
      }
    );

  const [submitting, setSubmitting] =
    useState(false);

  // ─────────────────────────────────────

  const set = (
    key: keyof AboutCardsSection,
    value: any
  ) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  // ─────────────────────────────────────
  // Card handlers
  // ─────────────────────────────────────

  const addCard = () =>
    set("cards", [
      ...(form.cards || []),
      defaultCard(),
    ]);

  const removeCard = (i: number) =>
    set(
      "cards",
      (
        form.cards || []
      ).filter((_, idx) => idx !== i)
    );

  const updateCard = (
    i: number,
    key: keyof AboutCard,
    value: any
  ) => {
    const updated = (
      form.cards || []
    ).map((card, idx) =>
      idx === i
        ? {
            ...card,
            [key]: value,
          }
        : card
    );

    set("cards", updated);
  };

  // ─────────────────────────────────────

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const {
        _id,
        __v,
        createdAt,
        updatedAt,
        ...payload
      } = form as any;

      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-5xl"
    >
      {/* Cards */}

      <Section
        title={`Cards (${(form.cards || []).length})`}
      >
        <div className="space-y-6">
          {(form.cards || []).map(
            (card, i) => (
              <div
                key={i}
                className="border rounded-xl overflow-hidden"
              >
                {/* Header */}

                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                  <div className="font-medium text-sm text-gray-700">
                    Card {i + 1}
                    {card.title
                      ? ` — ${card.title}`
                      : ""}
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          card.isActive
                        }
                        onChange={(e) =>
                          updateCard(
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
                        removeCard(i)
                      }
                      disabled={
                        (
                          form.cards || []
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
                      placeholder="Number"
                      value={card.number}
                      onChange={(e) =>
                        updateCard(
                          i,
                          "number",
                          e.target.value
                        )
                      }
                    />

                    <input
                      className="input"
                      placeholder="Title"
                      value={card.title}
                      onChange={(e) =>
                        updateCard(
                          i,
                          "title",
                          e.target.value
                        )
                      }
                    />

                    <input
                      className="input"
                      placeholder="Icon Name"
                      value={card.icon}
                      onChange={(e) =>
                        updateCard(
                          i,
                          "icon",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <textarea
                    className="input min-h-[120px]"
                    placeholder="Description"
                    value={
                      card.description
                    }
                    onChange={(e) =>
                      updateCard(
                        i,
                        "description",
                        e.target.value
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
          onClick={addCard}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
        >
          <Plus size={16} />
          Add Card
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
          "Save About Cards"
        )}
      </button>
    </form>
  );
}