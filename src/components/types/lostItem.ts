export interface LostItem {
  id: string;
  title: string;
  description: string;
  location: string;
  date_lost: string;
  image_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  category?: string;
  is_claimed?: boolean;
  claimed_by?: string;  // 👈 new (user ID of the person who claimed the item)
}

export interface LostItemWithProfile extends LostItem {
  user_profiles?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
    phone_number?: string;
    whatsapp?: string;
    email?: string;
    preferred_contact_method?: "email" | "phone" | "whatsapp";
    contact_visibility?: "public" | "private" | "friends_only";
  };
}
