export interface ListCareerJobOpeningsResponse {
    _id: string;
    badgeText: string;
    heading: string;
    headingHighlight: string;
    headingEnd: string;
    description: string;
    jobs: Job[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface Job {
    title: string;
    description: string;
    requirements: Requirement[];
    buttonText: string;
    applyLink: string;
    isActive: boolean;
}

interface Requirement {
    text: string;
}