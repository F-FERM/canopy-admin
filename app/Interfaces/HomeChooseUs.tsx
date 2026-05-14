export interface ListHomeChooseUsResponse {
  _id: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  description: string;
  features: Feature[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Feature {
  number: string;
  title: string;
  description: string;
  icon: string;
}