import axiosInstance from "@/service/axios";
import { AxiosError } from "axios";

export interface BlogItem {
  title: string;
  shortDescription: string;
  content: string;
  image: string;
  buttonText: string;
  slug: string;
  isActive: boolean;
  publishedAt: string;
  detailPage?: DetailPage;
}

export interface DetailPage {
  heroSection: HeroSection;
  importanceSection: ImportanceSection;
}

export interface HeroSection {
  heading: string;
  headingHighlight: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

export interface ImportanceSection {
  heading: string;
  headingHighlight: string;
  description: string;
  leftFeatures: Feature[];
  rightFeatures: Feature[];
}

export interface Feature {
  text: string;
}

export interface BlogSection {
  _id: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  description: string;
  blogs: BlogItem[];
  createdAt: string;
  updatedAt: string;
}

const BASE = "/home/blog-section";

// ─────────────────────────────────────────────
// LIST
// ─────────────────────────────────────────────

export const listBlogSectionApi = async (data: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { search, page, limit } = data;

  try {
    const params = new URLSearchParams();

    if (search)
      params.append("search", search);

    if (page)
      params.append(
        "page",
        page.toString()
      );

    if (limit)
      params.append(
        "limit",
        limit.toString()
      );

    const response =
      await axiosInstance.get<
        BlogSection[]
      >(`${BASE}?${params.toString()}`);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const apiError =
        error.response?.data;

      const errorMessage =
        apiError?.error ||
        apiError?.message ||
        error.message ||
        "An unexpected error occurred";

      const normalizedError =
        new Error(errorMessage);

      (normalizedError as any).statusCode =
        apiError?.statusCode ||
        error.response?.status;

      (normalizedError as any).raw =
        apiError;

      throw normalizedError;
    }

    throw error;
  }
};

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

export const createBlogSection =
  async (
    data: Partial<BlogSection>
  ) => {
    try {
      const res =
        await axiosInstance.post(
          BASE,
          data
        );

      return res.data;
    } catch (error) {
      throw (error as AxiosError)
        .response?.data;
    }
  };

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

export const updateBlogSection =
  async (
    data: Partial<BlogSection> & {
      _id: string;
    }
  ) => {
    try {
      const { _id, ...payload } =
        data;

      const res =
        await axiosInstance.patch(
          `${BASE}/${_id}`,
          payload
        );

      return res.data;
    } catch (error) {
      throw (error as AxiosError)
        .response?.data;
    }
  };

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

export const deleteBlogSection =
  async (id: string) => {
    try {
      const res =
        await axiosInstance.delete(
          `${BASE}/${id}`
        );

      return res.data;
    } catch (error) {
      throw (error as AxiosError)
        .response?.data;
    }
  };