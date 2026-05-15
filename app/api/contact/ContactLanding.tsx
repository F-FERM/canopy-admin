import axiosInstance from "@/service/axios";
import { AxiosError } from "axios";

// ─────────────────────────────────────
// Interfaces
// ─────────────────────────────────────

export interface Button {
    label: string;
    link: string;
    variant: "primary" | "outline";
    icon: string;
}

export interface ContactCard {
    title: string;
    icon: string;
    details: string[];
}

export interface FeatureCard {
    title: string;
    description: string;
    icon: string;
}

export interface ContactLandingSection {
    _id: string;

    badgeText: string;

    heading: string;

    headingHighlight: string;

    description: string;

    backgroundImage: string;

    buttons: Button[];

    contactTitle: string;

    contactHighlight: string;

    contactCards: ContactCard[];

    featureCards: FeatureCard[];

    createdAt: string;

    updatedAt: string;
}

const BASE = "contacts/contact-landing";

// ─────────────────────────────────────
// LIST
// ─────────────────────────────────────

export const listContactLandingApi =
    async (data: {
        search?: string;
        page?: number;
        limit?: number;
    }) => {
        const {
            search,
            page,
            limit,
        } = data;

        try {
            const params =
                new URLSearchParams();

            if (search)
                params.append(
                    "search",
                    search
                );

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
                    ContactLandingSection[]
                >(
                    `${BASE}?${params.toString()}`
                );

            return response.data;
        } catch (error) {
            if (
                error instanceof AxiosError
            ) {
                const apiError =
                    error.response?.data;

                const errorMessage =
                    apiError?.error ||
                    apiError?.message ||
                    error.message ||
                    "An unexpected error occurred";

                const normalizedError =
                    new Error(errorMessage);

                (normalizedError as any)
                    .statusCode =
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

export const createContactLanding =
    async (
        data: Partial<ContactLandingSection>
    ) => {
        try {
            const res =
                await axiosInstance.patch(
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

export const updateContactLanding =
    async (
        data: Partial<ContactLandingSection> & {
            _id: string;
        }
    ) => {
        try {
            const {
                _id,
                ...payload
            } = data;

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

export const deleteContactLanding =
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