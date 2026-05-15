import { ListBlogLandingResponse } from "@/app/Interfaces/BlogLanding";
import axiosInstance from "@/service/axios";
import { AxiosError } from "axios";

export interface Button {
    label: string;
    link: string;
    variant: "primary" | "outline";
}

export interface BlogLanding {
    _id: string;
    badgeText: string;
    heading: string;
    headingHighlight: string;
    description: string;
    backgroundImage: string;
    buttons: Button[];
    createdAt: string;
    updatedAt: string;
}

const BASE = "blog/blog-landing";

/* ---------------- LIST ---------------- */
export const listBlogLandingApi = async () => {
    try {
        const res = await axiosInstance.get<ListBlogLandingResponse[]>(BASE);
        return res.data;
    } catch (error) {
        throw error;
    }
};

/* ---------------- CREATE ---------------- */
export const createBlogLanding = async (data: Partial<BlogLanding>) => {
    try {
        const res = await axiosInstance.post(BASE, data);
        return res.data;
    } catch (error) {
        throw (error as AxiosError).response?.data;
    }
};

/* ---------------- UPDATE ---------------- */
export const updateBlogLanding = async (
    data: Partial<BlogLanding> & { _id: string }
) => {
    try {
        const { _id, ...payload } = data;
        const res = await axiosInstance.patch(`${BASE}/${_id}`, payload);
        return res.data;
    } catch (error) {
        throw (error as AxiosError).response?.data;
    }
};

/* ---------------- DELETE ---------------- */
export const deleteBlogLanding = async (id: string) => {
    try {
        const res = await axiosInstance.delete(`${BASE}/${id}`);
        return res.data;
    } catch (error) {
        throw (error as AxiosError).response?.data;
    }
};