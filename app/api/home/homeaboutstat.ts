// app/api/home/about.ts

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutSection {
  _id: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  descriptions: string[];
  primaryImage: string;
  secondaryImage: string;
  buttonText: string;
  buttonLink: string;
  patternImageTop: string;
  patternImageBottom: string;
  stats: AboutStat[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// ── List ──────────────────────────────────────────────────────────────────────
export async function listAboutApi(_params: Record<string, any> = {}): Promise<AboutSection[]> {
  const res = await fetch(`${BASE_URL}home/about`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch About sections: ${res.statusText}`);
  const json = await res.json();
  return Array.isArray(json) ? json : json?.data ?? [json];
}

// ── Create ────────────────────────────────────────────────────────────────────
export async function createAbout(data: Partial<AboutSection>): Promise<AboutSection> {
  const res = await fetch(`${BASE_URL}home/about`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create About section: ${res.statusText}`);
  return res.json();
}

// ── Update ────────────────────────────────────────────────────────────────────
export async function updateAbout(data: Partial<AboutSection> & { _id: string }): Promise<AboutSection> {
  const { _id, ...payload } = data;
  const res = await fetch(`${BASE_URL}home/about/${_id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to update About section: ${res.statusText}`);
  return res.json();
}

// ── Delete ────────────────────────────────────────────────────────────────────
export async function deleteAbout(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}home/about/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete About section: ${res.statusText}`);
}