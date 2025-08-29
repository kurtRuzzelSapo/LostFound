import type { FoundItem } from "@/components/types/foundItem";

// Example dummy data
export const foundItems: FoundItem[] = [
  {
    id: "1",
    title: "Wallet",
    description: "Black wallet with cards",
    image_url: "/images/wallet.jpg",
    date_found: "2025-08-30",
    location: "Library",
    category: "Accessories",
    isClaimed: false,
    user_id: "123",              // ✅ added
    createdAt: "2025-08-30",    // ✅ added
    updatedAt: "2025-08-30",    // ✅ added
  },
  {
    id: "2",
    title: "Red Umbrella",
    description: "A small red umbrella left near the entrance.",
    image_url:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=400&q=80",
    date_found: "2024-06-03",
    location: "Main Gate",
    category: "Accessories",
    isClaimed: false,
    user_id: "123",              // ✅ added
    createdAt: "2025-08-30",    // ✅ added
    updatedAt: "2025-08-30",    // ✅ added
  },
  {
    id: "3",
    title: "Blue Water Bottle",
    description: "Reusable bottle with motivational quotes.",
    image_url:
      "https://images.unsplash.com/photo-1608452954471-799c9cbf2f16?auto=format&fit=crop&w=400&q=80",
    date_found: "2024-06-05",
    location: "Gym",
    category: "Beverage Containers",
    isClaimed: false,
    user_id: "123",              // ✅ added
    createdAt: "2025-08-30",    // ✅ added
    updatedAt: "2025-08-30",    // ✅ added
  },
  {
    id: "4",
    title: "Silver Ring",
    description: "A small silver ring with a heart engraving.",
    image_url:
      "https://images.unsplash.com/photo-1600369672223-10f58d6b8c5f?auto=format&fit=crop&w=400&q=80",
    date_found: "2024-06-07",
    location: "Cafeteria",
    category: "Jewelry",
    isClaimed: false,
    user_id: "123",              // ✅ added
    createdAt: "2025-08-30",    // ✅ added
    updatedAt: "2025-08-30",    // ✅ added
  },
  {
    id: "5",
    title: "Black Backpack",
    description: "Backpack with textbooks and a water bottle.",
    image_url:
      "https://images.unsplash.com/photo-1542062703-3d7c63e52d6d?auto=format&fit=crop&w=400&q=80",
    date_found: "2024-06-08",
    location: "Lecture Hall A",
    category: "Bags",
    isClaimed: false,
    user_id: "123",              // ✅ added
    createdAt: "2025-08-30",    // ✅ added
    updatedAt: "2025-08-30",    // ✅ added
  },
  {
    id: "6",
    title: "Android Phone",
    description: "Phone with cracked screen and blue case.",
    image_url:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
    date_found: "2024-06-10",
    location: "Library",
    category: "Electronics",
    isClaimed: false,
    user_id: "123",              // ✅ added
    createdAt: "2025-08-30",    // ✅ added
    updatedAt: "2025-08-30",    // ✅ added
  },
  {
    id: "7",
    title: "Calculator",
    description: "Casio scientific calculator found in exam hall.",
    image_url:
      "https://images.unsplash.com/photo-1573496130141-209d200cebd9?auto=format&fit=crop&w=400&q=80",
    date_found: "2024-06-11",
    location: "Exam Hall",
    category: "School Supplies",
    isClaimed: false,
    user_id: "123",              // ✅ added
    createdAt: "2025-08-30",    // ✅ added
    updatedAt: "2025-08-30",    // ✅ added
  },
  {
    id: "8",
    title: "Keychain with House Keys",
    description: "Black keychain with three silver keys.",
    image_url:
      "https://images.unsplash.com/photo-1583337130417-3346a1a4f34e?auto=format&fit=crop&w=400&q=80",
    date_found: "2024-06-13",
    location: "Cafeteria",
    category: "Keys",
    isClaimed: false,
    user_id: "123",              // ✅ added
    createdAt: "2025-08-30",    // ✅ added
    updatedAt: "2025-08-30",    // ✅ added
  },
  {
    id: "9",
    title: "Leather Journal",
    description: "Brown leather journal with handwritten notes.",
    image_url:
      "https://images.unsplash.com/photo-1556228578-1b1aab118e2c?auto=format&fit=crop&w=400&q=80",
    date_found: "2024-06-14",
    location: "Library",
    category: "Stationery",
    isClaimed: false,
    user_id: "123",              // ✅ added
    createdAt: "2025-08-30",    // ✅ added
    updatedAt: "2025-08-30",    // ✅ added
  },
  {
    id: "10",
    title: "Bluetooth Headphones",
    description: "Wireless headphones, black, slightly worn.",
    image_url:
      "https://images.unsplash.com/photo-1583439483889-777edb38de9c?auto=format&fit=crop&w=400&q=80",
    date_found: "2024-06-16",
    location: "Study Area",
    category: "Electronics",
    isClaimed: false,
    user_id: "123",              // ✅ added
    createdAt: "2025-08-30",    // ✅ added
    updatedAt: "2025-08-30",    // ✅ added
  },
  {
    id: "11",
    title: "Green Hoodie",
    description: "Oversized green hoodie with white stripes.",
    image_url:
      "https://images.unsplash.com/photo-1618354691325-9df51d5cb1be?auto=format&fit=crop&w=400&q=80",
    date_found: "2024-06-18",
    location: "Locker Room",
    category: "Clothing",
    isClaimed: false,
    user_id: "123",              // ✅ added
    createdAt: "2025-08-30",    // ✅ added
    updatedAt: "2025-08-30",    // ✅ added
  },
  {
    id: "12",
    title: "Sketchbook",
    description: "Hardcover sketchbook with pencil drawings.",
    image_url:
      "https://images.unsplash.com/photo-1523289333742-be1143f6b766?auto=format&fit=crop&w=400&q=80",
    date_found: "2024-06-20",
    location: "Art Room",
    category: "Stationery",
    isClaimed: false,
    user_id: "123",              // ✅ added
    createdAt: "2025-08-30",    // ✅ added
    updatedAt: "2025-08-30",    // ✅ added
  },
  {
    id: "13",
    title: "Makeup Pouch",
    description: "Small pink pouch containing cosmetics.",
    image_url:
      "https://images.unsplash.com/photo-1608032071483-4002d3e5d1a3?auto=format&fit=crop&w=400&q=80",
    date_found: "2024-06-21",
    location: "Restroom",
    category: "Personal Items",
    isClaimed: false,
    user_id: "123",              // ✅ added
    createdAt: "2025-08-30",    // ✅ added
    updatedAt: "2025-08-30",    // ✅ added
  },
  {
    id: "14",
    title: "Black Sunglasses",
    description: "Classic style sunglasses in a black case.",
    image_url:
      "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?auto=format&fit=crop&w=400&q=80",
    date_found: "2024-06-22",
    location: "Entrance Hall",
    category: "Accessories",
    isClaimed: false,
    user_id: "123",              // ✅ added
    createdAt: "2025-08-30",    // ✅ added
    updatedAt: "2025-08-30",    // ✅ added
  },
  {
    id: "15",
    title: "Laptop Charger",
    description: "Dell 65W power adapter found under a desk.",
    image_url:
      "https://images.unsplash.com/photo-1586500018300-6aaf69762d89?auto=format&fit=crop&w=400&q=80",
    date_found: "2024-06-23",
    location: "Computer Lab",
    category: "Electronics",
    isClaimed: false,
    user_id: "123",              // ✅ added
    createdAt: "2025-08-30",    // ✅ added
    updatedAt: "2025-08-30",    // ✅ added
  },
];
