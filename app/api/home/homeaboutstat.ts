import axiosInstance from "@/service/axios";
import { AxiosError } from "axios";

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

const BASE = "/home/about"; // adjust if backend differs

// ─────────────────────────────────────────────
// LIST
// ─────────────────────────────────────────────
export const listAboutApi = async (data: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { search, page, limit } = data;

  try {
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());

    const response = await axiosInstance.get<AboutSection[]>(
      `${BASE}?${params.toString()}`
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data;

      const errorMessage =
        apiError?.error ||
        apiError?.message ||
        error.message ||
        "An unexpected error occurred";

      const normalizedError = new Error(errorMessage);

      (normalizedError as any).statusCode =
        apiError?.statusCode || error.response?.status;

      (normalizedError as any).raw = apiError;

      throw normalizedError;
    }

    throw error;
  }
};

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────
export const createAboutApi = async (data: Partial<AboutSection>) => {
  try {
    const { __v, ...payload } = data as any;
    const res = await axiosInstance.post(BASE, payload);
    return res.data;
  } catch (error) {
    throw (error as AxiosError).response?.data;
  }
};

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────
export const updateAboutApi = async (
  data: Partial<AboutSection> & { _id: string }
) => {
  try {
    const { _id, __v, ...payload } = data as any;

    const res = await axiosInstance.patch(`${BASE}/${_id}`, payload);

    return res.data;
  } catch (error) {
    throw (error as AxiosError).response?.data;
  }
};

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────
export const deleteAboutApi = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`${BASE}/${id}`);
    return res.data;
  } catch (error) {
    throw (error as AxiosError).response?.data;
  }
};

// ─────────────────────────────────────────────
// GET SINGLE (optional but recommended)
// ─────────────────────────────────────────────
export const getAboutApi = async (id: string) => {
  try {
    const res = await axiosInstance.get<AboutSection>(
      `${BASE}/${id}`
    );
    return res.data;
  } catch (error) {
    throw (error as AxiosError).response?.data;
  }
};