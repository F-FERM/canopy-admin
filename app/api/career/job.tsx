import axiosInstance from "@/service/axios";
import { AxiosError } from "axios";

export interface Requirement {
    text: string;
}

export interface Job {
    title: string;
    description: string;
    requirements: Requirement[];
    buttonText: string;
    applyLink: string;
    isActive: boolean;
}

export interface CareerOpeningsSection {
    _id: string;
    badgeText: string;
    heading: string;
    headingHighlight: string;
    headingEnd: string;
    description: string;
    jobs: Job[];
    createdAt: string;
    updatedAt: string;
}

const BASE = "careers/career-openings";

// ─────────────────────────────────────
// LIST
// ─────────────────────────────────────

export const listCareerOpeningsApi = async (data: {
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

        const response =
            await axiosInstance.get<
                CareerOpeningsSection[]
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

// ─────────────────────────────────────
// CREATE
// ─────────────────────────────────────

export const createCareerOpenings =
    async (
        data: Partial<CareerOpeningsSection>
    ) => {
        try {
            const res =
                await axiosInstance.post(
                    BASE,
                    data
                );

            return res.data;
        } catch (error) {
            throw (
                error as AxiosError
            ).response?.data;
        }
    };

// ─────────────────────────────────────
// UPDATE
// ─────────────────────────────────────

export const updateCareerOpenings =
    async (
        data: Partial<CareerOpeningsSection> & {
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
            throw (
                error as AxiosError
            ).response?.data;
        }
    };

// ─────────────────────────────────────
// DELETE
// ─────────────────────────────────────

export const deleteCareerOpenings =
    async (id: string) => {
        try {
            const res =
                await axiosInstance.delete(
                    `${BASE}/${id}`
                );

            return res.data;
        } catch (error) {
            throw (
                error as AxiosError
            ).response?.data;
        }
    };