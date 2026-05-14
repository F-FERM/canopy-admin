export interface ListAboutResponse {
  _id: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  headingEnd: string;
  descriptions: string[];
  image: string;
  stats: Stat[];
  patternImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Stat {
  value: string;
  label: string;
}
