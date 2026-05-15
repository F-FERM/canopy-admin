export interface ListCareerLandingResponse {
    _id: string;
    badgeText: string;
    heading: string;
    headingHighlight: string;
    headingEnd: string;
    description: string;
    image: string;
    patternImage: string;
    buttons: Button[];
    statsTitle: string;
    stats: Stat[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface Stat {
    value: string;
    label: string;
}

interface Button {
    label: string;
    link: string;
    variant: string;
}