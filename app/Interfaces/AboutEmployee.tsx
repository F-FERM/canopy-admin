export interface ListAboutEmployee {
  _id: string;
  heading: string;
  headingHighlight: string;
  description: string;
  employees: Employee[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Employee {
  name: string;
  month: string;
  image: string;
  designation: string;
  description: string;
  isActive: boolean;
}