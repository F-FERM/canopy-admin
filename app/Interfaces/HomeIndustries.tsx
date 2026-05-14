export interface ListHomeIndustriesSectionResponse {
  _id: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  description: string;
  industries: Industry[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Industry {
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
}