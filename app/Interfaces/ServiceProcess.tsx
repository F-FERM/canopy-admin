export interface ListServiceResponse {
    _id: string;
    badgeText: string;
    heading: string;
    headingHighlight: string;
    processes: Process[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface Process {
    title: string;
    description: string;
    isActive: boolean;
}