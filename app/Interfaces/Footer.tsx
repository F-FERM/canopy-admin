export interface ListFooterResponse {
    _id: string;
    logo: string;
    companyName: string;
    description: string;
    socialLinks: SocialLink[];
    companyLinks: CompanyLink[];
    serviceLinks: CompanyLink[];
    contactInfo: ContactInfo;
    bottomLinks: CompanyLink[];
    copyrightText: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ContactInfo {
    phone: string;
    email: string;
    address: string;
}

interface CompanyLink {
    label: string;
    link: string;
}

interface SocialLink {
    platform: string;
    icon: string;
    link: string;
}