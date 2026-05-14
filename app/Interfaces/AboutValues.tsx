export interface ListAboutValues {
  _id: string;
  cards: Card[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Card {
  number: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
}