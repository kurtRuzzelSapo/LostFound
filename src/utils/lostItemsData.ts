import type { LostItem } from "@/components/types/lostItem";

export const lostItems: LostItem[] = [
  {
    id: "1",
    title: "Blue Pencil Case",
    description: "A blue pencil case with pens, highlighters, and a USB stick.",
    imageUrl:
      "https://images.unsplash.com/photo-1607082349566-1870b8f60b44?auto=format&fit=crop&w=400&q=80",
    dateLost: "2024-06-10",
    location: "Math Building - Room 203",
    category: "School Supplies",
    isClaimed: false,
  },
  {
    id: "2",
    title: "White AirPods",
    description: "Missing one AirPod and case is slightly scratched.",
    imageUrl:
      "https://images.unsplash.com/photo-1606813908641-cf36cb732f5d?auto=format&fit=crop&w=400&q=80",
    dateLost: "2024-06-12",
    location: "Library Second Floor",
    category: "Electronics",
    isClaimed: false,
  },
  {
    id: "3",
    title: "Grey Hoodie",
    description: "Plain grey hoodie with no branding, medium size.",
    imageUrl:
      "https://images.unsplash.com/photo-1618354691325-9df51d5cb1be?auto=format&fit=crop&w=400&q=80",
    dateLost: "2024-06-14",
    location: "Cafeteria",
    category: "Clothing",
    isClaimed: false,
  },
  {
    id: "4",
    title: "Student ID",
    description: "Green university ID card with the name 'Riz Sapo'.",
    imageUrl:
      "https://images.unsplash.com/photo-1610563166156-4b753d88d501?auto=format&fit=crop&w=400&q=80",
    dateLost: "2024-06-15",
    location: "Admin Building",
    category: "Identification",
    isClaimed: false,
  },
  {
    id: "5",
    title: "Brown Wallet",
    description: "Small brown wallet with coins and bus card.",
    imageUrl:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    dateLost: "2024-06-17",
    location: "Main Entrance Bench",
    category: "Accessories",
    isClaimed: false,
  },
];
