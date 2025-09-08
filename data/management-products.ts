export interface ManagementProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export const managementProducts: ManagementProduct[] = [
  {
    id: "1",
    name: "Sample Product",
    price: 0,
    description: "Placeholder description",
    imageUrl: "/path/to/image.jpg",
  },
];