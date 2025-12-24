export interface IItem {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  isRemoved: boolean;
  category: { name: string; slug?: string };
}
