export interface ListContactLandingResponse {
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
    __v: number;
}

interface FeatureCard {
    title: string;
    description: string;
    icon: string;
}

interface ContactCard {
    title: string;
    icon: string;
    details: string[];
}

interface Button {
    label: string;
    link: string;
    variant: string;
    icon: string;
}