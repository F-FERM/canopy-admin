import axiosInstance from "@/service/axios";
import { AxiosError } from "axios";

export interface RootObject {
  _id: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  description: string;
  services: Service[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Service {
  title: string;
  slug?: string;
  image: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  detailPage?: DetailPage;
}

export interface DetailPage {
  heroSection: HeroSection;
  whyChooseSection: WhyChooseSection;
  responsibilitiesSection: ResponsibilitiesSection;
  industriesSection: IndustriesSection;
}

export interface IndustriesSection {
  heading: string;
  headingHighlight: string;
  description: string;
  industries: Responsibility[];
}

export interface ResponsibilitiesSection {
  heading: string;
  headingHighlight: string;
  responsibilities: Responsibility[];
}

export interface Responsibility {
  title: string;
  description: string;
}

export interface WhyChooseSection {
  heading: string;
  headingHighlight: string;
  descriptionOne: string;
  descriptionTwo: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

export interface HeroSection {
  badgeText: string;
  heading: string;
  headingHighlight: string;
  description: string;
  backgroundImage: string;
  buttonText: string;
  buttonLink: string;
}

const BASE = "service/security-services";

// ─────────────────────────────────────────────
// LIST
// ─────────────────────────────────────────────
export const listServicesPageApi = async (data: {
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

    const response = await axiosInstance.get<RootObject[]>(
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
export const createServicesPage = async (
  data: Partial<RootObject>
) => {
  try {
    const res = await axiosInstance.patch(BASE, data);
    return res.data;
  } catch (error) {
    throw (error as AxiosError).response?.data;
  }
};

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────
export const updateServicesPage = async (
  data: Partial<RootObject> & { _id: string }
) => {
  try {
    const { _id, ...payload } = data;

    const res = await axiosInstance.patch(
      `${BASE}/${_id}`,
      payload
    );

    return res.data;
  } catch (error) {
    throw (error as AxiosError).response?.data;
  }
};

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────
export const deleteServicesPage = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`${BASE}/${id}`);
    return res.data;
  } catch (error) {
    throw (error as AxiosError).response?.data;
  }
};