export interface ListServiceIndustriesResponse {
  _id: string;
  industries: Industry[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Industry {
  title: string;
  icon: string;
  isActive: boolean;
}