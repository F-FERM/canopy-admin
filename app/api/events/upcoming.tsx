import axiosInstance from "@/service/axios";
import { AxiosError } from "axios";

// ─────────────────────────────────────
// Interfaces
// ─────────────────────────────────────

export interface EventButton {
    label: string;
    link: string;
}

export interface UpcomingEvent {
    title: string;
    date: string;
    location: string;
    description: string;
    image: string;
    button: EventButton;
    isActive: boolean;
}

export interface WhyAttendCard {
    title: string;
    description: string;
    isActive: boolean;
}

export interface UpcomingEventsSection {
    _id: string;

    upcomingHeading: string;
    upcomingHeadingHighlight: string;

    events: UpcomingEvent[];

    whyBadgeText: string;
    whyHeading: string;
    whyHeadingHighlight: string;

    whyAttendCards: WhyAttendCard[];

    createdAt: string;
    updatedAt: string;
}

// ─────────────────────────────────────

const BASE = "events/events-section";

// ─────────────────────────────────────
// LIST
// ─────────────────────────────────────

export const listUpcomingEventsApi = async (data: {
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
            params.append(
                "limit",
                limit.toString()
            );

        const response =
            await axiosInstance.get<
                UpcomingEventsSection[]
            >(
                `${BASE}?${params.toString()}`
            );

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

export const createUpcomingEvents =
    async (
        data: Partial<UpcomingEventsSection>
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

// ─────────────────────────────────────
// UPDATE
// ─────────────────────────────────────

export const updateUpcomingEvents =
    async (
        data: Partial<UpcomingEventsSection> & {
            _id: string;
        }
    ) => {
        try {
            const { _id, ...payload } = data;

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

// ─────────────────────────────────────
// DELETE
// ─────────────────────────────────────

export const deleteUpcomingEvents =
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