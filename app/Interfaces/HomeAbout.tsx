export interface ListHomeAboutResponse {
  _id: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  descriptions: string[];
  primaryImage: string;
  secondaryImage: string;
  buttonText: string;
  buttonLink: string;
  patternImageTop: string;
  patternImageBottom: string;
  stats: Stat[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Stat {
  value: string;
  label: string;
}