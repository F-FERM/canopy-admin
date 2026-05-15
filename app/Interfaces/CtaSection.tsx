export interface ListCtaSectionResponse {
    _id: string;
    badgeText: string;
    heading: string;
    headingHighlight: string;
    description: string;
    buttons: Button[];
    backgroundColor: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface Button {
    label: string;
    link: string;
    variant: string;
    icon: string;
}