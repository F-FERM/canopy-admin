import axiosInstance from "@/service/axios";
import { AxiosError } from "axios";

// ─────────────────────────────────────
// Types
// ─────────────────────────────────────

export interface CTAButton {
    label: string;
    link: string;
    variant: "primary" | "outline";
    icon: string;
}

export interface ContactCTASection {
    _id: string;

    badgeText: string;

    heading: string;

    headingHighlight: string;

    description: string;

    buttons: CTAButton[];

    backgroundColor: string;

    createdAt: string;

    updatedAt: string;
}

const BASE = "home/cta-section";

// ─────────────────────────────────────
// LIST
// ─────────────────────────────────────

export const listContactCTAApi = async (data: {
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

        const res = await axiosInstance.get<ContactCTASection[]>(
            `${BASE}?${params.toString()}`
        );

        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            const apiError = error.response?.data;

            const message =
                apiError?.error ||
                apiError?.message ||
                error.message ||
                "Unexpected error";

            const normalized = new Error(message);

            (normalized as any).statusCode =
                apiError?.statusCode || error.response?.status;

            throw normalized;
        }

        throw error;
    }
};

// ─────────────────────────────────────
// CREATE
// ─────────────────────────────────────

export const createContactCTA = async (
    data: Partial<ContactCTASection>
) => {
    try {
        const res = await axiosInstance.patch(BASE, data);
        return res.data;
    } catch (error) {
        throw (error as AxiosError).response?.data;
    }
};

// ─────────────────────────────────────
// UPDATE
// ─────────────────────────────────────

export const updateContactCTA = async (
    data: Partial<ContactCTASection> & { _id: string }
) => {
    try {
        const { _id, ...payload } = data;

        const res = await axiosInstance.patch(`${BASE}/${_id}`, payload);

        return res.data;
    } catch (error) {
        throw (error as AxiosError).response?.data;
    }
};

// ─────────────────────────────────────
// DELETE
// ─────────────────────────────────────

export const deleteContactCTA = async (id: string) => {
    try {
        const res = await axiosInstance.delete(`${BASE}/${id}`);
        return res.data;
    } catch (error) {
        throw (error as AxiosError).response?.data;
    }
};