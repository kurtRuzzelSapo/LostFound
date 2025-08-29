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
   isClaimed?: boolean;
}

export interface LostItemWithProfile extends LostItem {
  user_profiles?: {
    full_name?: string;
    avatar_url?: string;
    phone_number?: string;
    whatsapp?: string;
    email?: string;
    preferred_contact_method?: "email" | "phone" | "whatsapp";
    contact_visibility?: "public" | "private" | "friends_only";
  };
}
