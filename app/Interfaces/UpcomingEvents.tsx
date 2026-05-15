export interface ListUpcomingEventsResponse {
    _id: string;
    upcomingHeading: string;
    upcomingHeadingHighlight: string;
    events: Event[];
    whyBadgeText: string;
    whyHeading: string;
    whyHeadingHighlight: string;
    whyAttendCards: WhyAttendCard[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface WhyAttendCard {
    title: string;
    description: string;
    isActive: boolean;
}

interface Event {
    title: string;
    date: string;
    location: string;
    description: string;
    image: string;
    button: Button;
    isActive: boolean;
}

interface Button {
    label: string;
    link: string;
}