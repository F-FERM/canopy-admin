export interface ListBlogLandingResponse {
    _id: string;
    badgeText: string;
    heading: string;
    headingHighlight: string;
    description: string;
    backgroundImage: string;
    buttons: Button[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface Button {
    label: string;
    link: string;
    variant: string;
}