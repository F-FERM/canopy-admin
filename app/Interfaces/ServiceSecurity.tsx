export interface ListServiceSecurityResponse {
  _id: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  description: string;
  services: Service[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Service {
  title: string;
  image: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
}