export interface ListHomeBlogResponse {
  _id: string;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  description: string;
  blogs: Blog[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Blog {
  title: string;
  shortDescription: string;
  content: string;
  image: string;
  buttonText: string;
  slug: string;
  isActive: boolean;
  publishedAt: string;
}