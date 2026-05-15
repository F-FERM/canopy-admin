import { ListFooterResponse } from "@/app/Interfaces/Footer";
import axiosInstance from "@/service/axios";
import { AxiosError } from "axios";

export interface SocialLink {
    platform: string;
    icon: string;
    link: string;
}

export interface LinkItem {
    label: string;
    link: string;
}

export interface ContactInfo {
    phone: string;
    email: string;
    address: string;
}

export interface Footer {
    _id: string;
    logo: string;
    companyName: string;
    description: string;

    socialLinks: SocialLink[];
    companyLinks: LinkItem[];
    serviceLinks: LinkItem[];
    bottomLinks: LinkItem[];

    contactInfo: ContactInfo;
    copyrightText: string;

    createdAt: string;
    updatedAt: string;
}

const BASE = "footer-section";

// ─────────────────────────────────────
// LIST
// ─────────────────────────────────────

export const listFooterApi = async (data: {
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
                ListFooterResponse[]
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

// CREATE
export const createFooterApi = async (data: Partial<Footer>) => {
    try {
        const res = await axiosInstance.post(BASE, data);
        return res.data;
    } catch (error) {
        throw (error as AxiosError).response?.data;
    }
};

// UPDATE
export const updateFooterApi = async (
    data: Partial<Footer> & { _id: string }
) => {
    try {
        const { _id, ...payload } = data;
        const res = await axiosInstance.patch(`${BASE}/${_id}`, payload);
        return res.data;
    } catch (error) {
        throw (error as AxiosError).response?.data;
    }
};

// DELETE
export const deleteFooterApi = async (id: string) => {
    try {
        const res = await axiosInstance.delete(`${BASE}/${id}`);
        return res.data;
    } catch (error) {
        throw (error as AxiosError).response?.data;
    }
};