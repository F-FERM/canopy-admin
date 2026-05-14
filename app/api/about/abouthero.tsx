import axiosInstance from "@/service/axios";
import { AxiosError } from "axios";

export interface StatItem {
  value: string;
  label: string;
}

export interface AboutSection {
  _id: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  headingEnd: string;
  descriptions: string[];
  image: string;
  stats: StatItem[];
  patternImage: string;
  createdAt: string;
  updatedAt: string;
}

const BASE = "/about/about-landing";

// ─────────────────────────────────────────────
// LIST
// ─────────────────────────────────────────────

export const listAboutSectionApi = async (data: {
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
        AboutSection[]
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

export const createAboutSection =
  async (
    data: Partial<AboutSection>
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

export const updateAboutSection =
  async (
    data: Partial<AboutSection> & {
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

export const deleteAboutSection =
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