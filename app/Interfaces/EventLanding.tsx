export interface ListEventLandingResponse {
    _id: string;
    badgeText: string;
    heading: string;
    headingHighlight: string;
    headingEnd: string;
    description: string;
    buttons: Button[];
    images: Image[];
    featuredEvent: FeaturedEvent;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface FeaturedEvent {
    badgeText: string;
    title: string;
    date: string;
    location: string;
    description: string;
    backgroundImage: string;
    button: Button;
}

interface Image {
    image: string;
}

interface Button {
    label: string;
    link: string;
    variant: string;
}