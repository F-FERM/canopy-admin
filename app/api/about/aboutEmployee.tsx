import axiosInstance from "@/service/axios";
import { AxiosError } from "axios";

export interface Employee {
  name: string;
  month: string;
  image: string;
  designation: string;
  description: string;
  isActive: boolean;
}

export interface EmployeeServiceSection {
  _id: string;
  heading: string;
  headingHighlight: string;
  description: string;
  employees: Employee[];
  createdAt: string;
  updatedAt: string;
}

const BASE = "/about/employee-recognition";

// ─────────────────────────────────────────────
// LIST
// ─────────────────────────────────────────────

export const listEmployeeServiceApi = async (data: {
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
      params.append("page", page.toString());

    if (limit)
      params.append("limit", limit.toString());

    const response =
      await axiosInstance.get<EmployeeServiceSection[]>(
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

export const createEmployeeService =
  async (
    data: Partial<EmployeeServiceSection>
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

export const updateEmployeeService =
  async (
    data: Partial<EmployeeServiceSection> & {
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

export const deleteEmployeeService =
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