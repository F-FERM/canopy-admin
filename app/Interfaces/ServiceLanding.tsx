export interface ListServiceLandingResponse {
  _id: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  descriptions: string[];
  backgroundImage: string;
  buttons: Button[];
  overlay: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Button {
  label: string;
  link: string;
  variant: string;
}