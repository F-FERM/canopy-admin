import axiosInstance from "@/service/axios";
import { AxiosError } from "axios";

// ─────────────────────────────────────
// Interfaces
// ─────────────────────────────────────

export interface Button {
    label: string;
    link: string;
    variant: "primary" | "outline";
}

export interface EventImage {
    image: string;
}

export interface FeaturedEvent {
    badgeText: string;
    title: string;
    date: string;
    location: string;
    description: string;
    backgroundImage: string;
    button: Button;
}

export interface EventsLandingSection {
    _id: string;
    badgeText: string;
    heading: string;
    headingHighlight: string;
    headingEnd: string;
    description: string;
    buttons: Button[];
    images: EventImage[];
    featuredEvent: FeaturedEvent;
    createdAt: string;
    updatedAt: string;
}

const BASE = "events/event-landing";

// ─────────────────────────────────────
// LIST
// ─────────────────────────────────────

export const listEventsLandingApi = async (data: {
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
                EventsLandingSection[]
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

export const createEventsLanding =
    async (
        data: Partial<EventsLandingSection>
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

export const updateEventsLanding =
    async (
        data: Partial<EventsLandingSection> & {
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

export const deleteEventsLanding =
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